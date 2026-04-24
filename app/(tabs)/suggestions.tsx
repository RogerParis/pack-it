import React, { useCallback, useRef } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import PackingListItem from '@/components/packing_list_item.component';
import ScreenHeader from '@/components/screen_header.component';
import SuggestionsListHeader from '@/components/suggestions_list_header.component';

import { usePackingStore } from '../../store/packingStore';
import { PackingItem } from '../../types/packing';

import { getPackingSuggestionsFromAI } from '@/services/groq_ai.service';
import { getWeatherForecast } from '@/services/weather.service';
import { useAlertStore } from '@/store/alertStore';
import { COLORS } from '@/theme/colors';
import { v4 as uuid } from 'uuid';

export default function SuggestionsScreen() {
  const addItem = usePackingStore((state) => state.addItem);
  const suggestions = usePackingStore((state) => {
    const activeList = state.activeList;
    return activeList ? state.lists[activeList].suggestions : [];
  });
  const clearList = usePackingStore((state) => state.clearList);
  const moveItem = usePackingStore((state) => state.moveItem);
  const removeItem = usePackingStore((state) => state.removeItem);
  const toBuy = usePackingStore((state) => {
    const activeList = state.activeList;
    return activeList ? state.lists[activeList].toBuy : [];
  });
  const toPack = usePackingStore((state) => {
    const activeList = state.activeList;
    return activeList ? state.lists[activeList].toPack : [];
  });
  const isGenerating = useRef(false);

  const handleGenerate = useCallback(
    async ({
      location,
      startDate,
      endDate,
      activities,
    }: {
      location?: string;
      startDate: Date | null;
      endDate: Date | null;
      activities?: string;
    }) => {
      if (isGenerating.current) return;
      isGenerating.current = true;

      try {
        let weatherHint = 'No weather data available';

        if (location) {
          try {
            const weatherData = await getWeatherForecast(location);
            weatherHint = weatherData?.list?.[0]?.weather?.[0]?.description || 'No forecast';
          } catch (error) {
            console.warn('Failed to fetch weather data:', error);
          }
        }

        const aiSuggestionsText = await getPackingSuggestionsFromAI(
          location || '',
          startDate,
          endDate,
          activities || '',
          weatherHint,
        );

        const existingItems = new Set(
          [...toBuy, ...toPack].map((item) => item.name.trim().toLowerCase()),
        );

        const aiSuggestions = aiSuggestionsText
          .split('\n')
          .map((item: string) => item.trim())
          .filter((item: string) => item && !existingItems.has(item.toLowerCase()));

        clearList('suggestions');

        aiSuggestions.forEach((item: string) => {
          addItem('suggestions', {
            id: uuid(),
            name: item,
            packed: false,
          });
        });
      } catch (error) {
        console.error('Failed to generate suggestions:', error);
        useAlertStore.getState().showAlert({
          title: 'Generation Failed',
          message: 'Could not generate suggestions. Please try again.',
          buttons: [{ text: 'OK', style: 'cancel' }],
        });
      } finally {
        isGenerating.current = false;
      }
    },
    [addItem, clearList, toBuy, toPack],
  );

  const renderItem = useCallback(
    ({ item }: { item: PackingItem }) => (
      <PackingListItem
        item={item}
        onMoveToBuy={() => {
          moveItem('suggestions', 'toBuy', item.id);
          removeItem('suggestions', item.id);
        }}
        onMoveToPack={() => {
          moveItem('suggestions', 'toPack', item.id);
          removeItem('suggestions', item.id);
        }}
        onDelete={() => removeItem('suggestions', item.id)}
      />
    ),
    [moveItem, removeItem],
  );

  return (
    <View style={styles.screen}>
      <ScreenHeader />
      <FlatList
        ListHeaderComponent={
          <View style={styles.listHeader}>
            <SuggestionsListHeader onGenerate={handleGenerate} />

            {suggestions.length > 0 && (
              <Text style={styles.sectionLabel}>SMART PICKS · {suggestions.length}</Text>
            )}
          </View>
        }
        data={suggestions}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No suggestions yet. Fill in your trip details above.</Text>
        }
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.paper,
  },
  listHeader: {
    gap: 12,
    marginBottom: 4,
  },
  sectionLabel: {
    fontSize: 10,
    color: COLORS.mute,
    letterSpacing: 1.2,
    fontWeight: '600',
    marginLeft: 4,
    marginTop: 4,
  },
  list: {
    gap: 10,
    padding: 20,
    paddingTop: 0,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.mute,
    textAlign: 'center',
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
});

import React, { useCallback, useRef } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import PackingListItem from '@/components/packing_list_item.component';
import SuggestionsListHeader from '@/components/suggestions_list_header.component';

import { usePackingStore } from '../../store/packingStore';
import { PackingItem } from '../../types/packing';

import { getPackingSuggestionsFromAI } from '@/services/groq_ai.service';
import { getWeatherForecast } from '@/services/weather.service';
import { useAlertStore } from '@/store/alertStore';

export default function SuggestionsScreen() {
  const addItem = usePackingStore((state) => state.addItem);
  const suggestions = usePackingStore((state) => {
    const activeList = state.activeList;
    return activeList ? state.lists[activeList].suggestions : [];
  });
  const clearList = usePackingStore((state) => state.clearList);
  const copyItem = usePackingStore((state) => state.copyItem);
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
            id: `${Date.now()}-${item}`,
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
          copyItem('suggestions', 'toBuy', item.id);
          removeItem('suggestions', item.id);
        }}
        onMoveToPack={() => {
          copyItem('suggestions', 'toPack', item.id);
          removeItem('suggestions', item.id);
        }}
        onDelete={() => removeItem('suggestions', item.id)}
      />
    ),
    [copyItem, removeItem],
  );

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        ListHeaderComponent={<SuggestionsListHeader onGenerate={handleGenerate} />}
        data={suggestions}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text>No suggestions yet.</Text>}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: 12, margin: 16 },
});

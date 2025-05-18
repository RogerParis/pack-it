import React, { useCallback } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import PackingListItem from '@/components/packing_list_item.component';
import SuggestionsListHeader from '@/components/suggestions_list_header.component';

import { usePackingStore } from '../../store/packingStore';
import { PackingItem } from '../../types/packing';

import { getPackingSuggestionsFromAI } from '@/services/groq_ai.service';
import { getWeatherForecast } from '@/services/weather.service';

export default function SuggestionsScreen() {
  const addItem = usePackingStore((state) => state.addItem);
  const suggestions = usePackingStore((state) => state.suggestions);
  const clearList = usePackingStore((state) => state.clearList);
  const copyItem = usePackingStore((state) => state.copyItem);
  const removeItem = usePackingStore((state) => state.removeItem);

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
      console.log('Generating suggestions...');
      let weatherHint = 'No weather data available';

      if (location) {
        try {
          const weatherData = await getWeatherForecast(location);
          weatherHint = weatherData?.list?.[0]?.weather?.[0]?.description || 'No forecast';
        } catch (error) {
          console.warn('Failed to fetch weather data:', error);
        }
      }

      console.log('Weather hint:', weatherHint);
      const aiSuggestionsText = await getPackingSuggestionsFromAI(
        location || '',
        startDate,
        endDate,
        activities || '',
        weatherHint,
      );

      console.log('AI suggestions:\n', aiSuggestionsText);
      const aiSuggestions = aiSuggestionsText
        .split('\n')
        .filter((item: string) => item.trim() !== '');

      clearList('suggestions');
      console.log('Cleared previous suggestions');

      aiSuggestions.forEach((item: string) => {
        addItem('suggestions', {
          id: `${Date.now()}-${item}`,
          name: item,
          packed: false,
        });
      });
    },
    [addItem, clearList],
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
  list: { gap: 12 },
});

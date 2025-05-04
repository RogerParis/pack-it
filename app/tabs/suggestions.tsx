import React, { useCallback, useState } from 'react';
import {
  Button,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import PackingListItem from '@/components/packing_list_item.component';

import { usePackingStore } from '../../store/packingStore';
import { COLORS } from '../../theme/colors';
import { PackingItem } from '../../types/packing';

import { getPackingSuggestionsFromAI } from '@/services/groq_ai.service';
import { getWeatherForecast } from '@/services/weather.service';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function SuggestionsScreen() {
  const addItem = usePackingStore((state) => state.addItem);
  const suggestions = usePackingStore((state) => state.suggestions);
  const clearList = usePackingStore((state) => state.clearList);
  const copyItem = usePackingStore((state) => state.copyItem);
  const removeItem = usePackingStore((state) => state.removeItem);

  const [location, setLocation] = useState('');
  const [activities, setActivities] = useState('');

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const handleGenerate = useCallback(async () => {
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
  }, [location, startDate, endDate, activities, addItem]);

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

  const formatDate = (date: Date | null) => (date ? date.toLocaleDateString() : 'Select date');

  return (
    <View style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Text style={styles.heading}>🤖 AI Suggestions</Text>

        <TextInput
          placeholder="Destination"
          value={location}
          onChangeText={setLocation}
          style={styles.input}
        />

        <Pressable style={styles.dateButton} onPress={() => setShowStartPicker(true)}>
          <Text>Start Date: {formatDate(startDate)}</Text>
        </Pressable>

        {showStartPicker && (
          <DateTimePicker
            value={startDate || new Date()}
            mode="date"
            display="default"
            onChange={(_, date) => {
              setShowStartPicker(false);
              if (date) setStartDate(date);
            }}
          />
        )}

        <Pressable style={styles.dateButton} onPress={() => setShowEndPicker(true)}>
          <Text>End Date: {formatDate(endDate)}</Text>
        </Pressable>

        {showEndPicker && (
          <DateTimePicker
            value={endDate || new Date()}
            mode="date"
            display="default"
            onChange={(_, date) => {
              setShowEndPicker(false);
              if (date) setEndDate(date);
            }}
          />
        )}

        <TextInput
          placeholder="Activities (comma-separated)"
          value={activities}
          onChangeText={setActivities}
          style={styles.input}
        />

        <Button title="Generate Suggestions" onPress={handleGenerate} />

        <Text style={styles.subheading}>Generated Suggestions:</Text>

        <FlatList
          data={suggestions}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListEmptyComponent={<Text>No suggestions yet.</Text>}
          contentContainerStyle={styles.list}
        />
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  heading: { fontSize: 22, fontWeight: 'bold', marginBottom: 12 },
  subheading: { marginTop: 16, fontWeight: 'bold' },
  input: {
    borderWidth: 1,
    borderColor: COLORS.neutral300,
    padding: 12,
    marginBottom: 12,
    borderRadius: 6,
  },
  dateButton: {
    borderWidth: 1,
    borderColor: COLORS.neutral300,
    padding: 12,
    marginBottom: 12,
    borderRadius: 6,
  },
  suggestionItem: {
    padding: 12,
    backgroundColor: COLORS.background,
    borderRadius: 8,
    marginBottom: 8,
  },
  list: { gap: 12 },
});

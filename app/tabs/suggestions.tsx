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

import { usePackingStore } from '../../store/packingStore';
import { COLORS } from '../../theme/colors';

import DateTimePicker from '@react-native-community/datetimepicker';

export default function SuggestionsScreen() {
  const addItem = usePackingStore((state) => state.addItem);
  const suggestions = usePackingStore((state) => state.suggestions);
  const clearList = usePackingStore((state) => state.clearList);

  const [location, setLocation] = useState('');
  const [activities, setActivities] = useState('');

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  // const [generated, setGenerated] = useState<string[]>([]);

  const handleGenerate = useCallback(() => {
    if (!location || !startDate || !endDate) {
      alert('Please enter destination and select both dates.');
      return;
    }

    const duration =
      Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))) + 1;

    // Dummy suggestions (replace later with AI & weather-based)
    const newSuggestions = [
      'Sunscreen',
      'Rain jacket',
      'Hiking boots',
      `Map of ${location}`,
      `${activities.split(',')[0] || 'General'} gear`,
      `${duration} days worth of clothing`,
    ];

    clearList('suggestions');

    newSuggestions.forEach((item) => {
      addItem('suggestions', {
        id: `${Date.now()}-${item}`,
        name: item,
        packed: false,
      });
    });

    // setGenerated(newSuggestions);
  }, [location, startDate, endDate, activities, addItem]);

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
          renderItem={({ item }) => (
            <View style={styles.suggestionItem}>
              <Text>{item.name}</Text>
            </View>
          )}
          ListEmptyComponent={<Text>No suggestions yet.</Text>}
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
});

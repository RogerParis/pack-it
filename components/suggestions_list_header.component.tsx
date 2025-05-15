import React, { useState } from 'react';
import {
  Button,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
} from 'react-native';

import { COLORS } from '@/theme/colors';
import DateTimePicker from '@react-native-community/datetimepicker';

type Props = {
  onGenerate: (params: {
    location: string;
    startDate: Date | null;
    endDate: Date | null;
    activities: string;
  }) => void;
};

export default function SuggestionsListHeader({ onGenerate }: Props) {
  const [location, setLocation] = useState('');
  const [activities, setActivities] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const formatDate = (date: Date | null) => (date ? date.toLocaleDateString() : 'Select date');

  const handleGenerate = () => {
    onGenerate({ location, startDate, endDate, activities });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}>
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
    </KeyboardAvoidingView>
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
});

import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput } from 'react-native';

import CustomButton from '@/components/custom_button.component';

import { COLORS } from '@/theme/colors';
import DateTimePicker from '@react-native-community/datetimepicker';

type Props = {
  onGenerate: (params: {
    location: string;
    startDate: Date | null;
    endDate: Date | null;
    activities: string;
  }) => Promise<void>;
};

export default function SuggestionsListHeader({ onGenerate }: Props) {
  const [location, setLocation] = useState('');
  const [activities, setActivities] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const formatDate = (date: Date | null) => (date ? date.toLocaleDateString() : 'Select date');

  const handleGenerate = async () => {
    setLoading(true);
    try {
      await onGenerate({ location, startDate, endDate, activities });
    } finally {
      setLoading(false);
    }
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

      <CustomButton
        title={`Start Date: ${formatDate(startDate)}`}
        onPress={() => setShowStartPicker(true)}
        style={styles.dateButton}
      />

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

      <CustomButton
        title={`End Date: ${formatDate(endDate)}`}
        onPress={() => setShowEndPicker(true)}
        style={styles.dateButton}
      />

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

      <CustomButton
        title={loading ? 'Loading...' : 'Generate Suggestions'}
        onPress={handleGenerate}
        disabled={loading}
      />

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

import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';

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

      <TouchableOpacity style={styles.dateButton} onPress={() => setShowStartPicker(true)}>
        <Text>Start Date: {formatDate(startDate)}</Text>
      </TouchableOpacity>

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

      <TouchableOpacity style={styles.dateButton} onPress={() => setShowEndPicker(true)}>
        <Text>End Date: {formatDate(endDate)}</Text>
      </TouchableOpacity>

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

      <TouchableOpacity
        onPress={handleGenerate}
        disabled={loading}
        style={[styles.button, loading && styles.buttonDisabled]}>
        {loading ? (
          <ActivityIndicator color={COLORS.white} />
        ) : (
          <Text style={styles.buttonText}>Generate Suggestions</Text>
        )}
      </TouchableOpacity>

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
  button: {
    backgroundColor: COLORS.primary,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonDisabled: {
    backgroundColor: COLORS.neutral300,
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 16,
  },
});

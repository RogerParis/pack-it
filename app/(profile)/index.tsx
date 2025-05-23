import React, { useCallback, useState } from 'react';
import {
  Button,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { useRouter } from 'expo-router';

import { getSyncLabel } from '@/utils/date.utils';

import { saveUserPackingData } from '@/services/cloud.service';
import { useAuthStore } from '@/store/authStore';
import { usePackingStore } from '@/store/packingStore';
import { COLORS } from '@/theme/colors';

export default function ProfileScreen() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const signOut = useAuthStore((state) => state.signOut);
  const lastSyncedAt = usePackingStore((state) => state.lastSyncedAt);
  const createList = usePackingStore((state) => state.createList);
  const setActiveList = usePackingStore((state) => state.setActiveList);
  const lists = usePackingStore((state) => state.lists);

  const [newListName, setNewListName] = useState('');
  const [isPickerVisible, setPickerVisible] = useState(false);

  const handleLogin = useCallback(() => {
    router.push('/login');
  }, [router]);

  const handleSync = useCallback(() => {
    saveUserPackingData(user!);
  }, [user]);

  const handleCreateList = useCallback(() => {
    if (newListName.trim()) {
      createList(newListName.trim());
      setNewListName('');
    }
  }, [newListName, createList]);

  const handleSelectList = useCallback(
    (listName: string) => {
      setActiveList(listName);
      setPickerVisible(false);
    },
    [setActiveList, setPickerVisible],
  );

  const listKeys = Object.keys(lists);

  return (
    <View style={styles.container}>
      <Text style={styles.syncLabel}>{getSyncLabel(lastSyncedAt)}</Text>

      {!user ? (
        <Button title="Log In" onPress={handleLogin} />
      ) : (
        <>
          <Text style={styles.loggedInText}>Logged in as: {user}</Text>
          <Button title="Sync Now" onPress={handleSync} />
          <Button title="Log Out" onPress={signOut} />
        </>
      )}
      <TextInput
        style={styles.input}
        placeholder="New List Name"
        value={newListName}
        onChangeText={setNewListName}
      />
      <Button title="Create List" onPress={handleCreateList} />

      <Button title="Select List" onPress={() => setPickerVisible(true)} />

      <Modal visible={isPickerVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <FlatList
            data={listKeys}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.listItem} onPress={() => handleSelectList(item)}>
                <Text style={styles.listItemText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
          <Button title="Close" onPress={() => setPickerVisible(false)} />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  loggedInText: { marginVertical: 16 },
  syncLabel: {
    textAlign: 'center',
    color: COLORS.neutral500,
    fontSize: 13,
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.neutral300,
    padding: 8,
    marginVertical: 8,
    width: '80%',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 16, // Added padding to ensure proper centering
  },
  listItem: {
    padding: 16,
    backgroundColor: 'white',
    marginVertical: 4,
    width: '90%', // Adjusted to ensure full width of list names is shown
    alignItems: 'center',
    alignSelf: 'center', // Center the list items horizontally
    textAlign: 'center', // Ensures text is centered within the list item
  },
  listItemText: {
    fontSize: 16,
  },
});

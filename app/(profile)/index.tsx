import React, { useCallback, useState } from 'react';
import {
  Button,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
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
  const activeList = usePackingStore((state) => state.activeList);

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
      router.push('/(tabs)/to-pack');
    },
    [setActiveList, setPickerVisible, router],
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
      <Text style={{ marginBottom: 12 }}>
        {'Current List: '}
        <Text style={{ fontWeight: 'bold' }}>
          {lists[Object.keys(lists).find((key) => key === activeList)!].name}
        </Text>
      </Text>
      <TextInput
        style={styles.input}
        placeholder="New List Name"
        value={newListName}
        onChangeText={setNewListName}
      />
      <Button title="Create List" onPress={handleCreateList} />

      <Button title="Select List" onPress={() => setPickerVisible(true)} />

      <Modal visible={isPickerVisible} animationType="slide" transparent>
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Select Packing List</Text>

            <FlatList
              data={listKeys}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <Pressable
                  style={[styles.modalListItem, item === activeList && styles.modalListItemActive]}
                  onPress={() => handleSelectList(item)}>
                  <Text style={styles.modalListItemText}>
                    {lists[item].name} {item === activeList ? '✅' : ''}
                  </Text>
                </Pressable>
              )}
              contentContainerStyle={{ paddingVertical: 8 }}
            />

            <Button title="Close" onPress={() => setPickerVisible(false)} />
          </View>
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
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  modal: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalListItem: {
    padding: 14,
    borderRadius: 8,
    backgroundColor: COLORS.neutral200,
    marginBottom: 8,
  },
  modalListItemActive: {
    backgroundColor: COLORS.primary,
  },
  modalListItemText: {
    fontSize: 16,
    color: COLORS.text,
  },
});

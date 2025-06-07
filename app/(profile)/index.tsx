import React, { useCallback, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { useRouter } from 'expo-router';

import PackingListsBottomSheet from '@/components/packing_lists_bottom_sheet.component';
import { getSyncLabel } from '@/utils/date.utils';

import {
  showCannotDeleteListAlert,
  showDeleteListAlert,
  showMergeListAlert,
  showMergeSuccessAlert,
} from '@/services/alerts.service';
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
  const renameList = usePackingStore((state) => state.renameList);
  const deleteList = usePackingStore((state) => state.deleteList);
  const mergeList = usePackingStore((state) => state.mergeList);
  const activeList = usePackingStore((state) => state.activeList);
  const lists = usePackingStore((state) => state.lists);

  const [newListName, setNewListName] = useState('');
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [renaming, setRenaming] = useState<string | null>(null);
  const [renameText, setRenameText] = useState('');

  const handleLogin = useCallback(() => {
    router.push('/login');
  }, [router]);

  const handleSync = useCallback(() => {
    if (user) saveUserPackingData(user);
  }, [user]);

  const handleCreateList = useCallback(() => {
    const trimmed = newListName.trim();
    if (!trimmed) return;

    const newId = createList(trimmed);
    setNewListName('');
    setActiveList(newId);
    handleSync();
    router.push('/(tabs)/to-pack');
  }, [newListName, createList, setActiveList, handleSync, router]);

  const handleSelectList = useCallback(
    (listId: string) => {
      setActiveList(listId);
      setPickerVisible(false);
      router.push('/(tabs)/to-pack');
    },
    [setActiveList, setPickerVisible, router],
  );

  const handleRenameSubmit = (id: string) => {
    const trimmed = renameText.trim();
    if (!trimmed) return;
    renameList(id, trimmed);
    setRenaming(null);
    setRenameText('');
  };

  const handleDeleteList = (id: string) => {
    if (Object.keys(lists).length === 1) {
      showCannotDeleteListAlert('only');
      return;
    }

    if (id === activeList) {
      showCannotDeleteListAlert('active');
      return;
    }

    showDeleteListAlert(() => deleteList(id));
  };

  const handleMergeList = (id: string) => {
    if (id === activeList) {
      return;
    }

    showMergeListAlert(lists[id].name, lists[activeList!].name, () => {
      mergeList(id);
      showMergeSuccessAlert();
    });
  };

  const listKeys = Object.keys(lists);

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.label}>Status</Text>
          <Text style={styles.sync}>{getSyncLabel(lastSyncedAt)}</Text>
          {user ? (
            <Text style={styles.subtext}>Logged in as: {user}</Text>
          ) : (
            <Text style={styles.subtext}>Using app as guest</Text>
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Active List: </Text>
          <Text style={styles.listName}>
            {lists[Object.keys(lists).find((key) => key === activeList)!].name}
          </Text>
          <TouchableOpacity onPress={() => setPickerVisible(true)} style={styles.buttonAlt}>
            <Text style={styles.buttonText}>Select Another List</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Create New List</Text>
          <View style={styles.inputRow}>
            <TextInput
              placeholder="New list name"
              value={newListName}
              onChangeText={setNewListName}
              style={styles.input}
            />
            <TouchableOpacity onPress={handleCreateList} style={styles.button}>
              <Text style={styles.buttonText}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.card}>
          <TouchableOpacity onPress={handleSync} style={styles.button}>
            <Text style={styles.buttonText}>Sync Now</Text>
          </TouchableOpacity>

          {user ? (
            <TouchableOpacity onPress={signOut} style={[styles.button, styles.logoutButton]}>
              <Text style={styles.buttonText}>Log Out</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={handleLogin} style={styles.button}>
              <Text style={styles.buttonText}>Log In / Register</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {isPickerVisible && (
        <PackingListsBottomSheet
          sheetVisible={isPickerVisible}
          setSheetVisible={setPickerVisible}
          listKeys={listKeys}
          activeList={activeList || ''} // Ensure activeList is always a string
          lists={lists}
          renaming={renaming}
          setRenaming={setRenaming}
          renameText={renameText}
          setRenameText={setRenameText}
          handleRenameSubmit={handleRenameSubmit}
          handleSelectList={handleSelectList}
          handleMergeList={handleMergeList}
          handleDeleteList={handleDeleteList}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, padding: 20, gap: 24 },
  card: {
    backgroundColor: '#F2F2F2',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  label: { fontWeight: '600', fontSize: 16 },
  sync: { color: COLORS.neutral500 },
  subtext: { fontSize: 14, color: COLORS.neutral500 },
  listName: { fontSize: 18, fontWeight: '600' },
  inputRow: { flexDirection: 'row', gap: 8 },
  input: {
    flex: 1,
    borderColor: COLORS.neutral300,
    borderWidth: 1,
    padding: 12,
    borderRadius: 6,
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonAlt: {
    backgroundColor: COLORS.secondary,
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: COLORS.error,
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: '600',
  },
});

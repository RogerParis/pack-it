import React, { useCallback, useState } from 'react';
import {
  Alert,
  FlatList,
  Modal,
  SafeAreaView,
  ScrollView,
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
import Clipboard from '@react-native-clipboard/clipboard';

export default function ProfileScreen() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const signOut = useAuthStore((state) => state.signOut);
  const lastSyncedAt = usePackingStore((state) => state.lastSyncedAt);
  const createList = usePackingStore((state) => state.createList);
  const setActiveList = usePackingStore((state) => state.setActiveList);
  const renameList = usePackingStore((state) => state.renameList);
  const deleteList = usePackingStore((state) => state.deleteList);
  const activeList = usePackingStore((state) => state.activeList);
  const lists = usePackingStore((state) => state.lists);
  const addCollaborator = usePackingStore((state) => state.addCollaborator);
  const removeCollaborator = usePackingStore((state) => state.removeCollaborator);

  const [newListName, setNewListName] = useState('');
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [renaming, setRenaming] = useState<string | null>(null);
  const [renameText, setRenameText] = useState('');
  const [collaboratorUid, setCollaboratorUid] = useState('');
  const [copied, setCopied] = useState(false);

  const handleAddCollaborator = useCallback(() => {
    if (!activeList || !collaboratorUid.trim()) return;
    addCollaborator(activeList, collaboratorUid.trim());
    setCollaboratorUid('');
  }, [activeList, collaboratorUid]);

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
      Alert.alert('Cannot delete the only list.');
      return;
    }

    if (id === activeList) {
      Alert.alert('Switch to another list before deleting this one.');
      return;
    }

    Alert.alert('Delete List', 'Are you sure you want to delete this list?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deleteList(id);
        },
      },
    ]);
  };

  const handleRemoveCollaborator = useCallback(
    (uid: string) => {
      if (!activeList) return;
      removeCollaborator(activeList, uid);
    },
    [activeList, removeCollaborator],
  );

  const handleCopyUid = useCallback(() => {
    if (user) {
      Clipboard.setString(user);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  }, [user]);

  const listKeys = Object.keys(lists);
  const activePackingList = lists[Object.keys(lists).find((key) => key === activeList)!];

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <View style={styles.card}>
            <Text style={styles.label}>Status</Text>
            <Text style={styles.sync}>{getSyncLabel(lastSyncedAt)}</Text>
            {user ? (
              <View style={styles.uidRow}>
                <Text style={styles.subtext}>Logged in as: {user}</Text>
                <TouchableOpacity
                  onPress={handleCopyUid}
                  style={styles.copyButton}
                  accessibilityLabel="Copy UID">
                  <Text style={styles.copyIcon}>📋</Text>
                </TouchableOpacity>
                {copied && <Text style={styles.copiedText}>Copied!</Text>}
              </View>
            ) : (
              <Text style={styles.subtext}>Using app as guest</Text>
            )}
          </View>

          <View style={styles.card}>
            <Text style={styles.listName}>{activePackingList.name}</Text>
            <Text style={styles.label}>Share This List</Text>
            <View style={styles.inputRow}>
              <TextInput
                placeholder="Collaborator UID"
                value={collaboratorUid}
                onChangeText={setCollaboratorUid}
                style={styles.input}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="done"
                onSubmitEditing={handleAddCollaborator}
              />
              <TouchableOpacity onPress={handleAddCollaborator} style={styles.button}>
                <Text style={styles.buttonText}>Add</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Shared With:</Text>
            {activePackingList?.sharedWith?.length ? (
              activePackingList.sharedWith.map((uid) => (
                <View key={uid} style={styles.collaboratorRow}>
                  <Text style={styles.subtext}>👥 {uid}</Text>
                  <TouchableOpacity
                    onPress={() => handleRemoveCollaborator(uid)}
                    style={styles.removeCollaboratorButton}>
                    <Text style={styles.removeCollaboratorText}>✖️</Text>
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <Text style={styles.subtext}>No collaborators</Text>
            )}
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
      </ScrollView>
      <Modal visible={isPickerVisible} transparent animationType="slide">
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Select Packing List</Text>
            <FlatList
              data={listKeys}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <View style={styles.modalItem}>
                  {renaming === item ? (
                    <View style={styles.renameRow}>
                      <TextInput
                        value={renameText}
                        onChangeText={setRenameText}
                        style={styles.input}
                        onSubmitEditing={() => handleRenameSubmit(item)}
                        returnKeyType="done"
                      />
                      <TouchableOpacity
                        onPress={() => handleRenameSubmit(item)}
                        style={styles.button}>
                        <Text style={styles.buttonText}>Save</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <>
                      <TouchableOpacity
                        onPress={() => handleSelectList(item)}
                        style={[styles.selectRow, item === activeList && styles.modalItemActive]}>
                        <Text style={styles.modalItemText}>
                          {lists[item].name} {item === activeList ? '✅' : ''}
                        </Text>
                      </TouchableOpacity>
                      <View style={styles.actionsRow}>
                        <TouchableOpacity
                          onPress={() => {
                            setRenaming(item);
                            setRenameText(lists[item].name);
                          }}>
                          <Text style={styles.action}>✏️</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleDeleteList(item)}>
                          <Text style={styles.action}>🗑️</Text>
                        </TouchableOpacity>
                      </View>
                    </>
                  )}
                </View>
              )}
            />
            <TouchableOpacity onPress={() => setPickerVisible(false)} style={styles.button}>
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff' },
  scrollContainer: { flexGrow: 1 },
  container: { flex: 1, padding: 20, gap: 24 },
  card: {
    backgroundColor: '#F2F2F2',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  label: { fontWeight: '600', fontSize: 16 },
  sync: { color: COLORS.neutral500 },
  subtext: {
    fontSize: 14,
    color: COLORS.neutral500,
    maxWidth: '80%',
    flexShrink: 1,
  },
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
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modal: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    gap: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 12,
  },
  modalItem: {
    padding: 12,
    backgroundColor: '#F2F2F2',
    borderRadius: 10,
    marginBottom: 8,
  },
  modalItemActive: {
    backgroundColor: COLORS.primary,
  },
  modalItemText: {
    fontSize: 16,
    color: COLORS.text,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 6,
  },
  selectRow: {
    padding: 6,
    borderRadius: 8,
  },
  renameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  action: {
    fontSize: 18,
  },
  collaboratorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  removeCollaboratorButton: {
    marginLeft: 8,
    padding: 4,
    borderRadius: 4,
    backgroundColor: COLORS.error,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeCollaboratorText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  uidRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  copyButton: {
    marginLeft: 8,
    padding: 4,
    borderRadius: 4,
    backgroundColor: COLORS.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copyIcon: {
    fontSize: 16,
    color: COLORS.text,
  },
  copiedText: {
    marginLeft: 8,
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: '600',
  },
});

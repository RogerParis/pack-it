import React, { useCallback, useState } from 'react';
import {
  Dimensions,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';

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

  // --- Animated Bottom Sheet Logic ---
  const sheetAnim = useSharedValue(Dimensions.get('window').height);
  const [sheetVisible, setSheetVisible] = useState(false);

  React.useEffect(() => {
    if (isPickerVisible) {
      setSheetVisible(true);
      sheetAnim.value = Dimensions.get('window').height;
      sheetAnim.value = withSpring(0, { damping: 20 });
    } else {
      sheetAnim.value = withTiming(Dimensions.get('window').height, {}, (finished) => {
        if (finished) runOnJS(setSheetVisible)(false);
      });
    }
  }, [isPickerVisible]);

  const animatedSheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: sheetAnim.value }],
  }));

  // Gesture handler for swipe down to dismiss
  const panGesture = Gesture.Pan().onUpdate((event) => {
    if (event.translationY > 60) {
      runOnJS(setPickerVisible)(false);
    }
  });

  // --- End Animated Bottom Sheet Logic ---

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
      return; // Should never happen as we hide the merge button for active list
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

      {/* Animated Bottom Sheet */}
      {sheetVisible && (
        <View style={styles.overlay}>
          <GestureDetector gesture={panGesture}>
            <Animated.View style={[styles.modal, animatedSheetStyle]}>
              <View style={styles.modalTopBorder} />
              <Text style={styles.modalTitle}>Select Packing List</Text>
              <FlatList
                data={listKeys}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <View style={[styles.modalItem, item === activeList && styles.modalItemActive]}>
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
                      <View style={styles.modalItemWrapper}>
                        <TouchableOpacity
                          onPress={() => handleSelectList(item)}
                          style={[styles.selectRow]}>
                          <Text style={styles.modalItemText}>
                            {lists[item].name} {item === activeList ? '✅' : ''}
                          </Text>
                        </TouchableOpacity>
                        <View style={styles.actionsRow}>
                          <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => {
                              setRenaming(item);
                              setRenameText(lists[item].name);
                            }}>
                            <Feather name="edit-2" size={18} style={styles.actionIcon} />
                          </TouchableOpacity>
                          {item !== activeList && (
                            <TouchableOpacity
                              style={styles.actionButton}
                              onPress={() => handleMergeList(item)}>
                              <Feather name="git-merge" size={18} style={styles.actionIcon} />
                            </TouchableOpacity>
                          )}
                          <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => handleDeleteList(item)}>
                            <Feather name="trash-2" size={18} style={styles.actionIcon} />
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}
                  </View>
                )}
              />
              <TouchableOpacity onPress={() => setPickerVisible(false)} style={styles.button}>
                <Text style={styles.buttonText}>Close</Text>
              </TouchableOpacity>
            </Animated.View>
          </GestureDetector>
        </View>
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
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    elevation: 5,
  },
  modal: {
    padding: 20,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    gap: 12,
    backgroundColor: COLORS.white,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 8, // Android shadow
  },
  modalTopBorder: {
    height: 3,
    width: 36,
    backgroundColor: COLORS.neutral300,
    alignSelf: 'center',
    borderRadius: 1.5,
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 12,
  },
  modalItemWrapper: { flexDirection: 'row', alignItems: 'center' },
  modalItem: {
    padding: 12,
    backgroundColor: '#F2F2F2',
    borderRadius: 10,
    marginBottom: 8,
    alignItems: 'center',
  },
  modalItemActive: {
    backgroundColor: COLORS.primary,
  },
  modalItemText: {
    fontSize: 16,
    color: COLORS.text,
    verticalAlign: 'middle',
  },
  actionsRow: {
    flexDirection: 'row',
    marginTop: 6,
    alignItems: 'center',
  },
  selectRow: {
    flex: 1,
    padding: 6,
    borderRadius: 8,
  },
  renameRow: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    padding: 6,
    borderRadius: 4,
    marginHorizontal: 2,
  },
  actionIcon: {
    padding: 4,
    color: COLORS.text,
  },
});

import React, { useEffect } from 'react';
import {
  Dimensions,
  FlatList,
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

import { Feather } from '@expo/vector-icons';

import CustomButton from '@/components/custom_button.component';
import { isDuplicatePackingListName } from '@/utils/packing_list.utils';

import { showDuplicateNameAlert } from '@/services/alerts.service';
import { COLORS } from '@/theme/colors';

type BottomSheetProps = {
  sheetVisible: boolean;
  setSheetVisible: (visible: boolean) => void;
  listKeys: string[];
  activeList: string;
  lists: { [key: string]: { name: string } };
  renaming: string | null;
  setRenaming: (key: string | null) => void;
  renameText: string;
  setRenameText: (text: string) => void;
  handleRenameSubmit: (key: string) => void;
  handleSelectList: (key: string) => void;
  handleMergeList: (key: string) => void;
  handleDeleteList: (key: string) => void;
};

const BottomSheet: React.FC<BottomSheetProps> = ({
  sheetVisible,
  setSheetVisible,
  listKeys,
  activeList,
  lists,
  renaming,
  setRenaming,
  renameText,
  setRenameText,
  handleRenameSubmit,
  handleSelectList,
  handleMergeList,
  handleDeleteList,
}) => {
  const sheetAnim = useSharedValue(Dimensions.get('window').height);

  const screenHeight = Dimensions.get('window').height;

  useEffect(() => {
    if (sheetVisible) {
      sheetAnim.value = screenHeight;
      sheetAnim.value = withSpring(0, { damping: 20 });
    } else {
      sheetAnim.value = withTiming(screenHeight);
    }
  }, [sheetVisible]);

  const animatedSheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: sheetAnim.value }],
  }));

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      sheetAnim.value = Math.max(event.translationY, 0);
    })
    .onEnd((event) => {
      if (event.translationY > 60) {
        sheetAnim.value = withTiming(screenHeight, {}, () => {
          runOnJS(setSheetVisible)(false);
        });
      } else {
        sheetAnim.value = withSpring(0, { damping: 20 });
      }
    });

  const handleRename = (item: string) => {
    if (isDuplicatePackingListName(lists, renameText)) {
      showDuplicateNameAlert();
      return;
    }
    handleRenameSubmit(item);
  };

  return (
    <View style={styles.overlay}>
      <Animated.View style={[styles.modal, animatedSheetStyle]}>
        <GestureDetector gesture={panGesture}>
          <View style={styles.swipeWrapper}>
            <View style={styles.modalTopBorder} />
          </View>
        </GestureDetector>
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
                    onSubmitEditing={() => handleRename(item)}
                    returnKeyType="done"
                  />
                  <CustomButton title="Save" onPress={() => handleRename(item)} />
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
        <CustomButton title="Close" onPress={() => setSheetVisible(false)} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    elevation: 5,
  },
  modal: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    gap: 12,
    backgroundColor: COLORS.white,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 8,
  },
  swipeWrapper: {
    paddingVertical: 20,
    paddingHorizontal: 40,
    alignItems: 'center',
  },
  modalTopBorder: {
    height: 5,
    width: 60,
    backgroundColor: COLORS.neutral300,
    alignSelf: 'center',
    borderRadius: 1.5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 12,
  },
  modalItemWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
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
  input: {
    flex: 1,
    borderColor: COLORS.neutral300,
    borderWidth: 1,
    padding: 12,
    borderRadius: 6,
  },
});

export default BottomSheet;

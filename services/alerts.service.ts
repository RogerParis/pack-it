import { AlertButton, useAlertStore } from '@/store/alertStore';

type ShowAlertOptions = {
  title: string;
  message: string;
  buttons?: AlertButton[];
  cancelable?: boolean; // currently unused, could be used for backdrop press
};

const showAlert = ({ title, message, buttons }: ShowAlertOptions) => {
  useAlertStore.getState().showAlert({ title, message, buttons });
};

export const showDuplicateItemAlert = (listName: string) => {
  showAlert({
    title: 'Duplicate Item',
    message: `This item is already in your "${listName}" list.`,
    buttons: [{ text: 'OK', style: 'cancel' }],
  });
};

export const showMoveItemAlert = (fromList: string, toList: string, onMove: () => void) => {
  showAlert({
    title: `Item Exists in ${fromList}`,
    message: `This item is already in your "${fromList}" list. Move it to "${toList}"?`,
    buttons: [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Move', onPress: onMove },
    ],
  });
};

export const showDeleteItemAlert = (onDelete: () => void) => {
  showAlert({
    title: 'Delete Item',
    message: 'Are you sure you want to delete this item?',
    buttons: [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: onDelete },
    ],
  });
};

export const showDeleteListAlert = (onDelete: () => void) => {
  showAlert({
    title: 'Delete List',
    message: 'Are you sure you want to delete this list?',
    buttons: [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: onDelete },
    ],
  });
};

export const showCannotDeleteListAlert = (reason: 'only' | 'active') => {
  const message =
    reason === 'only'
      ? 'Cannot delete the only list.'
      : 'Switch to another list before deleting this one.';

  showAlert({
    title: message,
    message: '',
  });
};

export const showMergeListAlert = (
  sourceListName: string,
  targetListName: string,
  onMerge: () => void,
) => {
  showAlert({
    title: 'Merge List',
    message: `Are you sure you want to merge "${sourceListName}" into your active list "${targetListName}"?`,
    buttons: [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Merge',
        onPress: onMerge,
      },
    ],
  });
};

export const showMergeSuccessAlert = () => {
  showAlert({
    title: 'Success',
    message: 'List merged successfully!',
  });
};

export const showPasswordResetSuccessAlert = () => {
  showAlert({
    title: 'Success',
    message: 'Password reset email sent.',
  });
};

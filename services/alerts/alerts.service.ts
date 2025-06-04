import { Alert } from 'react-native';

type AlertButton = {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
};

type ShowAlertOptions = {
  title: string;
  message: string;
  buttons?: AlertButton[];
  cancelable?: boolean;
};

export const showAlert = ({ title, message, buttons, cancelable }: ShowAlertOptions) => {
  Alert.alert(
    title,
    message,
    buttons?.map((btn) => ({
      text: btn.text,
      onPress: btn.onPress,
      style: btn.style,
    })),
    { cancelable },
  );
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

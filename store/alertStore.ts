import { create } from 'zustand';

export type AlertButton = {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
};

export type AlertState = {
  visible: boolean;
  title: string;
  message: string;
  buttons: AlertButton[];
  showAlert: (opts: { title: string; message: string; buttons?: AlertButton[] }) => void;
  hideAlert: () => void;
};

export const useAlertStore = create<AlertState>((set) => ({
  visible: false,
  title: '',
  message: '',
  buttons: [],
  showAlert: ({ title, message, buttons }) =>
    set({
      visible: true,
      title,
      message,
      buttons: buttons || [{ text: 'OK', style: 'default' }],
    }),
  hideAlert: () =>
    set({
      visible: false,
      title: '',
      message: '',
      buttons: [],
    }),
}));

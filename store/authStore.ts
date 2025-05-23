import { usePackingStore } from './packingStore';

import { login, logout, register } from '@/services/auth.service';
import { saveUserPackingData } from '@/services/cloud.service';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

type AuthState = {
  user: string | null;
  setUser: (uid: string | null) => void;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

export const useAuthStore = create<AuthState>()(
  immer((set, get) => ({
    user: null,

    setUser: (uid) => {
      set((state) => {
        state.user = uid;
      });
    },

    signIn: async (email, password) => {
      const credential = await login(email, password);
      usePackingStore.getState().setActiveList('default');
      const user = credential.user as FirebaseAuthTypes.User;
      const uid = user.uid;
      set((state) => {
        state.user = uid;
      });
    },

    signUp: async (email, password) => {
      const credential = await register(email, password);
      const uid = (credential.user as FirebaseAuthTypes.User).uid;
      set((state) => {
        state.user = uid;
      });
    },

    signOut: async () => {
      const state = get();
      const userId = state.user;

      if (!userId) {
        // Already a guest, just clear local lists
        usePackingStore.getState().clearAllLists();
        return;
      }

      try {
        await saveUserPackingData(userId);

        await logout();
      } catch (error) {
        console.warn('[authStore] Failed to save data before logout:', error);
      }

      usePackingStore.getState().clearAllLists();
      set({ user: null });
    },
  })),
);

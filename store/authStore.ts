import { login, logout, register } from '../services/auth.service';

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
  immer((set) => ({
    user: null,

    setUser: (uid) => {
      set((state) => {
        state.user = uid;
      });
    },

    signIn: async (email, password) => {
      const credential = await login(email, password);
      const uid = (credential.user as FirebaseAuthTypes.User).uid;
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
      await logout();
      set((state) => {
        state.user = null;
      });
    },
  })),
);

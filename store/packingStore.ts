import { MMKV } from 'react-native-mmkv';

import { PackingItem } from '../types/packing';

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

const storage = new MMKV();

type ListKey = 'toBuy' | 'toPack' | 'suggestions';

type PackingState = {
  toBuy: PackingItem[];
  toPack: PackingItem[];
  suggestions: PackingItem[];

  addItem: (list: ListKey, item: PackingItem) => void;
  togglePacked: (id: string) => void;
  copyItem: (fromList: ListKey, toList: ListKey, id: string) => void;
  removeItem: (list: ListKey, id: string) => void;
  clearList: (list: ListKey) => void;

  replaceAllData: (data: {
    toBuy: PackingItem[];
    toPack: PackingItem[];
    suggestions: PackingItem[];
  }) => void;
  getCurrentState: () => {
    toBuy: PackingItem[];
    toPack: PackingItem[];
    suggestions: PackingItem[];
  };

  lastSyncedAt: number | null; // store as timestamp (Date.now())
  setLastSyncedAt: (ts: number) => void;
};

export const usePackingStore = create<PackingState>()(
  persist(
    immer((set, get) => ({
      toBuy: [],
      toPack: [],
      suggestions: [],
      lastSyncedAt: null,

      addItem: (list, item) => {
        set((state) => {
          (state[list] as PackingItem[]).push(item);
        });
      },

      togglePacked: (id) => {
        set((state) => {
          const item = state.toPack.find((i) => i.id === id);
          if (item) {
            item.packed = !item.packed;
          }
        });
      },

      copyItem: (fromList: ListKey, toList: ListKey, id: string) => {
        set((state) => {
          if (fromList === toList) return; // No move needed

          const index = state[fromList].findIndex((i) => i.id === id);
          if (index !== -1) {
            const [item] = state[fromList].splice(index, 1);
            state[toList].push({ ...item, packed: false });
          }
        });
      },

      removeItem: (list, id) => {
        set((state) => {
          state[list] = state[list].filter((item) => item.id !== id);
        });
      },

      clearList: (list) => {
        set((state) => {
          state[list] = [];
        });
      },

      replaceAllData: (data) => {
        set((state) => {
          state.toBuy = data.toBuy ?? [];
          state.toPack = data.toPack ?? [];
          state.suggestions = data.suggestions ?? [];
        });
      },

      getCurrentState: () => {
        const { toBuy, toPack, suggestions } = get();
        return { toBuy, toPack, suggestions };
      },

      setLastSyncedAt: (ts) => {
        set((state) => {
          state.lastSyncedAt = ts;
        });
      },
    })),
    {
      name: 'packing-storage',
      storage: createJSONStorage(() => ({
        getItem: (key) => storage.getString(key) ?? null,
        setItem: storage.set.bind(storage),
        removeItem: storage.delete.bind(storage),
      })),
    },
  ),
);

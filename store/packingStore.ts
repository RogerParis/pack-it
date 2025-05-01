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
  moveToPack: (id: string) => void;
  removeItem: (list: ListKey, id: string) => void;
};

export const usePackingStore = create<PackingState>()(
  persist(
    immer((set) => ({
      toBuy: [],
      toPack: [],
      suggestions: [],

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

      moveToPack: (id) => {
        set((state) => {
          const index = state.toBuy.findIndex((i) => i.id === id);
          if (index !== -1) {
            const [item] = state.toBuy.splice(index, 1);
            state.toPack.push({ ...item, packed: false });
          }
        });
      },

      removeItem: (list, id) => {
        set((state) => {
          state[list] = state[list].filter((item) => item.id !== id);
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

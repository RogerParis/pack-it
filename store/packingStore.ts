import { MMKV } from 'react-native-mmkv';

import { ListType, PackingItem } from '../types/packing';

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

const storage = new MMKV();

type PackingState = {
  lists: Record<
    string,
    {
      toBuy: PackingItem[];
      toPack: PackingItem[];
      suggestions: PackingItem[];
    }
  >;
  activeList: string | null;

  createList: (name: string) => void;
  deleteList: (name: string) => void;
  setActiveList: (name: string) => void;
  addItem: (type: ListType, item: PackingItem) => void;
  togglePacked: (id: string) => void;
  copyItem: (fromList: ListType, toList: ListType, id: string) => void;
  removeItem: (type: ListType, id: string) => void;
  clearList: (type: ListType) => void;
  clearAllLists: () => void;
  lastSyncedAt: number | null;
  setLastSyncedAt: (ts: number) => void;
  replaceAllData: (
    lists: Record<
      string,
      {
        toBuy: PackingItem[];
        toPack: PackingItem[];
        suggestions: PackingItem[];
      }
    >,
  ) => void;
};

export const usePackingStore = create<PackingState>()(
  persist(
    immer((set) => ({
      lists: {
        default: { toBuy: [], toPack: [], suggestions: [] },
      },
      activeList: 'default',
      lastSyncedAt: null,

      createList: (name) => {
        set((state) => {
          if (!state.lists[name]) {
            state.lists[name] = { toBuy: [], toPack: [], suggestions: [] };
          }
        });
      },

      deleteList: (name) => {
        set((state) => {
          delete state.lists[name];
          if (state.activeList === name) {
            state.activeList = 'default';
          }
        });
      },

      setActiveList: (name) => {
        set((state) => {
          if (state.lists[name]) {
            state.activeList = name;
          }
        });
      },

      addItem: (type, item) => {
        set((state) => {
          if (state.activeList) {
            state.lists[state.activeList][type].push(item);
          }
        });
      },

      togglePacked: (id) => {
        set((state) => {
          if (state.activeList) {
            const item = state.lists[state.activeList].toPack.find((i) => i.id === id);
            if (item) {
              item.packed = !item.packed;
            }
          }
        });
      },

      copyItem: (fromList, toList, id) => {
        set((state) => {
          if (state.activeList && fromList !== toList) {
            const index = state.lists[state.activeList][fromList].findIndex((i) => i.id === id);
            if (index !== -1) {
              const [item] = state.lists[state.activeList][fromList].splice(index, 1);
              state.lists[state.activeList][toList].push({ ...item, packed: false });
            }
          }
        });
      },

      removeItem: (type, id) => {
        set((state) => {
          if (state.activeList) {
            state.lists[state.activeList][type] = state.lists[state.activeList][type].filter(
              (item) => item.id !== id,
            );
          }
        });
      },

      clearList: (type) => {
        set((state) => {
          if (state.activeList) {
            state.lists[state.activeList][type] = [];
          }
        });
      },

      clearAllLists: () => {
        set((state) => {
          state.lists = { default: { toBuy: [], toPack: [], suggestions: [] } };
          state.activeList = 'default';
        });
      },

      setLastSyncedAt: (ts) => {
        set((state) => {
          state.lastSyncedAt = ts;
        });
      },

      replaceAllData: (
        lists: Record<
          string,
          {
            toBuy: PackingItem[];
            toPack: PackingItem[];
            suggestions: PackingItem[];
          }
        >,
      ) => {
        set((state) => {
          state.lists = lists;
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

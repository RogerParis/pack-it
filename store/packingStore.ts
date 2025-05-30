import { MMKV } from 'react-native-mmkv';

import { ListType, PackingItem, PackingListDataRecord } from '../types/packing';

import { v4 as uuidv4 } from 'uuid';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

const storage = new MMKV();

type PackingState = {
  lists: PackingListDataRecord;
  activeList: string | null;

  createList: (name: string) => string;
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
  replaceAllData: (lists: PackingListDataRecord) => void;
};

export const usePackingStore = create<PackingState>()(
  persist(
    immer((set) => ({
      lists: {
        default: { name: 'Default', toBuy: [], toPack: [], suggestions: [] },
      },
      activeList: 'default',
      lastSyncedAt: null,

      createList: (name) => {
        const id = uuidv4();
        set((state) => {
          state.lists[id] = { name, toBuy: [], toPack: [], suggestions: [] };
        });
        return id;
      },

      deleteList: (id) => {
        set((state) => {
          delete state.lists[id];
          if (state.activeList === id) {
            state.activeList = Object.keys(state.lists)[0] || null;
          }
        });
      },

      setActiveList: (id) => {
        set((state) => {
          if (state.lists[id]) {
            state.activeList = id;
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
          state.lists = { default: { name: 'Default', toBuy: [], toPack: [], suggestions: [] } };
          state.activeList = 'default';
        });
      },

      setLastSyncedAt: (ts) => {
        set((state) => {
          state.lastSyncedAt = ts;
        });
      },

      replaceAllData: (lists: PackingListDataRecord) => {
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

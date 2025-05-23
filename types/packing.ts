export type PackingItem = {
  id: string;
  name: string;
  packed: boolean;
};

export type ListType = 'toBuy' | 'toPack' | 'suggestions';

export type PackingData = {
  toBuy: PackingItem[];
  toPack: PackingItem[];
  suggestions: PackingItem[];
};

export type FirestoreTimestamp = {
  seconds: number;
  nanoseconds: number;
};

export type CloudPackingData = {
  schemaVersion: number;
  lastSyncedAt: FirestoreTimestamp;
  lists: Record<
    string,
    {
      toBuy: PackingItem[];
      toPack: PackingItem[];
      suggestions: PackingItem[];
    }
  >;
};

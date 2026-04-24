import { jest } from '@jest/globals';

jest.mock('react-native-mmkv', () => {
  const storage: Record<string, string> = {};
  return {
    createMMKV: jest.fn().mockImplementation(() => ({
      getString: (key: string) => storage[key] ?? null,
      set: (key: string, value: string) => {
        storage[key] = value;
      },
      remove: (key: string) => {
        delete storage[key];
      },
    })),
  };
});

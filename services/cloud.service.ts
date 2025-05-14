import { usePackingStore } from '@/store/packingStore';
import { PackingItem } from '@/types/packing';
import {
  collection,
  doc,
  getDoc,
  getFirestore,
  serverTimestamp,
  setDoc,
} from '@react-native-firebase/firestore';

const firestore = getFirestore();

export const getUserPackingData = async (uid: string) => {
  const docRef = doc(collection(firestore, 'users'), uid);
  const docSnap = await getDoc(docRef);

  return docSnap.exists ? docSnap.data() : null;
};

export const saveUserPackingData = async (
  uid: string,
  toBuy: PackingItem[],
  toPack: PackingItem[],
  suggestions: PackingItem[],
) => {
  usePackingStore.getState().setLastSyncedAt(Date.now());
  const docRef = doc(collection(firestore, 'users'), uid);
  await setDoc(docRef, {
    schemaVersion: 1,
    lastSyncedAt: serverTimestamp(),
    toBuy,
    toPack,
    suggestions,
  });
};

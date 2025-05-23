import { usePackingStore } from '@/store/packingStore';
import { CloudPackingData } from '@/types/packing';
import {
  collection,
  doc,
  getDoc,
  getFirestore,
  serverTimestamp,
  setDoc,
} from '@react-native-firebase/firestore';

const firestore = getFirestore();

export const saveUserPackingData = async (uid: string) => {
  const { lists } = usePackingStore.getState();
  usePackingStore.getState().setLastSyncedAt(Date.now());

  const docRef = doc(collection(firestore, 'users'), uid);
  await setDoc(docRef, {
    schemaVersion: 1,
    lastSyncedAt: serverTimestamp(),
    lists,
  });
};

export const getUserPackingData = async (uid: string): Promise<CloudPackingData | null> => {
  const docRef = doc(collection(firestore, 'users'), uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists) {
    return docSnap.data() as CloudPackingData;
  }

  return null;
};

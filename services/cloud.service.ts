import { PackingItem } from '@/types/packing';
import { collection, doc, getDoc, getFirestore, setDoc } from '@react-native-firebase/firestore';

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
  const docRef = doc(collection(firestore, 'users'), uid);
  await setDoc(docRef, {
    toBuy,
    toPack,
    suggestions,
  });
};

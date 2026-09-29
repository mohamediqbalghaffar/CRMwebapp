'use client';

import {
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  MockDocRef,
  MockColRef,
} from '@/firebase/mock-store';

export function setDocumentNonBlocking(docRef: any, data: any, options?: any) {
  try {
    setDoc(docRef, data, options);
  } catch (error) {
    console.error('Error in setDocumentNonBlocking:', error);
  }
}

export function addDocumentNonBlocking(colRef: any, data: any) {
  try {
    return addDoc(colRef, data);
  } catch (error) {
    console.error('Error in addDocumentNonBlocking:', error);
    return Promise.reject(error);
  }
}

export function updateDocumentNonBlocking(docRef: any, data: any) {
  try {
    updateDoc(docRef, data);
  } catch (error) {
    console.error('Error in updateDocumentNonBlocking:', error);
  }
}

export function deleteDocumentNonBlocking(docRef: any) {
  try {
    deleteDoc(docRef);
  } catch (error) {
    console.error('Error in deleteDocumentNonBlocking:', error);
  }
}

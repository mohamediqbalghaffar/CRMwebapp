'use client';

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './mock-store';
export * from './mock-data';

export function initializeFirebase() {
  const mockApp = { name: 'CRMwebapp-Showcase' } as any;
  const mockAuth = {
    currentUser: {
      uid: 'demo-admin',
      displayName: 'پیشاندەر (Demo Admin)',
    },
  } as any;
  const mockFirestore = {
    type: 'mock-firestore',
    isMock: true,
  } as any;

  return {
    firebaseApp: mockApp,
    auth: mockAuth,
    firestore: mockFirestore,
  };
}

export function getSdks(firebaseApp: any) {
  return initializeFirebase();
}

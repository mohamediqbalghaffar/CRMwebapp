'use client';

import { INITIAL_MOCK_DATA } from './mock-data';

const STORAGE_KEY = 'CRM_MOCK_DATABASE_V3';

type StoreType = Record<string, Record<string, any>>;

class MockDatabase {
  private store: StoreType = {};
  private listeners = new Set<() => void>();
  private initialized = false;

  constructor() {
    this.init();
  }

  private init() {
    if (this.initialized) return;

    if (typeof window !== 'undefined') {
      try {
        // Purge legacy storage keys so old mock data is never read
        localStorage.removeItem('CRM_MOCK_DATABASE_V1');
        localStorage.removeItem('CRM_MOCK_DATABASE_V2');
        localStorage.removeItem('demo_mock_db');

        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          this.store = JSON.parse(saved);
          this.initialized = true;
          return;
        }
      } catch (e) {
        console.warn('Could not read mock db from localStorage, using initial data:', e);
      }
    }

    this.store = this.buildInitialStore();
    this.persist();
    this.initialized = true;
  }

  private buildInitialStore(): StoreType {
    const s: StoreType = {
      users: { ...INITIAL_MOCK_DATA.users },
      suppliers: { ...INITIAL_MOCK_DATA.suppliers },
      customers: { ...INITIAL_MOCK_DATA.customers },
      product_definitions: { ...INITIAL_MOCK_DATA.product_definitions },
      products: { ...INITIAL_MOCK_DATA.products },
      selling_forms: { ...INITIAL_MOCK_DATA.selling_forms },
      buying_forms: { ...INITIAL_MOCK_DATA.buying_forms },
      expenses: { ...INITIAL_MOCK_DATA.expenses },
      stock_movements: { ...INITIAL_MOCK_DATA.stock_movements },
      app_settings: { ...INITIAL_MOCK_DATA.app_settings },
    };

    // Subcollections for selling forms: products and payments
    for (const [key, prod] of Object.entries(INITIAL_MOCK_DATA.selling_form_products)) {
      const formId = (prod as any).formId;
      const subPath = `selling_forms/${formId}/selling_form_products`;
      if (!s[subPath]) s[subPath] = {};
      s[subPath][(prod as any).id] = prod;

      // Also maintain flattened group for collectionGroup queries
      if (!s['selling_form_products']) s['selling_form_products'] = {};
      s['selling_form_products'][key] = prod;
    }

    for (const [key, pay] of Object.entries(INITIAL_MOCK_DATA.payments)) {
      const formId = (pay as any).formId;
      const subPath = `selling_forms/${formId}/payments`;
      if (!s[subPath]) s[subPath] = {};
      s[subPath][(pay as any).id] = pay;

      if (!s['payments']) s['payments'] = {};
      s['payments'][key] = pay;
    }

    // Subcollections for buying forms: products
    for (const [key, prod] of Object.entries(INITIAL_MOCK_DATA.buying_form_products)) {
      const formId = (prod as any).formId;
      const subPath = `buying_forms/${formId}/buying_form_products`;
      if (!s[subPath]) s[subPath] = {};
      s[subPath][(prod as any).id] = prod;

      if (!s['buying_form_products']) s['buying_form_products'] = {};
      s['buying_form_products'][key] = prod;
    }

    return s;
  }

  public persist() {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.store));
      } catch (e) {
        console.warn('Failed to persist mock db to localStorage:', e);
      }
    }
  }

  public subscribe(cb: () => void): () => void {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }

  public notify() {
    this.persist();
    for (const cb of this.listeners) {
      try {
        cb();
      } catch (e) {
        console.error('Error in mock listener:', e);
      }
    }
  }

  public resetToDefault() {
    this.store = this.buildInitialStore();
    this.notify();
  }

  public getCollectionDocs(path: string): Array<{ id: string; [key: string]: any }> {
    this.init();
    const clean = path.replace(/^\/|\/$/g, '');
    const col = this.store[clean];
    if (!col) return [];
    return Object.entries(col).map(([id, val]) => ({ ...val, id }));
  }

  public getDoc(path: string): { id: string; data?: any; exists: boolean } {
    this.init();
    const parts = path.replace(/^\/|\/$/g, '').split('/');
    if (parts.length % 2 !== 0) {
      throw new Error(`Invalid document path (must have even number of segments): ${path}`);
    }
    const id = parts[parts.length - 1];
    const colPath = parts.slice(0, parts.length - 1).join('/');
    const col = this.store[colPath];
    if (col && col[id] !== undefined) {
      return { id, data: { ...col[id] }, exists: true };
    }
    return { id, exists: false };
  }

  public setDoc(path: string, data: any, options?: { merge?: boolean }) {
    this.init();
    const parts = path.replace(/^\/|\/$/g, '').split('/');
    const id = parts[parts.length - 1];
    const colPath = parts.slice(0, parts.length - 1).join('/');
    if (!this.store[colPath]) {
      this.store[colPath] = {};
    }
    if (options?.merge && this.store[colPath][id]) {
      this.store[colPath][id] = { ...this.store[colPath][id], ...data };
    } else {
      this.store[colPath][id] = { ...data };
    }

    // Mirror to subcollection root if applicable
    if (colPath.includes('/')) {
      const subName = parts[parts.length - 2];
      if (!this.store[subName]) this.store[subName] = {};
      this.store[subName][`${parts[parts.length - 3]}_${id}`] = this.store[colPath][id];
    }

    this.notify();
  }

  public updateDoc(path: string, data: any) {
    this.init();
    const parts = path.replace(/^\/|\/$/g, '').split('/');
    const id = parts[parts.length - 1];
    const colPath = parts.slice(0, parts.length - 1).join('/');
    if (!this.store[colPath] || !this.store[colPath][id]) {
      // Create if doesn't exist to be resilient
      this.setDoc(path, data);
      return;
    }
    this.store[colPath][id] = { ...this.store[colPath][id], ...data };

    if (colPath.includes('/')) {
      const subName = parts[parts.length - 2];
      if (!this.store[subName]) this.store[subName] = {};
      this.store[subName][`${parts[parts.length - 3]}_${id}`] = this.store[colPath][id];
    }

    this.notify();
  }

  public deleteDoc(path: string) {
    this.init();
    const parts = path.replace(/^\/|\/$/g, '').split('/');
    const id = parts[parts.length - 1];
    const colPath = parts.slice(0, parts.length - 1).join('/');
    if (this.store[colPath]) {
      delete this.store[colPath][id];
    }
    this.notify();
  }

  public addDoc(colPath: string, data: any): string {
    this.init();
    const cleanCol = colPath.replace(/^\/|\/$/g, '');
    const id = 'doc_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now().toString(36);
    if (!this.store[cleanCol]) {
      this.store[cleanCol] = {};
    }
    this.store[cleanCol][id] = { ...data };
    this.notify();
    return id;
  }
}

export const mockDb = new MockDatabase();

// ── Mock Reference & Query Types ──

export interface MockDocRef {
  type: 'document';
  path: string;
  id: string;
}

export interface MockColRef {
  type: 'collection';
  path: string;
  id?: string;
  __memo?: boolean;
}

export interface MockQueryConstraint {
  type: 'where' | 'orderBy' | 'limit';
  field?: string;
  op?: string;
  value?: any;
  direction?: 'asc' | 'desc';
  limitCount?: number;
}

export interface MockQuery {
  type: 'query';
  colRef: MockColRef;
  constraints: MockQueryConstraint[];
  __memo?: boolean;
  _query?: {
    path: {
      canonicalString: () => string;
      toString: () => string;
    };
  };
}

export function cleanPathParts(...parts: any[]): string {
  const flattened: string[] = [];
  for (const part of parts) {
    if (!part) continue;
    if (typeof part === 'string') {
      flattened.push(part);
    } else if (part.path) {
      flattened.push(part.path);
    }
  }
  return flattened.join('/').replace(/\/+/g, '/').replace(/^\/|\/$/g, '');
}

export function collection(firestore: any, ...pathSegments: any[]): MockColRef {
  const fullPath = cleanPathParts(...pathSegments);
  return {
    type: 'collection',
    path: fullPath,
  };
}

export function collectionGroup(firestore: any, collectionId: string): MockColRef {
  return {
    type: 'collection',
    path: collectionId,
  };
}

export function doc(firestore: any, ...pathSegments: any[]): MockDocRef {
  const fullPath = cleanPathParts(...pathSegments);
  const parts = fullPath.split('/');
  return {
    type: 'document',
    path: fullPath,
    id: parts[parts.length - 1],
  };
}

export function where(field: string, op: string, value: any): MockQueryConstraint {
  return { type: 'where', field, op, value };
}

export function orderBy(field: string, direction: 'asc' | 'desc' = 'asc'): MockQueryConstraint {
  return { type: 'orderBy', field, direction };
}

export function limit(limitCount: number): MockQueryConstraint {
  return { type: 'limit', limitCount };
}

export function query(colRef: MockColRef, ...constraints: MockQueryConstraint[]): MockQuery {
  const pathStr = colRef.path;
  return {
    type: 'query',
    colRef,
    constraints,
    _query: {
      path: {
        canonicalString: () => pathStr,
        toString: () => pathStr,
      },
    },
  };
}

export function executeQuery(target: MockColRef | MockQuery | null | undefined): any[] {
  if (!target) return [];
  const colRef = target.type === 'query' ? target.colRef : target;
  const constraints = target.type === 'query' ? target.constraints : [];

  let items = mockDb.getCollectionDocs(colRef.path);

  // Apply where constraints
  for (const c of constraints) {
    if (c.type === 'where' && c.field) {
      items = items.filter((item) => {
        const val = item[c.field!];
        switch (c.op) {
          case '==':
            return val === c.value;
          case '!=':
            return val !== c.value;
          case '>=':
            return val !== undefined && val >= c.value;
          case '<=':
            return val !== undefined && val <= c.value;
          case '>':
            return val !== undefined && val > c.value;
          case '<':
            return val !== undefined && val < c.value;
          case 'in':
            return Array.isArray(c.value) && c.value.includes(val);
          case 'array-contains':
            return Array.isArray(val) && val.includes(c.value);
          default:
            return true;
        }
      });
    }
  }

  // Apply orderBy constraints
  for (const c of constraints) {
    if (c.type === 'orderBy' && c.field) {
      items.sort((a, b) => {
        const av = a[c.field!];
        const bv = b[c.field!];
        if (av === bv) return 0;
        if (av === undefined) return 1;
        if (bv === undefined) return -1;
        const res = av < bv ? -1 : 1;
        return c.direction === 'desc' ? -res : res;
      });
    }
  }

  // Apply limit
  for (const c of constraints) {
    if (c.type === 'limit' && typeof c.limitCount === 'number') {
      items = items.slice(0, c.limitCount);
    }
  }

  return items;
}

export async function getDocs(target: MockColRef | MockQuery) {
  const items = executeQuery(target);
  const docs = items.map((item) => ({
    id: item.id,
    data: () => ({ ...item }),
    exists: () => true,
  }));
  return {
    empty: docs.length === 0,
    size: docs.length,
    docs,
    forEach: (cb: (doc: any) => void) => docs.forEach(cb),
  };
}

export async function getDoc(docRef: MockDocRef) {
  const res = mockDb.getDoc(docRef.path);
  return {
    id: docRef.id,
    exists: () => res.exists,
    data: () => res.data || {},
  };
}

export async function setDoc(docRef: MockDocRef, data: any, options?: any) {
  mockDb.setDoc(docRef.path, data, options);
}

export async function addDoc(colRef: MockColRef, data: any): Promise<MockDocRef> {
  const id = mockDb.addDoc(colRef.path, data);
  return {
    type: 'document',
    path: `${colRef.path}/${id}`,
    id,
  };
}

export async function updateDoc(docRef: MockDocRef, data: any) {
  mockDb.updateDoc(docRef.path, data);
}

export async function deleteDoc(docRef: MockDocRef) {
  mockDb.deleteDoc(docRef.path);
}

export function serverTimestamp() {
  return new Date().toISOString();
}

export async function runTransaction(firestore: any, updateFunction: (transaction: any) => Promise<any>) {
  const transaction = {
    get: async (docRef: MockDocRef) => getDoc(docRef),
    set: (docRef: MockDocRef, data: any, options?: any) => {
      mockDb.setDoc(docRef.path, data, options);
      return transaction;
    },
    update: (docRef: MockDocRef, data: any) => {
      mockDb.updateDoc(docRef.path, data);
      return transaction;
    },
    delete: (docRef: MockDocRef) => {
      mockDb.deleteDoc(docRef.path);
      return transaction;
    },
  };
  return await updateFunction(transaction);
}

export function writeBatch(firestore?: any) {
  const ops: Array<() => void> = [];
  return {
    set: (docRef: MockDocRef, data: any, options?: any) => {
      ops.push(() => mockDb.setDoc(docRef.path, data, options));
    },
    update: (docRef: MockDocRef, data: any) => {
      ops.push(() => mockDb.updateDoc(docRef.path, data));
    },
    delete: (docRef: MockDocRef) => {
      ops.push(() => mockDb.deleteDoc(docRef.path));
    },
    commit: async () => {
      for (const op of ops) op();
    },
  };
}

export interface User {
  email: string | null;
  uid: string;
}

export interface TableData {
  id: string | number;
  [key: string]: any;
}

export interface SyncStatus {
  lastSync?: string;
  status: string;
  message?: string;
  progress?: number;
  statistics?: {
    [key: string]: number;
  };
}

export interface Table {
  name: string;
  description?: string;
}

export interface SnackbarState {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'info' | 'warning';
}

export * from './table'; 
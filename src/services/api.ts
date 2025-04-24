import axios, { AxiosInstance } from 'axios';
import { TableData, SyncStatus } from '../types';
import { Table, TablesResponse } from '../types/table';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  response => response,
  error => {
    console.error('Error en la solicitud API:', error);
    throw error.response?.data || error;
  }
);

export const getTables = async (): Promise<TablesResponse | Table[]> => {
  try {
    const response = await api.get('/tables');
    return response.data;
  } catch (error) {
    console.error('Error al obtener tablas:', error);
    throw error;
  }
};

export const getTableData = async (tableName: string): Promise<TableData[]> => {
  try {
    const response = await api.get(`/tables/${tableName}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener datos de la tabla ${tableName}:`, error);
    throw error;
  }
};

export const createRecord = async (tableName: string, data: TableData): Promise<void> => {
  try {
    await api.post(`/tables/${tableName}`, data);
  } catch (error) {
    console.error(`Error al crear registro en ${tableName}:`, error);
    throw error;
  }
};

export const updateRecord = async (tableName: string, id: string | number, data: TableData): Promise<void> => {
  try {
    await api.put(`/tables/${tableName}/${id}`, data);
  } catch (error) {
    console.error(`Error al actualizar registro en ${tableName}:`, error);
    throw error;
  }
};

export const deleteRecord = async (tableName: string, id: string | number): Promise<void> => {
  try {
    await api.delete(`/tables/${tableName}/${id}`);
  } catch (error) {
    console.error(`Error al eliminar registro en ${tableName}:`, error);
    throw error;
  }
};

export const syncTable = async (tableName: string): Promise<void> => {
  try {
    const response = await api.post('/sync', { table: tableName });
    if (!response.data) {
      throw new Error('No se recibió respuesta del servidor');
    }
    if (response.data.error) {
      throw new Error(response.data.error);
    }
  } catch (error: any) {
    console.error(`Error al sincronizar tabla ${tableName}:`, error);
    throw error.response?.data?.error || error.message || 'Error desconocido al sincronizar';
  }
};

export const getSyncStatus = async (tableName: string): Promise<SyncStatus> => {
  try {
    const response = await api.get('/status');
    if (!response.data) {
      throw new Error('No se recibió respuesta del servidor');
    }
    if (response.data.error) {
      throw new Error(response.data.error);
    }
    return response.data;
  } catch (error: any) {
    console.error(`Error al obtener estado de sincronización de ${tableName}:`, error);
    throw error.response?.data?.error || error.message || 'Error desconocido al obtener estado';
  }
}; 
import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Button,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Paper,
  Grid,
  Card,
  CardContent,
  Table as MUITable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  LinearProgress,
} from '@mui/material';
import SyncIcon from '@mui/icons-material/Sync';
import { getTables, syncTable, getSyncStatus } from '../services/api';
import StatusMessage from '../components/ui/StatusMessage';
import { SyncStatus, SnackbarState } from '../types';
import type { Table } from '../types/table';

const SyncPage: React.FC = () => {
  const [tables, setTables] = useState<Table[]>([]);
  const [selectedTable, setSelectedTable] = useState('');
  const [loading, setLoading] = useState(false);
  const [tablesLoading, setTablesLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(null);
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: '',
    severity: 'info'
  });

  const fetchStatus = useCallback(async () => {
    if (!selectedTable) return;
    try {
      const statusResponse = await getSyncStatus(selectedTable);
      setSyncStatus(statusResponse);
    } catch (err: any) {
      console.error('Error al obtener estado:', err);
    }
  }, [selectedTable]);

  const fetchTables = useCallback(async () => {
    try {
      setTablesLoading(true);
      const data = await getTables();
      const configTables = Array.isArray(data)
        ? data.filter(table => {
            const tableName = typeof table === 'string' ? table : table.name;
            return tableName.startsWith('Configuration') || tableName.includes('Config');
          })
        : data.tables.filter((table: string | Table) => {
            const tableName = typeof table === 'string' ? table : table.name;
            return tableName.startsWith('Configuration') || tableName.includes('Config');
          });
      
      setTables(configTables.map((table: string | Table) => 
        typeof table === 'string' ? { name: table } : table
      ));
      
      if (selectedTable) {
        const statusResponse = await getSyncStatus(selectedTable);
        setSyncStatus(statusResponse);
      }
    } catch (err: any) {
      showSnackbar(`Error al cargar las tablas: ${err.message}`, 'error');
    } finally {
      setTablesLoading(false);
    }
  }, [selectedTable]);

  useEffect(() => {
    fetchTables();
    const intervalId = setInterval(fetchStatus, 10000);
    return () => clearInterval(intervalId);
  }, [fetchTables, fetchStatus]);

  const handleSync = async () => {
    if (!selectedTable) return;

    setLoading(true);
    try {
      await syncTable(selectedTable);
      await fetchStatus();
      showSnackbar(`Sincronización iniciada para ${selectedTable}`, 'success');
    } catch (err: any) {
      showSnackbar(`Error al iniciar la sincronización: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message: string, severity: SnackbarState['severity']) => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const getStatusColor = (status: string): 'success' | 'error' | 'warning' | 'default' => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'success':
        return 'success';
      case 'failed':
      case 'error':
        return 'error';
      case 'in_progress':
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Typography variant="h5" color="primary" gutterBottom>
        Sincronización de Datos
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" color="primary" gutterBottom>
                Iniciar Sincronización
              </Typography>
              
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Seleccionar Tabla</InputLabel>
                <Select
                  value={selectedTable}
                  onChange={(e) => setSelectedTable(e.target.value)}
                  label="Seleccionar Tabla"
                  disabled={tablesLoading || loading}
                >
                  {tables.map((table) => (
                    <MenuItem key={table.name} value={table.name}>
                      {table.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Button
                variant="contained"
                onClick={handleSync}
                disabled={!selectedTable || loading || tablesLoading}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SyncIcon />}
                fullWidth
              >
                Iniciar Sincronización
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" color="primary" gutterBottom>
                Estado Actual
              </Typography>
              
              {syncStatus && (
                <Box>
                  <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <Typography variant="body1">
                      Estado:
                    </Typography>
                    <Chip 
                      label={syncStatus.status}
                      color={getStatusColor(syncStatus.status)}
                      variant="outlined"
                    />
                  </Box>
                  
                  {syncStatus.message && (
                    <Typography variant="body2" color="text.secondary" mb={2}>
                      {syncStatus.message}
                    </Typography>
                  )}

                  {syncStatus.progress !== undefined && (
                    <Box sx={{ width: '100%', mt: 2 }}>
                      <LinearProgress variant="determinate" value={syncStatus.progress} />
                    </Box>
                  )}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <StatusMessage
        snackbar={snackbar}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      />
    </Box>
  );
};

export default SyncPage; 
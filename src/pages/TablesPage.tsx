import React, { useState, useEffect, useCallback } from 'react';
import {
  Typography,
  Box,
  Button,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  CircularProgress,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { getTables, getTableData, createRecord, updateRecord, deleteRecord } from '../services/api';
import DataTable from '../components/ui/DataTable';
import DataDialog from '../components/ui/DataDialog';
import StatusMessage from '../components/ui/StatusMessage';
import { TableData, SnackbarState } from '../types';
import { Table } from '../types/table';

const TablesPage: React.FC = () => {
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [tableData, setTableData] = useState<TableData[]>([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<TableData | null>(null);
  const [editedData, setEditedData] = useState<TableData>({ id: '' });
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: '',
    severity: 'info'
  });

  const fetchTables = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getTables();
      const formattedTables = Array.isArray(data) 
        ? data.map((table: string | Table) => typeof table === 'string' ? { name: table } : table)
        : data.tables.map((table: string | Table) => typeof table === 'string' ? { name: table } : table);
      setTables(formattedTables);
    } catch (err: any) {
      setError(err.message || 'Error al cargar las tablas');
      showSnackbar('Error al cargar las tablas', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTables();
  }, [fetchTables]);

  const fetchTableData = async (tableName: string) => {
    try {
      setSelectedTable(tableName);
      setDataLoading(true);
      setOpenDialog(true);
      const data = await getTableData(tableName);
      setTableData(data);
    } catch (err: any) {
      showSnackbar(`Error al cargar datos: ${err.message}`, 'error');
    } finally {
      setDataLoading(false);
    }
  };

  const handleEditClick = (record: TableData) => {
    setCurrentRecord(record);
    setEditedData({...record});
    setEditDialogOpen(true);
  };

  const handleCreateClick = () => {
    if (!tableData.length) {
      showSnackbar('No hay datos disponibles para crear un nuevo registro', 'warning');
      return;
    }
    const templateRecord: TableData = {
      id: '',
      ...Object.keys(tableData[0]).reduce((acc, key) => ({
        ...acc,
        [key]: key === 'id' ? '' : null
      }), {})
    };
    setEditedData(templateRecord);
    setCreateDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedTable || !currentRecord) return;
    try {
      const primaryKey = Object.keys(currentRecord).find(key => 
        key.toLowerCase() === 'id' || 
        key.toLowerCase().endsWith('_id') || 
        key.toLowerCase() === 'mapping_id'
      ) || 'ID';
      
      await updateRecord(selectedTable, currentRecord[primaryKey], editedData);
      setEditDialogOpen(false);
      await fetchTableData(selectedTable);
      showSnackbar('Registro actualizado correctamente', 'success');
    } catch (err: any) {
      showSnackbar(`Error al actualizar: ${err.message}`, 'error');
    }
  };

  const handleSaveCreate = async () => {
    if (!selectedTable) return;
    try {
      await createRecord(selectedTable, editedData);
      setCreateDialogOpen(false);
      await fetchTableData(selectedTable);
      showSnackbar('Registro creado correctamente', 'success');
    } catch (err: any) {
      showSnackbar(`Error al crear registro: ${err.message}`, 'error');
    }
  };

  const handleDelete = async (record: TableData) => {
    if (!selectedTable) return;
    try {
      const primaryKey = Object.keys(record).find(key => 
        key.toLowerCase() === 'id' || 
        key.toLowerCase().endsWith('_id') || 
        key.toLowerCase() === 'mapping_id'
      ) || 'ID';
      
      await deleteRecord(selectedTable, record[primaryKey]);
      await fetchTableData(selectedTable);
      showSnackbar('Registro eliminado correctamente', 'success');
    } catch (err: any) {
      showSnackbar(`Error al eliminar: ${err.message}`, 'error');
    }
  };

  const showSnackbar = (message: string, severity: SnackbarState['severity']) => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" py={3}>
        <Typography variant="h6" color="error" gutterBottom>
          {error}
        </Typography>
        <Button
          variant="contained"
          onClick={fetchTables}
          startIcon={<RefreshIcon />}
        >
          Reintentar
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" color="primary">
          Tablas Disponibles
        </Typography>
        <Button 
          startIcon={<RefreshIcon />}
          onClick={fetchTables}
          variant="outlined"
          color="primary"
        >
          Actualizar
        </Button>
      </Box>

      <Grid container spacing={3}>
        {tables.map((table) => (
          <Grid item xs={12} sm={6} md={4} key={table.name}>
            <Card 
              elevation={3}
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)'
                }
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom color="primary">
                  {table.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {table.description || 'Sin descripción'}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  startIcon={<VisibilityIcon />}
                  onClick={() => fetchTableData(table.name)}
                  variant="contained"
                  color="primary"
                  fullWidth
                  aria-label={`Ver datos de ${table.name}`}
                >
                  Ver Datos
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        fullWidth
        maxWidth="xl"
        aria-labelledby="table-dialog-title"
        PaperProps={{
          sx: {
            width: '95%',
            maxHeight: '90vh',
            m: 2
          }
        }}
      >
        <DialogTitle id="table-dialog-title">
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" color="primary">
              Datos de {selectedTable}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleCreateClick}
              aria-label="Crear nuevo registro"
            >
              Nuevo Registro
            </Button>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          <Box sx={{ overflowX: 'auto', width: '100%' }}>
            <DataTable
              data={tableData}
              isLoading={dataLoading}
              onEdit={handleEditClick}
              onDelete={handleDelete}
            />
          </Box>
        </DialogContent>
      </Dialog>

      {editDialogOpen && (
        <DataDialog
          open={editDialogOpen}
          title="Editar Registro"
          data={editedData}
          onClose={() => setEditDialogOpen(false)}
          onSave={handleSaveEdit}
          onChange={(key, value) => setEditedData(prev => ({ ...prev, [key]: value }))}
        />
      )}

      {createDialogOpen && (
        <DataDialog
          open={createDialogOpen}
          title="Crear Nuevo Registro"
          data={editedData}
          onClose={() => setCreateDialogOpen(false)}
          onSave={handleSaveCreate}
          onChange={(key, value) => setEditedData(prev => ({ ...prev, [key]: value }))}
          isCreate
        />
      )}

      <StatusMessage
        snackbar={snackbar}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      />
    </Box>
  );
};

export default TablesPage; 
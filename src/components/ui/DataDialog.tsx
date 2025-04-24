import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
  Typography,
  Box,
  IconButton,
  useTheme,
  Tooltip
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { TableData } from 'types';

interface DataDialogProps {
  open: boolean;
  title: string;
  data: TableData;
  onClose: () => void;
  onSave: () => void;
  onChange: (key: string, value: string) => void;
  isCreate?: boolean;
}

const DataDialog: React.FC<DataDialogProps> = ({
  open,
  title,
  data,
  onClose,
  onSave,
  onChange,
  isCreate = false
}) => {
  const theme = useTheme();

  const isFieldDisabled = (key: string) => {
    return !isCreate && (key.toLowerCase() === 'id' || key.toLowerCase().includes('_id'));
  };

  const getHelperText = (key: string) => {
    if (isCreate && (key.toLowerCase() === 'id' || key.toLowerCase().includes('_id'))) {
      return 'Campo identificador único';
    }
    if (isFieldDisabled(key)) {
      return 'Campo no editable';
    }
    return '';
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      fullWidth
      maxWidth="md"
      aria-labelledby="data-dialog-title"
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: theme.shadows[10],
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle id="data-dialog-title" sx={{ m: 0, p: 2, backgroundColor: theme.palette.primary.main, color: 'white' }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6" component="div">
            {title}
          </Typography>
          <IconButton
            aria-label="Cerrar diálogo"
            onClick={onClose}
            size="small"
            sx={{
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.2)'
              }
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent 
        dividers
        sx={{
          py: 3,
          px: 3,
          overflowY: 'auto'
        }}
      >
        <Grid container spacing={3}>
          {Object.entries(data).map(([key, value]) => (
            <Grid item xs={12} sm={6} key={key}>
              <Tooltip 
                title={getHelperText(key)} 
                placement="top-start"
                arrow
                open={!!getHelperText(key)}
              >
                <TextField
                  fullWidth
                  label={key}
                  value={value || ''}
                  onChange={(e) => onChange(key, e.target.value)}
                  variant="outlined"
                  disabled={isFieldDisabled(key)}
                  required={key.toLowerCase() === 'id' || key.toLowerCase().includes('_id')}
                  aria-label={`Campo ${key}`}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&.Mui-focused fieldset': {
                        borderColor: theme.palette.primary.main,
                      },
                      '&:hover fieldset': {
                        borderColor: theme.palette.primary.light,
                      },
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: theme.palette.primary.main,
                    },
                  }}
                />
              </Tooltip>
            </Grid>
          ))}
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: 2.5, backgroundColor: theme.palette.grey[50] }}>
        <Button 
          onClick={onClose}
          variant="outlined"
          color="inherit"
          aria-label="Cancelar operación"
          sx={{
            mr: 1,
            '&:hover': {
              backgroundColor: theme.palette.grey[200]
            }
          }}
        >
          Cancelar
        </Button>
        <Button 
          onClick={onSave}
          variant="contained"
          color="primary"
          aria-label={isCreate ? "Crear nuevo registro" : "Guardar cambios"}
          sx={{
            px: 3,
            '&:hover': {
              backgroundColor: theme.palette.primary.dark
            }
          }}
        >
          {isCreate ? 'Crear' : 'Guardar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DataDialog; 
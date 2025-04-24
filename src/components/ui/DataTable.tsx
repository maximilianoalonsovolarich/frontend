import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Box,
  CircularProgress,
  Tooltip,
  Divider,
  Stack,
  useTheme
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { TableData } from 'types';

interface DataTableProps {
  data: TableData[];
  isLoading?: boolean;
  onEdit?: (record: TableData) => void;
  onDelete?: (record: TableData) => void;
}

const DataTable: React.FC<DataTableProps> = ({
  data,
  isLoading = false,
  onEdit,
  onDelete
}) => {
  const theme = useTheme();

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" my={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (!data.length) {
    return (
      <Box textAlign="center" py={3}>
        <Typography variant="body1" color="textSecondary">
          No hay datos disponibles
        </Typography>
      </Box>
    );
  }

  const renderCellContent = (value: any) => {
    if (value === null || value === undefined) {
      return <Typography color="text.secondary" variant="body2">-</Typography>;
    }
    if (typeof value === 'boolean') {
      return value ? 'Sí' : 'No';
    }
    if (typeof value === 'object') {
      return JSON.stringify(value);
    }
    return String(value);
  };

  return (
    <TableContainer 
      component={Paper} 
      sx={{ 
        mt: 2,
        boxShadow: 3,
        borderRadius: 2,
        overflow: 'auto',
        '& .MuiTable-root': {
          minWidth: 750,
          tableLayout: 'auto'
        },
        height: 'calc(80vh - 200px)'
      }}
    >
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            {Object.keys(data[0]).map((key) => (
              <TableCell 
                key={key}
                sx={{ 
                  backgroundColor: theme.palette.primary.main,
                  color: 'white',
                  fontWeight: 500,
                  whiteSpace: 'nowrap',
                  minWidth: '150px',
                  py: 2,
                  '&:first-of-type': {
                    borderTopLeftRadius: 8
                  }
                }}
              >
                {key}
              </TableCell>
            ))}
            <TableCell 
              align="center"
              sx={{ 
                backgroundColor: theme.palette.primary.main,
                color: 'white',
                fontWeight: 500,
                width: '120px',
                position: 'sticky',
                right: 0,
                zIndex: 2,
                borderTopRightRadius: 8,
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: '4px',
                  background: 'linear-gradient(90deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0) 100%)'
                }
              }}
            >
              Acciones
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <TableRow 
              key={index}
              sx={{ 
                '&:nth-of-type(odd)': { 
                  backgroundColor: theme.palette.action.hover 
                },
                '&:hover': { 
                  backgroundColor: theme.palette.action.selected,
                  '& .action-cell': {
                    backgroundColor: theme.palette.action.selected,
                  }
                },
                '&:last-child td': {
                  borderBottom: 0
                }
              }}
            >
              {Object.entries(row).map(([key, value], i) => (
                <TableCell 
                  key={i}
                  sx={{
                    maxWidth: '300px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    py: 1.5
                  }}
                >
                  <Tooltip title={renderCellContent(value)} enterDelay={500}>
                    <Box component="span" sx={{ cursor: 'default' }}>
                      {renderCellContent(value)}
                    </Box>
                  </Tooltip>
                </TableCell>
              ))}
              <TableCell
                className="action-cell"
                sx={{
                  position: 'sticky',
                  right: 0,
                  background: 'inherit',
                  width: '120px',
                  p: 1,
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: '4px',
                    background: 'linear-gradient(90deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0) 100%)'
                  }
                }}
              >
                <Stack 
                  direction="row" 
                  spacing={1} 
                  divider={<Divider orientation="vertical" flexItem />}
                  justifyContent="center"
                >
                  {onEdit && (
                    <Tooltip title="Editar registro" placement="left">
                      <IconButton 
                        size="small"
                        color="primary" 
                        onClick={() => onEdit(row)}
                        sx={{ 
                          '&:hover': { 
                            backgroundColor: theme.palette.primary.light,
                            color: 'white'
                          }
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                  {onDelete && (
                    <Tooltip title="Eliminar registro" placement="right">
                      <IconButton 
                        size="small"
                        color="error" 
                        onClick={() => onDelete(row)}
                        sx={{ 
                          '&:hover': { 
                            backgroundColor: theme.palette.error.light,
                            color: 'white'
                          }
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DataTable; 
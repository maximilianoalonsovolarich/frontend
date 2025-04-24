import React from 'react';
import { Alert, Snackbar, AlertColor, useTheme } from '@mui/material';
import { SnackbarState } from 'types';

interface StatusMessageProps {
  snackbar: SnackbarState;
  onClose: () => void;
}

const StatusMessage: React.FC<StatusMessageProps> = ({ snackbar, onClose }) => {
  const theme = useTheme();

  const getBackgroundColor = (severity: AlertColor) => {
    switch (severity) {
      case 'success':
        return theme.palette.success.light;
      case 'error':
        return theme.palette.error.light;
      case 'warning':
        return theme.palette.warning.light;
      case 'info':
        return theme.palette.info.light;
      default:
        return theme.palette.grey[200];
    }
  };

  return (
    <Snackbar
      open={snackbar.open}
      autoHideDuration={6000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      sx={{
        bottom: { xs: 16, sm: 24 }
      }}
    >
      <Alert
        elevation={6}
        variant="filled"
        onClose={onClose}
        severity={snackbar.severity as AlertColor}
        sx={{
          width: '100%',
          minWidth: { xs: '90vw', sm: 400 },
          borderRadius: 2,
          py: 1,
          px: 2,
          '& .MuiAlert-message': {
            fontSize: '0.95rem',
            py: 0.5
          },
          '& .MuiAlert-icon': {
            fontSize: '1.5rem'
          },
          backgroundColor: getBackgroundColor(snackbar.severity as AlertColor),
          color: theme.palette.getContrastText(getBackgroundColor(snackbar.severity as AlertColor))
        }}
      >
        {snackbar.message}
      </Alert>
    </Snackbar>
  );
};

export default StatusMessage; 
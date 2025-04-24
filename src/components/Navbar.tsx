import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
} from '@mui/material';
import SyncIcon from '@mui/icons-material/Sync';
import TableChartIcon from '@mui/icons-material/TableChart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      handleClose();
      navigate('/login');
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <AppBar position="static" sx={{ mb: 2 }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Sync UI
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {user && (
            <>
              <Button
                color="inherit"
                component={RouterLink}
                to="/"
                startIcon={<TableChartIcon />}
                sx={{ mr: 1 }}
              >
                Tablas
              </Button>
              <Button
                color="inherit"
                component={RouterLink}
                to="/sync"
                startIcon={<SyncIcon />}
                sx={{ mr: 2 }}
              >
                Sincronizar
              </Button>
            </>
          )}
          <Box>
            {user ? (
              <div>
                <IconButton
                  size="large"
                  aria-label="cuenta del usuario"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                >
                  <Avatar 
                    sx={{ 
                      width: 32, 
                      height: 32, 
                      bgcolor: 'secondary.main',
                      fontSize: '1rem'
                    }}
                  >
                    {user.email ? user.email.charAt(0).toUpperCase() : <AccountCircleIcon />}
                  </Avatar>
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem disabled sx={{ opacity: 0.7 }}>
                    {user.email}
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    Cerrar sesión
                  </MenuItem>
                </Menu>
              </div>
            ) : (
              <Button 
                color="inherit" 
                component={RouterLink} 
                to="/login"
                variant="outlined"
                sx={{ 
                  borderColor: 'rgba(255,255,255,0.5)',
                  '&:hover': {
                    borderColor: 'white'
                  }
                }}
              >
                Iniciar Sesión
              </Button>
            )}
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 
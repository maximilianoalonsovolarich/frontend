import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import theme from './theme';
import LoginPage from './pages/LoginPage';
import TablesPage from './pages/TablesPage';
import SyncPage from './pages/SyncPage';
import PrivateRoute from './components/PrivateRoute';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: 'login',
        element: <LoginPage />
      },
      {
        path: '',
        element: <PrivateRoute><TablesPage /></PrivateRoute>
      },
      {
        path: 'sync',
        element: <PrivateRoute><SyncPage /></PrivateRoute>
      }
    ]
  }
]);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

// Envolver la aplicación en un div con role="main" para mejorar la accesibilidad
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <div role="main">
          <RouterProvider router={router} />
        </div>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
); 
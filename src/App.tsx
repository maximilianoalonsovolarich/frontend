import React from 'react';
import { Outlet, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import TablesPage from './pages/TablesPage';
import SyncPage from './pages/SyncPage';
import PrivateRoute from './components/PrivateRoute';
import { Container } from '@mui/material';

const Layout: React.FC = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <>
      {!isLoginPage && <Navbar />}
      <Container>
        <Outlet />
      </Container>
    </>
  );
};

const App: React.FC = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <TablesPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/sync"
          element={
            <PrivateRoute>
              <SyncPage />
            </PrivateRoute>
          }
        />
      </Route>
    </Routes>
  );
};

export default App; 
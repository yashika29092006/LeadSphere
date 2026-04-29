import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import ProtectedRoute from '../components/ProtectedRoute';

import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Leads from '../pages/Leads';
import Contacts from '../pages/Contacts';
import Accounts from '../pages/Accounts';
import Deals from '../pages/Deals';
import Reports from '../pages/Reports';
import Users from '../pages/Users';

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      
      <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/leads" element={<Leads />} />
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/accounts" element={<Accounts />} />
        <Route path="/deals" element={<Deals />} />
        <Route path="/reports" element={<Reports />} />
        
        <Route path="/users" element={
          <ProtectedRoute allowedRoles={['Admin']}><Users /></ProtectedRoute>
        } />
      </Route>
    </Routes>
  );
}

export default AppRouter;

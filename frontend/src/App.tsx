import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, ProtectedRoute } from './auth/auth-context';
import { Layout } from './components/layout';
import { Login } from './pages/login';
import { Dashboard } from './pages/dashboard';
import { Customers } from './pages/customers';
import { Products } from './pages/products';
import { StockMovements } from './pages/stock-movements';
import { Challans } from './pages/challans';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Auth Route */}
          <Route path="/login" element={<Login />} />

          {/* Protected App Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            
            <Route
              path="customers"
              element={
                <ProtectedRoute allowedRoles={['admin', 'sales', 'accounts']}>
                  <Customers />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="products"
              element={
                <ProtectedRoute allowedRoles={['admin', 'sales', 'warehouse', 'accounts']}>
                  <Products />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="stock-movements"
              element={
                <ProtectedRoute allowedRoles={['admin', 'warehouse']}>
                  <StockMovements />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="challans"
              element={
                <ProtectedRoute allowedRoles={['admin', 'sales', 'warehouse', 'accounts']}>
                  <Challans />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Catch-all Redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

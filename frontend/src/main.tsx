import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import App from './App.tsx'

// Imports de Productos (Track 3)
import { ProductosPage } from './pages/productos/ProductosPage'
import { ProductoDetallePage } from './pages/productos/ProductoDetallePage'
import { CategoriasPage } from './pages/categorias/CategoriasPage'
import { IngredientesPage } from './pages/ingredientes/IngredientesPage'
import { CatalogoPage } from './pages/catalogo/CatalogoPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import UserProfilePage from './pages/UserProfilePage'
import OrdersPage from './pages/OrdersPage'
import OrderDetallePage from './pages/OrderDetallePage'
import CarritoPage from './pages/CarritoPage'
import UsuariosPage from './pages/UsuariosPage'
import { AuthProvider } from './context/AuthContext'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
})

// TODO: Create the actual components for /login, /perfil, /usuarios based on docs

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<Navigate to="/catalogo" replace />} />

            {/* Rutas Track 2: Catálogo */}
            <Route path="catalogo" element={<CatalogoPage />} />
            <Route path="categorias" element={<CategoriasPage />} />
            <Route path="ingredientes" element={<IngredientesPage />} />
            
            {/* Rutas Track 3: Productos */}
            <Route path="productos" element={<ProductosPage />} />
            <Route path="productos/:id" element={<ProductoDetallePage />} />

            {/* Rutas Track 4: Pedidos */}
            <Route path="carrito" element={<CarritoPage />} />
            <Route path="mis-pedidos" element={<OrdersPage />} />
            <Route path="mis-pedidos/:id" element={<OrderDetallePage />} />

            {/* Rutas Track 1: Identidad (Pendientes) */}
            <Route path="login" element={<LoginPage />} />
            <Route path="registro" element={<RegisterPage />} />
            <Route path="perfil" element={<UserProfilePage />} />
            <Route path="usuarios" element={<UsuariosPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
)

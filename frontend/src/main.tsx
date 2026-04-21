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

            {/* Rutas Track 1: Identidad (Pendientes) */}
            <Route path="login" element={<div>Login (Todo)</div>} />
            <Route path="perfil" element={<div>Perfil (Todo)</div>} />
            <Route path="usuarios" element={<div>Usuarios (Todo)</div>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
)

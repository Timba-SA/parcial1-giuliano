import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'

type NavLinkState = { isActive: boolean; isPending: boolean }

// ─── Íconos ────────────────────────────────────────────────────────────────

const IconCatalogo = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
    <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
  </svg>
)
const IconUsuarios = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
  </svg>
)
const IconProductos = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
    <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
    <path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
  </svg>
)
const IconCategorias = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z" />
  </svg>
)
const IconIngredientes = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
  </svg>
)
const IconPerfil = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
  </svg>
)
const IconLogin = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
    <path fillRule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
)
const IconCarrito = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
    <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C4.734 11.095 5.263 12 6.11 12h10a1 1 0 000-2H6.872l.823-.823a1 1 0 00.218-1.09L6.13 3H3zM8 14a2 2 0 11-4 0 2 2 0 014 0zM16 14a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
)
const IconPedidos = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
    <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
  </svg>
)
const IconLogout = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
    <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
  </svg>
)

// ─── Helpers nav ───────────────────────────────────────────────────────────

const Divider = () => (
  <span className="w-px h-5 shrink-0" style={{ background: 'rgba(255,255,255,0.12)' }} aria-hidden="true" />
)

function getNavClass({ isActive }: NavLinkState): string {
  const base = 'flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 outline-none whitespace-nowrap'
  if (isActive) return `${base} text-white nav-active-glow`
  return `${base} text-slate-400 hover:text-white hover:bg-white/8`
}

function getNavStyle(isActive: boolean): React.CSSProperties {
  if (isActive) {
    return {
      background: 'rgba(99,102,241,0.25)',
      border: '1px solid rgba(99,102,241,0.4)',
      boxShadow: '0 0 16px rgba(99,102,241,0.3)',
    }
  }
  return { border: '1px solid transparent' }
}

// ─── Role badge colors ─────────────────────────────────────────────────────

const roleColors: Record<string, string> = {
  admin: 'rgba(239,68,68,0.25)',
  empleado: 'rgba(59,130,246,0.25)',
  cliente: 'rgba(34,197,94,0.25)',
  anonimo: 'rgba(148,163,184,0.15)',
}
const roleTextColors: Record<string, string> = {
  admin: '#fca5a5',
  empleado: '#93c5fd',
  cliente: '#86efac',
  anonimo: '#94a3b8',
}

// ─── App ───────────────────────────────────────────────────────────────────

function App() {
  const { user, role, isLoggedIn, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(160deg, #f0f4ff 0%, #f8faff 45%, #eff6ff 100%)' }}>

      {/* HEADER */}
      <header
        className="sticky top-0 z-50"
        style={{
          background: 'linear-gradient(135deg, #080d1a 0%, #0f1629 40%, #11103b 100%)',
          borderBottom: '1px solid rgba(99,102,241,0.15)',
          boxShadow: '0 4px 40px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.04) inset',
        }}
      >
        <nav className="flex justify-between items-center max-w-7xl mx-auto px-6 h-14 gap-4">

          {/* Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
              style={{
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                boxShadow: '0 0 20px rgba(99,102,241,0.6)',
              }}
            >
              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-white font-bold text-sm tracking-tight">Sistema</span>
              <span className="text-indigo-400 font-medium text-[10px] tracking-widest uppercase">de Pedidos</span>
            </div>
          </div>

          {/* Nav links — según rol */}
          <div className="flex items-center gap-0.5 overflow-x-auto scrollbar-none flex-1 justify-center">

            {/* Todos ven el catálogo */}
            <NavLink to="/catalogo" className={getNavClass} style={({ isActive }) => getNavStyle(isActive)}>
              <IconCatalogo /> Catálogo
            </NavLink>

            {/* Clientes y anónimos: hacer y ver pedidos */}
            {(role === 'cliente' || role === 'anonimo') && (
              <>
                <Divider />
                <NavLink to="/carrito" className={getNavClass} style={({ isActive }) => getNavStyle(isActive)}>
                  <IconCarrito /> Hacer pedido
                </NavLink>
                {isLoggedIn && (
                  <NavLink to="/mis-pedidos" className={getNavClass} style={({ isActive }) => getNavStyle(isActive)}>
                    <IconPedidos /> Mis pedidos
                  </NavLink>
                )}
              </>
            )}

            {/* Empleados: catálogo + gestión de productos, pedidos propios */}
            {role === 'empleado' && (
              <>
                <Divider />
                <NavLink to="/productos" className={getNavClass} style={({ isActive }) => getNavStyle(isActive)}>
                  <IconProductos /> Productos
                </NavLink>
                <NavLink to="/categorias" className={getNavClass} style={({ isActive }) => getNavStyle(isActive)}>
                  <IconCategorias /> Categorías
                </NavLink>
                <NavLink to="/ingredientes" className={getNavClass} style={({ isActive }) => getNavStyle(isActive)}>
                  <IconIngredientes /> Ingredientes
                </NavLink>
                <Divider />
                <NavLink to="/carrito" className={getNavClass} style={({ isActive }) => getNavStyle(isActive)}>
                  <IconCarrito /> Carrito
                </NavLink>
                <NavLink to="/mis-pedidos" className={getNavClass} style={({ isActive }) => getNavStyle(isActive)}>
                  <IconPedidos /> Mis pedidos
                </NavLink>
              </>
            )}

            {/* Admin: todo */}
            {role === 'admin' && (
              <>
                <Divider />
                <NavLink to="/usuarios" className={getNavClass} style={({ isActive }) => getNavStyle(isActive)}>
                  <IconUsuarios /> Usuarios
                </NavLink>
                <NavLink to="/productos" className={getNavClass} style={({ isActive }) => getNavStyle(isActive)}>
                  <IconProductos /> Productos
                </NavLink>
                <NavLink to="/categorias" className={getNavClass} style={({ isActive }) => getNavStyle(isActive)}>
                  <IconCategorias /> Categorías
                </NavLink>
                <NavLink to="/ingredientes" className={getNavClass} style={({ isActive }) => getNavStyle(isActive)}>
                  <IconIngredientes /> Ingredientes
                </NavLink>
                <Divider />
                <NavLink to="/carrito" className={getNavClass} style={({ isActive }) => getNavStyle(isActive)}>
                  <IconCarrito /> Carrito
                </NavLink>
                <NavLink to="/mis-pedidos" className={getNavClass} style={({ isActive }) => getNavStyle(isActive)}>
                  <IconPedidos /> Mis pedidos
                </NavLink>
              </>
            )}

            <Divider />

            {/* Perfil / Auth */}
            {isLoggedIn ? (
              <>
                <NavLink to="/perfil" className={getNavClass} style={({ isActive }) => getNavStyle(isActive)}>
                  <IconPerfil /> Perfil
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 text-slate-400 hover:text-red-400 hover:bg-red-500/10"
                  style={{ border: '1px solid transparent' }}
                >
                  <IconLogout /> Salir
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={getNavClass} style={({ isActive }) => getNavStyle(isActive)}>
                  <IconLogin /> Login
                </NavLink>
                <NavLink to="/registro" className={getNavClass} style={({ isActive }) => getNavStyle(isActive)}>
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                    <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                  </svg>
                  Registrarse
                </NavLink>
              </>
            )}
          </div>

          {/* Badge de usuario logueado */}
          {user && (
            <div
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg shrink-0"
              style={{
                background: roleColors[role] ?? roleColors.anonimo,
                border: `1px solid ${roleTextColors[role]}30`,
              }}
            >
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black"
                style={{ background: roleTextColors[role] + '30', color: roleTextColors[role] }}
              >
                {user.nombre[0]}{user.apellido[0]}
              </div>
              <span className="text-[10px] font-bold" style={{ color: roleTextColors[role] }}>
                {user.nombre} · {role}
              </span>
            </div>
          )}

        </nav>
      </header>

      {/* MAIN */}
      <main
        className="flex-1 max-w-7xl mx-auto w-full px-6 py-8"
        style={{ animation: 'fade-in-up 0.45s cubic-bezier(0.16,1,0.3,1) both' }}
      >
        <Outlet />
      </main>
    </div>
  )
}

export default App

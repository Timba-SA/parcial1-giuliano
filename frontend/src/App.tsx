import { Outlet, Link } from 'react-router-dom'

function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
      <header className="bg-white shadow p-4">
        <nav className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="text-xl font-bold text-blue-600">Track 1 Identidad</div>
          <div className="flex gap-4">
            <Link to="/usuarios" className="hover:text-blue-500">Usuarios</Link>
            <Link to="/perfil" className="hover:text-blue-500">Perfil</Link>
            <Link to="/login" className="hover:text-blue-500">Login</Link>
          </div>
        </nav>
      </header>
      <main className="flex-1 max-w-7xl mx-auto p-4 w-full">
        <Outlet />
      </main>
    </div>
  )
}

export default App

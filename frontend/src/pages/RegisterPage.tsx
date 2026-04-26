import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function RegisterPage() {
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    celular: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/auth/signup`,
        form
      );
      // Redirect to login after successful registration
      navigate('/login');
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const detail = err.response?.data?.detail;
        if (Array.isArray(detail)) {
          setError(detail[0]?.msg || 'Error al registrar');
        } else {
          setError(detail || 'Error al crear cuenta');
        }
      } else {
        setError('Ocurrió un error inesperado');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 56px)' }}>
      <div className="w-full" style={{ maxWidth: 420 }}>
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Crear Cuenta</h1>
          <p className="text-slate-500 text-sm mt-1">Completá tus datos para registrarte</p>
        </div>

        <div className="rounded-2xl p-8" style={{ background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 8px 40px rgba(0,0,0,0.08)' }}>
          {error && (
            <div className="mb-4 p-3 rounded-xl text-sm" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', color: '#dc2626' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Nombre</label>
                <input
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  type="text"
                  required
                  className="w-full px-4 py-3 rounded-xl text-sm text-slate-800 outline-none"
                  style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Apellido</label>
                <input
                  name="apellido"
                  value={form.apellido}
                  onChange={handleChange}
                  type="text"
                  required
                  className="w-full px-4 py-3 rounded-xl text-sm text-slate-800 outline-none"
                  style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Email</label>
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                type="email"
                required
                className="w-full px-4 py-3 rounded-xl text-sm text-slate-800 outline-none"
                style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Celular (opcional)</label>
              <input
                name="celular"
                value={form.celular}
                onChange={handleChange}
                type="tel"
                className="w-full px-4 py-3 rounded-xl text-sm text-slate-800 outline-none"
                style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Contraseña</label>
              <input
                name="password"
                value={form.password}
                onChange={handleChange}
                type="password"
                required
                minLength={6}
                className="w-full px-4 py-3 rounded-xl text-sm text-slate-800 outline-none"
                style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-sm font-bold text-white mt-2"
              style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', boxShadow: '0 4px 18px rgba(99,102,241,0.45)' }}
            >
              {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-5">
            ¿Ya tenés cuenta?{' '}
            <a href="/login" className="text-indigo-600 font-semibold hover:underline">Iniciar sesión</a>
          </p>
        </div>
      </div>
    </div>
  );
}
import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

type RolOption = 'cliente' | 'empleado' | 'admin';

const ROL_OPTIONS: { value: RolOption; label: string; desc: string; color: string }[] = [
  {
    value: 'cliente',
    label: '🛒 Cliente',
    desc: 'Puede explorar el catálogo y realizar pedidos.',
    color: '#22c55e',
  },
  {
    value: 'empleado',
    label: '🧑‍💼 Empleado',
    desc: 'Gestiona productos, categorías e ingredientes.',
    color: '#3b82f6',
  },
  {
    value: 'admin',
    label: '🔑 Administrador',
    desc: 'Acceso completo al sistema, incluida la gestión de usuarios.',
    color: '#ef4444',
  },
];

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    celular: '',
  });
  const [rol, setRol] = useState<RolOption>('cliente');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await axios.post<unknown>(
        `${API_URL}/auth/signup?rol=${rol}`,
        form
      );
      // Redirigir a login con mensaje de éxito
      navigate('/login', { state: { registered: true } });
    } catch (err: unknown) {
      if (axios.isAxiosError<{ detail: string | { msg: string }[] }>(err)) {
        const detail = err.response?.data?.detail;
        if (Array.isArray(detail)) {
          setError(detail[0]?.msg ?? 'Error al registrar');
        } else {
          setError(detail ?? 'Error al crear cuenta');
        }
      } else {
        setError('Ocurrió un error inesperado');
      }
    } finally {
      setLoading(false);
    }
  };

  const selectedRol = ROL_OPTIONS.find((r) => r.value === rol)!;

  return (
    <div className="flex items-center justify-center py-10">
      <div className="w-full" style={{ maxWidth: 480 }}>

        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
            style={{
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              boxShadow: '0 0 24px rgba(99,102,241,0.5)',
            }}
          >
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Crear cuenta</h1>
          <p className="text-slate-500 text-sm mt-1">Completá tus datos para registrarte</p>
        </div>

        <div
          className="rounded-2xl p-8 space-y-5"
          style={{ background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 8px 40px rgba(0,0,0,0.08)' }}
        >

          {/* Error */}
          {error && (
            <div
              className="p-3 rounded-xl text-sm"
              style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', color: '#dc2626' }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Nombre + Apellido */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Nombre</label>
                <input
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  type="text"
                  required
                  autoComplete="given-name"
                  className="w-full px-4 py-2.5 rounded-xl text-sm text-slate-800 outline-none transition-all"
                  style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}
                  onFocus={(e) => (e.target.style.borderColor = '#6366f1')}
                  onBlur={(e) => (e.target.style.borderColor = '#e2e8f0')}
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
                  autoComplete="family-name"
                  className="w-full px-4 py-2.5 rounded-xl text-sm text-slate-800 outline-none transition-all"
                  style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}
                  onFocus={(e) => (e.target.style.borderColor = '#6366f1')}
                  onBlur={(e) => (e.target.style.borderColor = '#e2e8f0')}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Email</label>
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                type="email"
                required
                autoComplete="email"
                className="w-full px-4 py-2.5 rounded-xl text-sm text-slate-800 outline-none"
                style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}
                onFocus={(e) => (e.target.style.borderColor = '#6366f1')}
                onBlur={(e) => (e.target.style.borderColor = '#e2e8f0')}
              />
            </div>

            {/* Celular */}
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                Celular <span className="font-normal text-slate-400 normal-case">(opcional)</span>
              </label>
              <input
                name="celular"
                value={form.celular}
                onChange={handleChange}
                type="tel"
                autoComplete="tel"
                className="w-full px-4 py-2.5 rounded-xl text-sm text-slate-800 outline-none"
                style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}
                onFocus={(e) => (e.target.style.borderColor = '#6366f1')}
                onBlur={(e) => (e.target.style.borderColor = '#e2e8f0')}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Contraseña</label>
              <div className="relative">
                <input
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  autoComplete="new-password"
                  className="w-full px-4 py-2.5 pr-11 rounded-xl text-sm text-slate-800 outline-none"
                  style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}
                  onFocus={(e) => (e.target.style.borderColor = '#6366f1')}
                  onBlur={(e) => (e.target.style.borderColor = '#e2e8f0')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {form.password.length > 0 && form.password.length < 6 && (
                <p className="mt-1 text-xs text-red-500">Mínimo 6 caracteres</p>
              )}
            </div>

            {/* Selector de rol */}
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                Tipo de cuenta
              </label>
              <div className="grid grid-cols-3 gap-2">
                {ROL_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setRol(option.value)}
                    className="p-3 rounded-xl text-left transition-all duration-150"
                    style={{
                      border: rol === option.value
                        ? `2px solid ${option.color}`
                        : '2px solid #e2e8f0',
                      background: rol === option.value
                        ? `${option.color}10`
                        : '#f8fafc',
                    }}
                  >
                    <div className="text-sm font-bold text-slate-800">{option.label}</div>
                  </button>
                ))}
              </div>
              {/* Descripción del rol seleccionado */}
              <p
                className="mt-2 text-xs px-3 py-2 rounded-lg"
                style={{
                  background: `${selectedRol.color}08`,
                  color: selectedRol.color,
                  border: `1px solid ${selectedRol.color}30`,
                }}
              >
                {selectedRol.desc}
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-sm font-bold text-white mt-2 transition-opacity disabled:opacity-50"
              style={{
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                boxShadow: '0 4px 18px rgba(99,102,241,0.45)',
              }}
            >
              {loading ? 'Creando cuenta...' : 'Crear cuenta'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500">
            ¿Ya tenés cuenta?{' '}
            <Link to="/login" className="text-indigo-600 font-semibold hover:underline">
              Iniciar sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCurrentUser, useUpdateUsuario } from '../hooks/useUsuarios';

type FieldRowProps = { label: string; value: string; icon: React.ReactNode };
const FieldRow = ({ label, value, icon }: FieldRowProps) => (
  <div
    className="flex items-center justify-between py-4 px-5"
    style={{ borderBottom: '1px solid #f1f5f9' }}
  >
    <div className="flex items-center gap-3">
      <span className="text-slate-400">{icon}</span>
      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</span>
    </div>
    <span className="text-sm font-semibold text-slate-800">{value}</span>
  </div>
);

export default function UserProfilePage() {
  const [editMode, setEditMode] = useState(false);
  const navigate = useNavigate();
  
  const { data: currentUser, isLoading, error } = useCurrentUser();
  const updateUsuarioMutation = useUpdateUsuario();

  // Add state for form fields
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    celular: ''
  });

  // Initialize form when edit mode opens
  const handleEditClick = () => {
    if (!editMode && currentUser) {
      setForm({
        nombre: currentUser.nombre || '',
        apellido: currentUser.apellido || '',
        celular: currentUser.celular || ''
      });
    }
    setEditMode(v => !v);
  };

  const handleSave = async () => {
    if (currentUser) {
      await updateUsuarioMutation.mutateAsync({
        id: currentUser.id,
        data: {
          nombre: form.nombre,
          apellido: form.apellido,
          celular: form.celular
        }
      });
      setEditMode(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (isLoading) return <div className="p-8 text-center text-gray-500">Cargando perfil...</div>;
  if (error || !currentUser) return <div className="p-8 text-center text-red-500">Error cargando perfil. Por favor, inicie sesión nuevamente.</div>;

  const STATS = [
    { label: 'Pedidos realizados', value: '—', icon: '📦' },
    { label: 'Productos favoritos', value: '—', icon: '⭐' },
    { label: 'Estado', value: currentUser.is_active ? 'Activo' : 'Inactivo', icon: '🟢' },
  ];

  const fullName = `${currentUser.nombre} ${currentUser.apellido}`;
  const avatarInitials = (currentUser.nombre?.[0] || '') + (currentUser.apellido?.[0] || '');

  return (
    <div
      className="max-w-3xl mx-auto"
      style={{ animation: 'fade-in-up 0.45s cubic-bezier(0.16,1,0.3,1) both' }}
    >

      {/* ── Hero / banner ── */}
      <div
        className="rounded-2xl overflow-hidden mb-6"
        style={{
          background: 'linear-gradient(135deg,#0f172a 0%,#1e1b4b 50%,#0f172a 100%)',
          boxShadow: '0 8px 40px rgba(0,0,0,0.15)',
        }}
      >
        {/* top decoration */}
        <div className="relative h-28 overflow-hidden">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: 'radial-gradient(circle at 20% 50%, #6366f1 0%, transparent 50%), radial-gradient(circle at 80% 50%, #8b5cf6 0%, transparent 50%)',
            }}
          />
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: 'radial-gradient(circle at 25% 25%, white 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />
        </div>

        {/* avatar + info */}
        <div className="px-8 pb-8 -mt-12 flex items-end gap-5">
          {/* avatar */}
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-xl font-black shrink-0"
            style={{
              background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
              border: '3px solid #0f172a',
              boxShadow: '0 0 0 3px rgba(99,102,241,0.4)',
            }}
          >
            {avatarInitials.toUpperCase()}
          </div>

          <div className="pb-1 flex-1">
            <div className="flex items-center gap-2 mb-0.5">
              <h1 className="text-xl font-black text-white leading-none">{fullName}</h1>
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(99,102,241,0.3)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.4)' }}
              >
                Usuario
              </span>
            </div>
            <p className="text-slate-400 text-sm">{currentUser.email}</p>
          </div>

          <button
            onClick={handleEditClick}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer shrink-0"
            style={editMode
              ? { background: 'rgba(99,102,241,0.2)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.3)' }
              : { background: 'rgba(255,255,255,0.08)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.12)' }
            }
          >
            {editMode ? (
              <>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Cancelar
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Editar perfil
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {STATS.map(s => (
          <div
            key={s.label}
            className="rounded-2xl px-5 py-4 text-center"
            style={{ background: '#fff', border: '1px solid #e8edf5', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}
          >
            <div className="text-2xl mb-1">{s.icon}</div>
            <p className="text-lg font-black text-slate-800">{s.value}</p>
            <p className="text-xs text-slate-500 font-medium mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── Info card ── */}
      <div
        className="rounded-2xl overflow-hidden mb-6"
        style={{ background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 2px 16px rgba(0,0,0,0.05)' }}
      >
        <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid #f1f5f9' }}>
          <h2 className="text-sm font-bold text-slate-800">Información personal</h2>
          {editMode && (
              <span className="text-xs text-indigo-500 font-semibold">Modo edición activo</span>
            )}
          </div>
  
          {editMode ? (
            /* Edit mode */
            <div className="p-5 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nombre</label>
                <input
                  type="text"
                  value={form.nombre}
                  onChange={e => setForm({...form, nombre: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl text-sm text-slate-800 outline-none transition-all duration-200 border"
                  style={{ background: '#f8fafc', borderColor: '#e2e8f0' }}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Apellido</label>
                <input
                  type="text"
                  value={form.apellido}
                  onChange={e => setForm({...form, apellido: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl text-sm text-slate-800 outline-none transition-all duration-200 border"
                  style={{ background: '#f8fafc', borderColor: '#e2e8f0' }}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email (solo lectura)</label>
                <input
                  type="email"
                  disabled
                  value={currentUser.email}
                  className="w-full px-4 py-2.5 rounded-xl text-sm text-slate-400 outline-none transition-all duration-200 border bg-gray-100"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Celular</label>
                <input
                  type="tel"
                  value={form.celular}
                  onChange={e => setForm({...form, celular: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl text-sm text-slate-800 outline-none transition-all duration-200 border"
                  style={{ background: '#f8fafc', borderColor: '#e2e8f0' }}
                />
              </div>
  
              <button
                onClick={handleSave}
                disabled={updateUsuarioMutation.isPending}
                className="w-full py-2.5 rounded-xl text-sm font-bold text-white mt-1 cursor-pointer"
                style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', boxShadow: '0 4px 16px rgba(99,102,241,0.4)' }}
              >
                Guardar cambios
              </button>
            </div>
          ) : (
            /* View mode */
            <div>
              <FieldRow
                label="Nombre completo"
                value={fullName}
                icon={
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                }
              />
              <FieldRow
                label="Email"
                value={currentUser.email}
                icon={
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                }
              />
              <FieldRow
                label="Celular"
                value={currentUser.celular || 'No especificado'}
                icon={
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                }
              />
              <div className="px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-slate-400">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </span>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Rol</span>
              </div>
              <span
                className="text-xs font-bold px-2.5 py-1 rounded-full"
                style={{ background: 'rgba(99,102,241,0.08)', color: '#6366f1', border: '1px solid rgba(99,102,241,0.18)' }}
              >
                Usuario
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ── Actions ── */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 2px 16px rgba(0,0,0,0.05)' }}
      >
        <div className="px-5 py-4" style={{ borderBottom: '1px solid #f1f5f9' }}>
          <h2 className="text-sm font-bold text-slate-800">Acciones rápidas</h2>
        </div>
        <div className="p-4 grid grid-cols-2 gap-3">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200"
            style={{ background: 'rgba(239,68,68,0.05)', color: '#dc2626', border: '1px solid rgba(239,68,68,0.15)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.1)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.05)' }}
          >
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Cerrar sesión
          </button>
          <Link
            to="/productos"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200"
            style={{ background: 'rgba(99,102,241,0.06)', color: '#6366f1', border: '1px solid rgba(99,102,241,0.15)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(99,102,241,0.12)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(99,102,241,0.06)' }}
          >
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4zM3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
            </svg>
            Ver catálogo
          </Link>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useMemo } from 'react';
import { useProductos, type Producto } from '../../hooks/useProductos';
import { ProductoModal } from '../../components/productos/ProductoModal';
import { IngredientesModal } from '../../components/productos/IngredientesModal';
import { Link } from 'react-router-dom';

const GRADIENTS = [
  'linear-gradient(135deg,#667eea,#764ba2)',
  'linear-gradient(135deg,#f093fb,#f5576c)',
  'linear-gradient(135deg,#4facfe,#00f2fe)',
  'linear-gradient(135deg,#43e97b,#38f9d7)',
  'linear-gradient(135deg,#fa709a,#fee140)',
  'linear-gradient(135deg,#a18cd1,#fbc2eb)',
  'linear-gradient(135deg,#fd7043,#ff8a65)',
  'linear-gradient(135deg,#26c6da,#00acc1)',
];

// ─── Skeleton ──────────────────────────────────────────────────────────────
const Skeleton = () => (
  <div className="rounded-2xl overflow-hidden" style={{ background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
    <div className="h-44 skeleton-shimmer" />
    <div className="p-5 space-y-3">
      <div className="h-5 skeleton-shimmer rounded-lg w-3/4" />
      <div className="h-3 skeleton-shimmer rounded w-full" />
      <div className="h-3 skeleton-shimmer rounded w-2/3" />
      <div className="flex gap-2 pt-1">
        <div className="h-5 skeleton-shimmer rounded-full w-14" />
        <div className="h-5 skeleton-shimmer rounded-full w-18" />
      </div>
      <div className="pt-3 flex justify-between items-center border-t border-slate-100">
        <div className="h-6 skeleton-shimmer rounded w-14" />
        <div className="h-8 skeleton-shimmer rounded-lg w-20" />
      </div>
    </div>
  </div>
);

// ─── Stat card ─────────────────────────────────────────────────────────────
const StatCard = ({
  label, value, icon, accent,
}: { label: string; value: number | string; icon: React.ReactNode; accent: string }) => (
  <div
    className="flex items-center gap-4 rounded-2xl px-5 py-4"
    style={{ background: '#fff', border: '1px solid #e8edf5', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}
  >
    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: accent }}>
      {icon}
    </div>
    <div>
      <p className="text-2xl font-black text-slate-800 leading-none">{value}</p>
      <p className="text-xs text-slate-500 font-medium mt-0.5">{label}</p>
    </div>
  </div>
);

// ─── Product card ──────────────────────────────────────────────────────────
const ProductCard = ({ producto, index }: { producto: Producto; index: number }) => {
  const gradient = GRADIENTS[producto.id % GRADIENTS.length];
  const [hovered, setHovered] = useState(false);
  const [btnHovered, setBtnHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="rounded-2xl overflow-hidden flex flex-col"
      style={{
        background: '#fff',
        border: '1px solid rgba(226,232,240,0.8)',
        boxShadow: hovered ? '0 24px 56px rgba(0,0,0,0.14)' : '0 2px 16px rgba(0,0,0,0.06)',
        transform: hovered ? 'translateY(-5px)' : 'translateY(0)',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease',
        animation: `fade-in-up 0.5s cubic-bezier(0.16,1,0.3,1) ${index * 55}ms both`,
      }}
    >
      {/* Image */}
      <div className="h-44 relative flex items-center justify-center overflow-hidden" style={{ background: gradient }}>
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle at 20% 20%, white 1px, transparent 1px), radial-gradient(circle at 80% 80%, white 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
        <svg
          className="w-12 h-12 text-white/60"
          style={{ transform: hovered ? 'scale(1.12)' : 'scale(1)', transition: 'transform 0.4s ease' }}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>

        {/* Stock badge */}
        <div
          className="absolute top-3 right-3 flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full"
          style={{ background: 'rgba(0,0,0,0.28)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff' }}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: producto.disponible ? '#4ade80' : '#f87171' }} />
          {producto.disponible ? 'Stock' : 'Agotado'}
        </div>

        {/* Price badge */}
        <div
          className="absolute bottom-3 left-3 text-sm font-black"
          style={{ background: 'rgba(0,0,0,0.28)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '3px 12px', borderRadius: '999px' }}
        >
          ${producto.precio_base.toFixed(2)}
        </div>

        {/* Prep time */}
        {producto.tiempo_prep_min && (
          <div
            className="absolute bottom-3 right-3 flex items-center gap-1 text-[11px] font-semibold"
            style={{ background: 'rgba(0,0,0,0.28)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '3px 10px', borderRadius: '999px' }}
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {producto.tiempo_prep_min}m
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-5 flex-1 flex flex-col gap-2.5">
        <h3 className="text-sm font-bold text-slate-800 leading-snug line-clamp-1" style={{ color: hovered ? '#6366f1' : '#1e293b', transition: 'color 0.2s' }}>
          {producto.nombre}
        </h3>

        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed flex-1">
          {producto.descripcion || 'Sin descripción disponible.'}
        </p>

        {/* Ingredientes */}
        {producto.ingredientes?.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {producto.ingredientes.slice(0, 3).map(ing => (
              <span key={ing.id} className="text-[10px] font-semibold px-2 py-0.5 rounded-md"
                style={{ background: 'rgba(99,102,241,0.08)', color: '#6366f1', border: '1px solid rgba(99,102,241,0.15)' }}>
                {ing.nombre}
              </span>
            ))}
            {producto.ingredientes.length > 3 && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md"
                style={{ background: '#f1f5f9', color: '#64748b', border: '1px solid #e2e8f0' }}>
                +{producto.ingredientes.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Categorías */}
        {producto.categorias?.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {producto.categorias.slice(0, 2).map(cat => (
              <span key={cat.id} className="text-[10px] font-semibold px-2 py-0.5 rounded-md"
                style={{ background: 'rgba(16,185,129,0.08)', color: '#059669', border: '1px solid rgba(16,185,129,0.15)' }}>
                {cat.nombre}
              </span>
            ))}
            {producto.categorias.length > 2 && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md"
                style={{ background: '#f1f5f9', color: '#64748b', border: '1px solid #e2e8f0' }}>
                +{producto.categorias.length - 2}
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 mt-auto">
          <Link
            to={`/productos/${producto.id}`}
            onMouseEnter={() => setBtnHovered(true)}
            onMouseLeave={() => setBtnHovered(false)}
            className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl text-xs font-bold transition-all duration-200"
            style={btnHovered
              ? { background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', border: '1px solid transparent', boxShadow: '0 4px 14px rgba(99,102,241,0.4)' }
              : { background: 'rgba(99,102,241,0.06)', color: '#6366f1', border: '1px solid rgba(99,102,241,0.18)' }}
          >
            Ver detalles
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

// ─── Page ──────────────────────────────────────────────────────────────────
export const ProductosPage: React.FC = () => {
  const { data: productos, isLoading, error } = useProductos();
  const [isProductoModalOpen, setProductoModalOpen] = useState(false);
  const [isIngredientesModalOpen, setIngredientesModalOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!productos) return [];
    const q = search.toLowerCase().trim();
    if (!q) return productos;
    return productos.filter(p =>
      p.nombre.toLowerCase().includes(q) ||
      p.descripcion?.toLowerCase().includes(q) ||
      p.categorias?.some(c => c.nombre.toLowerCase().includes(q)) ||
      p.ingredientes?.some(i => i.nombre.toLowerCase().includes(q))
    );
  }, [productos, search]);

  const stats = useMemo(() => ({
    total: productos?.length ?? 0,
    disponibles: productos?.filter(p => p.disponible).length ?? 0,
    agotados: productos?.filter(p => !p.disponible).length ?? 0,
  }), [productos]);

  return (
    <div style={{ animation: 'fade-in-up 0.45s cubic-bezier(0.16,1,0.3,1) both' }}>

      {/* ── Page header ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wider uppercase"
              style={{ background: 'rgba(99,102,241,0.1)', color: '#6366f1', border: '1px solid rgba(99,102,241,0.2)' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
              Gestión
            </span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none">
            Catálogo de{' '}
            <span style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Productos
            </span>
          </h1>
          <p className="text-slate-500 text-sm mt-1.5">
            {isLoading ? 'Cargando inventario…' : `${stats.total} productos en el sistema`}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button onClick={() => setIngredientesModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold cursor-pointer transition-all duration-200"
            style={{ background: '#fff', color: '#475569', border: '1px solid #e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 20px rgba(0,0,0,0.1)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)' }}
          >
            <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            Ingredientes
          </button>

          <button onClick={() => setProductoModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white cursor-pointer transition-all duration-200"
            style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', boxShadow: '0 4px 16px rgba(99,102,241,0.4)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 28px rgba(99,102,241,0.55)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px rgba(99,102,241,0.4)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)' }}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Nuevo Producto
          </button>
        </div>
      </div>

      {/* ── Stats ── */}
      {!isLoading && !error && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <StatCard label="Total registrados" value={stats.total}
            accent="rgba(99,102,241,0.1)"
            icon={<svg className="w-5 h-5" style={{ color: '#6366f1' }} fill="currentColor" viewBox="0 0 20 20"><path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" /><path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" clipRule="evenodd" /></svg>}
          />
          <StatCard label="Disponibles" value={stats.disponibles}
            accent="rgba(16,185,129,0.1)"
            icon={<svg className="w-5 h-5" style={{ color: '#10b981' }} fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>}
          />
          <StatCard label="Agotados" value={stats.agotados}
            accent="rgba(239,68,68,0.08)"
            icon={<svg className="w-5 h-5" style={{ color: '#ef4444' }} fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>}
          />
        </div>
      )}

      {/* ── Search ── */}
      {!isLoading && !error && stats.total > 0 && (
        <div className="relative mb-6">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Buscar por nombre, categoría o ingrediente…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl text-sm text-slate-700 outline-none transition-all duration-200"
            style={{ background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}
            onFocus={e => { (e.target as HTMLInputElement).style.border = '1px solid rgba(99,102,241,0.5)'; (e.target as HTMLInputElement).style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)' }}
            onBlur={e => { (e.target as HTMLInputElement).style.border = '1px solid #e2e8f0'; (e.target as HTMLInputElement).style.boxShadow = '0 1px 4px rgba(0,0,0,0.05)' }}
          />
          {search && (
            <button onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      )}

      {/* ── Content ── */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} />)}
        </div>
      ) : error ? (
        <div className="rounded-2xl p-8 flex items-start gap-5"
          style={{ background: 'linear-gradient(135deg,#fff1f2,#ffe4e6)', border: '1px solid #fca5a5' }}>
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center shrink-0">
            <svg className="h-6 w-6 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-red-900">Error de conexión</h3>
            <p className="text-red-700 text-sm mt-1">No se pudo cargar el catálogo. Verificá que el backend esté corriendo.</p>
          </div>
        </div>
      ) : filtered.length === 0 && search ? (
        <div className="text-center py-20 rounded-2xl" style={{ background: '#fff', border: '1px solid #e2e8f0' }}>
          <svg className="mx-auto h-12 w-12 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <p className="mt-3 text-slate-700 font-semibold">Sin resultados para "<span className="text-indigo-600">{search}</span>"</p>
          <button onClick={() => setSearch('')} className="mt-4 text-sm text-indigo-600 hover:text-indigo-800 font-medium cursor-pointer">
            Limpiar búsqueda
          </button>
        </div>
      ) : stats.total === 0 ? (
        <div className="text-center py-24 rounded-3xl"
          style={{ background: 'linear-gradient(135deg,#f8faff,#f0f4ff)', border: '2px dashed #c7d2fe' }}>
          <div className="w-20 h-20 rounded-2xl mx-auto mb-5 flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg,#e0e7ff,#ede9fe)' }}>
            <svg className="w-10 h-10 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-slate-800">No hay productos todavía</h3>
          <p className="text-slate-500 text-sm mt-1 mb-6">Comenzá creando tu primer producto en el catálogo.</p>
          <button onClick={() => setProductoModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white cursor-pointer"
            style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', boxShadow: '0 4px 16px rgba(99,102,241,0.4)' }}>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Crear primer producto
          </button>
        </div>
      ) : (
        <>
          {search && (
            <p className="text-xs text-slate-500 mb-4 font-medium">
              {filtered.length} resultado{filtered.length !== 1 ? 's' : ''} para "<span className="text-indigo-600 font-semibold">{search}</span>"
            </p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((p, i) => <ProductCard key={p.id} producto={p} index={i} />)}
          </div>
        </>
      )}

      <ProductoModal isOpen={isProductoModalOpen} onClose={() => setProductoModalOpen(false)} />
      <IngredientesModal isOpen={isIngredientesModalOpen} onClose={() => setIngredientesModalOpen(false)} />
    </div>
  );
};

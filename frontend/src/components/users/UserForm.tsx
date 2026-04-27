import { useState } from 'react';
import { type Usuario, type NuevoUsuario, useRoles } from '../../hooks/useUsuarios';

interface UserFormProps {
  user?: Usuario;
  onSubmit: (data: NuevoUsuario) => void;
  onCancel: () => void;
  isLoading: boolean;
  // Para gestión de roles en modo edición
  onAddRole?: (rolCodigo: string) => void;
  onRemoveRole?: (rolCodigo: string) => void;
  isRoleLoading?: boolean;
}

export default function UserForm({
  user,
  onSubmit,
  onCancel,
  isLoading,
  onAddRole,
  onRemoveRole,
  isRoleLoading,
}: UserFormProps) {
  const { data: rolesDisponibles = [] } = useRoles();

  const [formData, setFormData] = useState({
    nombre: user?.nombre || '',
    apellido: user?.apellido || '',
    email: user?.email || '',
    celular: user?.celular || '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const userRolCodigos = user?.roles.map(r => r.codigo) ?? [];
  const rolesNoAsignados = rolesDisponibles.filter(r => !userRolCodigos.includes(r.codigo));

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nombre</label>
          <input
            required
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Apellido</label>
          <input
            required
            type="text"
            name="apellido"
            value={formData.apellido}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          required
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          disabled={!!user}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border disabled:bg-gray-100 disabled:text-gray-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Celular</label>
        <input
          type="text"
          name="celular"
          value={formData.celular}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
        />
      </div>

      {!user && (
        <div>
          <label className="block text-sm font-medium text-gray-700">Contraseña</label>
          <input
            required
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
          />
        </div>
      )}

      {/* Gestión de roles — solo en modo edición */}
      {user && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Roles</label>

          {/* Roles actuales */}
          <div className="flex flex-wrap gap-2 mb-3 min-h-[32px]">
            {user.roles.length === 0 && (
              <span className="text-sm text-gray-400 italic">Sin roles asignados</span>
            )}
            {user.roles.map(rol => (
              <span
                key={rol.codigo}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800"
              >
                {rol.descripcion ?? rol.codigo}
                {onRemoveRole && (
                  <button
                    type="button"
                    disabled={isRoleLoading}
                    onClick={() => onRemoveRole(rol.codigo)}
                    className="ml-0.5 text-indigo-500 hover:text-red-600 disabled:opacity-50 transition-colors"
                    title="Quitar rol"
                  >
                    ×
                  </button>
                )}
              </span>
            ))}
          </div>

          {/* Agregar rol */}
          {onAddRole && rolesNoAsignados.length > 0 && (
            <div className="flex gap-2 items-center">
              <select
                id="rol-select"
                defaultValue=""
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                onChange={e => {
                  if (e.target.value) {
                    onAddRole(e.target.value);
                    e.target.value = '';
                  }
                }}
                disabled={isRoleLoading}
              >
                <option value="" disabled>Agregar rol…</option>
                {rolesNoAsignados.map(r => (
                  <option key={r.codigo} value={r.codigo}>
                    {r.descripcion ?? r.codigo}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}

      <div className="flex justify-end gap-2 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none disabled:opacity-50"
        >
          {isLoading ? 'Guardando…' : user ? 'Actualizar' : 'Crear Usuario'}
        </button>
      </div>
    </form>
  );
}

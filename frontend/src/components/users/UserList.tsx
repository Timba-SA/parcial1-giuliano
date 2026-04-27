import { useUsuarios, useDeleteUsuario, type Usuario } from '../../hooks/useUsuarios';

interface UserListProps {
  onEdit: (user: Usuario) => void;
}

export default function UserList({ onEdit }: UserListProps) {
  const { data: usuarios, isLoading, isError } = useUsuarios();
  const deleteMutation = useDeleteUsuario();

  if (isLoading) return <div className="p-4 text-gray-500">Cargando usuarios...</div>;
  if (isError) return <div className="p-4 text-red-500">Error al cargar usuarios.</div>;

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow ring-1 ring-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roles</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 text-sm">
          {usuarios?.map((user: Usuario) => (
            <tr key={user.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap text-gray-500">{user.id}</td>
              <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                {user.nombre} {user.apellido}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-500">{user.email}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex flex-wrap gap-1">
                  {user.roles.length === 0 ? (
                    <span className="text-xs text-gray-400 italic">Sin rol</span>
                  ) : (
                    user.roles.map(rol => (
                      <span
                        key={rol.codigo}
                        className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                          rol.codigo === 'admin'
                            ? 'bg-purple-100 text-purple-800'
                            : rol.codigo === 'empleado'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {rol.descripcion ?? rol.codigo}
                      </span>
                    ))
                  )}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}
                >
                  {user.is_active ? 'Activo' : 'Inactivo'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <button
                  className="text-blue-600 hover:text-blue-900 transition-colors"
                  onClick={() => onEdit(user)}
                >
                  Editar
                </button>
                <button
                  className="text-red-600 hover:text-red-900 transition-colors"
                  onClick={() => {
                    if (confirm('¿Seguro que deseas desactivar este usuario?')) {
                      deleteMutation.mutate(user.id);
                    }
                  }}
                >
                  Borrar
                </button>
              </td>
            </tr>
          ))}
          {usuarios?.length === 0 && (
            <tr>
              <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                No hay usuarios registrados
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

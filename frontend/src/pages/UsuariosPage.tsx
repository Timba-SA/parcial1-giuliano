import UserList from '../components/users/UserList';
import UserForm from '../components/users/UserForm';
import {
  useCrearUsuario,
  useUpdateUsuario,
  useAsignarRol,
  useQuitarRol,
  type NuevoUsuario,
  type Usuario,
} from '../hooks/useUsuarios';
import { useState } from 'react';

type ModalMode = 'create' | 'edit';

export default function UsuariosPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState<ModalMode>('create');
  const [selectedUser, setSelectedUser] = useState<Usuario | undefined>();

  const createMutation = useCrearUsuario();
  const updateMutation = useUpdateUsuario();
  const asignarRol = useAsignarRol();
  const quitarRol = useQuitarRol();

  const isRoleLoading = asignarRol.isPending || quitarRol.isPending;

  const openCreate = () => {
    setSelectedUser(undefined);
    setMode('create');
    setModalOpen(true);
  };

  const openEdit = (user: Usuario) => {
    setSelectedUser(user);
    setMode('edit');
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
    setSelectedUser(undefined);
  };

  const handleSubmit = (data: NuevoUsuario) => {
    if (mode === 'create') {
      createMutation.mutate(data, { onSuccess: handleClose });
    } else if (selectedUser) {
      updateMutation.mutate(
        { id: selectedUser.id, data: { nombre: data.nombre, apellido: data.apellido, celular: data.celular } },
        { onSuccess: handleClose }
      );
    }
  };

  const handleAddRole = (rolCodigo: string) => {
    if (!selectedUser) return;
    asignarRol.mutate(
      { userId: selectedUser.id, rolCodigo },
      {
        onSuccess: (updatedUser) => {
          // Actualiza el usuario seleccionado para reflejar el nuevo rol sin cerrar el modal
          setSelectedUser(updatedUser);
        },
      }
    );
  };

  const handleRemoveRole = (rolCodigo: string) => {
    if (!selectedUser) return;
    quitarRol.mutate(
      { userId: selectedUser.id, rolCodigo },
      {
        onSuccess: (updatedUser) => {
          setSelectedUser(updatedUser);
        },
      }
    );
  };

  const isSubmitLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Usuarios</h1>
          <p className="mt-1 text-sm text-gray-500">Administra los usuarios del sistema, sus roles y estados.</p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Nuevo Usuario
        </button>
      </div>

      <UserList onEdit={openEdit} />

      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-gray-500/75 transition-opacity"
            aria-hidden="true"
            onClick={handleClose}
          />

          {/* Panel */}
          <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-lg bg-white shadow-xl">
            <div className="px-6 pt-6 pb-2">
              <h3 className="text-lg font-medium leading-6 text-gray-900" id="modal-title">
                {mode === 'create' ? 'Crear Nuevo Usuario' : `Editar Usuario — ${selectedUser?.nombre} ${selectedUser?.apellido}`}
              </h3>
              <div className="mt-4">
                <UserForm
                  user={selectedUser}
                  onSubmit={handleSubmit}
                  onCancel={handleClose}
                  isLoading={isSubmitLoading}
                  onAddRole={mode === 'edit' ? handleAddRole : undefined}
                  onRemoveRole={mode === 'edit' ? handleRemoveRole : undefined}
                  isRoleLoading={isRoleLoading}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

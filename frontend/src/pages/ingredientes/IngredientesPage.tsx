import React, { useState } from 'react';
import { IngredienteModal } from '../../components/ingredientes/IngredienteModal';
import { useIngredientes, useDeleteIngrediente } from '../../hooks/useIngredientes';
import { type Ingrediente } from '../../hooks/useProductos';

export const IngredientesPage: React.FC = () => {
  const { data: ingredientes, isLoading, error } = useIngredientes();
  const deleteMutation = useDeleteIngrediente();

  const [isModalOpen, setModalOpen] = useState(false);
  const [ingredienteAEditar, setIngredienteAEditar] = useState<Ingrediente | null>(null);

  const handleCreate = () => {
    setIngredienteAEditar(null);
    setModalOpen(true);
  };

  const handleEdit = (ingrediente: Ingrediente) => {
    setIngredienteAEditar(ingrediente);
    setModalOpen(true);
  };

  const handleDelete = (ingrediente: Ingrediente) => {
    if (!window.confirm(`¿Seguro que querés eliminar el ingrediente "${ingrediente.nombre}"?`)) {
      return;
    }
    deleteMutation.mutate(ingrediente.id);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 border-b pb-4">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Catálogo de Ingredientes</h1>
        <button
          onClick={handleCreate}
          className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <svg className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Nuevo Ingrediente
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
          <p className="text-sm text-red-700">Error al cargar ingredientes. Verificá que el backend esté levantado.</p>
        </div>
      ) : ingredientes?.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <h3 className="mt-2 text-sm font-medium text-gray-900">No hay ingredientes</h3>
          <p className="mt-1 text-sm text-gray-500">Creá el primer ingrediente para empezar.</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white shadow rounded-xl border border-gray-100">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unidad</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {ingredientes?.map((ingrediente) => (
                <tr key={ingrediente.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{ingrediente.nombre}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{ingrediente.descripcion || '—'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{ingrediente.stock}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{ingrediente.unidad_medida}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm space-x-3">
                    <button
                      onClick={() => handleEdit(ingrediente)}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(ingrediente)}
                      disabled={deleteMutation.isPending}
                      className="text-red-600 hover:text-red-800 font-medium disabled:opacity-50"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <IngredienteModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        ingredienteAEditar={ingredienteAEditar}
      />
    </div>
  );
};

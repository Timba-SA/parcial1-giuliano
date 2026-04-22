import React, { useState } from 'react';
import { CategoriaModal } from '../../components/categorias/CategoriaModal';
import { type Categoria, useCategorias, useDeleteCategoria } from '../../hooks/useCategorias';

export const CategoriasPage: React.FC = () => {
  const { data: categorias, isLoading, error } = useCategorias();
  const deleteMutation = useDeleteCategoria();

  const [isModalOpen, setModalOpen] = useState(false);
  const [categoriaAEditar, setCategoriaAEditar] = useState<Categoria | null>(null);

  const handleCreate = () => {
    setCategoriaAEditar(null);
    setModalOpen(true);
  };

  const handleEdit = (categoria: Categoria) => {
    setCategoriaAEditar(categoria);
    setModalOpen(true);
  };

  const handleDelete = (categoria: Categoria) => {
    if (!window.confirm(`¿Seguro que querés eliminar la categoría "${categoria.nombre}"?`)) {
      return;
    }
    deleteMutation.mutate(categoria.id);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 border-b pb-4">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Catálogo de Categorías</h1>
        <button
          onClick={handleCreate}
          className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <svg className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Nueva Categoría
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
          <p className="text-sm text-red-700">Error al cargar las categorías. Verificá que el backend esté levantado.</p>
        </div>
      ) : categorias?.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <h3 className="mt-2 text-sm font-medium text-gray-900">No hay categorías</h3>
          <p className="mt-1 text-sm text-gray-500">Creá la primera categoría para empezar.</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white shadow rounded-xl border border-gray-100">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orden</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categorias?.map((categoria) => (
                <tr key={categoria.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{categoria.nombre}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{categoria.descripcion || '—'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{categoria.orden_display}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {categoria.activo ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">Activa</span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">Inactiva</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm space-x-3">
                    <button
                      onClick={() => handleEdit(categoria)}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(categoria)}
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

      <CategoriaModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        categoriaAEditar={categoriaAEditar}
      />
    </div>
  );
};

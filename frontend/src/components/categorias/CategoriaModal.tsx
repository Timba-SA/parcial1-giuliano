import React, { useEffect, useState } from 'react';
import { type Categoria, type CategoriaCreate, useCreateCategoria, useUpdateCategoria } from '../../hooks/useCategorias';

interface CategoriaModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoriaAEditar?: Categoria | null;
}

export const CategoriaModal: React.FC<CategoriaModalProps> = ({ isOpen, onClose, categoriaAEditar }) => {
  const createMutation = useCreateCategoria();
  const updateMutation = useUpdateCategoria();

  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [ordenDisplay, setOrdenDisplay] = useState(0);
  const [activo, setActivo] = useState(true);

  useEffect(() => {
    if (categoriaAEditar) {
      setNombre(categoriaAEditar.nombre);
      setDescripcion(categoriaAEditar.descripcion || '');
      setOrdenDisplay(categoriaAEditar.orden_display);
      setActivo(categoriaAEditar.activo);
    } else {
      setNombre('');
      setDescripcion('');
      setOrdenDisplay(0);
      setActivo(true);
    }
  }, [categoriaAEditar, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: CategoriaCreate = {
      nombre,
      descripcion,
      orden_display: ordenDisplay,
      activo,
    };

    if (categoriaAEditar) {
      updateMutation.mutate(
        { id: categoriaAEditar.id, categoria: payload },
        { onSuccess: () => onClose() }
      );
      return;
    }

    createMutation.mutate(payload, {
      onSuccess: () => onClose(),
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-xl overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">{categoriaAEditar ? 'Editar Categoría' : 'Nueva Categoría'}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre</label>
            <input
              type="text"
              required
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Descripción</label>
            <textarea
              value={descripcion}
              onChange={e => setDescripcion(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Orden de visualización</label>
            <input
              type="number"
              min="0"
              value={ordenDisplay}
              onChange={e => setOrdenDisplay(Number(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex items-center">
            <input
              id="activo"
              type="checkbox"
              checked={activo}
              onChange={e => setActivo(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="activo" className="ml-2 block text-sm text-gray-900">Categoría activa</label>
          </div>

          <div className="pt-4 flex justify-end">
            <button type="button" onClick={onClose} className="mr-3 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              Cancelar
            </button>
            <button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50">
              {createMutation.isPending || updateMutation.isPending ? 'Guardando...' : (categoriaAEditar ? 'Guardar Cambios' : 'Crear Categoría')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import {
  IngredienteCreate,
  IngredienteUpdate,
  useCreateIngrediente,
  useUpdateIngrediente,
} from '../../hooks/useIngredientes';
import { Ingrediente } from '../../hooks/useProductos';

interface IngredienteModalProps {
  isOpen: boolean;
  onClose: () => void;
  ingredienteAEditar?: Ingrediente | null;
}

export const IngredienteModal: React.FC<IngredienteModalProps> = ({
  isOpen,
  onClose,
  ingredienteAEditar,
}) => {
  const createMutation = useCreateIngrediente();
  const updateMutation = useUpdateIngrediente();

  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [stock, setStock] = useState(0);
  const [unidadMedida, setUnidadMedida] = useState('g');

  useEffect(() => {
    if (ingredienteAEditar) {
      setNombre(ingredienteAEditar.nombre);
      setDescripcion(ingredienteAEditar.descripcion || '');
      setStock(ingredienteAEditar.stock);
      setUnidadMedida(ingredienteAEditar.unidad_medida);
      return;
    }

    setNombre('');
    setDescripcion('');
    setStock(0);
    setUnidadMedida('g');
  }, [ingredienteAEditar, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (ingredienteAEditar) {
      const payload: IngredienteUpdate = {
        nombre,
        descripcion,
        stock,
        unidad_medida: unidadMedida,
      };

      updateMutation.mutate(
        { id: ingredienteAEditar.id, ingrediente: payload },
        {
          onSuccess: () => onClose(),
        }
      );
      return;
    }

    const payload: IngredienteCreate = {
      nombre,
      descripcion,
      stock,
      unidad_medida: unidadMedida,
    };

    createMutation.mutate(payload, {
      onSuccess: () => onClose(),
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">
            {ingredienteAEditar ? 'Editar Ingrediente' : 'Nuevo Ingrediente'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre</label>
            <input
              type="text"
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Descripción</label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Stock</label>
              <input
                type="number"
                min="0"
                required
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Unidad</label>
              <select
                value={unidadMedida}
                onChange={(e) => setUnidadMedida(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="g">Gramos (g)</option>
                <option value="kg">Kilogramos (kg)</option>
                <option value="ml">Mililitros (ml)</option>
                <option value="l">Litros (l)</option>
                <option value="u">Unidades (u)</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-3 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              {createMutation.isPending || updateMutation.isPending
                ? 'Guardando...'
                : ingredienteAEditar
                ? 'Guardar Cambios'
                : 'Crear Ingrediente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

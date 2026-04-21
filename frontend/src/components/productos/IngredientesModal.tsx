import React, { useState } from 'react';
import { useIngredientes, useCreateIngrediente } from '../../hooks/useIngredientes';
import { Link } from 'react-router-dom';

export const IngredientesModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { data: ingredientes, isLoading } = useIngredientes();
  const createMutation = useCreateIngrediente();

  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [stock, setStock] = useState(0);
  const [unidadMedida, setUnidadMedida] = useState('g');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({ nombre, descripcion, stock, unidad_medida: unidadMedida }, {
      onSuccess: () => {
        setNombre('');
        setDescripcion('');
        setStock(0);
        setUnidadMedida('g');
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl flex flex-col md:flex-row overflow-hidden max-h-[90vh]">
        
        {/* Lista de Ingredientes Existentes */}
        <div className="w-full md:w-1/2 p-6 bg-gray-50 overflow-y-auto border-b md:border-b-0 md:border-r border-gray-200">
          <h2 className="text-xl font-bold mb-4">Ingredientes Existentes</h2>
          {isLoading ? <p>Cargando...</p> : (
            <ul className="space-y-3">
              {ingredientes?.map(ing => (
                <li key={ing.id} className="bg-white p-3 rounded shadow-sm border border-gray-100 flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-gray-800">{ing.nombre}</p>
                    <p className="text-sm text-gray-500">{ing.stock} {ing.unidad_medida}</p>
                  </div>
                </li>
              ))}
              {ingredientes?.length === 0 && <p className="text-gray-500">No hay ingredientes registrados.</p>}
            </ul>
          )}
        </div>

        {/* Formulario Crear Ingrediente */}
        <div className="w-full md:w-1/2 p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Nuevo Ingrediente</h2>
            <div className="flex items-center gap-3">
              <Link to="/ingredientes" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                Ver gestión completa
              </Link>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nombre</label>
              <input type="text" required value={nombre} onChange={e => setNombre(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Descripción</label>
              <textarea value={descripcion} onChange={e => setDescripcion(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500" rows={2} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Stock Inicial</label>
                <input type="number" min="0" required value={stock} onChange={e => setStock(Number(e.target.value))} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Unidad</label>
                <select value={unidadMedida} onChange={e => setUnidadMedida(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500">
                  <option value="g">Gramos (g)</option>
                  <option value="kg">Kilogramos (kg)</option>
                  <option value="ml">Mililitros (ml)</option>
                  <option value="l">Litros (l)</option>
                  <option value="u">Unidades (u)</option>
                </select>
              </div>
            </div>
            
            <div className="pt-4 flex justify-end">
              <button type="button" onClick={onClose} className="mr-3 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none">
                Cancelar
              </button>
              <button type="submit" disabled={createMutation.isPending} className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none disabled:opacity-50">
                {createMutation.isPending ? 'Guardando...' : 'Crear Ingrediente'}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};

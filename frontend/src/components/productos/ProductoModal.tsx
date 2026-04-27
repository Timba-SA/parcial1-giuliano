import React, { useState, useEffect } from 'react';
import { useCreateProducto, useUpdateProducto, type ProductoCreate, type Producto } from '../../hooks/useProductos';
import { useIngredientes } from '../../hooks/useIngredientes';
import { useCategorias } from '../../hooks/useCategorias';

interface ProductoModalProps {
  isOpen: boolean;
  onClose: () => void;
  productoAEditar?: Producto | null;
}

export const ProductoModal: React.FC<ProductoModalProps> = ({ isOpen, onClose, productoAEditar }) => {
  const { data: ingredientesList } = useIngredientes();
  const { data: categoriasList } = useCategorias();
  const createMutation = useCreateProducto();
  const updateMutation = useUpdateProducto();

  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precioBase, setPrecioBase] = useState(0);
  const [tiempoPrepMin, setTiempoPrepMin] = useState<number | ''>('');
  const [disponible, setDisponible] = useState(true);
  const [ingredientesSeleccionados, setIngredientesSeleccionados] = useState<number[]>([]);
  const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState<number[]>([]);

  useEffect(() => {
    if (productoAEditar) {
      setNombre(productoAEditar.nombre);
      setDescripcion(productoAEditar.descripcion || '');
      setPrecioBase(productoAEditar.precio_base);
      setTiempoPrepMin(productoAEditar.tiempo_prep_min ?? '');
      setDisponible(productoAEditar.disponible);
      setIngredientesSeleccionados(productoAEditar.ingredientes.map(ing => ing.id));
      setCategoriasSeleccionadas(productoAEditar.categorias.map(cat => cat.id));
    } else {
      setNombre('');
      setDescripcion('');
      setPrecioBase(0);
      setTiempoPrepMin('');
      setDisponible(true);
      setIngredientesSeleccionados([]);
      setCategoriasSeleccionadas([]);
    }
  }, [productoAEditar, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: ProductoCreate = {
      nombre,
      descripcion,
      precio_base: precioBase,
      tiempo_prep_min: tiempoPrepMin || undefined,
      disponible,
      categorias: categoriasSeleccionadas.map(id => ({ categoria_id: id, es_principal: false })),
      ingredientes: ingredientesSeleccionados.map(id => ({ ingrediente_id: id, es_removible: true, es_opcional: false }))
    };

    if (productoAEditar) {
      updateMutation.mutate({ id: productoAEditar.id, producto: payload }, {
        onSuccess: () => onClose()
      });
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => onClose()
      });
    }
  };

  const handleIngredienteToggle = (id: number) => {
    setIngredientesSeleccionados(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleCategoriaToggle = (id: number) => {
    setCategoriasSeleccionadas(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  return (
    <div className="fixed inset-0 bg-gray-500/75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">{productoAEditar ? 'Editar Producto' : 'Nuevo Producto'}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Información Básica</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Nombre del Producto</label>
                <input type="text" required value={nombre} onChange={e => setNombre(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500" placeholder="Ej. Hamburguesa Doble" />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Descripción</label>
                <textarea value={descripcion} onChange={e => setDescripcion(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500" rows={3} placeholder="Breve descripción del producto..." />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Precio Base ($)</label>
                <input type="number" min="0" step="0.01" required value={precioBase} onChange={e => setPrecioBase(Number(e.target.value))} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Tiempo de Preparación (min)</label>
                <input type="number" min="1" value={tiempoPrepMin} onChange={e => setTiempoPrepMin(e.target.value === '' ? '' : Number(e.target.value))} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500" placeholder="Ej. 15" />
              </div>

              <div className="md:col-span-2 flex items-center mt-2">
                <input id="disponible" type="checkbox" checked={disponible} onChange={e => setDisponible(e.target.checked)} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                <label htmlFor="disponible" className="ml-2 block text-sm text-gray-900">
                  Producto disponible para la venta
                </label>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Ingredientes del Producto</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-48 overflow-y-auto p-2 border rounded-md bg-gray-50">
              {ingredientesList?.map(ing => (
                <label key={ing.id} className="flex items-center p-2 border rounded bg-white hover:bg-gray-50 cursor-pointer shadow-sm">
                  <input
                    type="checkbox"
                    checked={ingredientesSeleccionados.includes(ing.id)}
                    onChange={() => handleIngredienteToggle(ing.id)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-2"
                  />
                  <span className="text-sm text-gray-800">{ing.nombre}</span>
                </label>
              ))}
              {(!ingredientesList || ingredientesList.length === 0) && (
                <div className="col-span-full text-sm text-gray-500 italic p-2">
                  No hay ingredientes registrados en el sistema.
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Categorías del Producto</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-48 overflow-y-auto p-2 border rounded-md bg-gray-50">
              {categoriasList?.map(cat => (
                <label key={cat.id} className="flex items-center p-2 border rounded bg-white hover:bg-gray-50 cursor-pointer shadow-sm">
                  <input
                    type="checkbox"
                    checked={categoriasSeleccionadas.includes(cat.id)}
                    onChange={() => handleCategoriaToggle(cat.id)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-2"
                  />
                  <span className="text-sm text-gray-800">{cat.nombre}</span>
                </label>
              ))}
              {(!categoriasList || categoriasList.length === 0) && (
                <div className="col-span-full text-sm text-gray-500 italic p-2">
                  No hay categorías registradas en el sistema.
                </div>
              )}
            </div>
          </div>
          
        </form>

        <div className="p-6 border-t bg-gray-50 flex justify-end">
          <button type="button" onClick={onClose} className="mr-3 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 focus:outline-none">
            Cancelar
          </button>
          <button type="submit" onClick={handleSubmit} disabled={createMutation.isPending || updateMutation.isPending} className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none disabled:opacity-50">
            {createMutation.isPending || updateMutation.isPending ? 'Guardando...' : (productoAEditar ? 'Guardar Cambios' : 'Guardar Producto')}
          </button>
        </div>

      </div>
    </div>
  );
};

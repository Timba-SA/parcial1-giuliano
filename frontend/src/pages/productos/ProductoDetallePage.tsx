import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProducto, useDeleteProducto } from '../../hooks/useProductos';
import { ProductoModal } from '../../components/productos/ProductoModal';

export const ProductoDetallePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: producto, isLoading, error } = useProducto(Number(id));
  const deleteMutation = useDeleteProducto();
  const [isEditModalOpen, setEditModalOpen] = useState(false);

  if (isLoading) return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  if (error || !producto) return <div className="text-center mt-10 text-red-600">Error al cargar el producto.</div>;

  const handleDelete = () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      deleteMutation.mutate(producto.id, {
        onSuccess: () => navigate('/productos')
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link to="/productos" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        Volver al Catálogo
      </Link>

      <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
        <div className="md:flex">
          {/* Imagen (Placeholder) */}
          <div className="md:w-1/2 bg-gray-200 h-64 md:h-auto flex items-center justify-center">
            <svg className="h-32 w-32 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          
          {/* Detalles */}
          <div className="p-8 md:w-1/2 flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-3xl font-bold text-gray-900">{producto.nombre}</h1>
              {!producto.disponible && (
                <span className="bg-red-100 text-red-800 text-xs px-3 py-1 rounded-full font-bold uppercase">Agotado</span>
              )}
            </div>

            <p className="text-gray-600 mb-6 text-lg">{producto.descripcion || 'Sin descripción disponible.'}</p>

            <div className="mb-6 grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <span className="block text-sm text-blue-600 font-medium">Precio Base</span>
                <span className="block text-3xl font-black text-gray-900">${producto.precio_base.toFixed(2)}</span>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <span className="block text-sm text-orange-600 font-medium">Tiempo Prep.</span>
                <span className="block text-xl font-bold text-gray-900">{producto.tiempo_prep_min ? `${producto.tiempo_prep_min} min` : 'N/A'}</span>
              </div>
            </div>

            <div className="mb-6 flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 border-b pb-2">Ingredientes Incluidos</h3>
              {producto.ingredientes && producto.ingredientes.length > 0 ? (
                <ul className="space-y-2">
                  {producto.ingredientes.map(ing => (
                    <li key={ing.id} className="flex justify-between items-center text-gray-700 bg-gray-50 p-2 rounded">
                      <span className="font-medium">{ing.nombre}</span>
                      {/* <span className="text-sm text-gray-500">{ing.stock} {ing.unidad_medida}</span> */}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 italic">No contiene ingredientes específicos.</p>
              )}
            </div>

            <div className="mb-6 flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 border-b pb-2">Categorías</h3>
              {producto.categorias && producto.categorias.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {producto.categorias.map((cat) => (
                    <span key={cat.id} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800">
                      {cat.nombre}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No tiene categorías asignadas.</p>
              )}
            </div>

            <div className="mt-auto pt-6 border-t flex space-x-3">
              <button 
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
                className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 font-semibold py-3 px-4 rounded-lg transition-colors border border-red-200"
              >
                {deleteMutation.isPending ? 'Eliminando...' : 'Eliminar Producto'}
              </button>
              <button 
                onClick={() => setEditModalOpen(true)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md transition-colors"
              >
                Editar Producto
              </button>
            </div>
          </div>
        </div>
      </div>

      <ProductoModal 
        isOpen={isEditModalOpen} 
        onClose={() => setEditModalOpen(false)} 
        productoAEditar={producto}
      />
    </div>
  );
};

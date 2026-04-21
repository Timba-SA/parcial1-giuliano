import React, { useState } from 'react';
import { useProductos, Producto } from '../../hooks/useProductos';
import { ProductoModal } from '../../components/productos/ProductoModal';
import { IngredientesModal } from '../../components/productos/IngredientesModal';
import { Link } from 'react-router-dom';

export const ProductosPage: React.FC = () => {
  const { data: productos, isLoading, error } = useProductos();
  const [isProductoModalOpen, setProductoModalOpen] = useState(false);
  const [isIngredientesModalOpen, setIngredientesModalOpen] = useState(false);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 border-b pb-4">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Catálogo de Productos</h1>
        <div className="flex space-x-4 mt-4 md:mt-0">
          <button
            onClick={() => setIngredientesModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="-ml-1 mr-2 h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            Gestionar Ingredientes
          </button>
          <button
            onClick={() => setProductoModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Nuevo Producto
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">Error al cargar los productos. Asegúrate de que el backend esté en ejecución.</p>
            </div>
          </div>
        </div>
      ) : productos?.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No hay productos</h3>
          <p className="mt-1 text-sm text-gray-500">Comienza creando tu primer producto.</p>
          <div className="mt-6">
            <button onClick={() => setProductoModalOpen(true)} className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
              <svg className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
              Nuevo Producto
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {productos?.map((producto: Producto) => (
            <div key={producto.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-100 flex flex-col">
              <div className="h-48 bg-gray-200 flex items-center justify-center relative">
                {/* Imagen placeholder */}
                <svg className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {!producto.disponible && (
                  <span className="absolute top-2 right-2 bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-semibold">
                    Agotado
                  </span>
                )}
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-gray-900 mb-1">{producto.nombre}</h3>
                <p className="text-sm text-gray-500 mb-2 flex-1 line-clamp-2">{producto.descripcion || 'Sin descripción'}</p>
                
                {/* Relaciones en la UI */}
                {producto.ingredientes && producto.ingredientes.length > 0 && (
                  <div className="mb-3">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Ingredientes:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {producto.ingredientes.slice(0, 3).map(ing => (
                        <span key={ing.id} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                          {ing.nombre}
                        </span>
                      ))}
                      {producto.ingredientes.length > 3 && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                          +{producto.ingredientes.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {producto.categorias && producto.categorias.length > 0 && (
                  <div className="mb-3">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Categorías:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {producto.categorias.slice(0, 3).map(cat => (
                        <span key={cat.id} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-800">
                          {cat.nombre}
                        </span>
                      ))}
                      {producto.categorias.length > 3 && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                          +{producto.categorias.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="flex justify-between items-center mt-auto">
                  <span className="text-2xl font-black text-gray-900">${producto.precio_base.toFixed(2)}</span>
                  <Link 
                    to={`/productos/${producto.id}`} 
                    className="text-blue-600 hover:text-blue-800 font-medium text-sm border-b border-transparent hover:border-blue-800 transition-colors"
                  >
                    Ver detalles &rarr;
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modales */}
      <ProductoModal isOpen={isProductoModalOpen} onClose={() => setProductoModalOpen(false)} />
      <IngredientesModal isOpen={isIngredientesModalOpen} onClose={() => setIngredientesModalOpen(false)} />

    </div>
  );
};

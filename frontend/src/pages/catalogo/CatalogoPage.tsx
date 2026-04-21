import React from 'react';
import { Link } from 'react-router-dom';
import { useCategorias } from '../../hooks/useCategorias';
import { useIngredientes } from '../../hooks/useIngredientes';

export const CatalogoPage: React.FC = () => {
  const {
    data: categorias,
    isLoading: loadingCategorias,
    error: errorCategorias,
  } = useCategorias();

  const {
    data: ingredientes,
    isLoading: loadingIngredientes,
    error: errorIngredientes,
  } = useIngredientes();

  const totalCategorias = categorias?.length ?? 0;
  const totalIngredientes = ingredientes?.length ?? 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 border-b pb-4">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Gestión de Catálogo</h1>
        <p className="mt-2 text-gray-600">Administrá categorías e ingredientes desde un solo lugar.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <p className="text-sm uppercase tracking-wide text-gray-500">Categorías</p>
          <p className="mt-2 text-4xl font-black text-gray-900">
            {loadingCategorias ? '...' : errorCategorias ? '!' : totalCategorias}
          </p>
          <p className="mt-2 text-sm text-gray-500">Total de categorías registradas</p>
          <Link
            to="/categorias"
            className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
          >
            Ir a categorías &rarr;
          </Link>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <p className="text-sm uppercase tracking-wide text-gray-500">Ingredientes</p>
          <p className="mt-2 text-4xl font-black text-gray-900">
            {loadingIngredientes ? '...' : errorIngredientes ? '!' : totalIngredientes}
          </p>
          <p className="mt-2 text-sm text-gray-500">Total de ingredientes registrados</p>
          <Link
            to="/ingredientes"
            className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
          >
            Ir a ingredientes &rarr;
          </Link>
        </div>
      </div>

      {(errorCategorias || errorIngredientes) && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
          <p className="text-sm text-red-700">
            Error cargando datos del catálogo. Verificá que el backend esté en ejecución.
          </p>
        </div>
      )}
    </div>
  );
};

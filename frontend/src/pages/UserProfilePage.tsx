export default function UserProfilePage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="px-4 py-5 bg-white shadow sm:rounded-lg sm:p-6 ring-1 ring-gray-200">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Perfil de Usuario</h3>
        <p className="max-w-2xl mt-1 text-sm text-gray-500">
          Información personal y configuraciones de cuenta.
        </p>
        <div className="mt-5 border-t border-gray-200">
          <dl className="divide-y divide-gray-200">
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm font-medium text-gray-500">Nombre completo</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">Usuario Ejemplo</dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">usuario@ejemplo.com</dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm font-medium text-gray-500">Celular</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">+54 11 1234-5678</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}

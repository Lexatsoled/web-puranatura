import { PlusIcon } from './AddressIcons';

export const AddressHeader = ({ onAdd }: { onAdd: () => void }) => (
  <div className="mb-8 flex items-center justify-between">
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Mis Direcciones</h1>
      <p className="text-gray-600">
        Gestiona tus direcciones de envio y facturacion
      </p>
    </div>
    <button
      onClick={onAdd}
      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center gap-2"
    >
      <PlusIcon />
      Agregar Direccion
    </button>
  </div>
);

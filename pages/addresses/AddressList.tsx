import { motion } from 'framer-motion';
import { Address } from './useAddressesState';
import {
  AddressTypeIcon,
  getAddressTypeName,
  EditIcon,
  DeleteIcon,
} from './AddressIcons';

type Props = {
  addresses: Address[];
  onSetDefault: (id: string) => void;
  onEdit: (address: Address) => void;
  onDelete: (id: string) => void;
};

export const AddressList = ({
  addresses,
  onSetDefault,
  onEdit,
  onDelete,
}: Props) => (
  <div className="space-y-4 mb-8">
    {addresses.map((address, index) => (
      <AddressCard
        key={address.id}
        address={address}
        index={index}
        onSetDefault={onSetDefault}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    ))}
  </div>
);

const AddressCard = ({
  address,
  index,
  onSetDefault,
  onEdit,
  onDelete,
}: {
  address: Address;
  index: number;
  onSetDefault: (id: string) => void;
  onEdit: (address: Address) => void;
  onDelete: (id: string) => void;
}) => {
  const badgeColor = address.isDefault
    ? 'border-green-200 bg-green-50'
    : 'border-gray-200';
  const iconColor = address.isDefault
    ? 'bg-green-100 text-green-600'
    : 'bg-gray-100 text-gray-600';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`bg-white rounded-lg shadow-sm border-2 p-6 ${badgeColor}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4">
          <div className={`p-2 rounded-lg ${iconColor}`}>
            <AddressTypeIcon type={address.type} />
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">
                {address.name}
              </h3>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  address.isDefault
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {getAddressTypeName(address.type)}
              </span>
              {address.isDefault && (
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Predeterminada
                </span>
              )}
            </div>
            <div className="text-gray-600 space-y-1">
              <p>{address.street}</p>
              <p>
                {address.city}, {address.postalCode}
              </p>
              <p>{address.country}</p>
            </div>
          </div>
        </div>
        <CardActions
          address={address}
          onSetDefault={onSetDefault}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </div>
    </motion.div>
  );
};

const CardActions = ({
  address,
  onSetDefault,
  onEdit,
  onDelete,
}: {
  address: Address;
  onSetDefault: (id: string) => void;
  onEdit: (address: Address) => void;
  onDelete: (id: string) => void;
}) => (
  <div className="flex items-center space-x-2">
    {!address.isDefault && (
      <button
        onClick={() => onSetDefault(address.id)}
        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
      >
        Usar como predeterminada
      </button>
    )}
    <button
      onClick={() => onEdit(address)}
      className="text-green-600 hover:text-green-700 p-2"
    >
      <EditIcon />
    </button>
    <button
      onClick={() => onDelete(address.id)}
      className="text-red-600 hover:text-red-700 p-2"
    >
      <DeleteIcon />
    </button>
  </div>
);

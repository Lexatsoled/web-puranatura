import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { AddressHeader } from './addresses/AddressHeader';
import { AddressList } from './addresses/AddressList';
import { AddressForm } from './addresses/AddressForm';
import {
  useAddressesState,
  INITIAL_ADDRESSES,
} from './addresses/useAddressesState';

const AddressesPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const state = useAddressesState(INITIAL_ADDRESSES);

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Acceso Denegado
          </h2>
          <p className="text-gray-600">
            Debes iniciar sesion para gestionar tus direcciones.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <AddressHeader onAdd={state.startAdd} />

        <AddressList
          addresses={state.addresses}
          onSetDefault={state.handleSetDefault}
          onEdit={state.handleEdit}
          onDelete={state.handleDelete}
        />

        {state.isAddingAddress && (
          <AddressForm
            formRef={state.formRef}
            formData={state.formData}
            editingAddress={state.editingAddress}
            onChange={state.handleInputChange}
            onSubmit={state.handleSubmit}
            onCancel={state.cancelForm}
          />
        )}
      </div>
    </div>
  );
};

export default AddressesPage;

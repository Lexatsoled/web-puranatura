import React from 'react';

type User = {
  firstName?: string;
  lastName?: string;
  phone?: string | null;
  email?: string;
};

type Props = {
  user: User;
  formData: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
  };
  isEditing: boolean;
  isSaving: boolean;
  saveMessage: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: () => void;
  onCancel: () => void;
};

export const ProfileForm: React.FC<Props> = ({
  formData,
  isEditing,
  isSaving,
  saveMessage,
  onChange,
  onSave,
  onCancel,
}) => (
  <div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label
          className="block text-sm font-medium text-gray-700"
          htmlFor="profile-first-name"
        >
          Nombre
        </label>
        <input
          type="text"
          id="profile-first-name"
          name="firstName"
          value={formData.firstName}
          onChange={onChange}
          disabled={!isEditing}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
        />
      </div>
      <div>
        <label
          className="block text-sm font-medium text-gray-700"
          htmlFor="profile-last-name"
        >
          Apellido
        </label>
        <input
          type="text"
          id="profile-last-name"
          name="lastName"
          value={formData.lastName}
          onChange={onChange}
          disabled={!isEditing}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
        />
      </div>
      <div>
        <label
          className="block text-sm font-medium text-gray-700"
          htmlFor="profile-phone"
        >
          Teléfono
        </label>
        <input
          type="tel"
          id="profile-phone"
          name="phone"
          value={formData.phone}
          onChange={onChange}
          disabled={!isEditing}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
        />
      </div>
      <div>
        <label
          className="block text-sm font-medium text-gray-700"
          htmlFor="profile-email"
        >
          Email
        </label>
        <input
          type="email"
          id="profile-email"
          name="email"
          value={formData.email}
          onChange={onChange}
          disabled
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm bg-gray-50"
        />
      </div>
    </div>

    {saveMessage && (
      <p className="mt-2 text-sm text-green-600" role="status">
        {saveMessage}
      </p>
    )}

    <div className="mt-6 flex space-x-3">
      {isEditing ? (
        <>
          <button
            onClick={onSave}
            disabled={isSaving}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {isSaving ? 'Guardando...' : 'Guardar cambios'}
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          >
            Cancelar
          </button>
        </>
      ) : (
        <button
          onClick={() => onSave()}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          Guardar
        </button>
      )}
    </div>
  </div>
);

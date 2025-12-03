export const ProfileHeader = ({
  user,
  isEditing,
  setIsEditing,
  memberSinceText,
}: {
  user: { firstName?: string; lastName?: string; email?: string };
  isEditing: boolean;
  setIsEditing: (val: boolean) => void;
  memberSinceText: string;
}) => (
  <div className="flex items-center justify-between">
    <div>
      <h1 className="text-2xl font-bold text-gray-900">
        {user.firstName || 'Usuario'} {user.lastName || ''}
      </h1>
      <p className="text-sm text-gray-600">Miembro desde: {memberSinceText}</p>
      <p className="text-sm text-gray-600">Email: {user.email}</p>
    </div>
    <button
      onClick={() => setIsEditing(!isEditing)}
      className="text-sm px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
    >
      {isEditing ? 'Cancelar' : 'Editar perfil'}
    </button>
  </div>
);

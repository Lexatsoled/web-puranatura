import React from 'react';
// Replace simple view animations with CSS transitions (no framer-motion)
import useProfile from '../src/hooks/useProfile';
import { ProfileHeader } from './profile/ProfileHeader';
import { ProfileForm } from './profile/ProfileForm';

const ProfilePage: React.FC = () => {
  const {
    user,
    isLoading,
    isEditing,
    setIsEditing,
    formData,
    isSaving,
    saveMessage,
    handleInputChange,
    handleSave,
    handleCancel,
    memberSinceText,
  } = useProfile();

  if (isLoading) {
    return <div className="text-center py-10">Cargando perfil...</div>;
  }

  if (!user) {
    return <div className="text-center py-10">No se encontró el usuario.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6 transition-transform duration-400">
        <ProfileHeader
          user={user}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          memberSinceText={memberSinceText}
        />
        <ProfileForm
          user={user}
          formData={formData}
          isEditing={isEditing}
          isSaving={isSaving}
          saveMessage={saveMessage}
          onChange={handleInputChange}
          onSave={() => handleSave()}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
};

export default ProfilePage;

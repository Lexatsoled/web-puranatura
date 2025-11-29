import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

export function useProfile() {
  const { user, updateProfile, isLoading } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
    email: user?.email || '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phone: user?.phone || '',
      email: user?.email || '',
    });
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (onSuccess?: () => void) => {
    setIsSaving(true);
    setSaveMessage('');

    try {
      const success = await updateProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone || undefined,
      });

      if (success) {
        setIsEditing(false);
        setSaveMessage('Perfil actualizado correctamente');
        onSuccess?.();
        setTimeout(() => setSaveMessage(''), 3000);
      } else {
        setSaveMessage('Error al actualizar el perfil');
      }
    } catch {
      setSaveMessage('Error al actualizar el perfil');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phone: user?.phone || '',
      email: user?.email || '',
    });
    setIsEditing(false);
    setSaveMessage('');
  };

  const memberSinceText = (() => {
    if (!user?.createdAt) return 'Reciente';
    const parsed = new Date(user.createdAt);
    return Number.isNaN(parsed.getTime())
      ? 'Reciente'
      : parsed.toLocaleDateString();
  })();

  return {
    user,
    isLoading,
    isEditing,
    setIsEditing,
    formData,
    setFormData,
    isSaving,
    saveMessage,
    handleInputChange,
    handleSave,
    handleCancel,
    memberSinceText,
  } as const;
}

export default useProfile;

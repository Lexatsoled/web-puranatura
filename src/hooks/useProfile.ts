import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';

type ProfileForm = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
};

const buildInitialForm = (user?: {
  firstName?: string;
  lastName?: string;
  phone?: string | null;
  email?: string;
}) => ({
  firstName: user?.firstName || '',
  lastName: user?.lastName || '',
  phone: user?.phone || '',
  email: user?.email || '',
});

export function useProfile() {
  const { user, updateProfile, isLoading } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ProfileForm>(buildInitialForm(user));
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    setFormData(buildInitialForm(user));
  }, [user]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleSave = useCallback(
    async (onSuccess?: () => void) => {
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
    },
    [formData.firstName, formData.lastName, formData.phone, updateProfile]
  );

  const handleCancel = useCallback(() => {
    setFormData(buildInitialForm(user));
    setIsEditing(false);
    setSaveMessage('');
  }, [user]);

  const memberSinceText = useMemo(() => {
    if (!user?.createdAt) return 'Reciente';
    const parsed = new Date(user.createdAt);
    return Number.isNaN(parsed.getTime())
      ? 'Reciente'
      : parsed.toLocaleDateString();
  }, [user?.createdAt]);

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

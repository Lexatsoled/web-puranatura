import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  buildInitialForm,
  buildPayload,
  clearMessageLater,
  computeMemberSince,
  ProfileForm,
  resetFormState,
  saveProfileData,
} from './useProfile.helpers';

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

  const resetForm = useCallback(() => {
    resetFormState(setFormData, setIsEditing, setSaveMessage, user);
  }, [user]);

  const markSuccess = useCallback((onSuccess?: () => void) => {
    setIsEditing(false);
    setSaveMessage('Perfil actualizado correctamente');
    onSuccess?.();
    clearMessageLater(setSaveMessage);
  }, []);

  const markFailure = useCallback(() => {
    setSaveMessage('Error al actualizar el perfil');
  }, []);

  const handleSave = useCallback(
    async (onSuccess?: () => void) => {
      setIsSaving(true);
      setSaveMessage('');

      try {
        const payload = buildPayload(formData);
        const success = await saveProfileData(payload, updateProfile);

        if (success) markSuccess(onSuccess);
        else markFailure();
      } catch {
        markFailure();
      } finally {
        setIsSaving(false);
      }
    },
    [
      formData.firstName,
      formData.lastName,
      formData.phone,
      markFailure,
      markSuccess,
      updateProfile,
    ]
  );

  const handleCancel = useCallback(() => {
    resetForm();
  }, [resetForm]);

  const memberSinceText = useMemo(
    () => computeMemberSince(user?.createdAt),
    [user?.createdAt]
  );

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

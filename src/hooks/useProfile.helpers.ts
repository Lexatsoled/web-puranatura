import { useAuth } from '../../contexts/AuthContext';
import { ProfileForm, buildInitialForm } from './useProfile.form';

export * from './useProfile.form';
export * from './useProfile.formatting';

export const clearMessageLater = (setMessage: (msg: string) => void) =>
  setTimeout(() => setMessage(''), 3000);

export const saveProfileData = async (
  payload: { firstName: string; lastName: string; phone?: string },
  updateProfile: ReturnType<typeof useAuth>['updateProfile']
) => updateProfile(payload);

export const resetFormState = (
  setFormData: (form: ProfileForm) => void,
  setIsEditing: (value: boolean) => void,
  setSaveMessage: (value: string) => void,
  user: ReturnType<typeof useAuth>['user']
) => {
  setFormData(buildInitialForm(user));
  setIsEditing(false);
  setSaveMessage('');
};

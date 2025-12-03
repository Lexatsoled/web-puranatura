import { useAuth } from '../../contexts/AuthContext';

export type ProfileForm = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
};

type AuthUser = Partial<{
  firstName: string;
  lastName: string;
  phone: string | null;
  email: string;
  createdAt: string | Date;
}>;

export const buildInitialForm = (user: AuthUser | null | undefined) => {
  if (!user) {
    return {
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
    };
  }

  return {
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    phone: user.phone || '',
    email: user.email || '',
  };
};

export const computeMemberSince = (
  createdAt: string | Date | null | undefined
) => {
  let label = 'Reciente';
  if (createdAt) {
    const parsed = new Date(createdAt);
    if (!Number.isNaN(parsed.getTime())) {
      label = parsed.toLocaleDateString();
    }
  }
  return label;
};

export const clearMessageLater = (setMessage: (msg: string) => void) =>
  setTimeout(() => setMessage(''), 3000);

export const saveProfileData = async (
  payload: { firstName: string; lastName: string; phone?: string },
  updateProfile: ReturnType<typeof useAuth>['updateProfile']
) => updateProfile(payload);

export const buildPayload = (formData: ProfileForm) => ({
  firstName: formData.firstName,
  lastName: formData.lastName,
  phone: formData.phone || undefined,
});

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

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

export const buildInitialForm = (
  user: AuthUser | null | undefined
): ProfileForm => {
  if (!user) {
    return { firstName: '', lastName: '', phone: '', email: '' };
  }

  return {
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    phone: user.phone || '',
    email: user.email || '',
  };
};

export const buildPayload = (formData: ProfileForm) => ({
  firstName: formData.firstName,
  lastName: formData.lastName,
  phone: formData.phone || undefined,
});

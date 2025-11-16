import { User } from '@/types/auth';

export interface BackendUserDTO {
  id: number | string;
  email: string;
  name?: string | null;
  created_at?: string | null;
}

const extractNameParts = (
  user: Pick<BackendUserDTO, 'name' | 'email'>
): { firstName: string; lastName: string } => {
  const normalizedName = user.name?.trim() ?? '';

  if (!normalizedName) {
    const fallback = user.email.split('@')[0] ?? 'Usuario';
    return { firstName: fallback, lastName: '' };
  }

  const [first, ...rest] = normalizedName.split(/\s+/);
  const emailFallback = user.email.split('@')[0] || 'Usuario';
  return {
    firstName: first || emailFallback,
    lastName: rest.join(' '),
  };
};

export const mapBackendUserToUser = (backendUser: BackendUserDTO): User => {
  const { firstName, lastName } = extractNameParts(backendUser);
  return {
    id: String(backendUser.id),
    email: backendUser.email,
    firstName,
    lastName,
    role: 'user',
    addresses: [],
    orderHistory: [],
    createdAt: backendUser.created_at
      ? new Date(backendUser.created_at)
      : new Date(),
  };
};

export const composeFullName = (
  firstName?: string,
  lastName?: string,
  email?: string
): string => {
  const name = [firstName, lastName].filter(Boolean).join(' ');
  if (name.trim()) {
    return name.trim();
  }
  const cleanedFirstName = firstName?.trim();
  if (cleanedFirstName) {
    return cleanedFirstName;
  }
  const emailPrefix = email?.includes('@') ? email.split('@')[0] : undefined;
  return emailPrefix && emailPrefix.trim() ? emailPrefix.trim() : 'Usuario';
};

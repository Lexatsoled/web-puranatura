export const computeMemberSince = (
  createdAt: string | Date | null | undefined
): string => {
  if (!createdAt) return 'Reciente';

  const parsed = new Date(createdAt);
  return !Number.isNaN(parsed.getTime())
    ? parsed.toLocaleDateString()
    : 'Reciente';
};

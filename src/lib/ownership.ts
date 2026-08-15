export function canClaimSlug(
  existingOwnerId: string | null | undefined,
  requestingUserId: string,
  existingPublished?: boolean,
): boolean {
  if (existingPublished && existingOwnerId !== requestingUserId) return false;
  return !existingOwnerId || existingOwnerId === requestingUserId;
}

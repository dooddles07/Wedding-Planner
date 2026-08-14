export function canClaimSlug(
  existingOwnerId: string | null | undefined,
  requestingUserId: string,
): boolean {
  return !existingOwnerId || existingOwnerId === requestingUserId;
}

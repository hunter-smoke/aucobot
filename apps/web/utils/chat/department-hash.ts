/** Parse department id from `location.hash` (e.g. `#1244557231`). */
export function parseDepartmentIdFromHash(hash: string): string | null {
  const raw = hash.startsWith("#") ? hash.slice(1) : hash;
  const id = raw.trim();
  return id.length > 0 ? id : null;
}

/** Build hash fragment for a department (no leading `#`). */
export function toDepartmentHash(departmentId: string): string {
  return departmentId.trim();
}

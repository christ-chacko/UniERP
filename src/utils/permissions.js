
export function canEdit(user, moduleName) {
  if (!user) return false;

  // Admins and faculty can edit notices or similar content
  if (["admin", "faculty"].includes(user.role)) {
    return true;
  }

  // fallback for custom permission-based system
  if (user.permissions && user.permissions[moduleName]) {
    return user.permissions[moduleName].includes("edit");
  }

  return false;
}

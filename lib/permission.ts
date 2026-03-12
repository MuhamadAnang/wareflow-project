import { PERMISSIONS } from "@/common/constants/permissions/permissions";
import { responseFormatter } from "./response-formatter";

export const serverCheckPermissions = (
  userPermissions: string[],
  requiredPermissions: string[],
) => {
  if (userPermissions.includes(PERMISSIONS.FULL_ACCESS)) {
    return true;
  }

  const hasPermission = requiredPermissions.every((permission) =>
    userPermissions.includes(permission),
  );

  if (hasPermission) {
    return true;
  }

  return responseFormatter.forbidden(
    "You do not have the necessary permissions to access this resource.",
  );
};

export const clientCheckPermissions = (
  userPermissions: string[],
  requiredPermissions: string[],
) => {
  if (userPermissions.includes(PERMISSIONS.FULL_ACCESS)) {
    return true;
  }

  return requiredPermissions.every((permission) => userPermissions.includes(permission));
};

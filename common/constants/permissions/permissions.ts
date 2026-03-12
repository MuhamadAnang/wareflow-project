export const PERMISSIONS = {
  FULL_ACCESS: "full-access",

  // Waitlist
  INVITE_WAITLIST: "waitlist:invite",
  VIEW_WAITLIST: "waitlist:view",
  REVOKE_WAITLIST: "waitlist:revoke",
  DENY_WAITLIST: "waitlist:deny",

  // Roles
  CREATE_ROLE: "role:create",
  EDIT_ROLE: "role:edit",
  DELETE_ROLE: "role:delete",
  UPDATE_ROLE: "role:update",
  SHOW_ROLE: "role:show",
  VIEW_ROLE: "role:view",

  // Simulations
  CREATE_SIMULATION: "simulation:create",
  VIEW_SIMULATION: "simulation:view",
  DELETE_SIMULATION: "simulation:delete",
};

export type TPermission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

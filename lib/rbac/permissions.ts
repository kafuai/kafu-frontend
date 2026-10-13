export const PERMISSIONS = {
  ALL: "*",

  ASSESSMENT_VIEW: "assessment.view",
  DISCOVERY_VIEW: "discovery.view",

  CORPORATE_BRAIN_VIEW: "corporate_brain.view",

  DIGITAL_WORKFORCE_VIEW: "digital_workforce.view",

  REQUESTS_VIEW: "requests.view",
  REQUESTS_MANAGE: "requests.manage",

  POLICIES_VIEW: "policies.view",
  POLICIES_MANAGE: "policies.manage",

  EMPLOYEE_USE: "employee.use",

  PROFILE_VIEW: "profile.view",

  EMPLOYEE_EXPERINCE_USE: "employee-experince.use",
  

} as const;

export type Permission =
  (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export const ROLE_PERMISSIONS: Record<
  string,
  readonly Permission[]
> = {
  admin: [
    PERMISSIONS.ALL,
  ],

  owner: [
    PERMISSIONS.ASSESSMENT_VIEW,
    PERMISSIONS.DISCOVERY_VIEW,
    PERMISSIONS.CORPORATE_BRAIN_VIEW,
    PERMISSIONS.DIGITAL_WORKFORCE_VIEW,
    PERMISSIONS.REQUESTS_VIEW,
    PERMISSIONS.REQUESTS_MANAGE,
    PERMISSIONS.POLICIES_VIEW,
    PERMISSIONS.POLICIES_MANAGE,
    PERMISSIONS.PROFILE_VIEW,
    PERMISSIONS.EMPLOYEE_EXPERINCE_USE,
  ],

  manager: [
    PERMISSIONS.REQUESTS_VIEW,
    PERMISSIONS.REQUESTS_MANAGE,
    PERMISSIONS.POLICIES_VIEW,
    PERMISSIONS.POLICIES_MANAGE,
    PERMISSIONS.PROFILE_VIEW,
    PERMISSIONS.EMPLOYEE_EXPERINCE_USE,
  ],

  member: [
    PERMISSIONS.EMPLOYEE_USE,
    PERMISSIONS.EMPLOYEE_EXPERINCE_USE,
    PERMISSIONS.PROFILE_VIEW,
  ],

  viewer: [],
};

export const ROUTE_PERMISSIONS: Record<string, Permission> = {
  "/assessment": PERMISSIONS.ASSESSMENT_VIEW,
  "/discovery": PERMISSIONS.DISCOVERY_VIEW,

  "/corporate-brain": PERMISSIONS.CORPORATE_BRAIN_VIEW,
  "/digital-workforce": PERMISSIONS.DIGITAL_WORKFORCE_VIEW,

  "/employee-experience/requests": PERMISSIONS.REQUESTS_VIEW,
  "/employee-experience/policies": PERMISSIONS.POLICIES_VIEW,
  "/employee-experience/employee": PERMISSIONS.EMPLOYEE_USE,

  "/profile" : PERMISSIONS.PROFILE_VIEW,

  "/employee-experience" : PERMISSIONS.EMPLOYEE_EXPERINCE_USE,

  "/admin/organizations": PERMISSIONS.ALL,

  "/admin/user" : PERMISSIONS.ALL,
  "/admin": PERMISSIONS.ALL
};
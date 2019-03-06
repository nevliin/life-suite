export interface RoutePermission {
    route: string;
    requiredPower?: number;
    permittedRoles?: string[];
    children?: RoutePermission[];
}
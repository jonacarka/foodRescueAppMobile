export type PublicAppRole = "CUSTOMER" | "BUSINESS" | "NGO" | "COURIER";

export type RoleOption = {
    title:string;
    subtitle:string;
    value:PublicAppRole;
};

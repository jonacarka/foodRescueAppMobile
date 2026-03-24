export type UserRole = "CUSTOMER" | "BUSINESS" | "NGO" | "COURIER" | "ADMIN";

export type AuthUser ={
    id:string;
    fullName:string;
    email:string;
    role:UserRole;
    isActive?:boolean;
    isVerified?:boolean;
    createdAt?:string;
};

export type RegisterPayload = {
    fullName:string;
    email:string;
    password:string;
    role:UserRole;
};

export type RegisterResponse = {
    message:string;
    requiresVerification:boolean;
    email:string;
    role?:UserRole;
};

export type VerifyEmailPayload = {
    email:string;
    code:string;
};

export type LoginPayload = {
    email:string;
    password:string;
    rememberMe?:boolean;
};

export type AuthSuccessResponse = {
    message:string;
    accessToken:string;
    refreshToken:string;
    user:AuthUser;
};

export type RefreshResponse={
    message:string;
    accessToken:string;
    refreshToken:string;
};

export type MeResponse = {
    user:AuthUser;
};

export type ApiErrorResponse = {
    error?:string;
    message?:string;
    details?:unknown;
    requiresVerification?:boolean;
    email?:string;
};
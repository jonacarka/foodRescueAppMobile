import {
    AuthSuccessResponse,
    LoginPayload,
    MeResponse,
    RefreshResponse,
    RegisterPayload,
    RegisterResponse,
    VerifyEmailPayload,
} from "@/types/auth";

import { apiRequest } from "@/services/api";

export const authService = {
    register(payload:RegisterPayload){
        return apiRequest<RegisterResponse>("/auth/register",{
            method:"POST",
            body:payload,
        });
    },

    verifyEmail(payload:VerifyEmailPayload){
        return apiRequest<AuthSuccessResponse>("/auth/verify-email",{
            method:"POST",
            body:payload,
    });
    },

    resendCode(email:string){
        return apiRequest<{message:string;email:string}>("/auth/resend-code",{
            method:"POST",
            body:{email},
        });
    },

    login(payload:LoginPayload){
        return apiRequest<AuthSuccessResponse>("/auth/login",{
            method:"POST",
            body:payload,
        });
    },

    refresh(refreshToken:string){
        return apiRequest<RefreshResponse>("/auth/refresh",{
            method:"POST",
            body:{refreshToken},
        });
    },

    logout(refreshToken:string){
        return apiRequest<{message:string}>("/auth/logout",{
            method:"POST",
            body:{refreshToken},
        });
    },

    me(accessToken:string){
        return apiRequest<MeResponse>("/auth/me",{
            method:"GET",
            token:accessToken,
        });
    },
};


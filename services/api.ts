import { ApiErrorResponse } from "@/types/auth";

export const API_BASE_URL ="http://172.20.10.13:5000/api";

type RequestOptions={
    method?:"GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    body?: unknown;
    token?: string;
};

export async function apiRequest<T>(
    path:string,
    options:RequestOptions = {}
) : Promise<T>{
    const {method = "GET" ,body,token}= options;

    const response = await fetch(`${API_BASE_URL}${path}`,{
        method,
        headers:{
            "Content-Type": "application/json",
            ...(token ? {Authorization: `Bearer ${token}`}:{}),
        },
        body:body ? JSON.stringify(body):undefined,
    });

    const data = await response.json().catch(() => ({}));

    if(!response.ok){
        const errorData = data as ApiErrorResponse;
        throw{
            status:response.status,
            message: errorData.error || errorData.message || "Something went wrong",
            requiresVerification:errorData.requiresVerification,
            email : errorData.email,
            details:errorData.details,
        };
    }
    return data as T;
}
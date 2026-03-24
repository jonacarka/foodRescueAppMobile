import { AuthUser } from "@/types/auth";
import * as SecureStore from "expo-secure-store";

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const USER_KEY = "auth_user";

export async function setAccessToken(token:string){
    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY,token);
}

export async function getAccessToken(){
    return SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
}

export async function setRefreshToken(token:string){
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY,token);
}

export async function getRefreshToken(){
    return SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
}

export async function setStoredUser(user:AuthUser){
    await SecureStore.setItemAsync(USER_KEY,JSON.stringify(user));
}

export async function getStoredUser(): Promise<AuthUser | null>{
    const value = await SecureStore.getItemAsync(USER_KEY);

    if(!value)
        return null;
    try{
        return JSON.parse(value) as AuthUser;

    }catch{
        return null;
    }
    
}

export async function saveSession(params: {
    accessToken:string;
    refreshToken:string;
    user:AuthUser;
}){
    await Promise.all([
        setAccessToken(params.accessToken),
        setRefreshToken(params.refreshToken),
        setStoredUser(params.user),
    ]);
}

export async function clearSession(){
    await Promise.all([
        SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
        SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
        SecureStore.deleteItemAsync(USER_KEY),
    ]);
}
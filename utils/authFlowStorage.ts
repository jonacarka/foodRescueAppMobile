import { PublicAppRole } from "@/types/auth-flow";
import * as SecureStore from "expo-secure-store";

const PENDING_ROLE_KEY = "pending_selected_role";

export async function setPendingRole(role:PublicAppRole){
    await SecureStore.setItemAsync(PENDING_ROLE_KEY,role);
}

export async function getPendingRole(): Promise<PublicAppRole | null>{
    const value = await SecureStore.getItemAsync(PENDING_ROLE_KEY);

    if(
        value === "CUSTOMER" ||
        value === "BUSINESS" || 
        value === "NGO" ||
        value === "COURIER"
    ){
        return value;
    }
    return null;
}

export async function clearPendingRole(){
    await SecureStore.deleteItemAsync(PENDING_ROLE_KEY);
}
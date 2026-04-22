import { Stack } from "expo-router";
import React from "react";

export default function CustomerLayout(){
    return(
        <Stack
        screenOptions={{
            headerShown:false,
            animation:"slide_from_right",
            contentStyle:{backgroundColor:"#F7F8FC"},
        }}
        >
            <Stack.Screen name="home" />
            <Stack.Screen name="listings/[id]" />
             <Stack.Screen name="orders/create" />
               <Stack.Screen name="orders/mine" />
            <Stack.Screen name="profile" />
            
        </Stack>
    );
}
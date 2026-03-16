import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withTiming,
} from "react-native-reanimated";
import ReplateLogo from "./ReplateLogo";

const APP_BG ='#0D1A63';

type Props ={
    onFinish : ()=> void;
};

export default function BrandIntro({onFinish}:Props){
    const opacity = useSharedValue(1);
    const scale = useSharedValue(1);

    useEffect(() =>{
        scale.value = withDelay(
            1200,
            withTiming(0.985,{
                duration:280,
                easing:Easing.out(Easing.quad),
            })
        );

        const timer = setTimeout(() => {
            onFinish();
        }, 1850);

        return() => clearTimeout(timer);
    },[onFinish,opacity,scale]);

    const wrapperStyle= useAnimatedStyle(() =>({
        opacity:opacity.value,
        transform:[{scale:scale.value}],
    }));

    return(
        <Animated.View style={[styles.container,wrapperStyle]}>
            <View style={styles.logoWrap}>
                <ReplateLogo />
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: APP_BG,
        justifyContent:'center',
        alignItems:'center',
    },
    logoWrap:{
        width:'100%',
        alignItems:'center',
        justifyContent:'center',
        paddingHorizontal:24,
    },
});
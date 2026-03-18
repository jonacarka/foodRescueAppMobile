import React, { useEffect } from "react";
import { StyleSheet, View, useWindowDimensions } from "react-native";
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withRepeat,
    withSequence,
    withTiming,
} from "react-native-reanimated";


const APP_BG ="#0D1A63";

const logoSource = require("@/assets/images/onboarding/logoFinal.png");

type Props ={
    onFinish : ()=> void;
};

export default function BrandIntro({onFinish}:Props){
    const {width} = useWindowDimensions();

    const opacity = useSharedValue(0);
    const translateY = useSharedValue(16);
    const scale = useSharedValue(0.94);
    const floatY = useSharedValue(0);

    useEffect(() =>{
        opacity.value = withTiming(1,{
            duration:550,
            easing:Easing.out(Easing.cubic),

        });
        translateY.value = withTiming(0,{
            duration:650,
            easing:Easing.out(Easing.cubic),
        });
        scale.value = withTiming(1,{
            duration:650,
            easing:Easing.out(Easing.cubic),
        });
        floatY.value = withDelay(
            750,
            withRepeat(
                withSequence(
                    withTiming(-4,{
                        duration:1400,
                        easing:Easing.inOut(Easing.sin),

                    }),
                    withTiming(4,{
                        duration:1400,
                        easing:Easing.inOut(Easing.sin),
                    })
                ),
                -1,
                true
            )
        );

        const fadeTimer = setTimeout(() =>{
            opacity.value = withTiming(0,{
                duration:450,
                easing:Easing.out(Easing.quad),
            });
        },1800);

        const finishTimer = setTimeout(() =>{
            onFinish();
        },2100);

        return () => {
            clearTimeout(fadeTimer);
            clearTimeout(finishTimer);
        };
      
    },[floatY,onFinish,opacity,scale,translateY]);

    const logoStyle = useAnimatedStyle(() =>({
        opacity : opacity.value,
        transform:[
            {translateY:translateY.value + floatY.value},
            {scale:scale.value},
        ],
    }));

    const logoWidth = Math.min(width * 1.1,400);
    const logoHeight = logoWidth * 0.42;

    return(
        <View style = {styles.container}>
            <Animated.Image
            source={logoSource}
            resizeMode="contain"
            style={[
                styles.logo,
                {
                    width:logoWidth,
                    height:logoHeight,
                },
                logoStyle,
            ]}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: APP_BG,
        justifyContent:'center',
        alignItems:'center',
        paddingHorizontal:24,
    },
    logo:{},
    
});
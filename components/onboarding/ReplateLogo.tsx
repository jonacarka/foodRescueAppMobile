import React, { useEffect } from "react";
import { ImageSourcePropType, StyleSheet, useWindowDimensions, View } from "react-native";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withTiming, } from "react-native-reanimated";

type LetterConfig = {
    key:string;
    source:ImageSourcePropType;
    width:number;
    height:number;
};

const letters: LetterConfig[]=[
    {key:'r',source:require('@/assets/images/onboarding/letters/r.png'), width:62,height:86},
    {key:'e',source:require('@/assets/images/onboarding/letters/e.png'), width:54,height:72},
    {key:'p',source:require('@/assets/images/onboarding/letters/p.png'), width:58,height:96},
    {key:'l',source:require('@/assets/images/onboarding/letters/l.png'), width:28,height:96},
    {key:'a',source:require('@/assets/images/onboarding/letters/a.png'), width:56,height:72},
    {key:'t',source:require('@/assets/images/onboarding/letters/t.png'), width:36,height:84},
    {key:'e2',source:require('@/assets/images/onboarding/letters/e2.png'), width:54,height:72},
];

type Props = {
    onAnimationEnd?: () => void;
};
function Letter({
    item,
    index,
    left,
    top,
} :{
    item:LetterConfig;
    index:number;
    left:number;
    top:number;
}){
    const opacity = useSharedValue(0);
    const translateY = useSharedValue(18);
    const scale = useSharedValue(0.94);

    useEffect(() =>{
        const delay = 130 + index * 90;

        opacity.value = withDelay(
            delay,
            withTiming(1,{
                duration:320,
                easing:Easing.out(Easing.cubic),
            })
        );

        translateY.value = withDelay(
            delay,
            withTiming(0,{
                duration:420,
                easing:Easing.out(Easing.cubic),
            })
        );

        scale.value=withDelay(
            delay,
            withTiming(1,{
                duration:420,
                easing:Easing.out(Easing.cubic),
            })
        );
    },[index,opacity,scale,translateY]);

    const animatedStyle = useAnimatedStyle(() =>({
        opacity : opacity.value,
        transform:[{translateY:translateY.value} ,{scale:scale.value}],
    }));

    return(
        <Animated.Image
        source={item.source}
        resizeMode="contain"
        style={[
            styles.letter,
            {
                width:item.width,
                height:item.height,
                left,
                top,
            },
            animatedStyle,
        ]}
        />
    );
}

export default function ReplateLogo({onAnimationEnd}:Props){
    const{width} = useWindowDimensions();

    const containerWidth = Math.min(width - 48,340);
    const gap = 2;

    const totalWidth = letters.reduce((sum,item) => sum + item.width,0) + gap *(letters.length -1);

    const startX = (containerWidth -totalWidth) /2;
    const baseY= 18;
    let currentX = startX;

    const positions = letters.map((item) =>{
        const left = currentX;
        currentX += item.width + gap;

        return{
            left,
            top : baseY + (96 - item.height),
        };
    });

    useEffect(() =>{
        const totalDuration = 130 +(letters.length -1) * 90 + 700;
        const timer = setTimeout(() =>{
            onAnimationEnd?.();
        },totalDuration);

        return () => clearTimeout(timer);
    },[onAnimationEnd]);

    return(
        <View style={[styles.container,{width:containerWidth,height:128}]}>
            {letters.map((item,index) => (
                <Letter
                key={item.key}
                item={item}
                index={index}
                left={positions[index].left}
                top={positions[index].top}
                />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        position:'relative',
        alignSelf:'center',
    },

    letter:{
        position:'absolute',
    },
});
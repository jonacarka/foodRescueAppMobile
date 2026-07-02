import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  AccessibilityInfo,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, {
  interpolate,
  interpolateColor,
  runOnJS,
  runOnUI,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

type RoleKey = "CUSTOMER" | "BUSINESS" | "NGO" | "COURIER";
type IconName = React.ComponentProps<typeof Ionicons>["name"];

type RoleItem ={
  key: RoleKey;
  title: string;
  description: string;
  icon: IconName;
};

const COLORS = {
  bg:"#14204F",
  bgDeep:"#101943",
  cream:"#F6F1E7",
  muted:"#9AA3D1",
  brandMuted:"#7A85C4",
  sectorInactive:"#1B2760",
  sectorBorder:"#333F78",
  card:"#1B2760",
  navyText:"#14204F",
};

const WHEEL_SIZE= 280;
const WHEEL_RADIUS = WHEEL_SIZE / 2;
const CENTER_SIZE =112;
const ROLE_COUNT = 4;

const ACTIVE_CENTER_ANGLE = -45;

const ROLE_CENTER_ANGELS = [-45,45,135,-135];

const SPRING_CONFIG = {
  damping:12,
  stiffness:105,
  mass:0.75,
  overshootClamping:false,
  restDisplacementThreshold:0.2,
  restSpeedThreshold:0.2,
};

const ROLES: RoleItem[] = [
  {
  key:"CUSTOMER",
  title:"Klient",
  description:"Shpeto ushqim te mire afer teje",
  icon:"bag-handle-outline",
  },
  {
    key:"BUSINESS",
    title:"Biznes",
    description:"Ndaj ushqimin e tepert lehtesisht",
    icon:"storefront-outline",
  },
  {
    key:"NGO",
    title:"OJF",
    description:"Ndihmo ne shperndarjen e ushqimit",
    icon:"heart-outline",
  },
  {
    key:"COURIER",
    title:"Korier",
    description:"Dergo ushqimin e shpetuar",
    icon:"bicycle-outline",
  },

];

function normalizeDeg(value: number) {
  "worklet";

  let normalized = ((value % 360) + 360) % 360;

  if (normalized >180){
    normalized -= 360;
  }
  return normalized;
}

function shortestDiff(target:number , current:number){
  "worklet";

  return normalizeDeg(target - current);
}

function closestEquivalentAngle(current: number,target:number){
  "worklet";

  return current + shortestDiff(target,current);
}

function indexFromSnapAngle(angle:number){
  "worklet";

  const steps = Math.round(angle/90);
  return ((-steps % ROLE_COUNT) + ROLE_COUNT) % ROLE_COUNT;
}

function getCloseness(index:number, rotation:number){
  "worklet";

  const currentCenter = normalizeDeg(ROLE_CENTER_ANGELS[index] + rotation);
  const distance = Math.abs(shortestDiff(ACTIVE_CENTER_ANGLE,currentCenter));
  const closeness = 1 - distance / 90;

  return Math.max(0, Math.min(1, closeness));
}

function roleIndexFromTouch(x:number, y:number, rotation:number) {
  "worklet";

  const dx = x - WHEEL_RADIUS;
  const dy = y - WHEEL_RADIUS;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if(distance < CENTER_SIZE /2){
    return indexFromSnapAngle(rotation);
  }

  const touchAngle = (Math.atan2(dy, dx) * 180) / Math.PI;
  const localAngle = normalizeDeg(touchAngle - rotation);

  if(localAngle >= -90 && localAngle < 0){
    // klienti
    return 0;  
  }
  if(localAngle >= 0 && localAngle < 90){
    // biznesi
    return 1;
  }
  if(localAngle >= 90 && localAngle <= 180){
    // OJF
    return 2;
  }
  // korieri
  return 3;

}

function getSectorPosition(index:number){
  switch(index){
    case 0:
      return styles.sectorTopRight;
      case 1:
        return styles.sectorBottomRight;
        case 2:
          return styles.sectorBottomLeft;
          default:
            return styles.sectorTopLeft;
  }
}

function WheelSector({
  role,
  index,
  rotation,
}:{
  role:RoleItem;
  index: number;
  rotation:SharedValue<number>;
}) {
  const sectorStyle = useAnimatedStyle(() =>{
    const closeness = getCloseness(index,rotation.value);

    return {
      backgroundColor: interpolateColor(
        closeness,
        [0,1],
        [COLORS.sectorInactive,COLORS.cream]
      ),
      borderColor:interpolateColor(closeness,
        [0,1],
        [COLORS.sectorBorder,COLORS.cream]
      ),
    };
  });

  const contentStyle = useAnimatedStyle(()=>{
    return{
      transform:[{rotate:`${-rotation.value}deg`}],
    };
  });

  const labelStyle = useAnimatedStyle(() =>{
    const closeness = getCloseness(index, rotation.value);

    return{
      color:interpolateColor(
        closeness,
        [0,1],
        [COLORS.cream,COLORS.navyText]
      ),
    };
  });

  const inactiveIconStyle = useAnimatedStyle(() =>{
    const closeness = getCloseness(index,rotation.value);

    return{
      opacity: interpolate(closeness,[0,1],[1,0]),
    };
  });
  
  const activeIconStyle = useAnimatedStyle(()=>{
    const closeness = getCloseness(index,rotation.value);

    return{
      opacity:interpolate(closeness,[0,1],[0,1]),
    };
  });

 return (
    <Animated.View style={[styles.sector, getSectorPosition(index), sectorStyle]}>
      <Animated.View style={[styles.sectorContent, contentStyle]}>
        <View style={styles.iconStack}>
          <Animated.View style={[styles.iconLayer, inactiveIconStyle]}>
            <Ionicons name={role.icon} size={23} color={COLORS.cream} />
          </Animated.View>

          <Animated.View style={[styles.iconLayer, activeIconStyle]}>
            <Ionicons name={role.icon} size={23} color={COLORS.navyText} />
          </Animated.View>
        </View>

        <Animated.Text style={[styles.sectorLabel, labelStyle]}>
          {role.title}
        </Animated.Text>
      </Animated.View>
    </Animated.View>
  );
}


export default function RoleSelectionScreen(){
  const [selectedRole,setSelectedRole] = useState<RoleKey>("CUSTOMER");

  const rotation = useSharedValue(0);
  const startAngle = useSharedValue(0);
  const startRotation = useSharedValue(0);
  const reduceMotion = useSharedValue(false);

  const activeRole = ROLES.find((role)=> role.key === selectedRole) ?? ROLES[0];

  useEffect(() =>{
    AccessibilityInfo.isReduceMotionEnabled().then((enabled) =>{
      reduceMotion.value = enabled;
    });

    const subscription = AccessibilityInfo.addEventListener(
      "reduceMotionChanged",
      (enabled) =>{
        reduceMotion.value = enabled;
      }
    );

    return () =>{
      subscription?.remove?.();
    };
  },[reduceMotion]);

  const commitSelectedRole = (index: number) =>{
    const role = ROLES[index];
    if(!role)
      return;

    setSelectedRole(role.key);
    Haptics.selectionAsync().catch(() => {});
  };

  const animateToAngle = (targetAngle:number,index:number) =>{
    "worklet";

    if(reduceMotion.value){
      rotation.value = withTiming(targetAngle,{duration:0},(finished)=>{
        if(finished){
          runOnJS(commitSelectedRole)(index);
        }
      });

      return;

    }
    rotation.value = withSpring(targetAngle, SPRING_CONFIG,(finished) =>{
      if(finished){
        runOnJS(commitSelectedRole)(index);
      }
    });
  };

  const snapToIndex = (index:number) =>{
    "worklet";

    const safeIndex =((index % ROLE_COUNT) + ROLE_COUNT) % ROLE_COUNT;
    const targetBaseAngle = -safeIndex * 90;
    const targetAngle = closestEquivalentAngle(rotation.value, targetBaseAngle);

    animateToAngle(targetAngle,safeIndex);
  };

  const snapToNearest = (projectedAngle:number) =>{
    "worklet";

    const targetAngle = Math.round(projectedAngle / 90) * 90;
    const index = indexFromSnapAngle(targetAngle);

    animateToAngle(targetAngle,index);
  };

  const panGesture = Gesture.Pan()
    .minDistance(2)
    .onBegin((event) => {
      const dx = event.x - WHEEL_RADIUS;
      const dy = event.y - WHEEL_RADIUS;
      
      startAngle.value = (Math.atan2(dy,dx) * 180) / Math.PI;
      startRotation.value = rotation.value;
    })
    .onUpdate((event) =>{
      const dx = event.x - WHEEL_RADIUS;
      const dy = event.y - WHEEL_RADIUS;

      const currentAngle = (Math.atan2(dy,dx) * 180) / Math.PI;
      const delta =  shortestDiff(currentAngle, startAngle.value);

      rotation.value = startRotation.value + delta;
    })
    .onEnd((event) =>{
      const dx = event.x - WHEEL_RADIUS;
      const dy = event.y - WHEEL_RADIUS;
      const radiusSquared = Math.max(dx * dx + dy * dy, 1);

      const angularVelocityRad = ( dx * event.velocityY - dy * event.velocityX) / radiusSquared;
      const angularVelocityDeg = (angularVelocityRad * 180) / Math.PI;

      const projectedAngle = rotation.value +angularVelocityDeg * 0.18;

      snapToNearest(projectedAngle);
    });

    const tapGesture = Gesture.Tap()
    .maxDistance(10)
    .onEnd((event) =>{
      const tappedIndex = roleIndexFromTouch(event.x,event.y,rotation.value);

      snapToIndex(tappedIndex);
    });

    const wheelGesture = Gesture.Exclusive(tapGesture,panGesture);

    const wheelStyle = useAnimatedStyle(() =>{
      return{
        transform:[{rotate:`${rotation.value}deg`}],
      };
    });

    const rotateRelative = (direction: -1 | 1) =>{
      const currentIndex = Math.max(
        0,
        ROLES.findIndex((role) => role.key === selectedRole)
      );

      const nextIndex = (currentIndex + direction + ROLE_COUNT) % ROLE_COUNT;

      runOnUI(snapToIndex)(nextIndex);
};

const handleContinue = () =>{
  router.push("/(auth)/register" as never);
};

 return (
  <GestureHandlerRootView style={styles.gestureRoot}>
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.brand}>REPLATE</Text>
          <Text style={styles.title}>Zgjidh vendin tënd</Text>
          <Text style={styles.subtitle}>Rrotullo ose prek një sektor</Text>
        </View>

        <View
          style={styles.wheelShell}
          accessible
          accessibilityRole="adjustable"
          accessibilityLabel="Zgjedhja e rolit"
          accessibilityValue={{ text: activeRole.title }}
          accessibilityActions={[
            { name: "decrement", label: "Roli i mëparshëm" },
            { name: "increment", label: "Roli tjetër" },
          ]}
          onAccessibilityAction={(event) => {
            if (event.nativeEvent.actionName === "increment") {
              rotateRelative(1);
            }

            if (event.nativeEvent.actionName === "decrement") {
              rotateRelative(-1);
            }
          }}
        >
          <Pressable
            onPress={() => rotateRelative(-1)}
            hitSlop={12}
            style={[styles.sideControl, styles.leftControl]}
            accessibilityRole="button"
            accessibilityLabel="Zgjidh rolin e mëparshëm"
          >
            <Ionicons name="chevron-back" size={20} color={COLORS.cream} />
          </Pressable>

          <GestureDetector gesture={wheelGesture}>
            <View style={styles.gestureBox}>
              <View style={styles.outerRing} />
              <View style={styles.outerRingSoft} />

              <Animated.View style={[styles.wheel, wheelStyle]}>
                {ROLES.map((role, index) => (
                  <WheelSector
                    key={role.key}
                    role={role}
                    index={index}
                    rotation={rotation}
                  />
                ))}
              </Animated.View>

              <View pointerEvents="none" style={styles.centerBadge}>
                <Text style={styles.centerText}>Replate</Text>
              </View>
            </View>
          </GestureDetector>

          <Pressable
            onPress={() => rotateRelative(1)}
            hitSlop={12}
            style={[styles.sideControl, styles.rightControl]}
            accessibilityRole="button"
            accessibilityLabel="Zgjidh rolin tjetër"
          >
            <Ionicons name="chevron-forward" size={20} color={COLORS.cream} />
          </Pressable>
        </View>

        <View style={styles.confirmCard}>
          <View style={styles.confirmIconBox}>
            <Ionicons name={activeRole.icon} size={23} color={COLORS.navyText} />
          </View>

          <View style={styles.confirmTextBlock}>
            <Text style={styles.confirmTitle}>{activeRole.title}</Text>
            <Text numberOfLines={1} style={styles.confirmDescription}>
              {activeRole.description}
            </Text>
          </View>
        </View>

        <Pressable
          onPress={handleContinue}
          style={({ pressed }) => [
            styles.primaryButton,
            pressed && styles.primaryButtonPressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel={`Vazhdo si ${activeRole.title}`}
        >
          <Text style={styles.primaryButtonText}>Vazhdo si {activeRole.title}</Text>
          <Ionicons name="arrow-forward" size={20} color={COLORS.navyText} />
        </Pressable>

        <Pressable
          onPress={() => router.push("/(auth)/login" as never)}
          hitSlop={10}
          style={styles.signInButton}
        >
          <Text style={styles.signInText}>
            Ke tashmë një llogari? <Text style={styles.signInLink}>Hyr</Text>
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  gestureRoot:{
    flex:1,
  },
  safeArea:{
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  container:{
    flex:1,
    backgroundColor:COLORS.bg,
    paddingHorizontal:20,
    paddingTop:12,
    paddingBottom:18,
  },
  header:{
    alignItems:"center",
    marginTop:8,
    marginBottom:28,
  },
  brand:{
    color:COLORS.brandMuted,
    fontSize:12,
    lineHeight:16,
    fontWeight:"800",
    letterSpacing:1,
    textTransform:"uppercase",
    marginBottom:8,
  },
  title:{
    color:COLORS.cream,
    fontSize:24,
    lineHeight:30,
    fontWeight:"600",
    letterSpacing: -0.3,
  },
  subtitle:{
    color:COLORS.muted,
    fontSize:13,
    lineHeight:18,
    fontWeight:"600",
    marginTop:4,
  },
  wheelShell:{
    width:330,
    height:330,
    alignSelf:"center",
    alignItems:"center",
    justifyContent:"center",
    marginTop:4,
  },

  gestureBox:{
    width: WHEEL_SIZE,
    height: WHEEL_SIZE,
    alignItems:"center",
    justifyContent:"center",
  },
  outerRing:{
    position:"absolute",
    width: WHEEL_SIZE + 24,
    height : WHEEL_SIZE + 24,
    borderRadius:(WHEEL_SIZE + 24) /2,
    borderWidth: 1,
    borderColor:"#2A3670",
  },
  outerRingSoft:{
    position:"absolute",
    width: WHEEL_SIZE + 42,
    height: WHEEL_SIZE + 42,
    borderRadius:(WHEEL_SIZE + 42) /2,
    borderWidth:1,
    borderColor:"rgba(122,133,196,0.18)",
  },
  wheel:{
    width: WHEEL_SIZE,
    height: WHEEL_SIZE,
    borderRadius:WHEEL_RADIUS,
    overflow:"hidden",
    borderWidth:1,
    borderColor:"#2A3670",
    backgroundColor:COLORS.sectorInactive,
  },
  sector:{
    position:"absolute",
    width:WHEEL_RADIUS,
    height:WHEEL_RADIUS,
    borderWidth:0.75,
    alignItems:"center",
    justifyContent:"center",
  },
  sectorTopRight:{
    top:0,
    right:0,
  },
  sectorBottomRight:{
    right:0,
    bottom:0,
  },
  sectorTopLeft:{
    top:0,
    left:0,
  },
  sectorBottomLeft:{
    left:0,
    bottom:0,
  },
  sectorContent:{
    width:"100%",
    height:"100%",
    alignItems:"center",
    justifyContent:"center",
    gap:7,
  },
  iconStack:{
    width:28,
    height:28,
    alignItems:"center",
    justifyContent:"center",
  },
  iconLayer:{
    ...StyleSheet.absoluteFillObject,
    alignItems:"center",
    justifyContent:"center",
  },
  sectorLabel:{
    fontSize:13,
    lineHeight:17,
    fontWeight:"800",
  },
  centerBadge:{
    position:"absolute",
    width:CENTER_SIZE,
    height:CENTER_SIZE,
    borderRadius:CENTER_SIZE / 2,
    backgroundColor:COLORS.bg,
    borderWidth:2,
    borderColor:COLORS.cream,
    alignItems:"center",
    justifyContent:"center",
  },
  centerText:{
    color:COLORS.cream,
    fontSize:14,
    lineHeight:18,
    fontWeight:"800",
  },
  sideControl:{
    position:"absolute",
    zIndex:20,
    width:38,
    height:38,
    borderRadius:19,
    backgroundColor:"rgba(246,241,231,0.08)",
    borderWidth: 1,
    borderColor:"rgba(246,241,231,0.16)",
    alignItems:"center",
    justifyContent:"center",
  },
  leftControl:{
    left:0,
  },
  rightControl:{
    right:0,
  },
  confirmCard:{
    minHeight:88,
    borderRadius:18,
    backgroundColor:COLORS.card,
    borderWidth:1,
    borderColor: COLORS.sectorBorder,
    marginTop:24,
    paddingHorizontal:18,
    paddingVertical:14,
    flexDirection:"row",
    alignItems:"center",
  },
  confirmIconBox:{
    width:50,
    height:50,
    borderRadius:15,
    backgroundColor: COLORS.cream,
    alignItems:"center",
    justifyContent:"center",
    marginRight:14,
  },
  confirmTextBlock:{
    flex: 1,
  },
  confirmTitle:{
    color:COLORS.cream,
    fontSize:18,
    lineHeight:24,
    fontWeight:"800",
  },
  confirmDescription:{
    color:COLORS.muted,
    fontSize:13,
    lineHeight:18,
    fontWeight:"600",
    marginTop:2,
  },
  primaryButton:{
    height:58,
    borderRadius:16,
    backgroundColor:COLORS.cream,
    alignItems:"center",
    justifyContent:"center",
    flexDirection:"row",
    gap:10,
    marginTop:18,
  },
  primaryButtonPressed:{
    transform:[{scale:0.985}],
    opacity:0.92,
  },
  primaryButtonText:{
    color: COLORS.navyText,
    fontSize:17,
    lineHeight:22,
    fontWeight:"800",
  },
  signInButton:{
    alignSelf:"center",
    marginTop:14,
    paddingVertical:6,
    paddingHorizontal:8,
  },
  signInText:{
    color:"rgba(246,241,231,0.68)",
    fontSize:14,
    fontWeight:"600",
  },
  signInLink:{
    color:COLORS.cream,
    fontWeight:"800",
  },
});

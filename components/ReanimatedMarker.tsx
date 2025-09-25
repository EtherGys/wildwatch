import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  BounceIn,
} from 'react-native-reanimated';

interface ReanimatedMarkerProps {
  children: React.ReactNode;
}

export default function ReanimatedMarker({ children }: ReanimatedMarkerProps) {
  const scale = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(1, {
      damping: 50,
      stiffness: 200,
    });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animatedStyle} >
      {children}
    </Animated.View>
  );
}

import React from 'react';
import {Pressable, PressableProps} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

export const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const AnimatedPressableSpring = ({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
  className: string;
} & PressableProps) => {
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{scale: scale.value}],
    };
  });

  return (
    <Animated.View style={animatedStyles}>
      <AnimatedPressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={animatedStyles}
        className={className}
        {...props}>
        {children}
      </AnimatedPressable>
    </Animated.View>
  );
};

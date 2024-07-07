import {View, Text, useColorScheme, Pressable} from 'react-native';
import React from 'react';
import {getColors, getTwColors} from '../../styles/styles';
import {ArrowLeft} from 'lucide-react-native';
import Animated, {FadeInUp} from 'react-native-reanimated';

interface PlainTopbarProps {
  title?: string;
  subtitle?: string;
  showBackButton?: boolean;
  backButtonAction?: () => void;
  children?: React.ReactNode;
}

export default function PlainTopbar(props: PlainTopbarProps) {
  const colorScheme = useColorScheme() || 'light';
  const twc = getTwColors(colorScheme);
  const color = getColors(colorScheme);

  return (
    <Animated.View entering={FadeInUp.delay(100).duration(100)}>
      <View className="z-10 pt-1 pb-1 bg-white dark:bg-zinc-950">
        <View
          className={`flex flex-row items-center w-full h-16 ${
            props.showBackButton ? 'px-3.5' : 'px-6'
          }`}>
          {props.showBackButton && (
            <Pressable
              onPress={props.backButtonAction}
              className={`mr-4 p-2 ${twc.button.opaque} aspect-square flex rounded-full justify-center`}>
              <ArrowLeft
                size={20}
                strokeWidth={1.5}
                color={color.icon.foreground}
              />
            </Pressable>
          )}
          <View className="flex-1">
            <Text
              className={`${twc.text.foreground} ${
                props.subtitle ? 'text-[17px]' : 'text-lg'
              } font-sans font-bold`}>
              {props.title ?? 'Pluto Health'}
            </Text>
            {props.subtitle && (
              <Text className={`${twc.text.muted} font-sans text-xs`}>
                {props.subtitle}
              </Text>
            )}
          </View>
          {props.children && <View>{props.children}</View>}
        </View>
      </View>
    </Animated.View>
  );
}

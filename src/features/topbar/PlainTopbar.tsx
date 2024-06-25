import {View, Text, useColorScheme, Pressable} from 'react-native';
import React from 'react';
import {getColors, getTwColors} from '../../styles/styles';
import {ArrowLeft} from 'lucide-react-native';

interface PlainTopbarProps {
  title?: string;
  subtitle?: string;
  showBackButton?: boolean;
  backButtonAction?: () => void;
}

export default function PlainTopbar(props: PlainTopbarProps) {
  const colorScheme = useColorScheme() || 'light';
  const twc = getTwColors(colorScheme);
  const color = getColors(colorScheme);

  return (
    <View
      className={`flex flex-row items-center w-full h-16 ${
        props.showBackButton ? 'px-3' : 'px-6'
      }`}>
      {props.showBackButton && (
        <Pressable
          onPress={props.backButtonAction}
          className={`mr-3 p-2 ${twc.button.opaque} aspect-square flex rounded-full justify-center`}>
          <ArrowLeft size={24} color={color.icon.foreground} />
        </Pressable>
      )}
      <View>
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
    </View>
  );
}

import {View, Text, useColorScheme} from 'react-native';
import React from 'react';
import {getColors} from '../../styles';

export default function PlainTopbar() {
  const colorScheme = useColorScheme() || 'light';
  const colors = getColors(colorScheme);

  return (
    <View className="flex justify-center w-full h-16 px-6 place-items-center">
      <Text className={`${colors.text.primary} text-lg font-bold`}>
        Pluto Health
      </Text>
    </View>
  );
}

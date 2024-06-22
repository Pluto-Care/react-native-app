import {getColors} from '@src/styles/styles';
import React from 'react';
import {Pressable, Text, View, useColorScheme} from 'react-native';

type Props = {
  whenOn: () => void;
  whenOff: () => void;
  isToggled?: boolean;
  iconOn: React.ReactNode;
  iconOff: React.ReactNode;
  text?: string;
};

export default function CallToggleButton(props: Props) {
  const theme = useColorScheme();
  const colors = getColors(theme || 'light');
  const [isToggled, setIsToggled] = React.useState(false);

  const handlePress = () => {
    setIsToggled(isToggled => {
      if (isToggled) {
        props.whenOff();
      } else {
        props.whenOn();
      }
      return !isToggled;
    });
  };

  return (
    <View className="w-16">
      <Pressable
        onPress={handlePress}
        className={`${
          isToggled ? colors.bg.accent : colors.bg.muted
        } rounded-full h-16 w-16 flex items-center justify-center`}>
        {isToggled ? props.iconOn : props.iconOff}
      </Pressable>
      {props.text && (
        <Text
          className={`text-center ${
            colors.text.foreground
          } font-sans text-xs mt-1 ${isToggled && 'font-bold'}`}>
          {props.text}
        </Text>
      )}
    </View>
  );
}

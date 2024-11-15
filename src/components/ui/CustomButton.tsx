import {Text, Pressable, View} from 'react-native';
import React from 'react';

type PButton_Props = {
  onClick?: () => void;
  text: string;
  style: PButton_Style;
  width: 'full' | 'auto';
  noRoundedCorners?: boolean;
  icon?: React.ReactNode;
};

type PButton_Style =
  | 'accent'
  | 'accent_hollow'
  | 'primary'
  | 'primary_hollow'
  | 'accent_hollow_no_border';
const styles: {[key in PButton_Style]: {pressable: string; text: string}} = {
  accent: {
    pressable:
      'bg-accent-foreground border border-accent-foreground active:bg-accent-foreground/90 hover:bg-accent-foreground/90',
    text: 'text-white dark:text-black',
  },
  accent_hollow: {
    pressable:
      'bg-transparent border border-accent-600 text-accent-700 dark:text-accent-400 active:bg-accent-500/10 hover:bg-accent-500/10',
    text: 'text-accent-600 dark:text-accent-400',
  },
  primary: {
    pressable:
      'bg-black dark:bg-white border border-black dark:border-whtie active:bg-zinc-800 hover:bg-zinc-800 dark:active:bg-zinc-200 dark:hover:bg-zinc-200',
    text: 'text-white dark:text-black',
  },
  primary_hollow: {
    pressable:
      'bg-transparent border border-black dark:border-white text-black dark:text-white active:bg-zinc-500/10 hover:bg-zinc-500/10',
    text: 'text-black dark:text-white',
  },
  accent_hollow_no_border: {
    pressable:
      'bg-transparent dark:bg-zinc-950 text-gray-400 dark:text-gray-600 active:bg-gray-200 hover:bg-gray-200 dark:active:bg-gray-700 dark:hover:bg-gray-700',
    text: 'text-accent-600 dark:text-accent-300',
  },
};

const baseStyle = {
  pressable: 'py-2.5 px-4 shadow-lg',
  text: 'items-center flex gap-3 justify-center flex-row',
};

const CustomButton = (props: PButton_Props) => {
  const width = props.width === 'full' ? 'w-full' : 'w-auto';

  if (styles[props.style] === undefined) {
    styles[props.style] = styles.accent_hollow;
  }

  return (
    <Pressable
      className={`${styles[props.style].pressable} ${
        baseStyle.pressable
      } ${width} ${props.noRoundedCorners ? '' : 'rounded-md'}`}
      onPress={props.onClick}>
      <View className={`${styles[props.style].text} ${baseStyle.text}`}>
        {props.icon}
        <Text
          className={`${
            styles[props.style].text
          } text-base font-sans-semibold font-medium`}>
          {props.text}
        </Text>
      </View>
    </Pressable>
  );
};

export default CustomButton;

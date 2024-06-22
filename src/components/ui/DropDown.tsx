import {getColors} from '@src/styles/styles';
import React from 'react';
import {Pressable, View, useColorScheme} from 'react-native';

const DropDownContext = React.createContext({
  open: false,
  setOpen: (open: boolean) => {},
});

export function DropDown({children, ...props}: {children: React.ReactNode}) {
  const [open, setOpen] = React.useState(false);

  return (
    <DropDownContext.Provider value={{open, setOpen}}>
      <View {...props}>
        <View>{children}</View>
      </View>
    </DropDownContext.Provider>
  );
}

/**
 * DropDownTrigger
 */

export interface DropDownTriggerProps
  extends React.ComponentProps<typeof Pressable> {
  children: React.ReactNode;
}

export function DropDownTrigger({children, ...props}: DropDownTriggerProps) {
  const context = React.useContext(DropDownContext);

  return (
    <Pressable
      onPress={() => {
        context.setOpen(!context.open);
      }}
      {...props}>
      {children}
    </Pressable>
  );
}

/**
 * DropDownContent
 */

export interface DropDownContentProps
  extends React.ComponentProps<typeof View> {
  children: React.ReactNode;
}

export function DropDownContent({
  children,
  className,
  ...props
}: DropDownContentProps) {
  const context = React.useContext(DropDownContext);
  const theme = useColorScheme();
  const colors = getColors(theme || 'light');

  return context.open ? (
    <View
      className={`absolute shadow min-w-[140px] top-0 right-0 z-50 ${colors.border.gray} border ${colors.bg.body} rounded ${className}`}
      {...props}>
      {children}
    </View>
  ) : (
    <></>
  );
}

/**
 * DropDownItem
 */

export interface DropDownItemProps
  extends React.ComponentProps<typeof Pressable> {
  closeOnPress?: boolean;
  children: React.ReactNode;
}

export function DropDownItem({
  children,
  closeOnPress = true,
  className,
  onPress,
  ...props
}: DropDownItemProps) {
  const context = React.useContext(DropDownContext);
  const theme = useColorScheme();
  const colors = getColors(theme || 'light');

  return (
    <Pressable
      className={`py-2.5 px-4 w-full ${colors.button.opaque} ${colors.border.gray} ${className}`}
      onPress={e => {
        if (closeOnPress) {
          context.setOpen(false);
        }
        onPress && onPress(e);
      }}
      {...props}>
      {children}
    </Pressable>
  );
}

/**
 * DropDownSeparator
 */

export function DropDownSeparator() {
  const theme = useColorScheme();
  const colors = getColors(theme || 'light');

  return <View className={`h-px ${colors.border.gray} border-b`} />;
}

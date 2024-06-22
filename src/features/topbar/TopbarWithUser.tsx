import {View, Text, useColorScheme, Platform, Pressable} from 'react-native';
import React, {ReactElement, ReactNode} from 'react';
import {getColors} from '../../styles/styles';
import {SignedIn, SignedOut, useAuth, useSignOut} from '../../contexts/auth';
import LinearGradient from 'react-native-linear-gradient';
import {MenuView} from '@react-native-menu/menu';
import {
  DropDown,
  DropDownContent,
  DropDownItem,
  DropDownSeparator,
  DropDownTrigger,
} from '@src/components/ui/DropDown';
import {LogOutIcon} from 'lucide-react-native';
import CustomButton from '@src/components/ui/CustomButton';

export default function UserTopbar({navigation}: {navigation: any}) {
  const colorScheme = useColorScheme() || 'light';
  const colors = getColors(colorScheme);
  const context = useAuth();
  const {signOut} = useSignOut();

  return (
    <>
      <SignedIn>
        <View className="flex flex-row items-center w-full h-16 px-6 place-items-center">
          <View className="flex-1">
            <Text className={`${colors.text.foreground} text-lg font-bold`}>
              Pluto Health
            </Text>
          </View>
          <View>
            <DropDown>
              <DropDownTrigger
                className={`flex flex-row items-center px-1 py-1 border rounded-full h-min ${colors.border.gray} ${colors.button.opaque}`}>
                <View className="pl-2.5 pr-3">
                  <Text
                    className={`${colors.text.muted} text-xs font-medium text-right`}>
                    {context.user?.detail.email}
                  </Text>
                </View>
                <View className="w-6 h-6 rounded-full bg-accent-600">
                  <LinearGradient
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 1}}
                    colors={
                      colorScheme === 'light'
                        ? ['#ffedd5', '#e5f4ff', '#f3e8ff']
                        : ['#ce653b', '#2b0948']
                    }
                    className="flex items-center justify-center h-full rounded-full">
                    <Text
                      className={`text-xs font-medium text-center ${colors.text.foreground} opacity-50`}>
                      {context.user?.detail.first_name?.charAt(0).toUpperCase()}
                      {context.user?.detail.last_name?.charAt(0).toUpperCase()}
                    </Text>
                  </LinearGradient>
                </View>
              </DropDownTrigger>
              <DropDownContent className="mt-10">
                <DropDownItem
                  className="flex flex-row items-center"
                  onPress={() => {
                    signOut();
                  }}>
                  <LogOutIcon size={14} className={colors.text.foreground} />
                  <Text
                    className={`${colors.text.foreground} pl-2 font-sans-semibold text-sm`}>
                    Logout
                  </Text>
                </DropDownItem>
              </DropDownContent>
            </DropDown>
          </View>
        </View>
      </SignedIn>
      <SignedOut>
        <LinearGradient
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          colors={
            colorScheme === 'light'
              ? ['#ffedd5', '#e5f4ff', '#f3e8ff']
              : ['#ce653b', '#2b0948']
          }
          className="h-full">
          <View className="flex flex-col justify-center w-full min-h-screen px-6 place-items-center">
            <View
              className={`${colors.border.gray} border rounded-md p-4 ${colors.bg.muted}`}>
              <Text
                className={`text-2xl mb-4 font-bold ${colors.text.foreground}`}>
                Logged Out!
              </Text>
              <Text className={`mb-6 ${colors.text.foreground} leading-6`}>
                You are not signed in. Please sign in to access the application.
              </Text>
              <CustomButton
                onClick={() => {
                  navigation.replace('Login');
                }}
                text="Login"
                style="accent"
                width="full"
              />
            </View>
          </View>
        </LinearGradient>
      </SignedOut>
    </>
  );
}

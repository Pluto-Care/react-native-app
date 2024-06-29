import {View, Text, useColorScheme, Pressable} from 'react-native';
import React from 'react';
import {getColors, getTwColors} from '@src/styles/styles';
import {SignedIn, SignedOut, useAuth, useSignOut} from '@src/contexts/auth';
import LinearGradient from 'react-native-linear-gradient';
import {Bell, LogOutIcon, MoreVertical} from 'lucide-react-native';
import CustomButton from '@src/components/ui/CustomButton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@src/components/ui/dropdown-menu';
import Animated, {FadeInUp} from 'react-native-reanimated';

export default function UserTopbar({navigation}: {navigation: any}) {
  const colorScheme = useColorScheme() || 'light';
  const twc = getTwColors(colorScheme);
  const color = getColors(colorScheme);
  const context = useAuth();
  const {signOut} = useSignOut();

  return (
    <>
      <SignedIn>
        <Animated.View entering={FadeInUp.delay(150)}>
          <View className="flex flex-row items-center w-full h-16 px-6 mt-2 place-items-center">
            <View className="flex-1">
              <View className="flex flex-row items-center h-min">
                <View className="overflow-hidden rounded-full size-10 bg-accent-600">
                  <LinearGradient
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 1}}
                    colors={
                      colorScheme === 'light'
                        ? ['#ffedd5', '#e5f4ff', '#f3e8ff']
                        : ['#ce653b', '#2b0948']
                    }
                    className="items-center justify-center h-full rounded-full size-10">
                    <Text className="text-xs font-medium text-center text-black/50 dark:text-white/50">
                      {context.user?.detail.first_name?.charAt(0).toUpperCase()}
                      {context.user?.detail.last_name?.charAt(0).toUpperCase()}
                    </Text>
                  </LinearGradient>
                </View>
                <View className="pl-3 pr-3 -mt-px">
                  <Text className="text-[15px] font-bold text-foreground">
                    Hello, {context.user?.detail.first_name}
                  </Text>
                  <Text className="text-[11px] text-muted-foreground">
                    Welcome Back
                  </Text>
                </View>
              </View>
            </View>
            <View className="flex flex-row gap-1">
              <Pressable className="flex items-center justify-center rounded-full size-10 active:bg-muted">
                <Bell
                  size={18}
                  strokeWidth={2.25}
                  color={color.icon.foreground}
                />
              </Pressable>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Pressable className="flex items-center justify-center rounded-full size-10 active:bg-muted">
                    <MoreVertical
                      fill={color.icon.foreground}
                      size={18}
                      strokeWidth={3}
                      color={color.icon.foreground}
                    />
                  </Pressable>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="z-50 mx-6">
                  <DropdownMenuGroup>
                    <DropdownMenuItem closeOnPress={true}>
                      <Pressable
                        className="flex flex-row items-center"
                        onPress={() => {
                          signOut();
                        }}>
                        <LogOutIcon size={14} color={color.icon.foreground} />
                        <Text
                          className={`${twc.text.foreground} pl-2 font-sans-semibold text-sm`}>
                          Logout
                        </Text>
                      </Pressable>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </View>
          </View>
        </Animated.View>
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
              className={`${twc.border.gray} border rounded-md p-4 ${twc.bg.muted}`}>
              <Text
                className={`text-2xl mb-4 font-bold ${twc.text.foreground}`}>
                Logged Out!
              </Text>
              <Text className={`mb-6 ${twc.text.foreground} leading-6`}>
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

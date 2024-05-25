import {View, Text, useColorScheme} from 'react-native';
import React from 'react';
import {getColors} from '../../styles';
import {SignedIn, useAuth} from '../../contexts/auth';

export default function UserTopbar() {
  const colorScheme = useColorScheme() || 'light';
  const colors = getColors(colorScheme);
  const context = useAuth();

  return (
    <SignedIn>
      <View className="flex flex-row justify-center w-full h-16 px-6 place-items-center">
        <View>
          <Text className={`${colors.text.primary} text-lg font-bold`}>
            Pluto Health
          </Text>
        </View>
        <View className="flex flex-row gap-1 border rounded-full h-min border-zinc-200">
          <Text className="text-zinc-600 dark:text-zinc-300">
            {context.user?.detail.first_name}
          </Text>
        </View>
      </View>
    </SignedIn>
  );
}

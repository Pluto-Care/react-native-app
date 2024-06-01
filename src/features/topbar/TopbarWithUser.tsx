import {View, Text, useColorScheme, Platform} from 'react-native';
import React, {ReactElement, ReactNode} from 'react';
import {getColors} from '../../styles/styles';
import {SignedIn, useAuth} from '../../contexts/auth';
import LinearGradient from 'react-native-linear-gradient';
import {MenuView} from '@react-native-menu/menu';

export default function UserTopbar() {
  const colorScheme = useColorScheme() || 'light';
  const colors = getColors(colorScheme);
  const context = useAuth();

  return (
    <SignedIn>
      <View className="flex flex-row items-center w-full h-16 px-6 place-items-center">
        <View className="flex-1">
          <Text className={`${colors.text.foreground} text-lg font-bold`}>
            Pluto Health
          </Text>
        </View>
        <View>
          <ProfileBadgeMenu>
            <View
              className={`flex flex-row items-center px-1 py-1 border rounded-full h-min ${colors.border.gray}`}>
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
                  <Text className="text-xs font-medium text-center text-white/40">
                    {context.user?.detail.first_name?.charAt(0).toUpperCase()}
                    {context.user?.detail.last_name?.charAt(0).toUpperCase()}
                  </Text>
                </LinearGradient>
              </View>
            </View>
          </ProfileBadgeMenu>
        </View>
      </View>
    </SignedIn>
  );
}

function ProfileBadgeMenu(props: {children: ReactNode}): ReactElement {
  return (
    <View>
      <MenuView
        title="Menu Title"
        onPressAction={({nativeEvent}) => {
          console.warn(JSON.stringify(nativeEvent));
        }}
        actions={[
          {
            id: 'add',
            title: 'Add',
            titleColor: '#2367A2',
            image: Platform.select({
              ios: 'plus',
              android: 'ic_menu_add',
            }),
            imageColor: '#2367A2',
            subactions: [
              {
                id: 'nested1',
                title: 'Nested action',
                titleColor: 'rgba(250,180,100,0.5)',
                subtitle: 'State is mixed',
                image: Platform.select({
                  ios: 'heart.fill',
                  android: 'ic_menu_today',
                }),
                imageColor: 'rgba(100,200,250,0.3)',
                state: 'mixed',
              },
              {
                id: 'nestedDestructive',
                title: 'Destructive Action',
                attributes: {
                  destructive: true,
                },
                image: Platform.select({
                  ios: 'trash',
                  android: 'ic_menu_delete',
                }),
              },
            ],
          },
          {
            id: 'share',
            title: 'Share Action',
            titleColor: '#46F289',
            subtitle: 'Share action on SNS',
            image: Platform.select({
              ios: 'square.and.arrow.up',
              android: 'ic_menu_share',
            }),
            imageColor: '#46F289',
            state: 'on',
          },
          {
            id: 'destructive',
            title: 'Destructive Action',
            attributes: {
              destructive: true,
            },
            image: Platform.select({
              ios: 'trash',
              android: 'ic_menu_delete',
            }),
          },
        ]}
        shouldOpenOnLongPress={false}>
        <View>{props.children}</View>
      </MenuView>
    </View>
  );
}

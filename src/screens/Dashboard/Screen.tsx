import {View, Text, useColorScheme} from 'react-native';
import React from 'react';
import {SignedIn, useAuth, useSignOut} from '../../contexts/auth';
import UserTopbar from '../../features/topbar/TopbarWithUser';
import {useMakeOutgoingCall} from '../../hooks/twilio/useMakeOutgoingCall';
import CustomButton from '../../components/ui/CustomButton';
import {getColors} from '../../styles/styles';

export default function DashboardScreen({navigation}: {navigation: any}) {
  const colorScheme = useColorScheme() || 'light';
  const colors = getColors(colorScheme);
  const context = useAuth();
  const {signOut} = useSignOut();
  const {makeCall} = useMakeOutgoingCall(
    context.user?.session.key || '',
    '+17782339602',
    'number',
  );

  return (
    <SignedIn>
      <View className={`${colors.bg.body} min-h-screen`}>
        <UserTopbar />
        <View className="flex flex-col gap-4 px-6 py-6">
          <Text>DashboardScreen</Text>
          <View>
            <CustomButton
              text="Start Call"
              style="accent"
              width="full"
              onClick={() => {
                try {
                  makeCall();
                } catch (err: any) {
                  console.log(err);
                }
              }}
            />
            <CustomButton
              text="End Call"
              style="accent"
              width="full"
              onClick={() => {
                // router.push('/dashboard');
              }}
            />
            <View className="py-4" />
            <CustomButton
              text="Sign Out"
              style="accent_hollow"
              width="full"
              onClick={() => {
                signOut().then(() => {
                  navigation.navigate('Login');
                });
              }}
            />
          </View>
        </View>
      </View>
    </SignedIn>
  );
}

import {View, Text} from 'react-native';
import React from 'react';
import {SignedIn, useAuth, useSignOut} from '../../contexts/auth';
import UserTopbar from '../../features/topbar/TopbarWithUser';
import {useMakeOutgoingCall} from '../../hooks/twilio/useMakeOutgoingCall';
import CustomButton from '../../components/ui/CustomButton';

export default function DashboardScreen({navigation}: {navigation: any}) {
  const context = useAuth();
  const {signOut} = useSignOut();
  const {makeCall} = useMakeOutgoingCall(
    context.user?.session.key,
    '+17782339602',
    'number',
  );

  return (
    <SignedIn>
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
            style="accent_hollow"
            width="full"
            onClick={() => {
              // router.push('/dashboard');
            }}
          />
        </View>
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
    </SignedIn>
  );
}

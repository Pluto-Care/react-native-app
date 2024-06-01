import {ScrollView, Text, View, useColorScheme} from 'react-native';
import React from 'react';
import {SignedIn, useAuth, useSignOut} from '../../contexts/auth';
import UserTopbar from '../../features/topbar/TopbarWithUser';
import {useMakeOutgoingCall} from '../../hooks/twilio/useMakeOutgoingCall';
import CustomButton from '../../components/ui/CustomButton';
import {getColors} from '../../styles/styles';
import {CalendarProvider, WeekCalendar} from 'react-native-calendars';
import {ChevronRight, CircleUser} from 'lucide-react-native';

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
        <View className="h-[84px]">
          <CalendarProvider date={new Date().toDateString()} showTodayButton>
            <WeekCalendar
              onDayPress={day => {
                console.log('selected day', day);
              }}
            />
          </CalendarProvider>
        </View>
        <ScrollView className={`${colors.bg.muted}`}>
          <View className="my-6">
            <Text
              className={`${colors.text.foreground} text-lg font-bold px-6`}>
              Assigned Clients
            </Text>
          </View>
          <View className="w-full">
            <View
              className={`w-full flex items-center px-4 py-3 border-t border-b ${colors.border.gray} flex-row ${colors.bg.body}`}>
              <CircleUser size={24} color={'black'} />
              <View className="flex flex-col flex-1 px-5">
                <Text className={`${colors.text.foreground} text-base `}>
                  John Doe
                </Text>
                <Text className={`${colors.text.muted} text-sm`}>
                  +1 (123) 456-7890
                </Text>
              </View>
              <Text className="pr-4 ">1:00 PM</Text>
              <ChevronRight size={24} color={'black'} />
            </View>
          </View>
          <View className="flex flex-col gap-4 px-6 py-6">
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
        </ScrollView>
      </View>
    </SignedIn>
  );
}

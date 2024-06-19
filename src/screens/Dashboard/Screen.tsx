import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
  useColorScheme,
} from 'react-native';
import React from 'react';
import {SignedIn, useAuth, useSignOut} from '../../contexts/auth';
import UserTopbar from '../../features/topbar/TopbarWithUser';
import {useMakeOutgoingCall} from '../../hooks/twilio/useMakeOutgoingCall';
import CustomButton from '../../components/ui/CustomButton';
import {getColors} from '../../styles/styles';
import {CalendarProvider, WeekCalendar} from 'react-native-calendars';
import {ChevronRight, CircleUser, Loader2} from 'lucide-react-native';
import {useMutation} from '@tanstack/react-query';
import axios from 'axios';
import {BACKEND_URL} from '../../config/common';
import {timePretty} from '../../utils/timeUtils';
import {formatPhoneNumber} from '../../utils/formatPhoneNumber';

export default function DashboardScreen({navigation}: {navigation: any}) {
  const theme = useColorScheme();
  const {user} = useAuth();
  const colorScheme = useColorScheme() || 'light';
  const colors = getColors(colorScheme);
  const context = useAuth();
  const [date, setDate] = React.useState(new Date().toDateString());
  const [appointments, setAppointments] = React.useState<any[]>([]);
  const {signOut} = useSignOut();
  const {makeCall} = useMakeOutgoingCall(
    context.user?.session.key || '',
    '+17782339602',
    'number',
  );

  const dateAppointmentMutation = useMutation({
    mutationKey: ['dateAppointment'],
    mutationFn: async (date: string) =>
      user
        ? await axios.get(
            `${BACKEND_URL}/api/scheduling/appointments/my/list/${date}/`,
            {
              headers: {
                'Content-Type': 'application/json',
                'X-Requested-By': 'expo',
                Authorization: 'Bearer ' + user.session.key,
              },
            },
          )
        : null,
    onSuccess: response => {
      setAppointments(response?.data.data);
    },
    onError: error => {
      console.log(error);
    },
  });

  if (dateAppointmentMutation.isIdle && user) {
    let date = new Date();
    const formattedDate = `${
      date.getMonth() + 1
    }-${date.getDate()}-${date.getFullYear()}`; // MM-DD-YYYY
    dateAppointmentMutation.mutate(formattedDate);
  }

  return (
    <SignedIn>
      <View className={`${colors.bg.body} min-h-screen`}>
        <UserTopbar />
        <View className="h-[84px]">
          <CalendarProvider date={new Date().toDateString()} showTodayButton>
            <WeekCalendar
              onDayPress={day => {
                let date = day.dateString.split('-');
                const formattedDate = `${date[1]}-${date[2]}-${date[0]}`; // MM-DD-YYYY
                setDate(
                  new Date(day.dateString)
                    .toUTCString()
                    .split(' ')
                    .slice(0, 4)
                    .join(' '),
                );
                dateAppointmentMutation.mutate(formattedDate);
              }}
            />
          </CalendarProvider>
        </View>
        <ScrollView className={`${colors.bg.muted}`}>
          <View className="flex flex-row items-center my-6">
            <Text
              className={`${colors.text.foreground} flex-1 text-lg font-bold px-6`}>
              Assigned Clients
            </Text>
            <Text className={`${colors.text.muted} text-sm px-6`}>{date}</Text>
          </View>
          {dateAppointmentMutation.isPending ? (
            <View className="flex items-center w-full">
              <ActivityIndicator
                size="large"
                color={theme === 'light' ? 'black' : 'white'}
              />
            </View>
          ) : dateAppointmentMutation.isSuccess ? (
            appointments.length === 0 ? (
              <View className="w-full">
                <Text className={`${colors.text.muted} text-sm px-6`}>
                  No appointments found for the selected date.
                </Text>
              </View>
            ) : (
              appointments.map((appointment, index) => (
                <Pressable
                  className={`w-full ${colors.bg.body} ${
                    theme === 'light'
                      ? 'active:bg-zinc-100'
                      : 'active:bg-zinc-800'
                  }`}
                  key={index}>
                  <View
                    className={`w-full flex items-center px-4 py-3 border-t border-b ${colors.border.gray} flex-row`}>
                    <CircleUser
                      size={28}
                      strokeWidth={1.5}
                      className={`${colors.text.muted}`}
                    />
                    <View className="flex flex-col flex-1 px-5">
                      <Text className={`${colors.text.foreground} text-base `}>
                        {appointment.patient.first_name}{' '}
                        {appointment.patient.last_name}
                      </Text>
                      <Text className={`${colors.text.muted} text-sm`}>
                        +1 {formatPhoneNumber(appointment.patient.phone)}
                      </Text>
                    </View>
                    <Text className={`${colors.text.muted} pr-4 uppercase`}>
                      {timePretty(appointment.start_time)}
                    </Text>
                    <ChevronRight
                      size={24}
                      className={`${colors.text.foreground}`}
                    />
                  </View>
                </Pressable>
              ))
            )
          ) : dateAppointmentMutation.isError ? (
            <Text>Failed to load appointments</Text>
          ) : (
            <></>
          )}
        </ScrollView>
      </View>
    </SignedIn>
  );
}

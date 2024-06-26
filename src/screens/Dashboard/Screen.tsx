import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  View,
  useColorScheme,
} from 'react-native';
import axios from 'axios';
import React from 'react';
import {SignedIn, useAuth} from '@src/contexts/auth';
import UserTopbar from '@src/features/topbar/TopbarWithUser';
import {getColors, getTwColors} from '@src/styles/styles';
import {CalendarProvider, WeekCalendar} from 'react-native-calendars';
import {
  CalendarClock,
  ChevronRight,
  CircleUser,
  Clock,
  Plus,
} from 'lucide-react-native';
import {useMutation} from '@tanstack/react-query';
import {BACKEND_URL} from '@src/config/common';
import {timePretty} from '@src/utils/timeUtils';
import {formatPhoneNumber} from '@src/utils/formatPhoneNumber';
import {Text} from '@src/components/ui/text';
import Animated, {FadeInRight} from 'react-native-reanimated';
import {Button} from '@src/components/ui/button';
import {Badge} from '@src/components/ui/badge';

type AppointmentType = {
  assigned_to: {
    first_name: string;
    last_name: string;
    id: String;
  };
  created_at: string;
  created_by: {
    first_name: string;
    last_name: string;
    id: String;
  };
  end_time: string | null;
  end_time_expected: string;
  id: string;
  logs: any[];
  organization: string;
  patient: {
    first_name: string;
    last_name: string;
    id: string;
    phone: string;
    email: string;
  };
  reason: string;
  start_time: string;
  status: string;
  type: string;
  updated_at: string;
  updated_by: {
    first_name: string;
    last_name: string;
    id: string;
  } | null;
};

export default function DashboardScreen({navigation}: {navigation: any}) {
  const theme = useColorScheme();
  const {user} = useAuth();
  const colorScheme = useColorScheme() || 'light';
  const twc = getTwColors(colorScheme);
  const color = getColors(colorScheme);
  const [date, setDate] = React.useState(new Date().toDateString());
  const [appointments, setAppointments] = React.useState<AppointmentType[]>([]);
  const [nextApt, setNextApt] = React.useState<AppointmentType | null>(null);

  const dateAppointmentMutation = useMutation({
    mutationKey: ['dateAppointment'],
    mutationFn: async (d: string) =>
      user
        ? await axios.get(
            `${BACKEND_URL}/api/scheduling/appointments/my/date/${d}/`,
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
      setAppointments(response?.data.data as AppointmentType[]);
      // Find next appointment due
      const nextAppointment = response?.data.data.find(
        (appointment: AppointmentType) =>
          new Date(appointment.start_time) > new Date(),
      );
      setNextApt(nextAppointment);
    },
    onError: error => {
      console.log(error);
    },
  });

  if (dateAppointmentMutation.isIdle && user) {
    let d = new Date();
    const formattedDate = `${
      d.getMonth() + 1
    }-${d.getDate()}-${d.getFullYear()}`; // MM-DD-YYYY
    dateAppointmentMutation.mutate(formattedDate);
  }

  return (
    <View className={`${twc.bg.body} min-h-screen`}>
      <UserTopbar navigation={navigation} />
      <SignedIn>
        <View className="h-[84px]">
          <CalendarProvider date={new Date().toDateString()}>
            <WeekCalendar
              onDayPress={day => {
                let d = day.dateString.split('-');
                const formattedDate = `${d[1]}-${d[2]}-${d[0]}`; // MM-DD-YYYY
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
        <ScrollView className={`${twc.bg.muted}`}>
          {nextApt ? (
            <>
              <View className="w-full gap-6 px-6 my-6">
                <View className="flex flex-row items-center">
                  <View className="flex-1">
                    <Text
                      className={`${twc.text.foreground} text-base font-bold`}>
                      Upcoming Appointment
                    </Text>
                    <Text className="mt-px text-sm text-muted-foreground">
                      {date}
                    </Text>
                  </View>
                  <Button
                    variant={'accent'}
                    size={'sm'}
                    className="flex flex-row gap-1.5 rounded-xl">
                    <Plus
                      size={14}
                      strokeWidth={2.5}
                      color={color.icon.accent}
                    />
                    <Text>Add</Text>
                  </Button>
                </View>
                <Animated.View entering={FadeInRight.duration(200)}>
                  <View
                    className="px-4 pt-3 pb-5 rounded-2xl bg-accent-foreground"
                    style={{
                      shadowColor: '#000',
                      shadowOffset: {
                        width: 0,
                        height: 2,
                      },
                      shadowOpacity: 0.25,
                      shadowRadius: 3.84,
                      elevation: 4,
                    }}>
                    <Pressable className="flex flex-row px-3 py-2 -mx-2 rounded-xl active:bg-white/10">
                      <Text className="flex-1 font-bold tracking-wide text-white">
                        Appointment
                      </Text>
                      <View className="flex flex-row items-center gap-2">
                        <Badge
                          variant={
                            nextApt.status === 'cancelled'
                              ? 'destructive'
                              : 'secondary'
                          }>
                          <Text>{nextApt.status}</Text>
                        </Badge>
                        <ChevronRight size={24} color={color.icon.white} />
                      </View>
                    </Pressable>
                    <View className="flex flex-row items-center gap-3 mt-3 opacity-80">
                      <CalendarClock
                        size={16}
                        strokeWidth={2.5}
                        color={color.icon.white}
                      />
                      <Text className="text-[13px] font-medium text-white">
                        {timePretty(nextApt.start_time)} —{' '}
                        {timePretty(nextApt.end_time_expected)}
                      </Text>
                    </View>
                    <View className="flex flex-row items-center gap-3 mt-2 opacity-80">
                      <Clock
                        size={16}
                        strokeWidth={2.5}
                        color={color.icon.white}
                      />
                      <Text className="text-[13px] font-medium text-white">
                        Duration:{' '}
                        {(new Date(nextApt.end_time_expected).getTime() -
                          new Date(nextApt.start_time).getTime()) /
                          1000 /
                          60}{' '}
                        mins
                      </Text>
                    </View>
                    <View
                      className="flex flex-row items-center gap-3 px-4 py-2.5 mt-4 -mx-1 -mb-1.5 shadow rounded-xl bg-primary-foreground"
                      style={{
                        shadowColor: '#000',
                        shadowOffset: {
                          width: 0,
                          height: 2,
                        },
                        shadowOpacity: 0.25,
                        shadowRadius: 3.84,
                        elevation: 4,
                      }}>
                      <View className="flex-1">
                        <Text className="font-bold text-primary">
                          {nextApt.patient.first_name}{' '}
                          {nextApt.patient.last_name}
                        </Text>
                        <Text className="text-[12px] text-primary opacity-60">
                          Requested: {nextApt.type}
                        </Text>
                      </View>
                      <Button
                        variant={'ghost'}
                        size={'md'}
                        className="px-1 py-1 rounded-xl bg-primary/5">
                        <Text>View Details</Text>
                      </Button>
                    </View>
                  </View>
                </Animated.View>
              </View>
            </>
          ) : (
            <></>
          )}
          <View className="flex flex-row items-center my-6">
            <Text
              className={`${twc.text.foreground} flex-1 text-base font-bold px-6`}>
              Following Appointments
            </Text>
            <Text className={`${twc.text.muted} text-sm px-6`}>{date}</Text>
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
                <Text className={`${twc.text.muted} text-sm px-6`}>
                  No appointments found for the selected date.
                </Text>
              </View>
            ) : (
              appointments.map((appointment, index) => (
                <Pressable
                  className={`w-full ${twc.bg.body} ${
                    theme === 'light'
                      ? 'active:bg-zinc-100'
                      : 'active:bg-zinc-800'
                  }`}
                  onPress={() => {
                    navigation.push('Appointment', {
                      id: appointment.id,
                    });
                  }}
                  key={index}>
                  <View
                    className={`w-full flex items-center px-4 py-3 border-t border-b ${twc.border.gray} flex-row`}>
                    <CircleUser
                      size={28}
                      strokeWidth={1.5}
                      color={color.icon.muted}
                    />
                    <View className="flex flex-col flex-1 px-5">
                      <Text className={`${twc.text.foreground} text-base `}>
                        {appointment.patient.first_name}{' '}
                        {appointment.patient.last_name}
                      </Text>
                      <Text className={`${twc.text.muted} text-sm`}>
                        +1 {formatPhoneNumber(appointment.patient.phone)}
                      </Text>
                    </View>
                    <Text className={`${twc.text.muted} pr-4 uppercase`}>
                      {timePretty(appointment.start_time)}
                    </Text>
                    <ChevronRight size={24} color={color.icon.muted} />
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
      </SignedIn>
    </View>
  );
}

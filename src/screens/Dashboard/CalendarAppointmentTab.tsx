import {Pressable, ScrollView, View, useColorScheme} from 'react-native';
import axios from 'axios';
import React from 'react';
import {SignedIn, useAuth} from '@src/contexts/auth';
import UserTopbar from '@src/features/topbar/TopbarWithUser';
import {getColors, getTwColors} from '@src/styles/styles';
import {CalendarProvider, ExpandableCalendar} from 'react-native-calendars';
import {
  CalendarClock,
  ChevronLeft,
  ChevronRight,
  Clock,
  Plus,
} from 'lucide-react-native';
import {useMutation} from '@tanstack/react-query';
import {BACKEND_URL} from '@src/config/common';
import {timePretty} from '@src/utils/timeUtils';
import {Text} from '@src/components/ui/text';
import Animated, {FadeInDown, FadeInRight} from 'react-native-reanimated';
import {Button} from '@src/components/ui/button';
import {Badge} from '@src/components/ui/badge';
import {AnimatedPressableSpring} from '@src/components/animated/AnimatedPressable';
import {Skeleton} from '@src/components/ui/skeleton';

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

export default function DashboardAppointmentTabScreen({
  navigation,
}: {
  navigation: any;
}) {
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
    <View className={`${twc.bg.body} min-h-full`}>
      <SignedIn>
        <CalendarProvider date={new Date().toDateString()}>
          <View
            style={{
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 4,
              },
              shadowOpacity: 0.4,
              shadowRadius: 0,
              elevation: 10,
            }}
            className="z-10 bg-white dark:bg-zinc-950">
            <UserTopbar navigation={navigation} />
            <View className="z-10 h-40">
              <ExpandableCalendar
                key={theme}
                firstDay={1}
                theme={{
                  backgroundColor: theme === 'light' ? 'white' : '#09090b',
                  calendarBackground: theme === 'light' ? 'white' : '#09090b',
                  textSectionTitleColor: color.icon.muted,
                  selectedDayBackgroundColor: color.icon.accent,
                  selectedDayTextColor: color.icon.white,
                  todayTextColor: color.icon.white,
                  dayTextColor: color.icon.foreground,
                  monthTextColor: color.icon.foreground,
                  todayDotColor: color.icon.accent,
                  todayBackgroundColor:
                    theme === 'light' ? color.icon.black : '#27272a',
                  dotColor: color.icon.accent,
                  textDayFontSize: 14,
                  arrowHeight: 12,
                  arrowWidth: 12,
                  textMonthFontSize: 14,
                }}
                renderArrow={direction => {
                  return direction === 'left' ? (
                    <ChevronLeft size={18} color={color.icon.muted} />
                  ) : (
                    <ChevronRight size={18} color={color.icon.muted} />
                  );
                }}
                indicatorStyle="black"
                markedDates={{
                  '2024-06-27': {
                    marked: true,
                  },
                  '2024-06-29': {marked: true},
                  '2024-06-24': {
                    marked: true,
                  },
                }}
                onDayPress={day => {
                  const formulatedDate = new Date(day.dateString)
                    .toUTCString()
                    .split(' ')
                    .slice(0, 4)
                    .join(' ');
                  if (date === formulatedDate) {
                    return;
                  }
                  setDate(formulatedDate);
                  let d = day.dateString.split('-');
                  const formattedDate = `${d[1]}-${d[2]}-${d[0]}`; // MM-DD-YYYY
                  dateAppointmentMutation.mutate(formattedDate);
                }}
                allowShadow={false}
              />
            </View>
          </View>
          <ScrollView
            className={`${theme === 'light' ? twc.bg.muted : twc.bg.body}`}>
            <View className="flex flex-row items-center px-6 my-6">
              <View className="flex-1">
                <Text
                  className={`${twc.text.foreground} text-[15px] font-bold`}>
                  Appointments
                </Text>
                <Text className="mt-0.5 text-sm text-muted-foreground">
                  {date}
                </Text>
              </View>
              <Button
                variant={'accent'}
                size={'sm'}
                className="flex flex-row gap-1.5 rounded-xl">
                <Plus size={14} strokeWidth={2.5} color={color.icon.accent} />
                <Text>Add</Text>
              </Button>
            </View>
            {dateAppointmentMutation.isPending ? (
              <View className="flex items-center w-full gap-3 px-6">
                <Skeleton className="w-full h-56 rounded-2xl bg-zinc-200" />
                <Skeleton className="w-full h-16 mt-4 rounded-2xl bg-zinc-200" />
                <Skeleton className="w-full h-16 rounded-2xl bg-zinc-200" />
                <Skeleton className="w-full h-16 rounded-2xl bg-zinc-200" />
                <Skeleton className="w-full h-16 rounded-2xl bg-zinc-200" />
              </View>
            ) : dateAppointmentMutation.isSuccess ? (
              appointments.length === 0 ? (
                <View className="px-4 py-16 mx-6 bg-white/50 rounded-2xl dark:bg-zinc-950/50">
                  <Text className={`${twc.text.muted} text-sm text-center`}>
                    No appointments found for the selected date.
                  </Text>
                </View>
              ) : (
                <>
                  {nextApt ? (
                    <>
                      <View className="w-full gap-6 px-6 mb-6">
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
                                <ChevronRight
                                  size={24}
                                  color={color.icon.white}
                                />
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
                                {(new Date(
                                  nextApt.end_time_expected,
                                ).getTime() -
                                  new Date(nextApt.start_time).getTime()) /
                                  1000 /
                                  60}{' '}
                                mins
                              </Text>
                            </View>
                            <View
                              className="flex flex-row items-center gap-3 px-4 py-3 mt-5 -mx-1 -mb-1.5 shadow rounded-xl bg-primary-foreground"
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
                                <Text className="text-[13px] font-semibold text-primary">
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
                                className="px-1 py-1 rounded-lg bg-primary/5">
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
                  <View className="flex gap-3 px-6 mb-6">
                    {appointments.map((appointment, index) => (
                      <Animated.View
                        key={index}
                        entering={FadeInDown.duration(200).delay(100 * index)}>
                        <AnimatedPressableSpring
                          className={`w-full bg-white dark:bg-zinc-950 rounded-xl ${
                            theme === 'light'
                              ? 'active:bg-zinc-300'
                              : 'active:bg-zinc-800'
                          }`}
                          onPress={() => {
                            navigation.push('Appointment', {
                              id: appointment.id,
                            });
                          }}
                          style={{
                            shadowColor: theme === 'light' ? '#aaa' : '#000',
                            shadowOffset: {
                              width: 0,
                              height: 1,
                            },
                            shadowOpacity: 0.1,
                            shadowRadius: 4,
                            elevation: 2,
                          }}>
                          <View className="flex flex-row items-center w-full px-4 py-4">
                            <View className="flex flex-col flex-1 gap-1">
                              <Text
                                className={
                                  'dark:text-white/90 text-black/90 text-[13.5px] font-medium'
                                }>
                                {appointment.patient.first_name}{' '}
                                {appointment.patient.last_name}
                              </Text>
                              <Text className={`${twc.text.muted} text-[12px]`}>
                                {timePretty(appointment.start_time)} —{' '}
                                {timePretty(appointment.end_time_expected)}
                              </Text>
                            </View>
                            <Badge className="mx-3">
                              <Text>{appointment.status}</Text>
                            </Badge>
                            <ChevronRight
                              size={20}
                              strokeWidth={1.5}
                              color={color.icon.muted}
                            />
                          </View>
                        </AnimatedPressableSpring>
                      </Animated.View>
                    ))}
                  </View>
                </>
              )
            ) : dateAppointmentMutation.isError ? (
              <Text>Failed to load appointments</Text>
            ) : (
              <></>
            )}
          </ScrollView>
        </CalendarProvider>
      </SignedIn>
    </View>
  );
}

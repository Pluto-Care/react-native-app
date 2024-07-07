/* eslint-disable radix */
import {useRoute} from '@react-navigation/native';
import {Button} from '@src/components/ui/button';
import {BACKEND_URL} from '@src/config/common';
import {SignedIn, useAuth} from '@src/contexts/auth';
import PlainTopbar from '@src/features/topbar/PlainTopbar';
import {getTwColors} from '@src/styles/styles';
import {
  datePretty,
  getAge,
  monthPretty,
  timePretty,
} from '@src/utils/timeUtils';
import {useQuery} from '@tanstack/react-query';
import axios from 'axios';
import {PhoneCall} from 'lucide-react-native';
import React from 'react';
import {dateTimePretty} from '../../../utils/timeUtils';
import {
  ActivityIndicator,
  ScrollView,
  View,
  useColorScheme,
} from 'react-native';
import {Badge} from '@src/components/ui/badge';
import {Text} from '@src/components/ui/text';
import Animated, {FadeInDown} from 'react-native-reanimated';

export default function AppointmentScreen({navigation}: {navigation: any}) {
  const params = useRoute().params as any;
  const context = useAuth();
  const theme = useColorScheme();
  const colors = getTwColors(theme || 'light');

  const appointment_query = useQuery({
    queryKey: ['appointment', params.id],
    queryFn: async () =>
      await axios
        .get(
          `${BACKEND_URL}/api/scheduling/appointments/my/list/${params.id}/`,
          {
            headers: {
              'Content-Type': 'application/json',
              'X-Requested-By': 'expo',
              Authorization: 'Bearer ' + context?.user?.session.key,
            },
          },
        )
        .then(res => res.data.data),
  });

  const patient_query = useQuery({
    queryKey: ['appointment_patient', params.id],
    queryFn: async () =>
      await axios
        .get(
          `${BACKEND_URL}/api/scheduling/appointments/my/list/${params.id}/patient/`,
          {
            headers: {
              'Content-Type': 'application/json',
              'X-Requested-By': 'expo',
              Authorization: 'Bearer ' + context?.user?.session.key,
            },
          },
        )
        .then(res => res.data.data),
  });

  console.log(patient_query.data);
  console.log(appointment_query.data);

  return (
    <SignedIn>
      <View className="flex flex-col h-full max-h-screen bg-muted dark:bg-zinc-900">
        <View
          className={`${colors.border.gray} z-10`}
          style={{
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 4,
            },
            shadowOpacity: 0.2,
            shadowRadius: 0,
            elevation: 4,
          }}>
          <PlainTopbar
            title={
              patient_query.data
                ? patient_query.data.first_name +
                  ' ' +
                  patient_query.data.last_name
                : 'Loading...'
            }
            subtitle={
              appointment_query.data
                ? timePretty(appointment_query.data.appointment.start_time) +
                  ' — ' +
                  datePretty(appointment_query.data.appointment.start_time)
                : 'Loading...'
            }
            showBackButton={true}
            backButtonAction={() => {
              navigation.goBack();
            }}>
            <Button
              size={'sm'}
              variant={'accent'}
              onPress={() => {
                navigation.push('Patient', {
                  id: patient_query.data.id,
                });
              }}>
              <Text className="font-medium text-[15px]">View Details</Text>
            </Button>
          </PlainTopbar>
          <Animated.View entering={FadeInDown.delay(100).duration(100)}>
            <View>
              <View className="px-4 pt-1 pb-4 bg-white dark:bg-zinc-950">
                <View className="px-4 py-3 rounded-md bg-muted dark:bg-zinc-900/70">
                  <View className="flex flex-row items-center gap-2">
                    <Text className={`${colors.text.muted} text-sm`}>
                      Gender
                    </Text>
                    <Text
                      className={`${colors.text.foreground} flex-1 text-right text-sm`}>
                      {patient_query.data?.sex ?? 'Unspecified'}
                    </Text>
                  </View>
                  <View className="flex flex-row items-center gap-2 mt-1.5">
                    <Text className={`${colors.text.muted} text-sm`}>Age</Text>
                    <Text
                      className={`${colors.text.foreground} flex-1 text-right text-sm`}>
                      {getAge(patient_query.data?.dob)} (
                      {monthPretty(
                        parseInt(patient_query.data?.dob.split('-')[1]),
                        -1,
                      )}{' '}
                      {parseInt(patient_query.data?.dob.split('-')[2])},{' '}
                      {patient_query.data?.dob.split('-')[0]})
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </Animated.View>
        </View>
        {patient_query.isSuccess ? (
          <>
            <ScrollView className="pb-6">
              {/* Appointment */}
              <Animated.View entering={FadeInDown.delay(100).duration(100)}>
                <View className="px-3 py-4">
                  <View
                    className="px-3 py-4 mt-2 bg-white rounded-lg dark:bg-zinc-950/70"
                    style={{
                      shadowColor: '#000',
                      shadowOffset: {
                        width: 0,
                        height: 4,
                      },
                      shadowOpacity: 0.1,
                      shadowRadius: 0,
                      elevation: 2,
                    }}>
                    <View className="flex flex-row items-center gap-2">
                      <Text
                        className={`font-sans flex-1 text-base font-bold px-2 ${colors.text.foreground}`}>
                        Appointment
                      </Text>
                      <View className="text-sm text-right">
                        <Badge className="">
                          <Text>
                            {appointment_query.data.appointment.status}
                          </Text>
                        </Badge>
                      </View>
                    </View>
                    <View className="px-4 py-3 mt-3 rounded-md bg-muted dark:bg-zinc-900/70">
                      <View className="flex flex-row items-center gap-2">
                        <Text className={`${colors.text.muted} text-sm`}>
                          Date
                        </Text>
                        <Text
                          className={`${colors.text.foreground} flex-1 text-right text-sm`}>
                          {datePretty(
                            appointment_query.data.appointment.start_time,
                          )}
                        </Text>
                      </View>
                      <View className="flex flex-row items-center gap-2 mt-1.5">
                        <Text className={`${colors.text.muted} text-sm`}>
                          Time
                        </Text>
                        <Text
                          className={`${colors.text.foreground} flex-1 text-right text-sm`}>
                          {timePretty(
                            appointment_query.data.appointment.start_time,
                          )}{' '}
                          —{' '}
                          {timePretty(
                            appointment_query.data.appointment
                              .end_time_expected,
                          )}
                        </Text>
                      </View>

                      {/* Reason */}
                      <View className="mt-1.5">
                        <Text className={`${colors.text.muted} text-sm`}>
                          Reason
                        </Text>
                        <Text
                          className={`${colors.text.foreground} flex-1 pl-3 mt-1 text-sm`}>
                          {appointment_query.data?.appointment.reason}
                        </Text>
                      </View>
                      <View className="flex flex-row items-center gap-2 pt-2 mt-4 border-t border-muted-foreground/10">
                        <Text className={`${colors.text.muted} text-sm`}>
                          Created by
                        </Text>
                        <Text
                          className={`${colors.text.foreground} flex-1 text-right text-sm`}>
                          {appointment_query.data.created_by.first_name}{' '}
                          {appointment_query.data.created_by.last_name}
                        </Text>
                      </View>
                      <View className="flex flex-row items-center gap-2 mt-1.5">
                        <Text className={`${colors.text.muted} text-sm`}>
                          Created on
                        </Text>
                        <Text
                          className={`${colors.text.foreground} flex-1 text-right text-sm`}>
                          {dateTimePretty(
                            appointment_query.data.appointment.created_at,
                          )}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </Animated.View>
            </ScrollView>
            <Button
              variant={'default'}
              className="flex flex-row items-center justify-center w-full gap-3 p-3 rounded-none bg-accent-foreground"
              onPress={() => {
                if (appointment_query.isSuccess) {
                  navigation.push('Calling', {
                    phone: patient_query.data.phone,
                    first_name: patient_query.data.first_name,
                    last_name: patient_query.data.last_name,
                    end_time_expected:
                      appointment_query.data.appointment.end_time,
                  });
                }
              }}>
              <PhoneCall size={16} color={'white'} />
              <Text className="font-medium text-[15px] text-white">
                Start Call
              </Text>
            </Button>
          </>
        ) : patient_query.isLoading ? (
          <ActivityIndicator />
        ) : (
          <Text>No data</Text>
        )}
      </View>
    </SignedIn>
  );
}

import {useRoute} from '@react-navigation/native';
import {BACKEND_URL} from '@src/config/common';
import {SignedIn, useAuth} from '@src/contexts/auth';
import PlainTopbar from '@src/features/topbar/PlainTopbar';
import {getTwColors} from '@src/styles/styles';
import {useQuery} from '@tanstack/react-query';
import axios from 'axios';
import React from 'react';
import {
  ActivityIndicator,
  ScrollView,
  View,
  useColorScheme,
} from 'react-native';
import {Text} from '@src/components/ui/text';
import Animated, {FadeInDown} from 'react-native-reanimated';
import {PatientNoteType, PatientType} from '../../../types/patient';
import {formatPhoneNumber} from '../../../utils/formatPhoneNumber';
import {dateTimePretty} from '../../../utils/timeUtils';

export default function PatientScreen({navigation}: {navigation: any}) {
  const params = useRoute().params as any;
  const context = useAuth();
  const theme = useColorScheme();
  const colors = getTwColors(theme || 'light');

  const patient_query = useQuery({
    queryKey: ['patient', params.id],
    queryFn: async () =>
      await axios
        .get(`${BACKEND_URL}/api/patients/list/${params.id}/`, {
          headers: {
            'Content-Type': 'application/json',
            'X-Requested-By': 'expo',
            Authorization: 'Bearer ' + context?.user?.session.key,
          },
        })
        .then(res => res.data.data as PatientType),
  });

  const notes_query = useQuery({
    queryKey: ['notes', params.id],
    queryFn: async () =>
      await axios
        .get(`${BACKEND_URL}/api/patients/list/${params.id}/notes/`, {
          headers: {
            'Content-Type': 'application/json',
            'X-Requested-By': 'expo',
            Authorization: 'Bearer ' + context?.user?.session.key,
          },
        })
        .then(res => res.data.data as PatientNoteType[]),
  });

  console.log(notes_query.data);

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
            showBackButton={true}
            backButtonAction={() => {
              navigation.goBack();
            }}
          />
        </View>
        {patient_query.isSuccess ? (
          <>
            <ScrollView className="pb-6">
              {/* Contact */}
              <Animated.View entering={FadeInDown.delay(100).duration(100)}>
                <View className="px-3 py-2">
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
                        Contact Information
                      </Text>
                    </View>
                    <View className="px-4 py-3 mt-3 rounded-md bg-muted dark:bg-zinc-900/70">
                      <View className="flex flex-row items-center gap-2">
                        <Text className={`${colors.text.muted} text-sm`}>
                          Phone
                        </Text>
                        <Text
                          className={`${colors.text.foreground} flex-1 text-right text-sm`}>
                          +1 {formatPhoneNumber(patient_query.data.phone)}
                        </Text>
                      </View>
                      <View className="flex flex-row items-center gap-2 mt-1.5">
                        <Text className={`${colors.text.muted} text-sm`}>
                          Email
                        </Text>
                        <Text
                          className={`${colors.text.foreground} flex-1 text-right text-sm`}>
                          {patient_query.data.email}
                        </Text>
                      </View>
                    </View>
                    <View className="flex flex-row items-center gap-2 mt-5">
                      <Text
                        className={`font-sans flex-1 text-base font-bold px-2 ${colors.text.foreground}`}>
                        Address
                      </Text>
                    </View>
                    <View className="px-4 py-3 mt-3 rounded-md bg-muted dark:bg-zinc-900/70">
                      <View className="flex flex-row items-center gap-2">
                        <Text className={`${colors.text.muted} text-sm`}>
                          Street
                        </Text>
                        <Text
                          className={`${colors.text.foreground} flex-1 text-right text-sm`}>
                          {patient_query.data.street}
                        </Text>
                      </View>
                      <View className="flex flex-row items-center gap-2 mt-1.5">
                        <Text className={`${colors.text.muted} text-sm`}>
                          City
                        </Text>
                        <Text
                          className={`${colors.text.foreground} flex-1 text-right text-sm`}>
                          {patient_query.data.city}
                        </Text>
                      </View>
                      <View className="flex flex-row items-center gap-2 mt-1.5">
                        <Text className={`${colors.text.muted} text-sm`}>
                          Province
                        </Text>
                        <Text
                          className={`${colors.text.foreground} flex-1 text-right text-sm`}>
                          {patient_query.data.state},{' '}
                          {patient_query.data.postal_code}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </Animated.View>
              {/* Notes */}
              <Animated.View entering={FadeInDown.delay(100).duration(100)}>
                <View className="flex flex-row items-center gap-2 px-4 mt-4 mb-3">
                  <Text
                    className={`font-sans flex-1 text-base font-bold px-2 ${colors.text.foreground}`}>
                    Patient Notes
                  </Text>
                </View>
                <View className="px-4 pb-4">
                  {notes_query.isSuccess ? (
                    notes_query.data.map(note => (
                      <View className="px-3 py-4 border rounded-xl border-foreground/10">
                        <View>
                          <View className="flex flex-row items-center gap-3">
                            <View className="flex items-center justify-center bg-white rounded-full dark:bg-zinc-950 bg-muted size-10">
                              <Text className="uppercase text-black/50 dark:text-white/50">
                                {note.created_by.first_name[0]}
                                {note.created_by.last_name[0]}
                              </Text>
                            </View>
                            <View>
                              <Text
                                className={`font-sans text-[14px] ${colors.text.foreground}`}>
                                {note.created_by.first_name}{' '}
                                {note.created_by.last_name}
                              </Text>
                              <Text
                                className={`font-sans text-[12px] ${colors.text.muted}`}>
                                {dateTimePretty(note.created_at)}
                              </Text>
                            </View>
                          </View>
                          <View className="mt-1">
                            <Text
                              className={`font-sans text-[13px] mt-2 ${colors.text.foreground}`}>
                              {note.note}
                            </Text>
                            {note.updated_at !== null && (
                              <Text className="mt-3 text-sm text-muted-foreground">
                                edited
                              </Text>
                            )}
                          </View>
                        </View>
                      </View>
                    ))
                  ) : (
                    <></>
                  )}
                </View>
              </Animated.View>
            </ScrollView>
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

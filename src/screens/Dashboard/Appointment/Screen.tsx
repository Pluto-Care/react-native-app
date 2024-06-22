import {useRoute} from '@react-navigation/native';
import CustomButton from '@src/components/ui/CustomButton';
import {BACKEND_URL} from '@src/config/common';
import {SignedIn, useAuth} from '@src/contexts/auth';
import PlainTopbar from '@src/features/topbar/PlainTopbar';
import {useMakeOutgoingCall} from '@src/hooks/twilio/useMakeOutgoingCall';
import {getColors} from '@src/styles/styles';
import {
  datePretty,
  getAge,
  monthPretty,
  timePretty,
  timeSince,
} from '@src/utils/timeUtils';
import {useQuery} from '@tanstack/react-query';
import axios from 'axios';
import {PhoneCall} from 'lucide-react-native';
import React from 'react';
import {
  ActivityIndicator,
  ScrollView,
  Text,
  View,
  useColorScheme,
} from 'react-native';

export default function AppointmentScreen({navigation}: {navigation: any}) {
  const params = useRoute().params as any;
  const context = useAuth();
  const theme = useColorScheme();
  const colors = getColors(theme || 'light');

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
      <View className={`${colors.bg.body} flex flex-col h-full max-h-screen`}>
        <View className={`${colors.border.gray} border-b`}>
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
                ? timePretty(appointment_query.data.start_time) +
                  ' — ' +
                  datePretty(appointment_query.data.start_time)
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
            <ScrollView className={`${colors.bg.body} px-6 py-4`}>
              <Text
                className={`font-sans text-base font-bold ${colors.text.foreground}`}>
                Details
              </Text>
              <View className="flex flex-row items-center gap-2 mt-2">
                <Text className={`${colors.text.muted} text-sm`}>
                  Full name
                </Text>
                <Text
                  className={`${colors.text.foreground} flex-1 text-right text-sm`}>
                  {patient_query.data.first_name} {patient_query.data.last_name}
                </Text>
              </View>
              <View className="flex flex-row items-center gap-2 mt-px">
                <Text className={`${colors.text.muted} text-sm`}>Gender</Text>
                <Text
                  className={`${colors.text.foreground} flex-1 text-right text-sm`}>
                  {patient_query.data.sex ?? 'Unspecified'}
                </Text>
              </View>
              <View className="flex flex-row items-center gap-2 mt-px">
                <Text className={`${colors.text.muted} text-sm`}>Age</Text>
                <Text
                  className={`${colors.text.foreground} flex-1 text-right text-sm`}>
                  {getAge(patient_query.data.dob)} (
                  {monthPretty(
                    parseInt(patient_query.data.dob.split('-')[1]),
                    -1,
                  )}{' '}
                  {parseInt(patient_query.data.dob.split('-')[2])},{' '}
                  {patient_query.data.dob.split('-')[0]})
                </Text>
              </View>
              {/* Reason */}
              <Text
                className={`font-sans mt-6 text-base font-bold ${colors.text.foreground}`}>
                Reason
              </Text>
              <Text
                className={`text-sm ${colors.text.foreground} mt-2 text-justify`}>
                {appointment_query.data.reason}
              </Text>
            </ScrollView>
            <CustomButton
              style="accent"
              text="Start Call"
              width="full"
              onClick={() => {
                if (appointment_query.isSuccess) {
                  navigation.push('Calling', {
                    phone: patient_query.data.phone,
                    first_name: patient_query.data.first_name,
                    last_name: patient_query.data.last_name,
                    end_time_expected: appointment_query.data.end_time,
                  });
                }
              }}
              icon={<PhoneCall size={16} color={'white'} />}
              noRoundedCorners
            />
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

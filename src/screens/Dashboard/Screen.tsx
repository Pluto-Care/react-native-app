import * as React from 'react';
import {Pressable, View, useColorScheme} from 'react-native';
import DashboardAppointmentTabScreen from './CalendarAppointmentTab';
import {Text} from '@src/components/ui/text';
import {CalendarCheck, Plus, Users} from 'lucide-react-native';
import {getColors} from '@src/styles/styles';
import {SignedIn, useAuth} from '@src/contexts/auth';
import DashboardPatientsTab from './PatientsTab';

export interface IDashboardScreenProps {
  navigation: any;
}

export function DashboardScreen(props: IDashboardScreenProps) {
  const theme = useColorScheme() || 'light';
  const color = getColors(theme);
  const [value, setValue] = React.useState('appointments');
  const context = useAuth();

  if (!context.user) {
    props.navigation.replace('Login');
  }

  return (
    <>
      <SignedIn>
        <View className="flex flex-col h-screen">
          <View className="flex-1">
            {value === 'appointments' ? (
              <DashboardAppointmentTabScreen navigation={props.navigation} />
            ) : value === 'patients' ? (
              <DashboardPatientsTab navigation={props.navigation} />
            ) : (
              <Text>New Appointment Page</Text>
            )}
          </View>
          <View
            className="flex flex-row max-w-full px-2 pt-2 pb-8 bg-white rounded-t-2xl"
            style={{
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: -4,
              },
              shadowOpacity: 0.8,
              shadowRadius: 4,
              elevation: 10,
            }}>
            <Pressable
              className="flex items-center justify-center w-1/2 px-2 py-2 active:bg-zinc-100 rounded-xl"
              onPress={() => {
                setValue('appointments');
              }}>
              <CalendarCheck
                size={20}
                color={
                  value === 'appointments'
                    ? color.icon.accent
                    : color.icon.foreground
                }
              />
              <Text
                className={
                  (value === 'appointments'
                    ? 'text-accent-foreground'
                    : 'text-foreground') + ' text-sm font-medium'
                }>
                Appointments
              </Text>
            </Pressable>
            <View className="absolute z-20 flex items-center justify-center px-2 -mt-4 -ml-8 left-1/2">
              <Pressable
                className="p-4 rounded-full bg-accent-foreground active:bg-accent-foreground/80"
                onPress={() => {
                  setValue('new_appointment');
                }}
                style={{
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 0,
                  },
                  shadowOpacity: 0.3,
                  shadowRadius: 10,
                  elevation: 4,
                }}>
                <Plus size={24} color={color.icon.white} />
              </Pressable>
            </View>
            <Pressable
              className="flex items-center justify-center w-1/2 px-2 py-2 active:bg-zinc-100 rounded-xl"
              onPress={() => {
                setValue('patients');
              }}>
              <Users
                size={20}
                color={
                  value === 'patients'
                    ? color.icon.accent
                    : color.icon.foreground
                }
              />
              <Text
                className={
                  (value === 'patients'
                    ? 'text-accent-foreground'
                    : 'text-foreground') + ' text-sm font-medium'
                }>
                Patients
              </Text>
            </Pressable>
          </View>
        </View>
      </SignedIn>
    </>
  );
}

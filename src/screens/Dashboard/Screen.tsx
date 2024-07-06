import * as React from 'react';
import {Pressable, View, useColorScheme} from 'react-native';
import DashboardAppointmentTabScreen from './DashboardAppointmentTab';
import {Text} from '@src/components/ui/text';
import {CalendarCheck, Plus, Users} from 'lucide-react-native';
import {getColors, getTwColors} from '@src/styles/styles';
import {SignedIn, useAuth} from '@src/contexts/auth';
import DashboardPatientsTab from './PatientsTab';
import NewAppointmentTab from './NewAppointmentTab';
import Animated, {useAnimatedStyle, withTiming} from 'react-native-reanimated';
import {set} from 'node_modules/ts-pattern/dist/patterns';

export interface IDashboardScreenProps {
  navigation: any;
}

export function DashboardScreen(props: IDashboardScreenProps) {
  const theme = useColorScheme() || 'light';
  const color = getColors(theme);
  const twc = getTwColors(theme);
  const [value, setValue] = React.useState('appointments');
  const [previosValue, setPreviousValue] = React.useState('appointments');
  const [openAddAppointment, setOpenAddAppointment] = React.useState(false);
  const context = useAuth();
  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotate: withTiming(openAddAppointment ? '45deg' : '0deg', {
            duration: 100,
          }),
        },
      ],
      backgroundColor: withTiming(
        openAddAppointment ? color.danger.foreground : color.accent.foreground,
        {
          duration: 100,
        },
      ),
      marginTop: withTiming(openAddAppointment ? 10 : 0, {
        duration: 100,
      }),
    };
  });

  if (!context.user) {
    props.navigation.replace('Login');
  }

  return (
    <>
      <SignedIn>
        <View className={`flex flex-col h-screen ${twc.bg.body}`}>
          <View className="z-0 flex-1">
            <View className="z-0 flex-1">
              {value === 'appointments' ? (
                <DashboardAppointmentTabScreen navigation={props.navigation} />
              ) : value === 'patients' ? (
                <DashboardPatientsTab navigation={props.navigation} />
              ) : (
                <></>
              )}
            </View>
            {openAddAppointment && (
              <View className={`z-10 flex-1 min-h-screen ${twc.bg.body}`}>
                <NewAppointmentTab navigation={props.navigation} />
              </View>
            )}
          </View>
          <View className={`${twc.bg.body} z-10`}>
            <View
              className="flex flex-row max-w-full px-2 pt-2 pb-8 bg-white dark:bg-zinc-950 rounded-t-2xl"
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
                className="flex items-center justify-center w-1/2 px-2 py-2 active:bg-zinc-100 dark:active:bg-zinc-800 rounded-xl"
                onPress={() => {
                  if (value !== 'appointments') {
                    setPreviousValue(value);
                    setValue('appointments');
                  } else {
                    setOpenAddAppointment(v => !v);
                  }
                }}>
                <CalendarCheck
                  size={20}
                  color={
                    value === 'appointments' && !openAddAppointment
                      ? color.icon.accent
                      : color.icon.foreground
                  }
                />
                <Text
                  className={
                    (value === 'appointments' && !openAddAppointment
                      ? 'text-accent-foreground'
                      : 'text-foreground') + ' text-sm font-medium'
                  }>
                  Appointments
                </Text>
              </Pressable>
              <View className="absolute z-20 flex items-center justify-center px-2 -mt-4 -ml-8 left-1/2">
                <Animated.View
                  className="rounded-full"
                  style={[
                    {
                      shadowColor: '#000',
                      shadowOffset: {
                        width: 0,
                        height: 0,
                      },
                      shadowOpacity: 0.3,
                      shadowRadius: 10,
                      elevation: 4,
                    },
                    animatedStyles,
                  ]}>
                  <Pressable
                    className={`p-4 rounded-full`}
                    onPress={() => {
                      setOpenAddAppointment(v => !v);
                    }}>
                    <Plus size={24} color={color.icon.white} />
                  </Pressable>
                </Animated.View>
              </View>
              <Pressable
                className="flex items-center justify-center w-1/2 px-2 py-2 active:bg-zinc-100 dark:active:bg-zinc-800 rounded-xl"
                onPress={() => {
                  if (value !== 'patients') {
                    setPreviousValue(value);
                    setValue('patients');
                  } else {
                    setOpenAddAppointment(v => !v);
                  }
                }}>
                <Users
                  size={20}
                  color={
                    value === 'patients' && !openAddAppointment
                      ? color.icon.accent
                      : color.icon.foreground
                  }
                />
                <Text
                  className={
                    (value === 'patients' && !openAddAppointment
                      ? 'text-accent-foreground'
                      : 'text-foreground') + ' text-sm font-medium'
                  }>
                  Patients
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </SignedIn>
    </>
  );
}

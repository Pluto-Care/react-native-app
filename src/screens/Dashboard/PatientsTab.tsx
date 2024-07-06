import {AnimatedPressableSpring} from '@src/components/animated/AnimatedPressable';
import {Skeleton} from '@src/components/ui/skeleton';
import {Text} from '@src/components/ui/text';
import {BACKEND_URL} from '@src/config/common';
import {SignedIn, useAuth} from '@src/contexts/auth';
import UserTopbar from '@src/features/topbar/TopbarWithUser';
import {getColors, getTwColors} from '@src/styles/styles';
import {PatientType} from '@src/types/patient';
import {useQuery} from '@tanstack/react-query';
import axios from 'axios';
import {AtSign, ChevronRight, Phone} from 'lucide-react-native';
import {ScrollView, View, useColorScheme} from 'react-native';
import Animated, {FadeInDown, FadeInLeft} from 'react-native-reanimated';
import {formatPhoneNumber} from '../../utils/formatPhoneNumber';

export default function DashboardPatientsTab({navigation}: {navigation: any}) {
  const theme = useColorScheme();
  const {user} = useAuth();
  const colorScheme = useColorScheme() || 'light';
  const twc = getTwColors(colorScheme);
  const color = getColors(colorScheme);

  const query = useQuery({
    queryKey: ['patients'],
    queryFn: async () => {
      return await axios
        .get(`${BACKEND_URL}/api/scheduling/appointments/my/patients/`, {
          headers: {
            'Content-Type': 'application/json',
            'X-Requested-By': 'expo',
            Authorization: 'Bearer ' + user?.session.key,
          },
        })
        .then(response => {
          const list = response.data.data as PatientType[];
          // TODO: [ONLY needed as distinct does not work with SQLite]
          // remove duplicate ids
          const uniqueList = list.filter(
            (v, i, a) => a.findIndex(t => t.id === v.id) === i,
          );
          return uniqueList;
        });
    },
  });

  return (
    <Animated.View entering={FadeInLeft.duration(100)} className="h-full">
      <View className={`${twc.bg.body} min-h-full flex-1`}>
        <SignedIn>
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
            className="z-10 pb-1 bg-white dark:bg-zinc-950">
            <UserTopbar navigation={navigation} />
          </View>
          <ScrollView
            className={`${theme === 'light' ? twc.bg.muted : twc.bg.body}`}
            contentContainerStyle={{flexGrow: 1}}>
            <Text className="px-6 mt-5 text-[16px] font-bold">Patients</Text>
            <View className="flex flex-col gap-3 px-6 my-6">
              {query.isSuccess ? (
                query.data.map((patient, index) => (
                  <Animated.View
                    key={patient.id}
                    entering={FadeInDown.duration(200).delay(100 * index)}>
                    <AnimatedPressableSpring
                      className={`w-full bg-white dark:bg-zinc-950 rounded-xl ${
                        theme === 'light'
                          ? 'active:bg-zinc-300'
                          : 'active:bg-zinc-800'
                      }`}
                      onPress={() => {
                        // navigation.navigate('Patient', {patient});
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
                            {patient.first_name} {patient.last_name}
                          </Text>
                          <View className="flex flex-row items-center gap-4">
                            <View className="flex flex-row items-center gap-2">
                              <Phone
                                size={12}
                                strokeWidth={2}
                                color={color.icon.muted}
                              />
                              <Text className={`${twc.text.muted} text-[12px]`}>
                                {formatPhoneNumber(patient.phone)}
                              </Text>
                            </View>
                            <View className="flex flex-row items-center gap-2">
                              <AtSign
                                size={12}
                                strokeWidth={2}
                                color={color.icon.muted}
                              />
                              <Text className={`${twc.text.muted} text-[12px]`}>
                                {patient.email}
                              </Text>
                            </View>
                          </View>
                        </View>
                        <ChevronRight
                          size={20}
                          strokeWidth={1.5}
                          color={color.icon.muted}
                        />
                      </View>
                    </AnimatedPressableSpring>
                  </Animated.View>
                ))
              ) : query.isLoading ? (
                <View className="flex items-center w-full gap-3 px-6">
                  <Skeleton className="w-full h-16 rounded-2xl bg-zinc-200" />
                  <Skeleton className="w-full h-16 rounded-2xl bg-zinc-200" />
                  <Skeleton className="w-full h-16 rounded-2xl bg-zinc-200" />
                </View>
              ) : (
                <></>
              )}
            </View>
          </ScrollView>
        </SignedIn>
      </View>
    </Animated.View>
  );
}

import {useRoute} from '@react-navigation/native';
import CallToggleButton from '@src/components/ui/CallToggleButton';
import CustomButton from '@src/components/ui/CustomButton';
import {SignedIn, useAuth} from '@src/contexts/auth';
import {useMakeOutgoingCall} from '@src/hooks/twilio/useMakeOutgoingCall';
import {getColors} from '@src/styles/styles';
import {Call} from '@twilio/voice-react-native-sdk';
import {
  ArrowLeft,
  CirclePause,
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  Volume2,
} from 'lucide-react-native';
import React from 'react';
import {Pressable, Text, View, useColorScheme} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

export default function CallScreen({navigation}: {navigation: any}) {
  const theme = useColorScheme();
  const colors = getColors(theme || 'light');
  const params = useRoute().params as any;
  const context = useAuth();
  const [callStatus, setCallStatus] = React.useState<string>('');
  const [callTime, setCallTime] = React.useState<string>('00:00');

  const [call, setCall] = React.useState<
    | {
        reason: string;
        error: unknown;
        outgoingCall?: undefined;
      }
    | {
        outgoingCall: Call;
        reason?: undefined;
        error?: undefined;
      }
    | null
  >(null);

  const {makeCall} = React.useMemo(
    () =>
      useMakeOutgoingCall(
        context.user?.session.key || '',
        '+1' + params.phone,
        'number',
      ),
    [context.user?.session.key, params.phone],
  );

  React.useEffect(() => {
    if (!call) {
      console.log('Making call....');
      makeCall().then(call => {
        setCall(call);
      });
    }
  }, []);

  // Call Status Polling
  React.useEffect(() => {
    if (!call?.outgoingCall) {
      return;
    }

    const interval = setInterval(() => {
      if (call.outgoingCall.getState() === 'disconnected') {
        // Call has ended
        clearInterval(interval);
        navigation.goBack();
      }
      if (call.outgoingCall.getInitialConnectedTimestamp() !== undefined) {
        const time = new Date();
        const diff =
          time.valueOf() -
          (call.outgoingCall.getInitialConnectedTimestamp()?.valueOf() ||
            time.valueOf());
        const hours = Math.floor(diff / 3600000);
        const minutes = Math.floor(diff / 60000);
        const seconds = ((diff % 60000) / 1000).toFixed(0);
        setCallTime(
          `${hours > 0 ? hours + ':' : ''}${
            minutes < 10 ? '0' + minutes : minutes
          }:${parseInt(seconds) < 10 ? '0' + seconds : seconds}`,
        );
      }
      setCallStatus(call.outgoingCall.getState());
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [call?.outgoingCall]);

  return (
    <SignedIn>
      <View className={`${colors.bg.body} flex flex-col h-full max-h-screen`}>
        <View className={`${colors.border.gray} flex h-full border-b`}>
          <View className={`${colors.bg.body} flex-1`}>
            <LinearGradient
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              colors={
                theme === 'light'
                  ? ['#ffedd5', '#e5f4ff', '#f3e8ff']
                  : ['#180b06', '#160525']
              }
              className="flex items-center justify-center h-full px-6 py-4">
              <View>
                <Text
                  className={`${colors.text.foreground} font-bold text-center font-sans text-lg mb-2`}>
                  {params.first_name} {params.last_name}
                </Text>
                <Text
                  className={`text-center uppercase text-xs ${colors.text.muted}`}>
                  {callStatus || 'No Status'}
                </Text>
                <Text
                  className={`text-center uppercase text-xs mt-2 ${colors.text.muted}`}>
                  {callTime}
                </Text>
                <View className="flex flex-row mt-32 mb-24">
                  <CallToggleButton
                    whenOff={() => {
                      call?.outgoingCall?.mute(false);
                    }}
                    whenOn={() => {
                      call?.outgoingCall?.mute(true);
                    }}
                    isToggled={false}
                    iconOn={<MicOff size={20} className={`text-white`} />}
                    iconOff={
                      <Mic size={20} className={`${colors.text.accent}`} />
                    }
                    text="Mute"
                  />
                  <View className="w-8" />
                  <CallToggleButton
                    whenOff={() => {
                      console.log('Speaker Off');
                    }}
                    whenOn={() => {
                      console.log('Speaker On');
                    }}
                    isToggled={false}
                    iconOn={<Volume2 size={20} className={`text-white`} />}
                    iconOff={
                      <Volume2 size={20} className={`${colors.text.accent}`} />
                    }
                    text="Speaker"
                  />
                  <View className="w-8" />
                  <CallToggleButton
                    whenOff={() => {
                      call?.outgoingCall?.hold(false);
                    }}
                    whenOn={() => {
                      call?.outgoingCall?.hold(true);
                    }}
                    isToggled={false}
                    iconOn={<Phone size={20} className={`text-white`} />}
                    iconOff={
                      <CirclePause
                        size={22}
                        className={`${colors.text.accent}`}
                      />
                    }
                    text="Hold"
                  />
                </View>
                <View className="flex items-center">
                  <Pressable
                    className={` w-16 h-16 rounded-full flex justify-center items-center ${colors.bg.danger}`}
                    onPress={() => {
                      call?.outgoingCall?.disconnect();
                    }}>
                    <PhoneOff size={20} className={`text-white`} />
                  </Pressable>
                </View>
              </View>
            </LinearGradient>
          </View>
          <View className={`border-t ${colors.border.gray}`}>
            <CustomButton
              style="accent_hollow_no_border"
              text="Go back to details"
              width="full"
              onClick={() => {
                navigation.goBack();
              }}
              icon={<ArrowLeft size={18} className={`${colors.text.accent}`} />}
              noRoundedCorners
            />
          </View>
        </View>
      </View>
    </SignedIn>
  );
}

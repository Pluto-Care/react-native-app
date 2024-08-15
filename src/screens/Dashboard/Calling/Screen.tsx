import {useRoute} from '@react-navigation/native';
import CallToggleButton from '@src/components/ui/CallToggleButton';
import {Button} from '@src/components/ui/button';
import {Text} from '@src/components/ui/text';
import {SignedIn, useAuth} from '@src/contexts/auth';
import {useMakeOutgoingCall} from '@src/hooks/twilio/useMakeOutgoingCall';
import {getColors, getTwColors} from '@src/styles/styles';
import {Call} from '@twilio/voice-react-native-sdk';
import {
  ArrowLeft,
  CirclePause,
  Mic,
  MicOff,
  PhoneOff,
  Play,
  Volume2,
} from 'lucide-react-native';
import React from 'react';
import {Pressable, View, useColorScheme} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

export default function CallScreen({navigation}: {navigation: any}) {
  const theme = useColorScheme() || 'light';
  const twc = getTwColors(theme);
  const color = getColors(theme);
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

  const {makeCall} = useMakeOutgoingCall(
    context.user?.session.key || '',
    '+1' + params.phone,
    'number',
  );

  React.useEffect(() => {
    if (!call) {
      console.log('Making call....');
      makeCall().then(c => {
        setCall(c);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
            // eslint-disable-next-line radix
          }:${parseInt(seconds) < 10 ? '0' + seconds : seconds}`,
        );
      }
      setCallStatus(call.outgoingCall.getState());
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [call?.outgoingCall, navigation]);

  return (
    <LinearGradient
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
      colors={
        theme === 'light'
          ? ['#ffedd5', '#e5f4ff', '#f3e8ff']
          : ['#180b06', '#160525']
      }>
      <SignedIn>
        <View className="flex flex-col h-full max-h-screen">
          <View className="flex h-full border-b">
            <View className="flex-1">
              <View className="flex items-center justify-center w-full h-full px-6 py-4">
                <View>
                  <Text
                    className={`${twc.text.foreground} font-bold text-center font-sans text-2xl mb-6`}>
                    {params.first_name} {params.last_name}
                  </Text>
                  <Text
                    className={`text-center uppercase text-lg ${twc.text.muted}`}>
                    {callStatus || 'No Status'}
                  </Text>
                  <Text
                    className={`text-center uppercase text-lg mt-2 ${twc.text.muted}`}>
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
                      iconOn={<MicOff size={22} color={color.icon.white} />}
                      iconOff={<Mic size={22} color={color.icon.accent} />}
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
                      iconOn={<Volume2 size={22} color={color.icon.white} />}
                      iconOff={<Volume2 size={22} color={color.icon.accent} />}
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
                      iconOn={<Play size={22} color={color.icon.white} />}
                      iconOff={
                        <CirclePause size={22} color={color.icon.accent} />
                      }
                      text="Hold"
                    />
                  </View>
                  <View className="flex items-center">
                    <Pressable
                      className={` w-16 h-16 rounded-full flex justify-center items-center ${twc.bg.danger}`}
                      onPress={() => {
                        call?.outgoingCall?.disconnect();
                      }}>
                      <PhoneOff size={20} color={color.icon.white} />
                    </Pressable>
                  </View>
                </View>
              </View>
            </View>
            <View className="p-4">
              <View>
                <Button
                  variant={'outline'}
                  onPress={() => {
                    navigation.goBack();
                  }}
                  className="flex flex-row items-center gap-4">
                  <ArrowLeft
                    size={18}
                    color={
                      theme === 'light' ? color.icon.black : color.icon.white
                    }
                  />
                  <Text>Go back to details</Text>
                </Button>
              </View>
            </View>
          </View>
        </View>
      </SignedIn>
    </LinearGradient>
  );
}

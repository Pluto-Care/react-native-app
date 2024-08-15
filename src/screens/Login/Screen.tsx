import React from 'react';
import {
  ActivityIndicator,
  ScrollView,
  View,
  useColorScheme,
} from 'react-native';
import Logo from '@src/assets/icon.svg';
import LogoLight from '@src/assets/full_logo_light.svg';
import LogoDark from '@src/assets/full_logo_dark.svg';
import {useForm} from 'react-hook-form';
import {SignedIn, SignedOut, useAuth, useSignIn} from '../../contexts/auth';
import CustomButton from '../../components/ui/CustomButton';
import {getTwColors} from '../../styles/styles';
import LinearGradient from 'react-native-linear-gradient';
import {handleAxiosError} from '../../utils/handleAxiosError';
import {Button} from '@src/components/ui/button';
import {Text} from '@src/components/ui/text';
import Animated, {FadeInDown} from 'react-native-reanimated';
import FormInput from '@src/components/ui/form-input';

export default function LoginScreen({
  navigation,
}: {
  navigation: any;
}): React.JSX.Element {
  const colorScheme = useColorScheme() || 'light';
  const colors = getTwColors(colorScheme);
  const context = useAuth();

  if (context.user) {
    navigation.replace('Dashboard');
  }

  return (
    <LinearGradient
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
      colors={
        colorScheme === 'light'
          ? ['#ffedd5', '#e5f4ff', '#f3e8ff']
          : ['#ce653b', '#2b0948']
      }
      className="h-screen">
      <ScrollView className="h-screen">
        <View className="flex flex-row items-center h-screen">
          <SignedOut>
            <View className="w-full -mt-8">
              <View
                style={{
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 4,
                  },
                  shadowOpacity: 0.2,
                  shadowRadius: 0,
                  elevation: 4,
                }}
                className="px-5 pt-8 pb-6 mx-4 my-6 bg-white rounded-xl dark:bg-zinc-950/95">
                {colorScheme === 'light' ? (
                  <LogoLight height={30} width={150} />
                ) : (
                  <LogoDark height={30} width={150} />
                )}
                <View className="mt-10 mb-4">
                  <Text
                    className={`${colors.text.foreground} text-xl w-full font-bold`}>
                    Sign in to continue
                  </Text>
                </View>
                <SignInForm navigation={navigation} />
              </View>
            </View>
          </SignedOut>
          <SignedIn>
            <View className="flex items-center justify-center h-full gap-10">
              <Animated.View entering={FadeInDown.duration(300)}>
                <Logo width={140} height={140} />
              </Animated.View>
              <Animated.View entering={FadeInDown.duration(300).delay(400)}>
                <ActivityIndicator
                  size="large"
                  className="text-accent-foreground"
                />
              </Animated.View>
            </View>
          </SignedIn>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

function SignInForm({navigation}: {navigation: any}): React.JSX.Element {
  const colorScheme = useColorScheme() || 'light';
  const colors = getTwColors(colorScheme);
  const [isWaiting, setIsWaiting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const {signIn, mfaRequired} = useSignIn();
  const [loginFormData, setLoginFormData] = React.useState<any>({});

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm();

  const onSignInPress = async (data: any) => {
    if (isWaiting) return;
    try {
      setIsWaiting(true);
      await signIn(data['email'], data['password']);
      navigation.navigate('Dashboard');
    } catch (err: any) {
      setLoginFormData(data);
      handleAxiosError(err, setError);
    }
    setIsWaiting(false);
  };

  const onTOTPFilledPress = async (data: any) => {
    if (isWaiting) return;
    try {
      setIsWaiting(true);
      await signIn(
        loginFormData['email'],
        loginFormData['password'],
        data['token'],
      );
      navigation.navigate('Dashboard');
    } catch (err: any) {
      handleAxiosError(err, setError);
    }
    setIsWaiting(false);
  };

  return (
    <View className="w-full">
      {isWaiting ? (
        <View className="absolute z-10 items-center justify-center w-full h-full bg-white/50 dark:bg-zinc-950/30 blur-3xl">
          <ActivityIndicator size="large" color="#758aff" />
        </View>
      ) : (
        <></>
      )}
      {error ? (
        <View className="mt-2 mb-2">
          <Text className={`text-base ${colors.text.danger}`}>{error}</Text>
        </View>
      ) : (
        <></>
      )}
      {mfaRequired ? (
        <TOTPForm onSubmit={onTOTPFilledPress} />
      ) : (
        <>
          <View className={`${colors.border.gray}`}>
            <FormInput
              control={control}
              label="Email Address"
              name="email"
              keyboardType="email-address"
              rules={{required: 'Email is required'}}
            />
            {errors.email && (
              <Text className="px-1 -mt-1 text-red-500">
                {errors.email.message?.toString()}
              </Text>
            )}
            <FormInput
              control={control}
              label="Password"
              name="password"
              keyboardType="default"
              secureTextEntry={true}
              rules={{required: 'Password is required'}}
            />
            {errors.password && (
              <Text className="px-1 -mt-1 text-red-500">
                {errors.password.message?.toString()}
              </Text>
            )}
          </View>
          <View className="mt-6">
            <Button
              variant={'default'}
              className="bg-accent-foreground"
              onPress={handleSubmit(onSignInPress)}>
              <Text>Continue</Text>
            </Button>
          </View>
        </>
      )}
    </View>
  );
}

const TOTPForm = ({onSubmit}: {onSubmit: any}): React.JSX.Element => {
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm();

  return (
    <View>
      <FormInput
        control={control}
        name="token"
        label="6 Digit Code"
        keyboardType="numeric"
        rules={{required: 'OTP is required'}}
      />
      {errors.token && (
        <Text className="px-1 -mt-1 text-red-500">
          {errors.token.message?.toString()}
        </Text>
      )}
      <View className="mt-6">
        <CustomButton
          style="accent"
          text="Continue"
          width="full"
          onClick={handleSubmit(onSubmit)}
        />
      </View>
    </View>
  );
};

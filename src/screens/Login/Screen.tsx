import React, {useEffect} from 'react';
import {ScrollView, View, useColorScheme} from 'react-native';
import {useForm} from 'react-hook-form';
import {SignedIn, SignedOut, useAuth, useSignIn} from '../../contexts/auth';
import CustomButton from '../../components/ui/CustomButton';
import CustomInputField from '../../components/ui/CustomInputField';
import {getTwColors} from '../../styles/styles';
import PlainTopbar from '../../features/topbar/PlainTopbar';
import LinearGradient from 'react-native-linear-gradient';
import {handleAxiosError} from '../../utils/handleAxiosError';
import {Button} from '@src/components/ui/button';
import {Text} from '@src/components/ui/text';

export default function LoginScreen({
  navigation,
}: {
  navigation: any;
}): React.JSX.Element {
  const colorScheme = useColorScheme() || 'light';
  const colors = getTwColors(colorScheme);
  const context = useAuth();

  useEffect(() => {
    if (context.user) {
      navigation.replace('Dashboard');
    }
  }, [context.user, navigation]);

  return (
    <ScrollView>
      <View className={`min-h-screen ${colors.bg.body}`}>
        <SignedOut>
          <View className="h-1/4">
            <LinearGradient
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              colors={
                colorScheme === 'light'
                  ? ['#ffedd5', '#e5f4ff', '#f3e8ff']
                  : ['#ce653b', '#2b0948']
              }
              className="h-full">
              <PlainTopbar />
            </LinearGradient>
          </View>
          <View className="px-6">
            <Text
              className={`${colors.text.foreground} mb-6 mt-8 text-lg w-full font-bold`}>
              Sign in to conitnue
            </Text>
          </View>
          <SignInForm navigation={navigation} />
        </SignedOut>
        <SignedIn>
          <Text
            className={`${colors.text.foreground} mb-16 w-full text-center font-sans-semibold text-base`}>
            Loading your dashboard...
          </Text>
        </SignedIn>
      </View>
    </ScrollView>
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
    <View className="flex flex-col w-full h-96">
      {error ? (
        <View className="mb-4">
          <Text className={`px-6 text-base ${colors.text.danger}`}>
            {error}
          </Text>
        </View>
      ) : (
        <></>
      )}
      {mfaRequired ? (
        <TOTPForm onSubmit={onTOTPFilledPress} />
      ) : (
        <>
          <View className={`flex-1 border-t ${colors.border.gray}`}>
            <CustomInputField
              control={control}
              errors={errors}
              name="email"
              label="Email Address"
              isRequired={true}
              isEmail={true}
            />
            <CustomInputField
              control={control}
              errors={errors}
              name="password"
              isPassword={true}
              isRequired={true}
              label="Password"
            />
            <Text className={`${colors.text.muted} mt-6 mb-4 text-base px-6`}>
              Forgot your password?
            </Text>
          </View>
          <View className="px-4 my-6">
            <Button variant={'default'} onPress={handleSubmit(onSignInPress)}>
              <Text>Continue</Text>
            </Button>
          </View>
        </>
      )}
    </View>
  );
}

const TOTPForm = ({onSubmit}: {onSubmit: any}): React.JSX.Element => {
  const colorScheme = useColorScheme() || 'light';
  const colors = getTwColors(colorScheme);
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm();

  return (
    <View className={`flex-1 border-t ${colors.border.gray}`}>
      <CustomInputField
        control={control}
        errors={errors}
        name="token"
        label="6 Digit Code"
        isRequired={true}
      />
      <View className="px-4 my-6">
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

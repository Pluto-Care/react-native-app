import React from 'react';
import {View, useColorScheme} from 'react-native';
import {Text} from 'react-native';
import {useForm} from 'react-hook-form';
import {SignedIn, SignedOut, useSignIn} from '../../contexts/auth';
import CustomButton from '../../components/ui/CustomButton';
import CustomInputField from '../../components/ui/CustomInputField';
import {getColors} from '../../styles';
import PlainTopbar from '../../features/topbar/PlainTopbar';
import LinearGradient from 'react-native-linear-gradient';
import {handleAxiosError} from '../../utils/handleAxiosError';

export default function LoginScreen({
  navigation,
}: {
  navigation: any;
}): React.JSX.Element {
  const colorScheme = useColorScheme() || 'light';
  const colors = getColors(colorScheme);

  return (
    <View className="min-h-screen bg-white">
      <SignedOut>
        <View className="h-1/4">
          <LinearGradient
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            colors={['#ffedd5', 'rgb(229,244,255)', '#f3e8ff']}
            className="h-full">
            <PlainTopbar />
          </LinearGradient>
        </View>
        <View className="px-6">
          <Text
            className={`${colors.text.primary} mb-6 mt-8 text-lg w-full font-bold`}>
            Sign in to conitnue
          </Text>
        </View>
        <SignInForm navigation={navigation} />
      </SignedOut>
      <SignedIn>
        <Text
          className={`${colors.text.primary} mb-16 w-full text-center font-sans text-xl`}>
          You are already signed in!
        </Text>
        <CustomButton
          text="Go to Dashboard"
          style="accent_hollow"
          width="full"
          onClick={() => {
            navigation.navigate('Dashboard');
          }}
        />
      </SignedIn>
    </View>
  );
}

function SignInForm({navigation}: {navigation: any}): React.JSX.Element {
  const colorScheme = useColorScheme() || 'light';
  const colors = getColors(colorScheme);
  const [isWaiting, setIsWaiting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const {signIn} = useSignIn();

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
      handleAxiosError(err, setError);
    }
    setIsWaiting(false);
  };

  return (
    <View className="flex flex-col w-full h-80">
      {error ? (
        <View className="mb-4">
          <Text className="px-6 text-base text-red-800">{error}</Text>
        </View>
      ) : (
        <></>
      )}
      <View className="flex-1 border-t border-zinc-200">
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
        <Text className={`${colors.text.secondary} mt-6 mb-4 text-base px-6`}>
          Forgot your password?
        </Text>
      </View>
      <View className="px-4 my-6">
        <CustomButton
          style="accent"
          text="Continue"
          width="full"
          onClick={handleSubmit(onSignInPress)}
        />
      </View>
    </View>
  );
}

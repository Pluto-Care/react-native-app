import React from 'react';
import {View, useColorScheme} from 'react-native';
import {Text} from 'react-native';
import {useForm} from 'react-hook-form';
import {SignedIn, SignedOut, useSignIn, useSignOut} from '../../contexts/auth';
import CustomButton from '../../components/ui/CustomButton';
import CustomInputField from '../../components/ui/CustomInputField';
import {getColors} from '../../styles';

export default function LoginScreen(): React.JSX.Element {
  const colorScheme = useColorScheme() || 'light';
  const colors = getColors(colorScheme);
  const {signOut} = useSignOut();

  return (
    <View className="flex flex-1 flex-col items-start justify-center px-5 pb-8 pt-5">
      <SignedOut>
        <Text
          className={`${colors.text.primary} mb-6 mt-3 w-full text-3xl font-medium`}>
          Sign In
        </Text>
        <SignInScreen />
        <Text
          className={`${colors.text.primary} mb-3 mt-8 w-full text-lg font-bold`}>
          Having trouble?
        </Text>
        <Text
          className={`${colors.text.primary} mb-1 border-b border-accent-600 text-base text-accent-600 dark:border-accent-400 dark:text-accent-400`}>
          Reset your password
        </Text>
        <Text
          className={`${colors.text.primary} my-1 border-b border-accent-600 text-base text-accent-600 dark:border-accent-400 dark:text-accent-400`}>
          Contact your support
        </Text>
      </SignedOut>
      <SignedIn>
        <Text
          className={`${colors.text.primary} mb-16 w-full text-center font-sans text-xl`}>
          You are already signed in!
        </Text>
        <CustomButton
          text="Go to Dashboard"
          style="accent"
          width="full"
          onClick={() => {
            // router.push('/dashboard');
          }}
        />
        <View className="py-4" />
        <CustomButton
          text="Sign Out"
          style="accent_hollow"
          width="full"
          onClick={() => {
            signOut();
          }}
        />
      </SignedIn>
    </View>
  );
}

function SignInScreen() {
  const [isWaiting, setIsWaiting] = React.useState(false);
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
    } catch (err: any) {
      console.log(err);
    }
    setIsWaiting(false);
  };

  return (
    <View className="w-full">
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
      <View className="py-2" />
      <CustomButton
        style="accent"
        text="Continue"
        width="full"
        onClick={handleSubmit(onSignInPress)}
      />
    </View>
  );
}

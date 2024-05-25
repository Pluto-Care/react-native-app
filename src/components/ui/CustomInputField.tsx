import * as React from 'react';
import {Control, Controller, FieldErrors, FieldValues} from 'react-hook-form';
import {Text, TextInput, View} from 'react-native';

export interface IInputFieldProps {
  name: string;
  label: string;
  control: Control<FieldValues, any>;
  errors: FieldErrors<FieldValues>;
  defaultValue?: string;
  placeholder?: string;
  isDisabled?: boolean;
  isPassword?: boolean;
  isRequired?: boolean;
  isEmail?: boolean;
  minLength?: number;
  maxLength?: number;
}

type PButton_Style = 'default' | 'accent' | 'danger' | 'success';

const styles: {[key in PButton_Style]: string} = {
  default:
    'bg-white text-black border-zinc-300 dark:bg-zinc-900 dark:text-white dark:border-zinc-700',
  accent: 'bg-white dark:bg-zinc-900 text-black border-accent-600',
  danger:
    'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-300 border-red-600',
  success:
    'bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-100 border-green-600',
};

export default function CustomInputField(props: IInputFieldProps) {
  return (
    <View className="my-1.5 font-sans">
      <View className="mb-1 flex flex-row">
        <Text className="flex-1 text-zinc-600 dark:text-zinc-300">
          {props.label}
        </Text>
        <Text className="text-red-600 dark:text-red-500">
          {props.errors[props.name] ? (
            props.errors[props.name]?.type === 'required' ? (
              'Required'
            ) : props.errors[props.name]?.type === 'minLength' ? (
              'Too short'
            ) : props.errors[props.name]?.type === 'maxLength' ? (
              'Too long'
            ) : typeof props.errors[props.name]?.message === 'string' ? (
              <>{props.errors[props.name]?.message as string}</>
            ) : (
              'Invalid'
            )
          ) : (
            <></>
          )}
        </Text>
      </View>
      <Controller
        control={props.control}
        rules={{
          required: props.isRequired ? 'Required' : false,
          minLength: props.minLength,
          maxLength: props.maxLength,
          pattern: props.isEmail
            ? {
                value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                message: 'Invalid email address',
              }
            : undefined,
        }}
        defaultValue={props.defaultValue}
        disabled={props.isDisabled}
        render={({field: {onChange, onBlur, value}}) => (
          <TextInput
            placeholder={props.placeholder}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            secureTextEntry={props.isPassword}
            className={`rounded-md border px-4 py-2 font-sans text-base shadow-lg ${
              props.errors[props.name] ? styles.danger : styles.default
            }`}
          />
        )}
        name={props.name}
      />
    </View>
  );
}

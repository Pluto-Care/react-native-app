import React from 'react';
import {Control, Controller} from 'react-hook-form';
import {Input} from './input';
import {Label} from './label';
import {View} from 'react-native';

export default function FormInput({
  label,
  name,
  control,
  rules,
  keyboardType,
  secureTextEntry,
  ...props
}: {
  label: string;
  control: Control;
  name: string;
  rules: any;
  keyboardType: 'default' | 'numeric' | 'email-address' | 'phone-pad';
  secureTextEntry?: boolean;
}) {
  return (
    <>
      <Controller
        control={control}
        rules={rules}
        render={({field: {onChange, onBlur, value}}) => (
          <View className="flex gap-1.5 my-2.5">
            <View className="px-1">
              <Label nativeID="name">{label}</Label>
            </View>
            <Input
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              nativeID={name}
              keyboardType={keyboardType}
              secureTextEntry={secureTextEntry || false}
              {...props}
            />
          </View>
        )}
        name={name}
      />
    </>
  );
}

/* eslint-disable radix */
import React from 'react';
import FormInput from '@src/components/ui/form-input';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@src/components/ui/dropdown-menu';
import {Controller, useForm} from 'react-hook-form';
import {
  KeyboardAvoidingView,
  ScrollView,
  View,
  useColorScheme,
} from 'react-native';
import {Text} from '@src/components/ui/text';
import {getColors, getTwColors} from '@src/styles/styles';
import Animated, {FadeInDown} from 'react-native-reanimated';
import {Button} from '@src/components/ui/button';
import {useState} from 'react';
import {Calendar} from 'react-native-calendars';
import {Label} from '@src/components/ui/label';
import {Option} from '@src/components/ui/select';
import {Textarea} from '@src/components/ui/textarea';
import {RadioGroup} from '@src/components/ui/radio-group';
import {useMutation} from '@tanstack/react-query';
import {
  SearchPatientResponseType,
  searchPatientAPI,
} from '@src/services/api/patients/admin/search';
import {debounce} from 'lodash';
import {useAuth} from '@src/contexts/auth';
import {Input} from '@src/components/ui/input';
import {Check} from 'lucide-react-native';
import {Skeleton} from '@src/components/ui/skeleton';
import {CreateAppointmentType} from '@src/services/api/appointment/admin/create';
import {createMyAppointmentAPI} from '@src/services/api/appointment/my/create';
import spacetime from 'spacetime';
import {datePretty} from '../../utils/timeUtils';

const apt_types: Option[] = [
  {label: 'Phone', value: 'phone'},
  {label: 'Video', value: 'video'},
  {label: 'In-person', value: 'in-person'},
];

export default function NewAppointmentTab({navigation}: {navigation: any}) {
  const auth = useAuth();
  const theme = useColorScheme() || 'light';
  const twc = getTwColors(theme);
  const color = getColors(theme);
  const insets = useSafeAreaInsets();
  const contentInsets = {
    top: insets.top,
    bottom: insets.bottom,
    left: 12,
    right: 12,
  };
  const {
    control,
    handleSubmit,
    reset,
    formState: {errors},
  } = useForm();
  const [show, setShow] = useState(false);

  //mutation
  const mutation = useMutation({
    mutationKey: ['add_apt'],
    mutationFn: (data: CreateAppointmentType) =>
      createMyAppointmentAPI(auth.user?.session.key || '', data),
    onSuccess: data => {
      // Redirect to the appointment page
      reset(); // form reset
      navigation.navigate('Appointment', {id: data.id});
    },
  });

  const onSubmit = (data: any) => {
    data['patient'] = data['patient']?.id;
    data['duration'] = parseInt(data['duration']);
    data['assigned_to'] = auth.user?.detail.id;
    data['status'] = 'confirmed';
    mutation.mutate(data);
  };

  return (
    <Animated.View entering={FadeInDown.duration(200)} className="min-h-screen">
      <View className="flex-1 min-h-screen pb-32 mt-3 ml-3 mr-3">
        <View className="px-2 pt-3 pb-5">
          <Text className="font-medium text-[18px] tracking-tight text-foreground">
            Creating new appointment
          </Text>
        </View>
        <ScrollView
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
          className={`rounded-t-xl ${twc.bg.body} dark:bg-zinc-950/70`}>
          <View className="px-4 pt-6 pb-2">
            <Text className="text-[14px] text-muted-foreground">
              Fill in the form below to create a new appointment.
            </Text>
          </View>
          <View className="flex gap-1.5 px-4 py-2">
            <Controller
              control={control}
              rules={{required: 'Patient is required'}}
              name="patient"
              render={({field: {onChange, value}}) => (
                <View className="flex gap-1.5 z-10 py-2.5 w-full">
                  <View className="px-1">
                    <Label nativeID="patient">Patient</Label>
                  </View>

                  <PatientSelector value={value} onChange={onChange} />
                  {errors.patient && (
                    <Text className="px-1 text-red-500">
                      {errors.patient.message?.toString()}
                    </Text>
                  )}
                </View>
              )}
            />
            <Controller
              control={control}
              rules={{required: 'Date is required'}}
              name="date"
              render={({field: {onChange, value}}) => (
                <View className="flex gap-1.5">
                  <Label className="px-2" nativeID="date">
                    Date
                  </Label>
                  <Button
                    variant={'outline'}
                    className="items-start justify-start"
                    onPress={() => {
                      setShow(v => !v);
                    }}>
                    <Text className="-mt-0.5">
                      {value ? datePretty(value) : 'Select a date'}
                    </Text>
                  </Button>
                  {errors.date && (
                    <Text className="px-1 text-red-500">
                      {errors.date.message?.toString()}
                    </Text>
                  )}
                  {show && (
                    <View className="border rounded-lg border-muted-foreground/20">
                      <Calendar
                        onDayPress={day => {
                          onChange(
                            spacetime(
                              new Date(day.dateString)
                                .toISOString()
                                .split('T')[0],
                              auth.user?.detail.timezone || 'UTC',
                            )
                              .goto('UTC')
                              .format('iso'),
                          );
                          setShow(false);
                        }}
                      />
                    </View>
                  )}
                </View>
              )}
            />
            <View className="flex flex-row py-1">
              <View className="w-1/2 pr-2">
                <FormInput
                  control={control}
                  label="Duration (in mins)"
                  name="duration"
                  keyboardType="numeric"
                  rules={{required: 'Duration is required'}}
                />
                {errors.duration && (
                  <Text className="px-1 -mt-1 text-red-500">
                    {errors.duration.message?.toString()}
                  </Text>
                )}
              </View>
              <Controller
                control={control}
                rules={{required: 'Type is required'}}
                name="type"
                render={({field: {onChange, value}}) => (
                  <View className="flex gap-1.5 z-10 py-2.5 w-1/2 pl-2">
                    <View className="px-1">
                      <Label nativeID="date">Type</Label>
                    </View>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="items-start">
                          <Text className="-mt-0.5">
                            {value ?? 'Select type'}
                          </Text>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        insets={contentInsets}
                        className="z-50 w-40 mt-1 native:w-40">
                        <DropdownMenuGroup>
                          {apt_types.map((type, index) => (
                            <DropdownMenuItem
                              key={index}
                              closeOnPress={true}
                              className="p-0 !py-0 !my-0">
                              <Button
                                className="items-start w-full"
                                variant={'ghost'}
                                onPress={() => {
                                  onChange(type?.value);
                                }}>
                                <View className="flex flex-row items-center gap-4">
                                  <View className="flex-1">
                                    <Text>{type?.label}</Text>
                                  </View>
                                  {value && value === type?.value && (
                                    <Check
                                      size={20}
                                      color={color.accent.foreground}
                                    />
                                  )}
                                </View>
                              </Button>
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    {errors.type && (
                      <Text className="px-1 text-red-500">
                        {errors.type.message?.toString()}
                      </Text>
                    )}
                  </View>
                )}
              />
            </View>
            <KeyboardAvoidingView>
              <Controller
                control={control}
                rules={{required: 'Reason is required'}}
                name="reason"
                render={({field: {onChange, value}}) => (
                  <View className="flex gap-1.5">
                    <Label className="px-2" nativeID="reason">
                      Reason
                    </Label>
                    <Textarea
                      placeholder="Write some reason..."
                      value={value}
                      onChangeText={onChange}
                      aria-labelledby="textareaLabel"
                    />
                    {errors.reason && (
                      <Text className="px-1 text-red-500">
                        {errors.reason.message?.toString()}
                      </Text>
                    )}
                  </View>
                )}
              />
            </KeyboardAvoidingView>
            <Controller
              control={control}
              name="start_time"
              rules={{required: 'Start time is required'}}
              render={({field: {onChange, value}}) => (
                <View className="flex gap-1.5 pt-3 pb-2">
                  <View className="px-1 pb-1">
                    <Label nativeID="start_time">Start Time</Label>
                  </View>
                  <View>
                    <RadioGroup value={value} onValueChange={onChange}>
                      <View className="flex flex-row flex-wrap w-full gap-3">
                        {slots('08:00', '18:00').map((time, index) => (
                          <RadioGroupItemWithLabel
                            key={index}
                            value={time}
                            onLabelPress={() => {
                              onChange(time);
                            }}
                            isSelected={value === time}
                          />
                        ))}
                      </View>
                    </RadioGroup>
                  </View>
                  {errors.start_time && (
                    <Text className="px-1 text-red-500">
                      {errors.start_time.message?.toString()}
                    </Text>
                  )}
                  {show && (
                    <View className="border rounded-lg border-muted-foreground/20">
                      <Calendar
                        onDayPress={day => {
                          onChange(
                            new Date(day.dateString)
                              .toISOString()
                              .split('T')[0],
                          );
                          setShow(false);
                        }}
                      />
                    </View>
                  )}
                </View>
              )}
            />
          </View>
        </ScrollView>
        <Button
          variant={'default'}
          size="lg"
          className="rounded-t-none rounded-b-lg bg-accent-foreground"
          onPress={handleSubmit(onSubmit)}>
          <Text>Submit</Text>
        </Button>
      </View>
    </Animated.View>
  );
}

function RadioGroupItemWithLabel({
  value,
  onLabelPress,
  isSelected,
}: {
  value: string;
  onLabelPress: () => void;
  isSelected?: boolean;
}) {
  return (
    <View
      className={`flex-row gap-2 items-center border rounded-md px-2 py-1 ${
        isSelected
          ? 'border-accent-foreground bg-accent-foreground/10'
          : 'border-muted-foreground/20'
      }`}>
      <Label nativeID={`label-for-${value}`} onPress={onLabelPress}>
        <Text
          className={`${
            isSelected ? 'text-accent-foreground' : ' text-muted-foreground'
          }`}>
          {value}
        </Text>
      </Label>
    </View>
  );
}

const toMinutes = (str: string) =>
  str.split(':').reduce((h, m) => (parseInt(h) * 60 + +m).toString());

const toString = (min: number) => {
  const minute = min % 60;
  // append 0 if minute is less than 10
  return `${Math.floor(min / 60)}:${minute < 10 ? '0' + minute : minute}`;
};

function slots(startStr: string, endStr = '16:00') {
  const start: string = toMinutes(startStr);
  const end: string = toMinutes(endStr);
  return Array.from(
    {length: Math.floor((parseInt(end) - parseInt(start)) / 30) + 1},
    (_, i) => toString(parseInt(start) + i * 30),
  );
}

function PatientSelector({
  value,
  onChange,
}: {
  value: SearchPatientResponseType | null;
  onChange: (...event: any[]) => void;
}) {
  const auth = useAuth();
  const [open, setOpen] = React.useState(false);
  const theme = useColorScheme() || 'light';
  const color = getColors(theme);
  const insets = useSafeAreaInsets();
  const contentInsets = {
    top: insets.top,
    bottom: insets.bottom,
    left: 12,
    right: 12,
  };

  const mutation = useMutation({
    mutationKey: ['search_patient'],
    mutationFn: (v: string) =>
      searchPatientAPI(auth.user?.session.key || '', v),
    retry: 1,
  });

  const changeKeyword = debounce((v: string) => {
    if (v.length > 1) {
      mutation.mutate(v);
    }
  }, 500);

  return (
    <DropdownMenu onOpenChange={setOpen}>
      {open ? (
        <Input
          placeholder="Search patient"
          onChangeText={e => {
            changeKeyword(e);
          }}
          autoFocus
        />
      ) : (
        <DropdownMenuTrigger asChild>
          <Button variant={'outline'} className="items-start">
            <View className="-mt-0.5">
              <Text>
                {value
                  ? value.first_name + ' ' + value.last_name
                  : 'Select Patient'}
              </Text>
            </View>
          </Button>
        </DropdownMenuTrigger>
      )}
      {!mutation.isIdle && (
        <DropdownMenuContent
          insets={contentInsets}
          className="z-50 mt-1 w-72 native:w-72"
          style={{
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 4,
            },
            shadowOpacity: 0.4,
            shadowRadius: 0,
            elevation: 10,
          }}>
          <DropdownMenuGroup className="flex gap-2">
            {mutation.isSuccess ? (
              mutation.data.length > 0 ? (
                mutation.data.map(patient => (
                  <DropdownMenuItem
                    key={patient.id}
                    closeOnPress={true}
                    className="p-0 !py-0 !my-0 w-full">
                    <Button
                      className="items-start w-full px-4"
                      size={'lg'}
                      variant={'ghost'}
                      onPress={() => {
                        setOpen(false);
                        onChange(patient);
                      }}>
                      <View className="flex flex-row items-center gap-4">
                        <View className="flex-1">
                          <Text className="!text-[14px]">
                            {patient.first_name} {patient.last_name}
                          </Text>
                          <Text className="font-normal text-muted-foreground !text-[12px] -mt-2">
                            {patient.city}, {patient.state}
                          </Text>
                        </View>
                        {value && value.id === patient.id && (
                          <Check size={20} color={color.accent.foreground} />
                        )}
                      </View>
                    </Button>
                  </DropdownMenuItem>
                ))
              ) : (
                <View className="px-4 py-2">
                  <Text>No patient found.</Text>
                </View>
              )
            ) : mutation.isPending ? (
              <View className="flex gap-1.5">
                <Skeleton className="w-full h-12" />
                <Skeleton className="w-full h-12" />
                <Skeleton className="w-full h-12" />
              </View>
            ) : mutation.isError ? (
              <Text className="text-red-500">Error fetching patients</Text>
            ) : (
              <></>
            )}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      )}
    </DropdownMenu>
  );
}

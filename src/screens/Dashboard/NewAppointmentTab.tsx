import FormInput from '@src/components/ui/form-input';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@src/components/ui/select';
import {Controller, useForm} from 'react-hook-form';
import {
  Platform,
  Pressable,
  ScrollView,
  View,
  useColorScheme,
} from 'react-native';
import {Text} from '@src/components/ui/text';
import {getTwColors} from '@src/styles/styles';
import Animated, {FadeInDown} from 'react-native-reanimated';
import {Button} from '@src/components/ui/button';
import {useState} from 'react';
import {Calendar} from 'react-native-calendars';
import {datePretty} from '@src/utils/timeUtils';
import {Label} from '@src/components/ui/label';

export default function NewAppointmentTab({navigation}: {navigation: any}) {
  const theme = useColorScheme() || 'light';
  const twc = getTwColors(theme);
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
    formState: {errors},
  } = useForm();
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [show, setShow] = useState(false);

  return (
    <Animated.View entering={FadeInDown.duration(200)} className="min-h-screen">
      <View className="flex-1 min-h-screen pb-32 mt-3 ml-3 mr-3">
        <View className="px-2 pt-2 pb-4">
          <Text className="font-medium text-[17px] tracking-tight text-foreground">
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
          <View className="px-4 pt-6">
            <Text className="text-[14px] text-foreground">
              Fill in the form below to create a new appointment
            </Text>
          </View>
          <View className="px-4 py-2">
            <Controller
              control={control}
              rules={{required: 'Type is required'}}
              name="date"
              render={({field: {onChange, onBlur, value}}) => (
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
                    <Text className="-mt-0.5">{value}</Text>
                  </Button>
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
            <FormInput
              control={control}
              label="Name"
              name="name"
              rules={{required: 'Name is required'}}
            />
            {errors.name && <Text>Some error</Text>}
            {errors.type && <Text>Some error type</Text>}
            {errors.date && <Text>Some error date</Text>}
            <Controller
              control={control}
              rules={{required: 'Type is required'}}
              render={({field: {onChange, onBlur, value}}) => (
                <Select
                  value={{value: value, label: 'Voice'}}
                  onValueChange={value => {
                    console.log(value);
                    onChange(value);
                  }}>
                  <SelectTrigger className="w-[250px]">
                    <SelectValue
                      className="text-sm text-foreground native:text-lg"
                      placeholder="Select type"
                    />
                  </SelectTrigger>
                  <SelectContent insets={contentInsets} className="w-[250px]">
                    <SelectGroup>
                      <SelectLabel>Types</SelectLabel>
                      <SelectItem label="Voice" value="voice">
                        Voice
                      </SelectItem>
                      <SelectItem label="Video" value="video">
                        Video
                      </SelectItem>
                      <SelectItem label="In-person" value="in-person">
                        In-person
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
              name="type"
            />
          </View>
        </ScrollView>
        <Button
          variant={'default'}
          size="lg"
          className="rounded-t-none rounded-b-lg bg-accent-foreground"
          onPress={handleSubmit(data => {
            console.log(data);
          })}>
          <Text>Submit</Text>
        </Button>
      </View>
    </Animated.View>
  );
}

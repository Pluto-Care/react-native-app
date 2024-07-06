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
import {useForm} from 'react-hook-form';
import {ScrollView, View, useColorScheme} from 'react-native';
import {Text} from '@src/components/ui/text';
import {getTwColors} from '@src/styles/styles';
import Animated, {FadeInDown} from 'react-native-reanimated';
import {Button} from '@src/components/ui/button';

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
            <FormInput
              control={control}
              label="Name"
              name="name"
              rules={{required: 'Name is required'}}
            />
            <Select defaultValue={{value: 'apple', label: 'Apple'}}>
              <SelectTrigger className="w-[250px]">
                <SelectValue
                  className="text-sm text-foreground native:text-lg"
                  placeholder="Select a fruit"
                />
              </SelectTrigger>
              <SelectContent insets={contentInsets} className="w-[250px]">
                <SelectGroup>
                  <SelectLabel>Fruits</SelectLabel>
                  <SelectItem label="Apple" value="apple">
                    Apple
                  </SelectItem>
                  <SelectItem label="Banana" value="banana">
                    Banana
                  </SelectItem>
                  <SelectItem label="Blueberry" value="blueberry">
                    Blueberry
                  </SelectItem>
                  <SelectItem label="Grapes" value="grapes">
                    Grapes
                  </SelectItem>
                  <SelectItem label="Pineapple" value="pineapple">
                    Pineapple
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </View>
        </ScrollView>
        <Button
          variant={'default'}
          size="lg"
          className="rounded-t-none rounded-b-lg bg-accent-foreground">
          <Text>Submit</Text>
        </Button>
      </View>
    </Animated.View>
  );
}

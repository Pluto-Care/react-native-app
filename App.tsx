/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import './src/global.css';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import LoginScreen from './src/screens/Login/Screen';
import {AuthProvider} from './src/contexts/auth';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import AppointmentScreen from './src/screens/Dashboard/Appointment/Screen';
import CallScreen from '@src/screens/Dashboard/Calling/Screen';
import {PortalHost} from '@rn-primitives/portal';
import {DashboardScreen} from '@src/screens/Dashboard/Screen';

const Stack = createNativeStackNavigator();

export const MyQueryClient = new QueryClient();

export const CallContext = React.createContext<any>(null);

function App(): React.JSX.Element {
  const [call, setCall] = React.useState<any>(null);

  return (
    <>
      <QueryClientProvider client={MyQueryClient}>
        <AuthProvider>
          <CallContext.Provider value={{call, setCall}}>
            <NavigationContainer>
              <Stack.Navigator>
                <Stack.Screen
                  options={{headerShown: false}}
                  name="Login"
                  component={LoginScreen}
                />
                <Stack.Screen
                  options={{headerShown: false}}
                  name="Dashboard"
                  component={DashboardScreen}
                />
                <Stack.Screen
                  options={{headerShown: false}}
                  name="Appointment"
                  component={AppointmentScreen}
                />
                <Stack.Screen
                  options={{headerShown: false}}
                  name="Calling"
                  component={CallScreen}
                />
              </Stack.Navigator>
            </NavigationContainer>
          </CallContext.Provider>
        </AuthProvider>
      </QueryClientProvider>
      <PortalHost />
    </>
  );
}

export default App;

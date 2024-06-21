/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import LoginScreen from './src/screens/Login/Screen';
import {AuthProvider} from './src/contexts/auth';
import DashboardScreen from './src/screens/Dashboard/Screen';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import AppointmentScreen from './src/screens/Dashboard/Appointment/Screen';

const Stack = createNativeStackNavigator();

export const MyQueryClient = new QueryClient();

function App(): React.JSX.Element {
  return (
    <QueryClientProvider client={MyQueryClient}>
      <AuthProvider>
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
          </Stack.Navigator>
        </NavigationContainer>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

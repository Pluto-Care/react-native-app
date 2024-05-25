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

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
  return (
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
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}

export default App;

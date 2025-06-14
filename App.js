import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import ReportFormScreen from './screens/ReportFormScreen';
import ReportListScreen from './screens/ReportListScreen';

const Stack = createNativeStackNavigator();

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#eaf0fb',
    primary: '#007bff',
    card: '#fff',
    text: '#1a2233',
    border: '#e0e0e0',
    notification: '#007bff',
  },
};

export default function App() {
  return (
    <NavigationContainer theme={MyTheme}>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#fff',
            borderBottomWidth: 0,
            shadowColor: 'transparent',
            elevation: 0,
          },
          headerTintColor: '#007bff',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 21,
            letterSpacing: 0.5,
          },
          contentStyle: {
            backgroundColor: '#eaf0fb',
          },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: 'The Torch🚥🚦🚥🚦🚥',
            headerTitleAlign: 'center',
          }}
        />
        <Stack.Screen
          name="New Report"
          component={ReportFormScreen}
          options={{
            title: 'Submit Report',
            headerTitleAlign: 'center',
          }}
        />
        <Stack.Screen
          name="All Reports"
          component={ReportListScreen}
          options={{
            title: 'All Reports',
            headerTitleAlign: 'center',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

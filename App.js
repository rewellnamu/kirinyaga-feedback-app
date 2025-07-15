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
            backgroundColor: 'blue',
            borderBottomWidth: 0,
            shadowColor: 'transparent',
            elevation: 0,
          },
          headerTintColor: '#ecedf0ff',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 28,
            letterSpacing: 0.5,
            fontFamily: 'Poppins',
            border: 'dashed 5px #0a0303ff',
            borderRadius: 10,
            padding: 5,
          },
          contentStyle: {
            backgroundColor: '#010307ff',
            
          },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: 'County Arena',
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

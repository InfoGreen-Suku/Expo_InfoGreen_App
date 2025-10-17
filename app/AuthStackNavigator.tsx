import Login from "@/pages/Login";
import Network from "@/pages/NetworkScreen";
import Splashscreen from "@/pages/SplashScreen";
import WelcomeScreen from "@/pages/WelcomeScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const AuthStack = createNativeStackNavigator();

const AuthStackNavigator = () => {
  return (
    <SafeAreaView style={{ flex: 1}}>
    <AuthStack.Navigator initialRouteName="Splashscreen" screenOptions={{ headerShown: false }}>
      <AuthStack.Screen
        name="Splashscreen"
        component={Splashscreen}
      />
      <AuthStack.Screen
        name="Login"
        component={Login}
      />
      <AuthStack.Screen
        name="Network"
        component={Network}
      />
      <AuthStack.Screen
        name="WelcomeScreen"
        component={WelcomeScreen}
      />
      {/* Add other screens here */}
    </AuthStack.Navigator>
    </SafeAreaView>
  );
};

export default AuthStackNavigator;

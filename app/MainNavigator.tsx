import CameraScreen from "@/pages/CameraScreen";
import OpenLink from "@/pages/OpenLinkScreen";
import PDF from "@/pages/PDF";
import PendingScreen from "@/pages/PendingScreen";
import PermissionScreen from "@/pages/PermissionScreen";
import Pin from "@/pages/PinScreen";
import Print from "@/pages/Print";
import Record from "@/pages/RecordScreen";
import Sharedfile from "@/pages/SharedFileScreen";
import VerificationScreen from "@/pages/VerificationScreen";
import Webview from "@/pages/Webview";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";


const MainStack = createNativeStackNavigator();
export default function MainNavigator() {
  const userData = useSelector((store: any) => store?.user?.userData);

  // Determine initial route based on userStatus
  // const initialRouteName = userStatus === 'success' ? 'Webview' : 'PendingScreen';
  const initialRouteName = () => {
    if (userData ) {
      switch (userData?.authentication) {
        case 'yes':
          return userData?.status === 'success' ? 'Pin' : 'PendingScreen';
        case 'no':
          return userData?.status === 'success' ? 'Webview' : 'PendingScreen';
        default:
          return 'PendingScreen';
      }
    }
  };
  const initRoute = initialRouteName();
  return (
    <SafeAreaView style={{ flex: 1}}>
    <MainStack.Navigator screenOptions={{ headerShown: false }} initialRouteName={initRoute}>
      <MainStack.Screen name="PendingScreen" component={PendingScreen} />
      <MainStack.Screen name="PermissionScreen" component={PermissionScreen} />
      <MainStack.Screen name="VerificationScreen" component={VerificationScreen} />
      <MainStack.Screen name="OpenLink" component={OpenLink} />
      <MainStack.Screen name="Webview" component={Webview} />
      <MainStack.Screen name="PDF" component={PDF} />
      <MainStack.Screen name="Print" component={Print} />
      <MainStack.Screen name="Pin" component={Pin} />
      <MainStack.Screen name="Record" component={Record} />
      <MainStack.Screen name="Camera" component={CameraScreen} />
      <MainStack.Screen name="Sharedfile" component={Sharedfile} />
    </MainStack.Navigator>
    </SafeAreaView>
  )
}



import { scaleFont } from '@/constants/ScaleFont';
import { postUserDetails } from '@/hooks/api/postUserDetails';
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, BackHandler, Dimensions, Image, ImageBackground, KeyboardAvoidingView, Modal, PermissionsAndroid, Platform, ScrollView, Text, TextInput, TouchableHighlight, View } from 'react-native';
import { OneSignal } from 'react-native-onesignal';

import { PermissionModal } from '@/constants/utils/permissionModal';
import { CameraType, CameraView } from 'expo-camera';
import DeviceInfo from 'react-native-device-info';
import { useDispatch, useSelector } from 'react-redux';
import { styles } from './style';
const ScreenHeight = Dimensions.get('window').height;
export default function Login() {
  const navigation = useNavigation<any>();
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [appCode, setAppCode] = useState('');
  const [nameError, setNameError] = useState('');
  const [companyNameError, setCompanyNameError] = useState('');
  const [mobileNumberError, setMobileNumberError] = useState('');
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [AndroidID, setAndroidID] = useState('');
  const dispatch = useDispatch();
  const currentDate = new Date();
  const secretKey =
    'InfoGreen#!@#$%' +
    currentDate.getHours().toString().padStart(2, '0') +
    currentDate.getMinutes().toString().padStart(2, '0');
  const plaintext = 'InfoGreen_App';
  const isLoading = useSelector((state: any) => state.user.loading); // handle notification
  const [visible, setisvisible] = useState(false);
  const [facing, setFacing] = useState<CameraType>('back');
  const [scanned, setScanned] = useState(false);
  const [permissionModalVisible, setPermissionModalVisible] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState<any>(null);
  useEffect(() => {
    getAllDeviceInfo()
  }, []);

  useEffect(() => {
    if (isCameraOpen) {
      setScanned(false);
    }
  }, [isCameraOpen]);


  const getAllDeviceInfo = async () => {
    try {
      const [
        androidApiLevel,
        androidID,
        brand,
        systemName,
        systemVersion,
        applicationBuildVersion,
        operatorName,
        device,
        deviceID,
        deviceName,
        fontScale,
        hardware,
        ipAddress,
        macAddress,
        manufacturer,
        modal,
        productName,
        applicationVersion,
        appName
      ] = await Promise.all([
        DeviceInfo.getApiLevel(),
        DeviceInfo.getAndroidId(),
        DeviceInfo.getBrand(),
        DeviceInfo.getSystemName(),
        DeviceInfo.getSystemVersion(),
        DeviceInfo.getBuildNumber(),
        DeviceInfo.getCarrier(),
        DeviceInfo.getDevice(),
        DeviceInfo.getDeviceId(),
        DeviceInfo.getDeviceName(),
        DeviceInfo.getFontScale(),
        DeviceInfo.getHardware(),
        DeviceInfo.getIpAddress(),
        DeviceInfo.getMacAddress(),
        DeviceInfo.getManufacturer(),
        DeviceInfo.getModel(),
        DeviceInfo.getProduct(),
        DeviceInfo.getVersion(),
        DeviceInfo.getApplicationName()
      ]);

      const deviceInfo = {
        androidApiLevel,
        androidID,
        brand,
        systemName,
        systemVersion,
        applicationBuildVersion,
        operatorName,
        device,
        deviceID,
        deviceName,
        fontScale,
        hardware,
        ipAddress,
        macAddress,
        manufacturer,
        modal,
        productName,
        applicationVersion,
        appName
      };
      setDeviceInfo(deviceInfo);
    } catch (error) {
      console.error('Error getting device info:', error);
    }
  };

  const checkNetworkStatus = () => {
    NetInfo.fetch().then(state => {
      if (!state.isConnected) {
        navigation.navigate('Network'); // Navigate to network error page
      } else {
        saveUserDetails();
      }
    });
  };

  const checkPermissions = async () => {
    const granted = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.CAMERA,
    );
    if (!granted) {
      setIsCameraOpen(false);
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
      ).then(granted => {
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          setIsCameraOpen(true);
        }
        else {
          console.log("Permission denied");
          setIsCameraOpen(false);
          setPermissionModalVisible(true);
        }
      });
    }
    else {
      setIsCameraOpen(true);
    }
  };

  const requestStoragePermission = async () => {
    
    try {
      const granted = await PermissionsAndroid.requestMultiple(
        [PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES, PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE],
      );
      if (granted['android.permission.READ_MEDIA_IMAGES'] === PermissionsAndroid.RESULTS.GRANTED && granted['android.permission.READ_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED) {
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error requesting storage permission:', error);
      return false;
    }
  }
  // const method = 'aes-256-cbc';

  // // Generate a random IV (Initialization Vector)
  // const iv = CryptoJS.lib.WordArray.random(16); // 16 bytes IV for AES-256-CBC

  // // Encrypt
  // const encrypted = CryptoJS.AES.encrypt(
  //   plaintext,
  //   CryptoJS.enc.Utf8.parse(secretKey),
  //   {
  //     iv: iv,
  //     mode: CryptoJS.mode.CBC,
  //     padding: CryptoJS.pad.Pkcs7,
  //   },
  // );

  // // Concatenate IV and ciphertext
  // const ciphertextWithIV = iv.concat(encrypted.ciphertext);

  // // Convert the encrypted data to a Base64 string
  // const ciphertext = ciphertextWithIV.toString(CryptoJS.enc.Base64);

  // getting androidID




  // Saving the user details and posting it into api
  const saveUserDetails = async () => {

    try {
      // Checking input field
      let isError = false;

      if (!name) {
        setNameError('Please enter your name');
        isError = true;
      } else {
        setNameError('');
      }

      if (!companyName) {
        setCompanyNameError('Please enter your company name');
        isError = true;
      } else {
        setCompanyNameError('');
      }

      if (!mobileNumber) {
        setMobileNumberError('Please enter your mobile number');
        isError = true;
      } else {
        setMobileNumberError('');
      }

      if (!isError) {
        // Geting SUBSCRIPTION ID
        const id =
          await OneSignal.User.pushSubscription.getIdAsync();

        // Storing to local storage
        const userId = deviceInfo.androidID;
        console.log(id);
        const userDetails = {
          userId,
          name,
          companyName,
          mobileNumber,
          appCode,
          subscriptionId: id,
          deviceInfo: deviceInfo,
          appName: deviceInfo.appName,
          // ciphertext: ciphertext,
          // key: secretKey,
        };
        // console.log(userDetails);

        await AsyncStorage.setItem('userDetails', JSON.stringify(userDetails));
        setisvisible(true);
        // store to server useing axios post method under the keyword of "userDetails"
        const details = await postUserDetails(userDetails);
        dispatch({ type: 'POST_USER_SUCCESS', payload: details });
        // console.log("details", details);
        // navigation.navigate('Webview');
        // Alert.alert('Success', 'User details stored successfully');
      }
    } catch (error) {
      console.error('Error saving user details:', error);
    }
  };
  // const codeScanner = useCodeScanner({
  //   codeTypes: ['qr'],
  //   onCodeScanned: codes => {
  //     handleQRCodeScan(codes[0].value);
  //   },
  // });
  // Handle QRcode for auto filling user details
  const handleQRCodeScan = async (data: any) => {
    try {
      const scannedData = JSON.parse(data);
      setName(scannedData.name || '');
      setCompanyName(scannedData.companyName || '');
      setMobileNumber(scannedData.mobileNumber || '');
      setAppCode(scannedData.appCode || '');
      setIsCameraOpen(false);
    } catch (error) {
      console.error('Error parsing scanned QR code data:', error);
      Alert.alert('Error', 'Failed to parse scanned QR code data');
    }
  };

  // handle BackButton for moving back to the previous page or exit app.
  useEffect(() => {


    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        navigation.goBack();
        return true;
      },
    );




    return () => backHandler.remove();
  }, []);

  return (

    <ImageBackground
      source={require('../../assets/images/background.png')}
      style={styles.background}>
      <View style={{ alignItems: 'center', marginTop: scaleFont(50) }}>
        <Image
          style={{ height: scaleFont(100), width: '70%', resizeMode: 'contain' }}
          source={require('../../assets/images/Logo.png')}
        />
      </View>
      <KeyboardAvoidingView
        behavior="padding"
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 50}>

        <ScrollView
          contentContainerStyle={{ marginTop: scaleFont(40), paddingHorizontal: scaleFont(20) }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <View style={styles.container}>

            <Text style={styles.header}>ENTER YOUR DETAILS</Text>
            <Text style={styles.text}>Name</Text>
            <View style={{ flexDirection: 'row' }}>
              <Entypo name="user" size={20} color="#009333" style={{ marginTop: 10 }} />
              <View style={{ position: 'relative', width: '80%' }}>
                <TextInput
                  style={[
                    styles.input,
                    nameError ? { borderBottomColor: 'red', borderBottomWidth: 1 } : null,
                  ]}
                  placeholder="Enter your name"
                  placeholderTextColor="lightgray"
                  keyboardType="default"
                  inputMode="text"
                  value={name}
                  onChangeText={text => {
                    // Allow only letters and single spaces between words
                    let filteredText = text.replace(/[^a-zA-Z\s]/g, '').replace(/\s{2,}/g, ' ');
                    // Capitalize first letter of each word
                    filteredText = filteredText.replace(/\b\w/g, char => char.toUpperCase());
                    setName(filteredText);
                    setNameError('');
                  }}
                  onFocus={() => setNameError('')}
                />
                {nameError && <AntDesign name="exclamation-circle" size={24} color="red" style={{ position: 'absolute', right: 0, bottom: 15 }} /> }
              </View>
            </View>

            <Text style={styles.text}>Company / Institution Name</Text>
            <View style={{ flexDirection: 'row' }}>
              <MaterialCommunityIcons name="office-building" size={25} color="#009333" style={{ marginTop: 10 }} />
              <View style={{ position: 'relative', width: '80%' }}>
                <TextInput
                  style={[
                    styles.input,
                    companyNameError ? { borderBottomColor: 'red', borderBottomWidth: 1 } : null,
                  ]}
                  placeholder="Enter your Company name"
                  placeholderTextColor="lightgray"
                  keyboardType="default"
                  inputMode="text"
                  value={companyName}
                  onChangeText={text => {
                    // Allow only letters and single spaces between words
                    let filteredText = text.replace(/[^a-zA-Z\s]/g, '').replace(/\s{2,}/g, ' ');
                    // Capitalize first letter of each word
                    filteredText = filteredText.replace(/\b\w/g, char => char.toUpperCase());
                    setCompanyName(filteredText);
                    setCompanyNameError('');
                  }}
                  onFocus={() => setCompanyNameError('')}
                />
                {companyNameError && <AntDesign name="exclamation-circle" size={24} color="red" style={{ position: 'absolute', right: 0, bottom: 15 }} /> }
              </View>

            </View>

            <Text style={styles.text}>Mobile Number</Text>
            <View style={{ flexDirection: 'row' }}>
              <Feather name="phone" size={22} color="#009333" style={{ marginTop: 10 }} />
              <View style={{ position: 'relative', width: '80%' }}>
              <TextInput
                style={[
                  styles.input,
                  mobileNumberError ? { borderBottomColor: 'red', borderBottomWidth: 1 } : null,
                ]}
                placeholder="Enter your Mobile number"
                placeholderTextColor="lightgray"
                keyboardType="numeric"
                value={mobileNumber}
                onChangeText={text => {
                  // Allow only numbers and limit to 10 digits
                  const filteredText = text.replace(/[^0-9]/g, '').slice(0, 10);
                  setMobileNumber(filteredText);
                  setMobileNumberError('');
                }}
                maxLength={10}
                  onFocus={() => setMobileNumberError('')}
                />
                {mobileNumberError && <AntDesign name="exclamation-circle" size={24} color="red" style={{ position: 'absolute', right: 0, bottom: 15 }} /> }
              </View>
            </View>

            {/* <Text style={styles.text}>App Code</Text>
              <View style={{flexDirection: 'row'}}>
              <Entypo name="dial-pad" size={20} color="#009333"  style={{marginTop: 10}}/>
                <TextInput
                  style={[styles.input]}
                  placeholder="Enter your App code"
                  placeholderTextColor="lightgray"
                  keyboardType="default"
                  value={appCode}
                  onChangeText={text => {
                    setAppCode(text);
                  }}
                />
              </View> */}
            <View style={styles.button}>
              <TouchableHighlight
                style={{
                  backgroundColor: '#009333',
                  padding: 6,
                  borderRadius: 10,

                  width: 200,
                }}
                onPress={checkNetworkStatus}
                underlayColor={'#009333'}>
                <Text
                  style={{
                    textAlign: 'center',
                    color: '#fff',
                    fontWeight: 400,
                    fontSize: scaleFont(20),
                  }}>
                  Register
                </Text>
              </TouchableHighlight>
              {/* <Button
                  title="Register"
                  buttonStyle={{backgroundColor:'#009333',padding:5,borderRadius:10,width:200}}
                  onPress={checkNetworkStatus}
                /> */}
            </View>
            <View style={styles.button}>
              <TouchableHighlight
                style={{
                  backgroundColor: '#009333',
                  padding: 6,
                  borderRadius: 10,
                  width: 200,
                }}
                onPress={checkPermissions}
                underlayColor={'#009333'}>
                <Text
                  style={{
                    textAlign: 'center',
                    color: '#fff',
                    fontWeight: 400,
                    fontSize: scaleFont(20),
                  }}>
                  Scan QR Code
                </Text>
              </TouchableHighlight>
              {/* <Button
                  title="Scan QR Code"
                  buttonStyle={{
                    backgroundColor: '#009333',
                    padding: 5,
                    borderRadius: 10,
                    width: 200,
                  }}
                  onPress={() => setIsCameraOpen(true)}
                /> */}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>


      {isCameraOpen && (
        <Modal
          visible={isCameraOpen}
          onRequestClose={() => setIsCameraOpen(!isCameraOpen)}
          animationType="slide" >
          <View style={styles.cameraContainer}>

            <View style={styles.cameraHeader}>
              <Text style={styles.barcodeText}>BarCode Scanner</Text>
              <AntDesign name="close-circle" size={30} color={'#fff'}
                onPress={() => setIsCameraOpen(false)} />

            </View>
            <View style={styles.camerabordercontainer}>
              <CameraView
                style={styles.cameraPreview}
                facing={facing}
                barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
                onBarcodeScanned={(result: any) => {
                  if (scanned) return;
                  setScanned(true);
                  if (result?.data) {
                    handleQRCodeScan(result.data);
                  }
                }}
              />
              {/* Scanner Frame Overlay */}
              <View style={styles.scannerFrame}>
                <View />
                <View />
                <View />
                <View />
              </View>
            </View>
          </View>
        </Modal>

      )}

      <View >
        <Modal
          animationType="slide"
          transparent={true}
          visible={visible}
          onRequestClose={isLoading}>
          <View >
            <View style={styles.modalView}>
              <ActivityIndicator size="large" color="#00ff00" />

            </View>
          </View>
        </Modal>
        <PermissionModal visible={permissionModalVisible} onClose={() => setPermissionModalVisible(false)} />
      </View>

    </ImageBackground>


  );
};


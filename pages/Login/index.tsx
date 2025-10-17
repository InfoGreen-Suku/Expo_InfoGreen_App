import { scaleFont } from '@/constants/ScaleFont';
import { postUserDetails } from '@/hooks/api/postUserDetails';
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { useNavigation } from '@react-navigation/native';
import * as Application from 'expo-application';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, BackHandler, Dimensions, Image, ImageBackground, KeyboardAvoidingView, Modal, Platform, ScrollView, Text, TextInput, TouchableHighlight, View } from 'react-native';
import { OneSignal } from 'react-native-onesignal';

import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
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
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    const androidId = Application.getAndroidId();
    setAndroidID(androidId);

    if (permission?.status !== 'granted') {
      requestPermission();
    }
  }, [permission]);

  useEffect(() => {
    if (isCameraOpen) {
      setScanned(false);
    }
  }, [isCameraOpen]);

  const checkNetworkStatus = () => {
    NetInfo.fetch().then(state => {
      if (!state.isConnected) {
        navigation.navigate('Network'); // Navigate to network error page
      } else {
        saveUserDetails();
      }
    });
  };

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
        const userId = AndroidID;
        console.log(id);
        const userDetails = {
          userId,
          name,
          companyName,
          mobileNumber,
          appCode,
          subscriptionId: id,
          // ciphertext: ciphertext,
          // key: secretKey,
        };
        console.log(userDetails);

        await AsyncStorage.setItem('userDetails', JSON.stringify(userDetails));
        setisvisible(true);
        // store to server useing axios post method under the keyword of "userDetails"
        const details = await postUserDetails(userDetails);
        dispatch({ type: 'POST_USER_SUCCESS', payload: details });
        console.log("details", details);
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

      <KeyboardAvoidingView
        behavior="padding"
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 50}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: ScreenHeight*0.1 }}>
          <Image
            style={{ height: scaleFont(85), width: '70%', marginBottom: scaleFont(20) }}
            source={require('../../assets/images/Logo1.png')}
          />
        </View>
        <ScrollView
          contentContainerStyle={{ paddingTop: scaleFont(50), paddingHorizontal: scaleFont(20) }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <View style={styles.container}>

            <Text style={styles.header}>ENTER YOUR DETAILS</Text>
            <Text style={styles.text}>Name</Text>
            <View style={{ flexDirection: 'row' }}>
              <Entypo name="user" size={20} color="#009333" style={{ marginTop: 10 }} />
              <TextInput
                style={[
                  styles.input,
                  nameError ? { borderBottomColor: 'red' } : null,
                ]}
                placeholder="Enter your name"
                placeholderTextColor="lightgray"
                keyboardType="default"
                value={name}
                onChangeText={text => {
                  setName(text);
                  setNameError('');
                }}
                onFocus={() => setNameError('')}
              />
            </View>
            {nameError ? <Text style={styles.error}>{nameError}</Text> : null}
            <Text style={styles.text}>Company Name</Text>
            <View style={{ flexDirection: 'row' }}>
              <MaterialCommunityIcons name="office-building" size={25} color="#009333" style={{ marginTop: 10 }} />
              <TextInput
                style={[
                  styles.input,
                  companyNameError ? { borderBottomColor: 'red' } : null,
                ]}
                placeholder="Enter your Company name"
                placeholderTextColor="lightgray"
                keyboardType="default"
                value={companyName}
                onChangeText={text => {
                  setCompanyName(text);
                  setCompanyNameError('');
                }}
                onFocus={() => setCompanyNameError('')}
              />
            </View>
            {companyNameError ? (
              <Text style={styles.error}>{companyNameError}</Text>
            ) : null}
            <Text style={styles.text}>Mobile Number</Text>
            <View style={{ flexDirection: 'row' }}>
              <Feather name="phone" size={22} color="#009333" style={{ marginTop: 10 }} />
              <TextInput
                style={[
                  styles.input,
                  mobileNumberError ? { borderBottomColor: 'red' } : null,
                ]}
                placeholder="Enter your Mobile number"
                placeholderTextColor="lightgray"
                keyboardType="numeric"
                value={mobileNumber}
                onChangeText={text => {
                  setMobileNumber(text);
                  setMobileNumberError('');
                }}
                onFocus={() => setMobileNumberError('')}
              />
            </View>
            {mobileNumberError ? (
              <Text style={styles.error}>{mobileNumberError}</Text>
            ) : null}
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
                onPress={() => setIsCameraOpen(true)}
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
      </View>

    </ImageBackground>


  );
};


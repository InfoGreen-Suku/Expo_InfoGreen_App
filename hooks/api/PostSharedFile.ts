import { View, Text } from 'react-native'
import React from 'react'
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const  PostSharedFile= async(formData: any)=> {
    // console.log(formData);
    try {
        let apiSharedfileUrl = 'https://infogreen.synology.me:82/api.php'; // Fallback URL
        const response = await axios.post(apiSharedfileUrl, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
    //   console.log(response.data);
    return response.data
    } catch (error) {
      console.log("error",error);  
    }
}
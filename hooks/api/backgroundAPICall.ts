import { View, Text } from 'react-native'
import React from 'react'
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const  makeApiCall= async()=> {
    // console.log(formData);
    try {
        let apiSharedfileUrl = 'https://67386c2e4eb22e24fca7e0a5.mockapi.io/cloudbook/api/reminder'; // Fallback URL
        const response = await axios.get(apiSharedfileUrl);
    //   console.log(response.data);
    return response.data
    } catch (error) {
      console.log("error",error);  
    }
}
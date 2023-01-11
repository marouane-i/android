import { useNavigation } from '@react-navigation/core'
import React, { useEffect, useState } from 'react'
import {ToastAndroid, Alert, Image, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import {data} from './data'
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  console.log("DKSLJFSKDFJ "+data.base_url)
  const navigation = useNavigation()

  useEffect(() => {

  }, [])
  const handleLogin = () => {
    if(email=="" || password==""){
      ToastAndroid.show("email et mot de pass ne peut pas entre vide!",ToastAndroid.show)
    }else{
      axios.post(`http://${data.base_url}/login`, {
        email,password
      })
      .then(async function (response) {
        console.log(response.data);
        navigation.replace("Home");
        try{
          await AsyncStorage.setItem("tokens",response.data.access_token);
        }catch(error){
          console.log(error)
        }
      })
      .catch(function (error) {
        ToastAndroid.show("email ou mot de pass n'est pas valid!",ToastAndroid.show)
      });
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
    > 
      <Image source={require('../assets/images/adaptive-icon.png')} style={styles.icon}/>
      <Text style={styles.logo}>Transfer <Text style={styles.national}>National</Text></Text>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={text => setEmail(text)}
          style={styles.input}
        />
        <TextInput
          placeholder="Mot de pass"
          value={password}
          onChangeText={text => setPassword(text)}
          style={styles.input}
          secureTextEntry
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={handleLogin}
          style={styles.button}
        >
          <Text style={styles.buttonText}>S'authentifier</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}

export default LoginScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  national:{
    color:'#0782F9',
  },
  icon:{
    width: 200,
    height: 100,
    marginRight:10
  },
  logo:{
    fontSize:30,
    marginVertical:20
  },
  inputContainer: {
    width: '80%'
  },
  input: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
    marginVertical:10
  },
  buttonContainer: {
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  button: {
    backgroundColor: '#0782F9',
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonOutline: {
    backgroundColor: 'white',
    marginTop: 5,
    borderColor: '#0782F9',
    borderWidth: 2,
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  buttonOutlineText: {
    color: '#0782F9',
    fontWeight: '700',
    fontSize: 16,
  },
})

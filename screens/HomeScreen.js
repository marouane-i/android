import { useNavigation } from '@react-navigation/core'
import React from 'react'
import {ToastAndroid,Alert,ScrollView, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native'
import {data} from './data'
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';



const HomeScreen = () => {
  const [user,setUser] = React.useState({});
  const [transfers,setTransfers]=React.useState([]);
  const getUser = async () => {
    try {
      return await AsyncStorage.getItem("tokens");
    } catch (error) {
      console.log(error);
    }
  };
  React.useEffect(()=>{
      const cur = getUser();
      cur.then((res)=>{
        const token = res;
        axios.get(`http://${data.base_url}/users/me`,{
        headers: {
          'Authorization': 'Bearer '+res 
          }
        })
        .then(function (response) {
          console.log(response.data)
          AsyncStorage.setItem("user",JSON.stringify(response.data))
          setUser(response.data)
          axios.get(`http://${data.base_url}/transfers`,{
          headers: {
            'Authorization': 'Bearer '+token 
            }
          }).then(response=>{setTransfers(response.data); console.log(response.data)})
        })
        .catch(function (error) {
          //Alert.alert("email or mot de pass n'est pas valid")
        });
      }).catch(error=>{Alert.alert("error try again later")})
  },[])
  const navigation = useNavigation()
  const handleSignOut = () => {
    console.log("dslfkjsdlkfjsd")
    const promise = async () =>{
      await AsyncStorage.clear();
    }
    promise().then((res)=>{navigation.replace("Login"); ToastAndroid.show("Déconnecter!",ToastAndroid.SHORT)})
    .catch((error)=>{console.log(error)})
  }

  const handleSendTransfer = () =>{
    navigation.replace("SendTransfer")
  }
  const handleShowTransfers = () =>{
    navigation.replace("TransferList")
  }
  return (
    <ScrollView contentContainerStyle={styles.center}>
      <View style={{borderWidth: 1,borderColor: "#0782F9",backgroundColor:"#0782F9",
      borderRadius:5,padding:20,width:"90%",marginVertical:10,flexDirection: "row",
      flexWrap: "wrap"}}>
          <Image
            style={styles.tinyLogo}
            source={{uri:'https://uybor.uz/borless/uybor/img/user-images/user_no_photo_600x600.png',}}
          />
          <View style={{color:"#FFF"}}>
            <Text style={{fontSize:20,color:"#FFF"}}>{user?.user?.prenom+" "+user?.user?.nom}</Text>
            <Text style={{fontSize:20,fontSize:15,color:"#FFF"}}>{user?.auth?.email}</Text>
          </View>
      </View>
      <View style={{borderWidth: 1,borderColor: "#0782F9",borderRadius:5,padding:20,width:"90%",marginVertical:10}}>
          <Text style={{fontSize:17}}>Solde Wallet*</Text>
          <Text style={{fontSize:20}}>{user?.wallet?.solde}</Text>
      </View>
      <View style={{borderWidth: 1,borderColor: "#0782F9",borderRadius:5,padding:20,width:"90%",marginVertical:10}}>
          <Text style={{fontSize:17}}>Type De Compte*</Text>
          <Text style={{fontSize:20}}>{user?.auth?.role.toLowerCase()}</Text>
      </View>
      <View style={{borderWidth: 1,borderColor: "#0782F9",borderRadius:5,padding:20,width:"90%",marginVertical:10}}>
          <Text style={{fontSize:17}}>Transferts*</Text>
          <Text style={{fontSize:20}}>{transfers.length}</Text>
      </View>
      <View style={{borderWidth: 1,borderColor: "#0782F9",borderRadius:5,padding:20,width:"90%",marginVertical:10}}>
          <Text style={{fontSize:25}}>Actions</Text>
          <TouchableOpacity
            onPress={handleSendTransfer}
            style={styles.actions}
          >
            <Text style={styles.buttonText}>émettre un transfert</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleShowTransfers}
            style={styles.actions}
          >
            <Text style={styles.buttonText}>Afficher les transferts</Text>
          </TouchableOpacity>
      </View>
      <TouchableOpacity
        onPress={handleSignOut}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Déconnexion</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
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
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  tinyLogo: {
    width: 50,
    height: 50,
    marginRight:10
  },
   button: {
    backgroundColor: '#0782F9',
    width: '90%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 40,
  },
  actions: {
    backgroundColor: '#0782F9',
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical:10
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
})

import { useNavigation } from '@react-navigation/core'
import React from 'react'
import {ToastAndroid, ScrollView, StyleSheet, Text,TextInput, TouchableOpacity, View } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {data} from './data'




const TransferListItem = (props) =>{
    const [otp,setOtp]=React.useState("");
    const value = 324234;
    const [tdata,setTdata]=React.useState(props.data);
    const handleRestitution = () =>{
        if(motif===""){
            ToastAndroid.show("le motif ne peut pas etre vide",ToastAndroid.SHORT)
        }else{
            setOtp(true)
            if(otpValue==""){
                ToastAndroid.show("svp entre une valuer OTP",ToastAndroid.SHORT)
            }else{
                if(otpValue==value){
                    axios.patch(`http://${data.base_url}/transfers/toreturned/${props.data.id}`,{
                        headers:{
                            "Authorization":""
                        }
                    })
                    .then((response)=>{
                        ToastAndroid.show("le transfer est bien restutier",ToastAndroid.SHORT)
                        setTdata(response.data)
                        setOtp("")
                    })
                    .catch(()=>{ToastAndroid.show("erreur d'operation",ToastAndroid.SHORT)})
                }else{
                    ToastAndroid.show("L'OTP n'est pas valid!",ToastAndroid.SHORT)
                }
            }
        }
        console.log(props.data)
    }
    const [motif,setMotif]=React.useState("");
    const [otpValue,setOtpValue]=React.useState("");
    return (
        <View style={{borderWidth: 1,borderColor: "#0782F9",borderRadius:5,padding:20,width:"100%",marginVertical:10}}>
            <Text style={{marginVertical:10}}>Émetteur Id: {tdata.senderId}</Text>
            <Text style={{marginVertical:10}}>Récepteur Id: {tdata.receiverId}</Text>
            <Text style={{marginVertical:10}}>Montant : {tdata.montant} MAD</Text>
            <Text style={{marginVertical:10}}>Motif : {tdata.motif}</Text>
            <Text style={{marginVertical:10}}>Notification : {tdata.withNotification?"On":"Off"}</Text>
            <Text style={{marginVertical:10}}>Status : {tdata.transferStatus}</Text>
            {(tdata.transferStatus!="RETURNED")? 
            (<Text style={{marginVertical:10}}>Motif de restitution:</Text>):""}
            {(tdata.transferStatus!="RETURNED")? 
            (<TextInput value={motif} onChangeText={(val)=>setMotif(val)} style={styles.input} placeholder="Motif de restutition"/>):""}
            { (otp!="") ?<TextInput  value={otpValue} keyboardType="numeric" onChangeText={(val)=>setOtpValue(val)} style={styles.input} placeholder="OTP"/>:"" }
            {(tdata.transferStatus!="RETURNED")? 
            (<TouchableOpacity
            onPress={handleRestitution}
            style={styles.button}
            >
            <Text style={styles.buttonText}>Restituer</Text>
            </TouchableOpacity>):""}
        </View>
    )
}

const TransferListScreen = () => {
    const [transfertList, setTransfertList] = React.useState([]);
    const getUser = async () => {
        try {
          return await AsyncStorage.getItem("tokens");
        } catch (error) {
          console.log(error);
        }
    }
    React.useEffect(()=>{
        const cur = getUser();
        cur.then((res)=>{
            console.log(res)
          axios.get(`http://${data.base_url}/transfers`,{
          headers: {
            'Authorization': 'Bearer '+res 
            }
          })
          .then(function (response) {
            console.log(response.data)
            setTransfertList(response.data)
          })
          .catch(function (error) {
            ToastAndroid.show("erreur du chargement",ToastAndroid.SHORT)
          });
        })
        .catch(error=>{ToastAndroid.show("error try again later",ToastAndroid.SHORT)})
    },[])
  const navigation = useNavigation()

  const handleCancel = () =>{
    navigation.replace("Home")
  }
  return (
    <ScrollView contentContainerStyle={styles.center}>
      <View><Text style={{fontSize:20,paddingVertical:10,fontSize:20}}>List Des Transfers</Text></View>
      <View style={styles.inputContainer}>
        { transfertList.map(item=>{return <TransferListItem key={item.id} data={item}/>})}
        <TouchableOpacity
        onPress={handleCancel}
        style={styles.button2}
        >
        <Text style={styles.buttonText}>Page d'accueil</Text>
        </TouchableOpacity>
      </View>
    </ScrollView> 
  )
}

export default TransferListScreen

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  button: {
    backgroundColor: '#0782F9',
    padding: 15,
    width:"100%",
    borderRadius: 10,
    alignItems: 'center',
  },
  button2: {
    backgroundColor: '#767577',
    padding: 15,
    width:"100%",
    borderRadius: 10,
    alignItems: 'center',
    marginBottom:20
  },
  tinyLogo: {
    width: 50,
    height: 50,
    marginRight:10
  },
   button: {
    backgroundColor: '#0782F9',
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
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
  inputContainer: {
    width: '90%',
  },
  input: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
    marginVertical:10
  },
})

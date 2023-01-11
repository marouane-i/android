import { useNavigation } from '@react-navigation/core'
import React from 'react'
import {data} from './data'
import { SelectList } from 'react-native-dropdown-select-list'
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ToastAndroid, ScrollView, StyleSheet, Text,TextInput, TouchableOpacity, View, Switch } from 'react-native'
import axios from 'axios';


const SendTransferScreen = () => {
  const [transfert, setTransfert] = React.useState({
    receiverId:"",
    senderId:"",
    fees_type:"",
    montant:"",
    motif:"",
    withNotification:false
   });
   const getUser = async () => {
    try {
      return await AsyncStorage.getItem("user");
    } catch (error) {
      console.log(error);
    }
  };
  const getToken = async () => {
    try {
      return await AsyncStorage.getItem("tokens");
    } catch (error) {
      console.log(error);
    }
  };
  function handleFieldUpdate(event) {
    setTransfert(old=>{return {...old,montant:event.target.value}})
  }
  React.useEffect(() => {
    const cur = getToken();
    cur.then((res)=>{
      axios.get(`http://${data.base_url}/users`,{
      headers: {
        'Authorization': 'Bearer '+res 
      }
      })
      .then(function (response) {
        setDatau(response.data.map(item=>{return {key:item.id,value:item.nom+item.prenom+" "+item.id}}));
      })
      .catch(function (error) {
        ToastAndroid.show("email or mot de pass n'est pas valid",ToastAndroid.SHORT)
      });
    }).catch(error=>{ToastAndroid.show("error try again later",ToastAndroid.SHORT)})
  },[])
  const  [datau,setDatau] = React.useState([
      {key:'1', value:'Chahid Ahmed'},
      {key:'2', value:'Youssef Bahomman'},
      {key:'3', value:'Youssef Chorfi'},
      {key:'4', value:'Mohamed Samih'},
  ]);
  const feesType=[
      {key:'bySender', value:'A la charge du client donneur'},
      {key:'byReceiver', value:'A la charge du client bénéficiaire'},
      {key:'shared', value:'Partagés entre les clients'},
  ]
  const motif=[
    {key:'bySender', value:'Soutien familial'},
    {key:'byReceiver', value:'Epargne/investissement'},
    {key:'shared', value:'Paiement de biens et de services'},
    {key:'shared', value:'Frais de dépassement'},
    {key:'shared', value:'Location/Hypothèque'},
    {key:'shared', value:'Aide de secours/Médicale'},
    {key:'shared', value:'Revenu d\'un site internet'},
    {key:'shared', value:'Dépenses salariales'},
    {key:'shared', value:'Frais de loterie ou récompense/taxes'},
    {key:'shared', value:'Prêt'},
    {key:'shared', value:'Commerce sur internet'},
    {key:'shared', value:'Donation'},
    ]
  const navigation = useNavigation()
  const handleCancel = () =>{
    navigation.replace("Home")
  }
  const handleSend = () =>{
    const user = getUser();
    user.then(response=>{
      const user = JSON.parse(response);
      setTransfert(old=>{return {...old,senderId:user?.user?.id}})
      if(transfert.montant=="" || transfert.receiverId=="" || transfert.senderId==""){
        ToastAndroid.show("tous les champs requies",ToastAndroid.SHORT);
      }else{
        if(transfert.montant*1>user?.wallet?.solde*1){
          ToastAndroid.show(transfert.montant+" MAD depasse votre solde.",ToastAndroid.SHORT);
        }else if(transfert.montant*1>2000.00){
          ToastAndroid.show(transfert.montant+" MAD depasse les limites.",ToastAndroid.SHORT);
        }else{
          const token = getToken();
          token.then((res)=>{
            axios.post(`http://${data.base_url}/transfers`, transfert, {
              headers: {
                'Authorization': 'Bearer '+res 
              }
            })
            .then(function (response) {
              ToastAndroid.show("le transfert est bien effecuter",ToastAndroid.SHORT)
              navigation.replace("Home")
            })
            .catch(function (error) {
              ToastAndroid.show("error du transfert",ToastAndroid.SHORT)
            });
          }).catch((error)=>ToastAndroid.show("error",ToastAndroid.SHORT))
        }
      }
    })
    .catch()
  }
  return (
    <ScrollView contentContainerStyle={styles.center}>
      <View><Text style={{fontSize:20,paddingVertical:10}}>Envoi Du Transfert</Text></View>
      <View style={styles.inputContainer}>
        <View style={{marginVertical:10}}>
        <Text style={{marginVertical:10}}>Bénéficiaire:</Text>
        <SelectList 
            setSelected={(val) =>setTransfert(old=>{return {...old,receiverId:val.split(" ")[1]}})} 
            data={datau} 
            save="value"
            boxStyles={{backgroundColor:"#FFF",borderColor:"#FFF"}}
        />
        </View>
        <Text style={{marginBottom:10}}>Montant:</Text>
        <TextInput
          placeholder="montant MAD"
          onChangeText={(val) => setTransfert(old=>{return {...old,montant:val*1}})}  
          keyboardType='numeric'
          style={styles.input}
        />
        <View style={{marginBottom:10}}>
        <Text style={{marginBottom:10}}>Type des frais:</Text>
        <SelectList 
            setSelected={(val) => setTransfert(old=>{return {...old,fees_type:val}})} 
            data={feesType} 
            save="value"
            boxStyles={{backgroundColor:"#FFF",borderColor:"#FFF"}}
        />
        </View>
        <View style={{marginBottom:10}}>
        <Text style={{marginBottom:10}}>Motif :</Text>
        <SelectList 
            setSelected={(val) => setTransfert(old=>{return {...old,motif:val}})}  
            data={motif} 
            save="value"
            boxStyles={{backgroundColor:"#FFF",borderColor:"#FFF"}}
        />
        </View>
        <View style={{flexDirection: "row",flexWrap: "wrap",alignItems:"center"}}>
            <Switch
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={transfert.withNotification ? "#81b0ff" : "#767577"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={() => setTransfert(old=>{return {...old,withNotification:!old.withNotification}})}
                value={transfert.withNotification}
            />
            <Text>notification du transfert</Text>
        </View>
        <TouchableOpacity
          onPress={handleSend}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Envoyer</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleCancel}
          style={styles.button2}
        >
          <Text style={styles.buttonText}>Annuler</Text>
        </TouchableOpacity>
    </View>
    </ScrollView>
  )
}

export default SendTransferScreen

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

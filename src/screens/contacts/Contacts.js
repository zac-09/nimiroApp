import * as React from 'react'
import * as firebase from 'firebase'
import * as Contacts from 'expo-contacts';
import * as Permissions from 'expo-permissions';
import firebaseSDK from '../../backend/Firebase'
import { formatPhoneNumber } from '../../utils/Validations'
import { View, Text } from 'native-base'
import { Lists } from '../../components'
import { Ionicons } from '@expo/vector-icons'
import Storage from '../../utils/Storage'
import Toast from 'react-native-root-toast';

export default class Contact extends React.Component{
    constructor(props){
        super(props)

        this.state = {
            friends: [],
            loading: false,
        }

        this.threadsRef = firebase
            .firestore()
            .collection('friends')
            .doc(firebase.auth().currentUser.uid)
            .collection('list')
            .orderBy('lastMessageDate', 'desc');

        this.threadsUnscribe = 'null';
    }

    componentDidMount(){  
        this.checkMultiPermissions()
        this.setState({loading: true})
        this.threadsUnscribe = this.threadsRef.onSnapshot(this.loadContactList);
    }

    componentWillUnmount(){
        this.threadsUnscribe();
    }

    checkMultiPermissions = async() => {
        const { status } = await Permissions.askAsync(Permissions.CONTACTS);
 
        if (status !== 'granted') {
          console.log("User has not allowed read contacts")
        }else {   
            this.scanContacts()
        }
    }

    loadContactList = querySnapshot => {
        const data = [];
        try{
            querySnapshot.forEach(doc => {
                const chat = doc.data();
                chat.lastMessageDate = doc.data().lastMessageDate.toDate()
                data.push(chat);
            })
        } catch(error) {
            this.showToast(error)
        }

        this.setState({ friends: data, loading: false });
    }

    showToast = message => {
        Toast.show(message, {
            duration: Toast.durations.LONG,
            position: Toast.positions.BOTTOM,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,
        });
    }

    navigate = (route, data) => {
        this.props.navigation.navigate(route, data)
    }

    scanContacts = async() => {
        const { data } = await Contacts.getContactsAsync({
            fields: [Contacts.Fields.PhoneNumbers],
        });

        const filteredNumbers = []
          
        if (data.length > 0) {
            data.map(el => {
                if(el.phoneNumbers !== undefined){
                    el.phoneNumbers.map(num => {
                        filteredNumbers.push(formatPhoneNumber(num.number))
                    })
                }
            })
            firebaseSDK.syncContacts(filteredNumbers)
        }
    }

    render(){
        const { friends } = this.state
        return(
            <View style={{flex: 1, position: 'relative', backgroundColor: 'rgba(246,246,246, 0.95)'}}>
                <Lists.ChatList chat={friends} onChatItemClicked={() => {}}/>
                <View style={{zIndex: 2, position: 'absolute', bottom: 40, right: 20, backgroundColor: '#53C41A', width: 50, height: 50, borderRadius: 25, overflow: 'hidden', justifyContent: 'center', alignItems: 'center'}}>
                    <Ionicons name="ios-chatbubbles" size={32} color='#fff' />
                </View>
            </View>
        )
    }
}
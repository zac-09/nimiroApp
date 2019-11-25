import React from 'react'
import { View, Text } from 'native-base'
import { Lists } from '../../components'
import { Ionicons } from '@expo/vector-icons'
import Storage from '../../utils/Storage'
import Toast from 'react-native-root-toast';
import * as firebase from 'firebase'
import * as Contacts from 'expo-contacts';
import * as Permissions from 'expo-permissions';
import firebaseSDK from '../../backend/Firebase'
import { formatPhoneNumber } from '../../utils/Validations'

export default class Chat extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            chats: [],
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
        this.threadsUnscribe = this.threadsRef.onSnapshot(this.loadChatList);
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

    existSameSentChat = (chats, newChat) => {
        for (let i = 0; i < chats.length; i++) {
          const temp = chats[i];
          if (
            newChat._id == temp._id 
          ) {
            return true;
          }
        }
    
        return false;
    };

    loadChatList = querySnapshot => {
        const data = [];
        try{
            querySnapshot.forEach(doc => {
                const chat = doc.data();
                chat.lastMessageDate = doc.data().lastMessageDate.toDate()
          
                if (!this.existSameSentChat(data, chat)) {
                  data.push(chat);
                }
            })
        } catch(error) {
            this.showToast(error)
        }
        
    
        this.setState({ chats: data, loading: false });
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
           // firebaseSDK.syncContacts(filteredNumbers)
        }
    }

    openChat = async (id) => {
        let id1 = firebase.auth().currentUser.uid;
        let id2 = id;
        const friend = this.state.chats.find(el => el._id === id)
        //hardcoded user
        const user = {
            _id: firebase.auth().currentUser.uid,
            avatar: firebase.auth().currentUser.photoURL,
            name: firebase.auth().currentUser.displayName,
        }
        let channel = {
                name: friend.dName,
                id: (id1 < id2 ? id1 + id2 : id2 + id1),
                currentUser: user,
                friend: friend,
                participants: [user, friend],
        };

        this.navigate('ChatScreen', { channel: channel });
    }

    render(){
        const { chats } = this.state
        return(
            <View style={{flex: 1, position: 'relative', backgroundColor: 'rgba(246,246,246, 0.95)'}}>
                <Lists.ChatList chat={chats} onChatItemClicked={this.openChat}/>
                <View style={{zIndex: 2, position: 'absolute', bottom: 40, right: 20, backgroundColor: '#53C41A', width: 50, height: 50, borderRadius: 25, overflow: 'hidden', justifyContent: 'center', alignItems: 'center'}}>
                    <Ionicons name="ios-chatbubbles" size={32} color='#fff' />
                </View>
            </View>
        )
    }
}

const CHAT_DUMMY = [
    {
        id: 'chat_01',
        avatar: 'https://images.pexels.com/photos/2128807/pexels-photo-2128807.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
        name: 'Mungujakisa Nickson',
        lastMessage: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        lastMessageDate: '18:10',
        unread: 5
    },
    {
        id: 'chat_02',
        avatar: 'https://images.pexels.com/photos/1578996/pexels-photo-1578996.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
        name: 'Misagga Zeus',
        lastMessage: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        lastMessageDate: '17:10',
        unread: 2
    },
    {
        id: 'chat_03',
        avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
        name: 'Daniel Ssejjemba',
        lastMessage: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        lastMessageDate: '14:10',
        unread: 1
    },
    {
        id: 'chat_04',
        avatar: 'https://images.pexels.com/photos/736716/pexels-photo-736716.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
        name: 'Olwe Samuel',
        lastMessage: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        lastMessageDate: '7:10',
        unread: 0
    },
    {
        id: 'chat_01',
        avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
        name: 'Ampumuza Ritah',
        lastMessage: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        lastMessageDate: '8:10',
        unread: 0
    }
]
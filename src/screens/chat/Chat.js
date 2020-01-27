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
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'

export default class Chat extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            chats: [],
            loading: false,
        }

        const uid = firebase.auth().currentUser.uid

        this.myChannels = firebase
            .firestore()
            .collection('channel_participation')
            .where('user', '==', uid)
            .orderBy('lastMessageDate', 'desc');

        this.threadsUnscribe = 'null';
    }

    componentDidMount(){  
        //sthis.setState({loading: true})
        //this.threadsUnscribe = this.myChannels.onSnapshot(this.loadChannelList);
    }

    componentWillUnmount(){
        //this.threadsUnscribe();
    }

    loadChannelList = async querySnapshot => {
        const data = [];
        try{
            querySnapshot.forEach(async doc => {
                const chat = doc.data();
                chat.lastMessageDate = doc.data().lastMessageDate.toDate()
          
                /* await firebase
                        .firestore()
                        .collection('channels')
                        .doc(chat.channel)
                        .get()
                        .then(doc => {
                            if(doc.exists){
                                const channelData = doc.data();
                                channelData.lastMessageDate = channelData.lastMessageDate.toDate()
                                data.push(channelData);
                            }
                        }) */
                
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

    openChannel = async (channelId) => {
        const channeData = {}

        await firebase
                .firestore()
                .collection('channels')
                .doc(channelId)
                .get()
                .then(doc => {
                    if(doc.exists){
                        channeData = doc.data()
                    }else{
                        console.log("Channel data isn't recorded in the database")
                    }
                })

        this.navigate('ChatScreen', { channel: channeData });
    }

    render(){
        const { chats } = this.state
        return(
            <View style={{flex: 1, position: 'relative', backgroundColor: 'rgba(246,246,246, 0.95)'}}>
                <Lists.ChatList chat={chats} onChatItemClicked={this.openChannel}/>
                <View style={{zIndex: 2, position: 'absolute', bottom: 40, right: 20, backgroundColor: '#53C41A', width: 50, height: 50, borderRadius: 25, overflow: 'hidden', justifyContent: 'center', alignItems: 'center'}}>
                    <TouchableWithoutFeedback onPress={() => this.props.navigation.navigate('Contacts')}>
                        <Ionicons name="ios-chatbubbles" size={32} color='#fff' />
                    </TouchableWithoutFeedback>
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
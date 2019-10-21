import React from 'react'
import { View, Text } from 'native-base'
import { Lists } from '../../components'
import { Ionicons } from '@expo/vector-icons'
import Storage from '../../utils/Storage'
import * as firebase from 'firebase'

export default class Chat extends React.Component{

    state = {
        chats: CHAT_DUMMY
    }

    navigate = (route, data) => {
        this.props.navigation.navigate(route, data)
    }

    openChat = async (id) => {
        let id1 = '';
        await Storage.getUserid().then(res => id1 = res).catch(() => 'An error occured')
        let id2 = id;
        const friend = this.state.chats.find(el => el.id === id)
        //hardcoded user
        const user = {
            _id: id1,
            avatar: firebase.auth().currentUser.photoURL,
            name: firebase.auth().currentUser.displayName,
        }
        let channel = {
                name: friend.name,
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
            <View style={{flex: 1, position: 'relative'}}>
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
        desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        time: '18:10',
        unread: 5
    },
    {
        id: 'chat_02',
        avatar: 'https://images.pexels.com/photos/1578996/pexels-photo-1578996.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
        name: 'Misagga Zeus',
        desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        time: '17:10',
        unread: 2
    },
    {
        id: 'chat_03',
        avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
        name: 'Daniel Ssejjemba',
        desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        time: '14:10',
        unread: 1
    },
    {
        id: 'chat_04',
        avatar: 'https://images.pexels.com/photos/736716/pexels-photo-736716.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
        name: 'Olwe Samuel',
        desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        time: '7:10',
        unread: 0
    },
    {
        id: 'chat_01',
        avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
        name: 'Ampumuza Ritah',
        desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        time: '8:10',
        unread: 0
    }
]
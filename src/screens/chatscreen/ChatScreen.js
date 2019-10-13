import React from 'react';
import { View } from 'react-native';
import { Headers } from '../../components';

class ChatScreen extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            user: {
                id: '',
                avator: '',
                name: ''
            }
        }
    }

    render(){
        return (
            <View style={{flex: 1}}>
                <Headers.ChatHeader avator={avator} name={name}/>
            </View>
        )
    }
}

export default ChatScreen;
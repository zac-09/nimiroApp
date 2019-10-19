import React from 'react';
import { View, TextInput, Keyboard, Platform, KeyboardAvoidingView, } from 'react-native';
import { Headers } from '../../components';
import styled from 'styled-components';
import { bg2} from '../../assets'
import { GiftedChat } from 'react-native-gifted-chat';
import { Ionicons } from '@expo/vector-icons';
import { Input } from 'native-base';

class ChatScreen extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            //user: this.props.navigation.getParams('user')
            isTyping: false,
            inputHeight: 50,
            currentMessage: '',
            user:  {
                _id: 'chat_01',
                avatar: 'https://images.pexels.com/photos/2128807/pexels-photo-2128807.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
                name: 'Mungujakisa Nickson',
                desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                time: '18:10',
                unread: 5
            },
            messages: [
                {
                  _id: 'message_01',
                  text: 'Hello Nickson',
                  createdAt: new Date(),
                  image: 'https://images.pexels.com/photos/2128807/pexels-photo-2128807.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
                  user: {
                    _id: 'chat_02',
                    name: 'Misagga Zeus',
                    avatar: 'https://images.pexels.com/photos/1578996/pexels-photo-1578996.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
                  },
                },
              ],
        }
    }

    componentDidMount() {
        this.keyboardDidShowListener = Keyboard.addListener(
          'keyboardDidShow',
          this._keyboardDidShow,
        );
        this.keyboardDidHideListener = Keyboard.addListener(
          'keyboardDidHide',
          this._keyboardDidHide,
        );
    }

    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    _keyboardDidShow = () => {
       this.setState({isTyping: true});
    }

    _keyboardDidHide = () => {
        if(this.state.currentMessage === '')
        this.setState({isTyping: false, behavior: undefined});
    }

    onTextChanged = text => {
        if(this.state.behavior !== 'height'){
            this.setState({behavior: 'height'});
        }
        this.setState({currentMessage: text})
    }

    renderInputToolbar = () => {
        const {isTyping} = this.state
        return (
            <View style={styles.inputBar}>
                <View style={styles.inputContainer}>
                    <Ionicons style={styles.icons} name='ios-happy' size={32} color='#ccc'/>
                    <TextInput 
                        multiline={true}
                        enablesReturnKeyAutomatically
                        underlineColorAndroid='transparent'
                        onChangeText={this.onTextChanged}
                        value={this.state.currentMessage}
                        onContentSizeChange={(event) => {
                            this.setState({ inputHeight: event.nativeEvent.contentSize.height })
                        }}
                        placeholder='Type a message' style={{...styles.input, height: Math.min(300, this.state.inputHeight)}}/>
                    <Ionicons style={styles.icons} name='ios-attach' size={32} color='#ccc'/>
                    {isTyping === false && <Ionicons style={styles.icons} name='ios-camera' size={32} color='#ccc'/>}
                </View>
                <View style={styles.micContainer}>
                    {isTyping === true ? 
                        <Ionicons name='ios-send' size={32} color='#fff'/>:
                        <Ionicons name='ios-mic' size={32} color='#fff'/>
                    }
                </View>
            </View>
        )
    }

    onSend(messages = []) {
        this.setState(previousState => ({
          messages: GiftedChat.append(previousState.messages, messages),
        }))
    }

    render(){
        const {avatar, name} = this.state.user
        return (
            <View style={{flex: 1}}>
                <Container source={bg2}>
                    <Headers.ChatHeader nomargin avator={avatar} name={name}/>
                    <KeyboardAvoidingView style={{flex: 1}} behavior={this.state.behavior}>
                        <GiftedChat
                            messages={this.state.messages}
                            onSend={messages => this.onSend(messages)}
                            user={this.state.user}
                            showUserAvatar
                            renderInputToolbar={this.renderInputToolbar}
                            minInputToolbarHeight={60}
                        />
                    </KeyboardAvoidingView>
                </Container>
            </View>
        )
    }
}

export default ChatScreen;

const Container = styled.ImageBackground`
    width: 100%;
    height: 100%;
`

const styles = {
    inputBar: {
        width: "100%",
        flexDirection: 'row',
        marginBottom: 10,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 15,
        marginRight: 10,
        marginLeft: 10,
        flexGrow: 1
    },
    input: {
        flex: 1,
        marginLeft: 10,
        fontSize: 16,
        lineHeight: 16,
        paddingTop: 6,
        paddingBottom: 6,
        marginTop: Platform.select({
        ios: 6,
        android: 0,
        web: 6,
        }),
        marginBottom: Platform.select({
        ios: 5,
        android: 3,
        web: 4,
        }),
    },
    micContainer: {
        backgroundColor: '#4a6aa5',
        width: 50,
        height: 50,
        borderRadius: 25,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 5,
        marginLeft: 5,
    },
    icons: {
        marginLeft: 10,
        marginRight: 10
    }
}
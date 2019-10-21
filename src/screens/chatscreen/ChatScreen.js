import React from 'react';
import { View, TextInput, Keyboard, Platform, KeyboardAvoidingView, } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Headers } from '../../components';
import styled from 'styled-components';
import { bg2} from '../../assets'
import { GiftedChat } from 'react-native-gifted-chat';
import { Ionicons } from '@expo/vector-icons';
import { Input } from 'native-base';
import * as firebase from 'firebase';
import 'firebase/firestore';
import AnimatedLoader from 'react-native-animated-loader';

class ChatScreen extends React.Component {
    constructor(props){
        super(props);

        //const channel = props.navigation.getParam('channel');
        const channel = {id: 'thisisafakeuidconcatenationstandinginplace'}

        this.state = {
            //user: this.props.navigation.getParams('user')
            isTyping: false,
            inputHeight: 50,
            currentMessage: '',
            minInputToolbarHeight: 50,
            user:  {
                _id: 'chat_01',
                avatar: 'https://images.pexels.com/photos/2128807/pexels-photo-2128807.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
                name: 'Mungujakisa Nickson',
                desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                time: '18:10',
                unread: 5
            },
            messages: [],
            loading: false
        }

        this.threadsRef = firebase
            .firestore()
            .collection('channels')
            .doc(channel.id)
            .collection('messages');

        this.threadsUnscribe = 'null';
    }

    componentDidMount() {
        this.setState({loading: true})
        this.threadsUnscribe = this.threadsRef.onSnapshot(this.onThreadsCollectionUpdate);
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

    existSameSentMessage = (messages, newMessage) => {
        for (let i = 0; i < messages.length; i++) {
          const temp = messages[i];
          if (
            newMessage._id == temp._id &&
            temp.text == newMessage.text &&
            temp.user == newMessage.user
          ) {
            return true;
          }
        }
    
        return false;
    };

    onThreadsCollectionUpdate = querySnapshot => {
        const data = [];
        querySnapshot.forEach(doc => {
          const message = doc.data();
          message._id = doc.id;
    
          if (!this.existSameSentMessage(data, message)) {
            data.push(message);
          }
        });
    
        this.setState({ messages: data, loading: false });
    };

    _keyboardDidShow = (e) => {
       this.setState({isTyping: true});
       let keyboardHeight = e.endCoordinates.height;
        this.setState({
            minInputToolbarHeight: keyboardHeight + 50,
        });
    }

    _keyboardDidHide = () => {
        if(this.state.currentMessage === '')
        this.setState({isTyping: false});
        this.setState({
            minInputToolbarHeight: 50,
        });
    }

    _pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
        });
    
        console.log(result);
    
        if (!result.cancelled) {
            const message = {
                _id: new Date().getMilliseconds().toString(),
                createdAt: new Date(),
                image: result.uri,
                user: this.state.user
            }
            await this.setState(prevState => ({
                messages: GiftedChat.append(prevState.messages, message),
                currentMessage: ''
            }))
        }
    };

    renderInputToolbar = () => {
        const {isTyping} = this.state
        return (
            <View style={styles.inputBar}>
                <View style={styles.inputContainer}>
                    <Ionicons style={styles.icons} name='ios-happy' size={32} color='#bbb'/>
                    <TextInput 
                        multiline={true}
                        enablesReturnKeyAutomatically
                        underlineColorAndroid='transparent'
                        onChangeText={text => this.setState({currentMessage: text})}
                        value={this.state.currentMessage}
                        onContentSizeChange={(event) => {
                            this.setState({ inputHeight: event.nativeEvent.contentSize.height })
                        }}
                        placeholder='Type a message' style={{...styles.input, height: Math.min(150, this.state.inputHeight)}}/>
                    <Ionicons style={styles.icons} name='ios-images' size={32} color='#bbb' onPress={this._pickImage}/>
                    {isTyping === false && <Ionicons style={styles.icons} name='ios-camera' size={32} color='#bbb'/>}
                </View>
                <View style={styles.micContainer}>
                    {isTyping === true ? 
                        <Ionicons name='ios-send' size={32} color='#fff' onPress={() => this.onSend()}/>:
                        <Ionicons name='ios-mic' size={32} color='#fff'/>
                    }
                </View>
            </View>
        )
    }

    onSend = async() => {
        if(this.state.currentMessage.length > 0){
            const message = {
                _id: new Date().getMilliseconds().toString(),
                createdAt: new Date(),
                text: this.state.currentMessage,
                user: this.state.user
            }
            await this.setState(prevState => ({
                messages: GiftedChat.append(prevState.messages, message),
                currentMessage: ''
            }))
        }
    }

    render(){
        const {avatar, name} = this.state.user
        return (
            <View style={{flex: 1}}>
                <Container source={bg2}>
                    <Headers.ChatHeader nomargin avator={avatar} name={name}/>
                        <GiftedChat
                            messages={this.state.messages}
                            user={this.state.user}
                            showUserAvatar
                            keyboardShouldPersistTaps='never'
                            renderInputToolbar={this.renderInputToolbar}
                            minInputToolbarHeight={this.state.minInputToolbarHeight}
                        />
                </Container>
                <AnimatedLoader
                    visible={this.state.loading}
                    overlayColor="rgba(255,255,255,0.75)"
                    source={require("../../assets/anim/trail_loading.json")}
                    animationStyle={styles.lottie}
                    speed={1}
                />
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
        width: 40,
        height: 40,
        borderRadius: 20,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 5,
        marginLeft: 5,
    },
    icons: {
        marginLeft: 5,
        marginRight: 5
    },
    lottie: {
        width: 200,
        height: 200
    }
}
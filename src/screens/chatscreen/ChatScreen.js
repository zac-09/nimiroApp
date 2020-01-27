import React from 'react';
import { View, TextInput, Keyboard, Platform, KeyboardAvoidingView, Dimensions } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Headers } from '../../components';
import styled from 'styled-components';
import bg2 from '../../assets/chat_bg.png';
import { GiftedChat } from 'react-native-gifted-chat';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-root-toast';
import * as firebase from 'firebase';
import 'firebase/firestore';
import AnimatedLoader from 'react-native-animated-loader';
import firebaseSDK from '../../backend/Firebase';

const HEIGHT = Dimensions.get('window').height

class ChatScreen extends React.Component {
    constructor(props){
        super(props);

        const channel = props.navigation.getParam('channel');

        this.state = {
            channel: channel,
            isNewChannel: false,
            isTyping: false,
            inputHeight: 55,
            currentMessage: '',
            minInputToolbarHeight: 55,
            user:  channel.currentUser,
            friend: channel.friend,
            messages: [],
            loading: false,
            offset: false
        }

        this.threadsUnscribe = null;
    }

    async componentDidMount() {
        this.setState({loading: true})
        await this._attachListeners()
        this._clearUnread()
    }

    shouldComponentUpdate(nextProps, nextState){
        const { messages } = this.state
        if(messages.length !== nextState.messages.length){
            this.clearUnread()
        }
        return true;
    }

    componentWillUnmount() {
        if(this.threadsUnscribe){
            this.threadsUnscribe();
        }
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    _attachListeners = async () => {
        this.keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            this._keyboardDidShow,
        );

        this.keyboardDidHideListener = Keyboard.addListener(
        'keyboardDidHide',
        this._keyboardDidHide,
        );

        await this._isNewChannel()
        if(this.state.isNewChannel){
            //No channel in Db don't attach message listeners
            //only create channel when user sends a message.
            
            this.setState({loading: false})
        }else{
            this.threadsUnscribe = firebase
                .firestore()
                .collection('channels')
                .doc(this.state.channel.id)
                .collection('messages')
                .orderBy('createdAt', 'desc')
                .onSnapshot(this.onThreadsCollectionUpdate);
        }
    }

    _createChannel = async () => {
        const { channel } = this.state
        const channelData = {
            creator_id: channel.currentUser._id,
            name: channel.name,
            lastMessage: this.state.currentMessage,
            lastMessageDate: new Date(),
            adminstrators: channel.adminstrators,
            participants: channel.participants,
            type: channel.type
        };

        const that = this

        await firebase
                .firestore()
                .collection('channels')
                .add(channelData)
                .then(async docRef => {
                    channelData.id = docRef.id
                    that.setState({ channel: channelData });

                    channelData.participants.forEach(async friend => {
                        const participationData = {
                            channel: docRef.id,
                            user: friend._id,
                            lastMessage: channelData.lastMessage,
                            lastMessageDate: channelData.lastMessageDate,
                            unread: 0
                        };
            
                        await firebase
                                .firestore()
                                .collection('channel_participation')
                                .add(participationData);
            
                    });

                    await that.setState({isNewChannel: false})
                })
                .catch(function(error) {
                    alert(error);
                });

    }

    _isNewChannel = async () => {
        const { channel } = this.state
        let isNew = true

        const channelRef = firebase.firestore().collection('channel_participation').doc(channel.id)

        await channelRef.get()
                .then((doc) => {
                    if (doc.exists) {
                        isNew = false
                    } else {
                        isNew = true
                    }
                });

        await this.setState({isNewChannel: isNew})
    }

    _clearUnread = async() => {
        const uid = await firebase.auth().currentUser.uid
        await firebase
                .firestore()
                .collection('channel_participation')
                .where('channel', '==', this.state.channel.id)
                .where('user', '==', uid)
                .get()
                .then(querySnapshot => {
                    querySnapshot.forEach(async doc => {
                            await firebase
                                    .firestore()
                                    .collection('channel_participation')
                                    .doc(doc.id)
                                    .update({
                                        unread: 0,
                                    })
                    })
                })
    }

    _updateFriendsChannel = async (lastMessage) => {
        const uid = await firebase.auth().currentUser.uid
        await firebase
                .firestore()
                .collection('channel_participation')
                .where('channel', '==', this.state.channel.id)
                .get()
                .then(querySnapshot => {
                    querySnapshot.forEach(async doc => {
                        if(doc.data().user !== uid){
                            await firebase
                                    .firestore()
                                    .collection('channel_participation')
                                    .doc(doc.id)
                                    .update({
                                        unread: firebase.firestore.FieldValue.increment(1),
                                        lastMessage: lastMessage,
                                        lastMessageDate: new Date()
                                    })
                        }
                    })
                })
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
        try{
            querySnapshot.forEach(doc => {
                const message = doc.data();
                message._id = doc.id;
                message.createdAt = doc.data().createdAt.toDate()
          
                if (!this.existSameSentMessage(data, message)) {
                  data.push(message);
                }
              })
        } catch(error) {
            this.showToast(error)
        }
        
    
        this.setState({ messages: data, loading: false });
    };

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

    _keyboardDidShow = (e) => {
       this.setState({isTyping: true});
       const { inputHeight } = this.state
       let keyboardHeight = e.endCoordinates.height;
        this.setState({
            minInputToolbarHeight: keyboardHeight + inputHeight,
            offset: true
        });
    }

    _keyboardDidHide = () => {
        if(this.state.currentMessage === '') this.setState({isTyping: false});
        const { inputHeight } = this.state
        this.setState({
            minInputToolbarHeight: inputHeight,
            offset: false
        });
    }

    _pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
        });
    
        console.log(result);
        const { channel } = this.state
    
        if (!result.cancelled) {
            this.setState({loading: true})
            await firebaseSDK.uploadBlob(result.uri, channel.id, this.sendImage, this.showToast)
            await this.setState(prevState => ({
                currentMessage: ''
            }))
            await this.setState({loading: false})
        }
    };

    _pickVideo = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Videos,
          allowsEditing: true,
        });
    
        console.log(result);
        const { channel } = this.state
    
        if (!result.cancelled) {
            this.setState({loading: true})
            await firebaseSDK.uploadBlob(result.uri, channel.id, this.sendVideo, this.showToast)
            await this.setState(prevState => ({
                currentMessage: ''
            }))
            await this.setState({loading: false})
        }
    };

    sendImage = url => {
        const message = {
            createdAt: new Date(),
            image: url,
            text: this.state.currentMessage,
            user: this.state.user
        }
        
        this.updateDB(message)
    }

    sendVideo = url => {
        const message = {
            createdAt: new Date(),
            video: url,
            text: this.state.currentMessage,
            user: this.state.user
        }
        
        this.updateDB(message)
    }

    onSend = async() => {
        if(this.state.currentMessage.length > 0){
            const message = {
                createdAt: new Date(),
                text: this.state.currentMessage,
                user: this.state.user
            }
            await this.setState({
                currentMessage: ''
            })
            this.updateDB(message)
        }
    }

    updateDB = async(message) => {

        const { channel, isNewChannel } = this.state

        if(isNewChannel){
            await this._createChannel()
            if(!this.state.isNewChannel){
                //don't send message if the channel has not been created
                alert("An Error occured while creating channel")
                return
            }else{
                //attach message listeners now....
                this.threadsUnscribe = firebase
                    .firestore()
                    .collection('channels')
                    .doc(this.state.channel.id)
                    .collection('messages')
                    .orderBy('createdAt', 'desc')
                    .onSnapshot(this.onThreadsCollectionUpdate);
            }
        }

        await firebase
                .firestore()
                .collection('channels')
                .doc(channel.id)
                .collection('messages')
                .add(message)

        const lastMessage = message.text ? message.text : message.image ? 'Photo' : 'Video'

        await this._updateFriendsChannel(lastMessage)
    }

    renderInputToolbar = () => {
        const {isTyping} = this.state
        return (
            <View style={styles.inputBar}>
                <View style={styles.inputContainer}>
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

    render(){
        const {avatar, name} = this.state.friend
        return (
            <View style={{flex: 1, height: HEIGHT}}>
                
                    <Headers.ChatHeader nomargin avator={avatar} name={name} offset={this.state.offset}/>
                    <Container source={bg2}>
                        <GiftedChat
                            messages={this.state.messages}
                            user={this.state.user}
                            showUserAvatar={false}
                            keyboardShouldPersistTaps='never'
                            renderInputToolbar={this.renderInputToolbar}
                            minInputToolbarHeight={this.state.minInputToolbarHeight}
                        />
                        <KeyboardAvoidingView behavior={'height'}/>
                    </Container>
                <AnimatedLoader
                    visible={this.state.loading}
                    overlayColor="rgba(0,0,0,0.25)"
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
    flex: 1
`

const styles = {
    inputBar: {
        width: "100%",
        flexDirection: 'row',
        marginBottom: 5,
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
        marginLeft: 5,
        marginRight: 5
    },
    lottie: {
        width: 200,
        height: 200
    }
}
import * as React from 'react'
import { View, Button, Text } from 'native-base';
import PostHeader from '../../components/headers/PostHeader';
import { logo } from '../../assets'
import { Image, TextInput, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import AnimatedLoader from "react-native-animated-loader";
import { Entypo } from '@expo/vector-icons';
import firebaseSDK from '../../backend/Firebase';
import * as firebase from 'firebase';
import 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import VideoView from '../../components/video/Video';
import ProgressiveImage from '../../components/images/ProgressiveImage';

class Post extends React.Component {
    constructor(props){
        super(props);
        this.child = props.navigation.getParam('post');

        this.state = {
            image: '',
            text: '',
            video: '',
            loading: false
        }
    }

    attachMediaFile = mediaType => {
        console.log("Open File browser window...")
        if(mediaType === 'image'){
            this._pickImage()
        }else{
            this._pickVideo()
        }
    }

    _pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
        });
    
        if (!result.cancelled) {
            this.setState({image: result.uri, video: ''})
        }
    };

    _pickVideo = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Videos,
          allowsEditing: true,
        });
    
        if (!result.cancelled) {
            this.setState({video: result.uri, image: ''})
        }
    };

    makePost = async () => {
        
        const { image, video, text } = this.state

        const isTextOnly = !image && !video && text
        
        if(isTextOnly){
            this.setState({loading: true})
            this.postTextMessage()
        } else if(image) {
            this.setState({loading: true})
            this.uploadMedia('image')
        }else if(video) {
            this.setState({loading: true})
            this.uploadMedia('video')
        }
    }

    postTextMessage = async () => {
        const { image, video, text } = this.state

        const data = {
            comments: [],
            likes: 0,
            created_by: firebase.auth().currentUser.uid,
            date_created: new Date(),
            content: {
                image,
                video,
                text
            }
        }

        this.post(data)
    }

    postImageMessage = async (uri) => {
        const { video, text } = this.state

        const data = {
            comments: [],
            likes: 0,
            created_by: firebase.auth().currentUser.uid,
            date_created: new Date(),
            content: {
                image: uri,
                video,
                text
            }
        }

        this.post(data)
    }

    postVideoMessage = async (uri) => {
        const { image, text } = this.state

        const data = {
            comments: [],
            likes: 0,
            created_by: firebase.auth().currentUser.uid,
            date_created: new Date(),
            content: {
                video: uri,
                image,
                text
            }
        }

        this.post(data)
    }

    post = async data => {
        const { child } = this
        await firebase
                .firestore()
                .collection(child)
                .add(data).then(async docRef => {
                    await firebase.firestore()
                            .collection(child)
                            .doc(docRef.id)
                            .update({
                                id: docRef.id
                            }).then(() => {
                                this.setState({loading: false})
                                this.props.navigation.goBack()
                            })
                            .catch(() => this.failed())
                })
    }



    uploadMedia = (mediaType) => {
        const { image, video, text } = this.state
        if(mediaType === 'image'){
            firebaseSDK.uploadBlob(image, this.child, this.postImageMessage, this.failed )
        }else {
            firebaseSDK.uploadBlob(video, this.child, this.postVideoMessage, this.failed )
        }
    }

    

    failed = () => {
        this.setState({loading: false})
        alert('Error Occured, Please check your internet connection')
    }

    render(){
        const { image, video, loading } = this.state
        return(
            <View style={{flex: 1, backgroundColor: "#681554",}}>
                <PostHeader 
                    title='Create post' 
                    nomargin 
                    goBack={this.props.navigation.goBack}
                    createPost={() => this.makePost()}/>

                <View style={{ backgroundColor: 'transparent', borderRadius: 5}}>
                    <View style={{flexDirection: 'row', alignItems: 'center', padding: 10}}>
                        <View style={styles.imageContainer}>
                            <Image source={logo} resizeMode="contain" style={styles.avator}/>
                        </View>
                        <TextInput 
                            placeholder='Enter subject' 
                            multiline={false} 
                            style={{flex: 1, borderBottomWidth: 1, borderBottomColor: 'grey', color: 'black', fontFamily: 'Roboto', fontSize: 14, fontWeight: '700', marginLeft: 8 }}
                            underlineColorAndroid='transparent'/>
                    </View>

                    <View style={styles.textAreaContainer} >
                        <TextInput
                            style={styles.textArea}
                            underlineColorAndroid="transparent"
                            placeholder="Type your description"
                            value={this.state.text}
                            onChangeText={text => this.setState({text: text})}
                            numberOfLines={10}
                            multiline={true}
                        />
                        <View style={styles.attachContainer}>
                            <TouchableWithoutFeedback onPress={() => this.attachMediaFile('image')}>
                                <Entypo name='image' size={20} color='white' />
                            </TouchableWithoutFeedback>
                        </View>
                        <View style={styles.videoAttachContainer}>
                            <TouchableWithoutFeedback onPress={() => this.attachMediaFile('video')}>
                                <Entypo name='video' size={20} color='white' />
                            </TouchableWithoutFeedback>
                        </View>
                    </View>
                    <View style={styles.content}>
                        { image ? <ProgressiveImage 
                                        style={styles.contentImage} 
                                        source={{uri: image}} 
                                        thumbnail={require('../../../assets/images/loading.jpg')}/> : null}
                        { video ? <VideoView source={video} width='100%' height={IMAGE_DIMENSIONS} /> : null}
                    </View>
                    <View>
                        <Button primary style={{width: 100, margin: 10, justifyContent: 'center', alignItems: 'center', borderRadius: 5}} children={<Text>Share</Text>}></Button>
                    </View>
                </View>
                <AnimatedLoader
                    visible={loading}
                    overlayColor="rgba(0,0,0,0.25)"
                    source={require("../../assets/anim/trail_loading.json")}
                    animationStyle={styles.lottie}
                    speed={1}
                />
            </View>
        )
    }
}

export default Post;

const IMAGE_DIMENSIONS = 200;

const styles = StyleSheet.create({
    textAreaContainer: {
      borderColor: '#707070',
      borderWidth: 1,
      padding: 5,
      margin: 10,
    },
    textArea: {
      height: 150,
      justifyContent: "flex-start",
      textAlignVertical: 'top',
    },
    imageContainer: {
        width: 68,
        height: 68,
        borderRadius: 34,
        overflow: 'hidden',
    },
    avator: {
        width: '100%',
        height: '100%'
    },
    attachContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#22f1db',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 10,
        right: 10
    },
    videoAttachContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#22f1db',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 10,
        right: 60
    },
    image: {
        width: 200,
        height: 200
    },
    contentImage: {
        width: "100%",
        height: IMAGE_DIMENSIONS,
    },
    content: {
        flexDirection: 'column',
        alignItems: 'center',
        margin: 10
    },
    lottie: {
        width: 200,
        height: 200
    }
  })
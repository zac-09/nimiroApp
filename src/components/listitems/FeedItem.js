import React from 'react';
import firebaseSDK from '../../backend/Firebase';
import { View } from 'native-base';
import { Card, Image } from 'react-native-elements';
import { StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import VideoView from '../video/Video';
import { Ionicons } from '@expo/vector-icons';
import ProgressiveImage from '../images/ProgressiveImage'

class FeedItem extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            user: {},
            liked: false,
        }
    }

    async componentDidMount (){    
        const user = await firebaseSDK.getUserInfo(this.props.created_by);
        this.setState({
            user
        })

    }

    like = () => {
        this.setState(prevState => ({
            liked: !prevState.liked
        }))
    }


    render(){
        const { user, liked } = this.state
        const { id, content, likes, comments, onItemPressed } = this.props
        const text = content.text 
        const image = content.image
        const video = content.video
        const comm = comments.length
        return (
            <Card containerStyle={styles.containerStyle}>
                <TouchableWithoutFeedback onPress={() => onItemPressed(id)}>
                    <View>
                        <View style={styles.header}>
                            <View style={styles.avatorContainer}>
                                <ProgressiveImage 
                                    style={styles.avator} 
                                    source={{uri: user.avatar}} 
                                    thumbnail={require('../../../assets/images/placeholder.png')}/>
                            </View>
                            <Text style={styles.username}>{user.name}</Text>
                        </View>
                        <View style={styles.content}>
                            { text ? <Text style={styles.contentText}>{text}</Text> : null}
                            { image ? <ProgressiveImage 
                                    style={styles.contentImage} 
                                    source={{uri: image}} 
                                    thumbnail={require('../../../assets/images/loading.jpg')}/> : null}
                            { video ? <VideoView source={video} width='100%' height={IMAGE_DIMENSIONS} /> : null}
                        </View>
                        <View style={styles.actions}>
                            <View style={styles.likesContainer}>
                                <Ionicons name={liked ? 'ios-heart' : 'ios-heart-empty'} size={32} onPress={() => this.like()} color='#2699FB'/>
                                <Text style={styles.actionsText}>{likes}</Text>
                            </View>
                            <View style={styles.commContainer}>
                                <Ionicons name='ios-chatboxes' size={32} onPress={() => this.like()} color='#2699FB'/>
                                <Text style={styles.actionsText}>{comm}</Text>
                            </View>
                            <TouchableOpacity style={{alignItems: 'center', marginLeft: 'auto'}}>
                                <Text style={styles.actionsText}>Share</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Card>
        )
    }
}

export default FeedItem;

const IMAGE_DIMENSIONS = 200;
const AVATAR_DIMENSIONS = 50

const styles = StyleSheet.create({
    containerStyle: {
        borderRadius: 5,
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
        borderWidth: 0
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    avatorContainer: {
        width: AVATAR_DIMENSIONS,
        height: AVATAR_DIMENSIONS,
        borderRadius: AVATAR_DIMENSIONS / 2,
        overflow: 'hidden',
    },
    avator: {
        width: AVATAR_DIMENSIONS,
        height: AVATAR_DIMENSIONS,
    },
    username: {
        fontSize: 15,
        fontFamily: 'Roboto',
        fontWeight: '900',
        color: '#2699FB',
        marginLeft: 20
    },
    content: {
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: 10
    },
    contentText: {
        fontSize: 14,
        fontFamily: 'Roboto',
        fontWeight: '300',
        color: '#000',
        marginBottom: 10
    },
    contentImage: {
        width: "100%",
        height: IMAGE_DIMENSIONS,
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10
    },
    likesContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    commContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 20
    },
    actionsText: {
        fontSize: 15,
        fontFamily: 'Roboto',
        color: '#2699FB',
        marginLeft: 8
    }
})
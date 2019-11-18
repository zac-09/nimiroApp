import * as React from 'react'
import { Thumbnail, Text, View } from 'native-base'
import { StyleSheet } from 'react-native'
import firebaseSDK from '../../backend/Firebase';
import moment from 'moment';

class CommentItem extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            user: {},
            avatar: require('../../assets/icons/profile.png')
        }
    }

    async componentDidMount (){    
        const user = await firebaseSDK.getUserInfo(this.props.created_by);
        this.setState({
            user,
            avatar: {uri: user.avatar}
        })
    }

    render(){
        const { avatar } = this.state
        const { content, date_created } = this.props
        return (
            <View style={styles.container}>
                <View style={styles.thumbnailContainer}>
                    <Thumbnail source={avatar}></Thumbnail>
                </View>
                <View style={styles.textContainer}>
                    <Text>{content.text}</Text>
                    <Text note>{moment(date_created.toDate()).format('MMMM Do YYYY, h:mm a')}</Text>
                </View>
            </View>
        )
    }
} 

export default CommentItem


const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        marginBottom: 5
    },
    thumbnailContainer: {
        marginRight: 20,
    },
    textContainer: {
        backgroundColor: '#ccc',
        padding: 10,
        borderRadius: 5,
        flex: 1
    }
})
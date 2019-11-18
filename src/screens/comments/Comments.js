import * as React from 'react';
import { View, Text } from 'native-base';
import { StyleSheet, KeyboardAvoidingView, TextInput } from 'react-native';
import { Lists } from '../../components';
import * as firebase from 'firebase'
import { Ionicons } from '@expo/vector-icons';

class Comments extends React.Component {

    constructor(props){
        super(props);

        this.postId = props.navigation.getParam('postId');
        this.type = props.navigation.getParam('type');

        this.state = {
            comments: [],
            comment: ''
        }

        this.threadsRef = firebase
            .firestore()
            .collection(this.type)
            .doc(this.postId)

        this.threadsUnscribe = 'null';
    }

    componentDidMount() {
        this.setState({loading: true})
        this.threadsUnscribe = this.threadsRef.onSnapshot(this.onThreadsCollectionUpdate);
    }

    componentWillUnmount() {
        this.threadsUnscribe();
    }

    onThreadsCollectionUpdate = doc => {
        let comments = []
        if(doc.exists){
            comments = doc.data().comments
        }

        this.setState({comments})
    }

    onSend = () => {
        const { comment, comments } = this.state
        const newComment = {
            content: {
                text: comment
            },
            created_by: firebase.auth().currentUser.uid,
            id: new Date().getMilliseconds(),
            date_created: new Date(),
            likes: 0
        }

        this.threadsRef.update({
            comments: firebase.firestore.FieldValue.arrayUnion(newComment)
        }).then(() => this.setState({comment: ''}))
    }


    render(){
        const { comments } = this.state
        return(
            <View style={styles.container}>
                <KeyboardAvoidingView style={{flex: 1}}>
                    <Lists.CommentList comments={comments}/>
                    <View style={styles.bottomContainer}>
                        <TextInput
                            maxLength={150}
                            value={this.state.comment}
                            onChangeText={val => this.setState({comment: val})}
                            underlineColorAndroid='transparent'
                            multiline
                            placeholder='Type a comment'
                            style={styles.input}
                        />
                        <Ionicons name='ios-send' size={48} color='#fff' onPress={() => this.onSend()}/>
                    </View>
                </KeyboardAvoidingView>
            </View>
        )
    }
}

export default Comments;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10
    },
    bottomContainer: {
        position: 'absolute',
        bottom: 0,
        padding: 5,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        flexGrow: 1
    },
    input: {
        padding: 10,
        marginRight: 10,
        backgroundColor: '#fff',
        borderRadius: 15,
        flex: 1
    }
})
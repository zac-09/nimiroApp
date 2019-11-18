import React from 'react'
import { View, Text } from 'native-base'
import * as Lists from '../../components/lists'
import * as firebase from 'firebase'
import Toast from 'react-native-root-toast';

export default class Feed extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            feed: [],
            loading: false,
        }
        
        this.threadsRef = firebase
            .firestore()
            .collection('feeds')
            .orderBy('date_created', 'desc');

        this.threadsUnscribe = 'null';
    }

    componentDidMount(){  
        this.setState({loading: true})
        this.threadsUnscribe = this.threadsRef.onSnapshot(this.loadFeedList);
    }

    componentWillUnmount(){
        this.threadsUnscribe();
    }

    loadFeedList = querySnapshot => {
        const data = [];
        try{
            querySnapshot.forEach(doc => {
                const feed = doc.data();
                data.push(feed);
            })
        } catch(error) {
            this.showToast(error)
        }
        
    
        this.setState({ feed: data, loading: false });
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

    openComments = id => {
        this.props.navigation.navigate('Comments', { postId: id, type: 'feeds'})
    }

    render(){
        const {feed} = this.state;
        return(
            <View style={{flex: 1}}>
                <Lists.FeedList 
                    feed={feed}
                    onFeedItemClicked={this.openComments}/>
            </View>
        )
    }
}
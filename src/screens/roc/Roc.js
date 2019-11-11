import React from 'react'
import { View, Text } from 'native-base'
import * as Lists from '../../components/lists'
import * as firebase from 'firebase'
import Toast from 'react-native-root-toast';

export default class Roc extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            roc: [],
            loading: false,
        }
        
        this.threadsRef = firebase
            .firestore()
            .collection('events')
            .orderBy('date_created', 'desc');

        this.threadsUnscribe = 'null';
    }

    componentDidMount(){  
        this.setState({loading: true})
        this.threadsUnscribe = this.threadsRef.onSnapshot(this.loadRocList);
    }

    componentWillUnmount(){
        this.threadsUnscribe();
    }

    loadRocList = querySnapshot => {
        const data = [];
        try{
            querySnapshot.forEach(doc => {
                const roc = doc.data();
                data.push(roc);
            })
        } catch(error) {
            this.showToast(error)
        }
        
    
        this.setState({ roc: data, loading: false });
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

    render(){
        const {roc} = this.state;
        return(
            <View style={{flex: 1}}>
                <Lists.RocList roc={roc}/>
            </View>
        )
    }
}
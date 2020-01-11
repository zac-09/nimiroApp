import * as React from 'react'
import * as firebase from 'firebase'
import * as Contacts from 'expo-contacts';
import * as Permissions from 'expo-permissions';
import firebaseSDK from '../../backend/Firebase'
import { formatPhoneNumber } from '../../utils/Validations'
import { View, Text } from 'native-base'
import { Lists } from '../../components'
import { Ionicons } from '@expo/vector-icons'
import Storage from '../../utils/Storage'
import Toast from 'react-native-root-toast';
import * as Headers from '../../components/headers';
import { ContactItem } from '../../components/listitems';

export default class Contact extends React.Component{
    constructor(props){
        super(props)

        this.state = {
            friends: [],
            loading: false,
        }

        this.threadsRef = firebase
            .firestore()
            .collection('friends')
            .doc(firebase.auth().currentUser.uid)
            .collection('list')
            .orderBy('name');

        this.threadsUnscribe = 'null';
    }

    componentDidMount(){  
        this.checkMultiPermissions()
        this.setState({loading: true})
        this.threadsUnscribe = this.threadsRef.onSnapshot(this.loadContactList);
    }

    componentWillUnmount(){
        this.threadsUnscribe();
    }

    checkMultiPermissions = async() => {
        const { status } = await Permissions.askAsync(Permissions.CONTACTS);
 
        if (status !== 'granted') {
          console.log("User has not allowed read contacts")
        }else {   
            this.scanContacts()
        }
    }

    loadContactList = querySnapshot => {
        const data = [];
        try{
            querySnapshot.forEach(doc => {
                const chat = doc.data();
                chat.lastMessageDate = doc.data().lastMessageDate.toDate()
                data.push(chat);
            })
        } catch(error) {
            this.showToast(error)
        }

        this.setState({ friends: data, loading: false });
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

    navigate = (route, data) => {
        this.props.navigation.navigate(route, data)
    }

    recordContactsLength = async length => {
        await Storage.set('numOfContacts', length.toString())
    }

    retrieveContactsLength = async () => {
        let num = null
        await Storage.get('numOfContacts', 'empty').then(res => num = res)

        return num;
    }

    scanContacts = async() => {
        const { data } = await Contacts.getContactsAsync({
            fields: [Contacts.Fields.PhoneNumbers],
        });

        const length = await this.retrieveContactsLength()

        if( length === data.length.toString() ){
            //no new contacts
            return;
        }else {
            //record new length
            this.recordContactsLength(data.length)
        }

        const filteredNumbers = []
          
        if (data.length > 0) {
            data.map(el => {
                if(el.phoneNumbers !== undefined){
                    el.phoneNumbers.map(num => {
                        filteredNumbers.push(formatPhoneNumber(num.number))
                    })
                }
            })
            firebaseSDK.syncContacts(filteredNumbers)
        }
    }

    openChat = async (id) => {
        let id1 = firebase.auth().currentUser.uid;
        let id2 = id;
        const friend = this.state.friends.find(el => el._id === id)
        
        const user = {
            _id: firebase.auth().currentUser.uid,
            avatar: firebase.auth().currentUser.photoURL,
            name: firebase.auth().currentUser.displayName,
        }
        let channel = {
                name: friend.dName,
                id: (id1 < id2 ? id1 + id2 : id2 + id1),
                currentUser: user,
                friend: friend,
                participants: [user, friend],
        };

        this.navigate('ChatScreen', { channel: channel });
    }

    addNewGroup = () => {

    }

    render(){
        const { friends } = this.state
        return(
            <View style={{flex: 1, position: 'relative', backgroundColor: 'rgba(246,246,246, 0.95)'}}>
                <Headers.BackHeader goBack={this.props.navigation.goBack} title='Contacts'/>
                <ContactItem name='New group' status=' ' icon iconName='group-add' onItemPressed={() => this.addNewGroup()}/>
                <Lists.ContactsList contacts={friends} onContactItemClicked={this.openChat}/>
            </View>
        )
    }
}
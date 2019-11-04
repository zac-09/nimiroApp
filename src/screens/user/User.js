import React from 'react';
import styled from 'styled-components/native'
import AnimatedLoader from "react-native-animated-loader";
import { logo, bg2} from '../../assets'
import { Forms } from '../../components';
import firebaseSDK from '../../backend/Firebase';
import Toast from 'react-native-root-toast';
import * as firebase from 'firebase';

class User extends React.Component {

    state = {
        rotaryLevel: '',
        club: '',
        fraternity: '',
        buddy: '',
        classification: '',
        rotaryLevelIndex: 0,
        loading: false,
    }

    navigate = route => {
        this.props.navigation.navigate(route)
    }

    handleUser = () => {

            this.setState({loading: true})
        
            const {  rotaryLevel, club, fraternity, buddy, classification} = this.state;
            let _id = firebase.auth().currentUser.uid
    
            const data = {
                rotaryLevel,
                club,
                fraternity,
                buddy,
                classification,
            }
          
            firebaseSDK.uploadUserData(data, this.success, this.failure)
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

    success = async() => {
        this.setState({loading: false});
        this.navigate('Login');
    }

    failure = error => {
        this.setState({loading: false});
        this.showToast(error.message.toString());
    }


    render(){
        const { 
            loading, 
            rotaryLevel, 
            club, 
            fraternity, 
            buddy, 
            classification, 
            rotaryLevelIndex} = this.state;
        return (
            <Container source={bg2}>
                <Content>
                    <Logo source={logo} resizeMode='contain' />
                    <Forms.UserForm
                            rotaryLevel={rotaryLevel}
                            club={club}
                            fraternity={fraternity}
                            buddy={buddy}
                            classification={classification}
                            rotaryLevelIndex={rotaryLevelIndex}
                            onChangeRotaryLevel={(value, index) => this.setState({rotaryLevel: value, rotaryLevelIndex: index})}
                            onChangeClub={text => this.setState({club: text})}
                            onChangeFraternity={text => this.setState({fraternity: text})}
                            onChangeBuddy={text => this.setState({buddy: text})}
                            onChangeClassification={text => this.setState({classification: text})}
                            onSubmitPress={() => this.handleUser()}
                        />
                </Content>
                <AnimatedLoader
                    visible={loading}
                    overlayColor="rgba(0,0,0,0.25)"
                    source={require("../../assets/anim/trail_loading.json")}
                    animationStyle={styles.lottie}
                    speed={1}
                />
            </Container>
        )
    }
}

export default User;

const styles = {
    accountContainer: {
        backgroundColor: '#155DEC',
        position: 'absolute',
        bottom: 0,
        right: 0,
        left: 0,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10
    },
    accountText: {
        fontSize: 14,
        color: '#fff',
        fontFamily: 'Roboto',
        textAlign: 'center'
    },
    lottie: {
        width: 200,
        height: 200
    }
}
const Container = styled.ImageBackground`
    width: 100%;
    height: 100%;
`

const Content = styled.View`
    width: 100%;
    height: 100%;
    align-items: center;
    position: relative;
`


const Logo = styled.Image`
    width: 70%;
    margin-bottom: 20;
`
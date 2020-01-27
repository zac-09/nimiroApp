import React from 'react';
import styled from 'styled-components/native'
import AnimatedLoader from "react-native-animated-loader";
import { logo, bg2} from '../../assets'
import { Forms } from '../../components';
import { TouchableOpacity, Text, View } from 'react-native';
import firebaseSDK from '../../backend/Firebase';
import Toast from 'react-native-root-toast';
import { validateEmail } from '../../utils/Validations';
import Storage from '../../utils/Storage';
import * as firebase from 'firebase';

export default class Forgot extends React.Component{

    state = {
        email: '',
        loading: false,
        sent: false
    }

    navigate = route => {
        this.props.navigation.navigate(route)
    }

    handleForgot = () => {
        //write login logic here
        const { email } = this.state
        const isValidEmail = validateEmail(email);
        if(isValidEmail !== true){
            this.showToast(isValidEmail);
        }else{
            this.setState({loading: true})
            firebaseSDK.resetPassword(email, this.success, this.failure)
        }
    }

    success = async() => {
        this.setState({loading: false, sent: true});
    }

    failure = error => {
        this.setState({loading: false});
        this.showToast(error.toString());
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
        const { email, sent, loading } = this.state
        const instruction = sent === true ? 'We have sent a password reset link to your email, please follow the link to reset your password and then login into the app with your new password' :
                'Please insert the email that you used to signup below:'
        return(
            <View style={{flex: 1}}>
                <Content>
                    <Logo source={logo} resizeMode='contain' />
                    <Text style={styles.instruction}>{instruction}</Text>
                    <Forms.ForgotForm 
                        email={email} 
                        onEmailChange={ text => this.setState({ email: text})}
                        onSubmitPress={this.handleForgot}/>
                    <TouchableOpacity style={styles.accountContainer} onPress={() => this.navigate('Register')}>
                        <Text style={styles.accountText}>Don't have an account? Sign up here</Text>
                    </TouchableOpacity>
                </Content>
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


const styles = {
    instruction: {
        fontSize: 14,
        color: '#fff',
        textAlign: 'center',
        fontFamily: 'Roboto',
        fontWeight: '900',
        marginBottom: 10
    },
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
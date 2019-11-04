import React from 'react';
import styled from 'styled-components/native'
import AnimatedLoader from "react-native-animated-loader";
import { logo, bg2} from '../../assets'
import { Forms } from '../../components';
import { TouchableOpacity, Text } from 'react-native';
import firebaseSDK from '../../backend/Firebase';
import Toast from 'react-native-root-toast';
import { validator } from '../../utils/Validations';
import Storage from '../../utils/Storage';
import * as firebase from 'firebase';

class Login extends React.Component {

    state = {
        checked: false,
        email: '',
        emailError: null,
        password: '',
        passwordError: null,
        loading: false
    }

    navigate = route => {
        this.props.navigation.navigate(route)
    }

    handleLogin = () => {
        //write login logic here
        const { email, emailError, password, passwordError, checked } = this.state
        const isValid = !(emailError || passwordError);
        if(isValid !== true){
            this.setState({loading: true})
            const user = {
                email,
                password
            }
            if(checked) firebaseSDK.persistLogin(user, this.success, this.failure)
            else firebaseSDK.login(user, this.success, this.failure)
        }else {
            this.showToast("Some fields are invalid")
        }
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
        const { email, password, checked } = this.state
        const uid = await firebase.auth().currentUser.uid
        console.log(`Your user id is: ${uid}`)
        /* if(checked) {
            Storage.set('userid', uid)
            Storage.set('password', password);
            Storage.set('email', email)
        } */
        
        this.setState({loading: false});
        this.navigate('SignedIn');
    }

    failure = error => {
        this.setState({loading: false});
        this.showToast(error.message.toString());
    }


    render(){
        const { email, emailError, password, passwordError, checked, loading } = this.state
        return (
            <Container source={bg2}>
                <Content>
                    <Logo source={logo} resizeMode='contain' />
                    <Forms.SignInForm 
                        email={email} 
                        password={password} 
                        onEmailChange={ text => this.setState({ email: text, emailError: validator('email', text)})}
                        emailError={emailError}
                        onPasswordChange={ text => this.setState({ password: text, passwordError: validator('password', text)})}
                        passwordError={passwordError}
                        onRemeberChange={() => this.setState(prev => ({ checked: !prev.checked}))}
                        onPasswordRecovery={() => this.navigate('Forgot')}
                        onSubmitPress={this.handleLogin}
                        checked={checked}/>
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
            </Container>
        )
    }
}

export default Login;

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
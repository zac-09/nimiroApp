import React from 'react';
import styled from 'styled-components/native'
import AnimatedLoader from "react-native-animated-loader";
import { logo, bg2} from '../../assets'
import { Forms } from '../../components';
import { TouchableOpacity, Text } from 'react-native';
import firebaseSDK from '../../backend/Firebase';
import Toast from 'react-native-root-toast';
import { validateEmail, validatePassword } from '../../utils/Validations';

class Login extends React.Component {

    state = {
        checked: false,
        email: '',
        password: '',
        loading: false
    }

    navigate = route => {
        this.props.navigation.navigate(route)
    }

    handleLogin = () => {
        //write login logic here
        const { email, password } = this.state
        const isValidEmail = validateEmail(email);
        const isValidPassword = validatePassword(password);
        if(isValidEmail !== true){
            this.showToast(isValidEmail);
        }else if(isValidPassword !== true){
            this.showToast(isValidPassword);
        }else{
            const user = {
                email,
                password
            }
            firebaseSDK.login(user, this.success, this.failure)
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

    success = () => {
        this.setState({loading: false});
        this.navigate('SignedIn');
    }

    failure = error => {
        this.setState({loading: false});
        this.showToast(error.toString());
    }

    render(){
        const { email, password, checked, loading } = this.state
        return (
            <Container source={bg2}>
                <Content>
                    <Logo source={logo} resizeMode='contain' />
                    <Forms.SignInForm 
                        email={email} 
                        password={password} 
                        onEmailChange={ text => this.setState({ email: text})}
                        onPasswordChange={ text => this.setState({ password: text})}
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
                    overlayColor="rgba(255,255,255,0.75)"
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
        width: 100,
        height: 100
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
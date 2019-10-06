import React from 'react';
import styled from 'styled-components/native'
import { logo, bg2} from '../../assets'
import { Forms } from '../../components';
import { TouchableOpacity, Text } from 'react-native';

class Login extends React.Component {

    state = {
        checked: false,
        email: '',
        password: ''
    }

    navigate = route => {
        this.props.navigation.navigate(route)
    }

    handleLogin = () => {
        //write login logic here
        this.navigate('SignedIn');
    }

    render(){
        const { email, password, checked } = this.state
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
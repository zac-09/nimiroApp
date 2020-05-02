import React from 'react';
import { Form, View, ListItem, CheckBox, Body, Text } from 'native-base';
import { UnderlinedInput } from '../inputs';
import { TouchableOpacity } from 'react-native';
import { LgButton } from '../buttons';

const SignInForm = props => {
    return (
        <Form style={styles.container}>
            <UnderlinedInput
                label='Email'
                keyboardType='email-address'
                value={props.email}
                inputError={props.emailError}
                containerStyle={{marginBottom: 20}}
                onChangeText={(text) => props.onEmailChange(text)}
            />
            <UnderlinedInput
                label='Password'
                isSecure={true}
                value={props.password}
                inputError={props.passwordError}
                onChangeText={(text) => props.onPasswordChange(text)}
            />
            <View style={styles.checkContainer}>
                <TouchableOpacity 
                    onPress={() => props.onRemeberChange()}
                    style={{flexShrink: 1, alignItems: 'center', flexDirection: 'row'}}>
                    <CheckBox
                        center
                        checked={props.checked}
                        onPress={() => props.onRemeberChange()}
                        titleProps={{style:styles.rememberText}}
                        containerStyle={{backgroundColor: "transparent", borderWidth: 0}}
                    />
                    <Text style={styles.rememberText}>Remember me</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{flexShrink: 1}}  onPress={() => props.onPasswordRecovery()}>
                    <Text style={styles.forgotText}>Forgot Password?</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.buttonContainer}>
                <LgButton text='Login' onPress={() => props.onSubmitPress()} />
            </View>
        </Form>
    )
}

export default SignInForm;

const styles = {
    container: {
        width: '100%',
        paddingHorizontal: 30
    },
    checkContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 30
    },
    rememberText: {
        fontSize: 16,
        color: '#fff',
        fontFamily: 'Roboto',
        marginLeft: 15
    },
    forgotText: {
        fontSize: 16,
        color: '#0404F9',
        fontFamily: 'Roboto'
    },
    buttonContainer: {
        paddingTop: 30,
        marginHorizontal: 40,
        alignItems: 'center',
        justifyContent: 'center',
    }

}
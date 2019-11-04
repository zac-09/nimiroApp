import React from 'react';
import { Form } from 'native-base';
import { BlockInput } from '../inputs';
import PhoneInput from 'react-native-phone-input';
import { LgButton } from '../buttons';
import { View, Text } from 'react-native';

const RegisterForm = props => {
    return (
        <Form style={styles.container}>
            <BlockInput
                placeholder='First name'
                value={props.fName}
                inputError={props.fNameError}
                onChangeText={(text) => props.onFNameChange(text)}
            />
            <BlockInput
                placeholder='Last name'
                value={props.lName}
                inputError={props.lNameError}
                onChangeText={(text) => props.onLNameChange(text)}
            />
            <BlockInput
                placeholder='User name'
                value={props.dName}
                inputError={props.dNameError}
                onChangeText={(text) => props.onDNameChange(text)}
            />
            <View style={styles.inputContainer}>
                <PhoneInput
                    style={{borderBottomWidth: 1, borderBottomColor: 'gray', paddingBottom: 10}}
                    initialCountry='ug'
                    value={props.phoneNumber}
                    onChangePhoneNumber={(number) => props.onChangePhoneNumber(number)}
                />
            </View>
            <BlockInput
                placeholder='Email address'
                keyboardType='email-address'
                value={props.email}
                inputError={props.emailError}
                onChangeText={(text) => props.onEmailChange(text)}
            />
            <BlockInput
                placeholder='Password'
                isSecure={true}
                value={props.password}
                inputError={props.passwordError}
                onChangeText={(text) => props.onPasswordChange(text)}
            />

            <BlockInput
                placeholder='Confirm password'
                isSecure={true}
                value={props.confirmPassword}
                inputError={props.passwordError}
                onChangeText={(text) => props.onConfirmPasswordChange(text)}
            />
            <View style={styles.buttonContainer}>
                <LgButton text='Create Account' onPress={() => props.onSubmitPress()} />
            </View>
            <Text style={{textAlign: 'center', color: '#F80A0A', marginVertical: 10}}>
                By clicking “Create Account” below, you agree to 
                our terms of service and privacy policy.
            </Text>
        </Form>
    )
}

export default RegisterForm;

const styles = {
    container: {
        width: '100%',
        paddingHorizontal: 30
    },
    inputContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0)',
        height: 60,
        width: '100%',
        padding: 10,
        justifyContent: 'center',
        borderRadius: 5
    },
    buttonContainer: {
        paddingTop: 30,
        marginHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
    }
}
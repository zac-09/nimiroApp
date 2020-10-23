import React from 'react';
import { Form } from 'native-base';
import { BlockInput } from '../inputs';
import PhoneInput from 'react-native-phone-input';
import { LgButton } from '../buttons';
import { View, Text, TouchableOpacity } from 'react-native';
import {Radio, RadioGroup,RadioButton} from "radio-react-native";
import { CheckBox } from 'react-native-elements';
import  NewButton  from '../buttons/NewButton';

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
                placeholder='Country'
                value={props.country}
                inputError={props.dNameError}
                onChangeText={(text) => props.onDNameChange(text)}
            />

            <View style={styles.inputContainer}>
                <Text style={{paddingVertical: 5, fontWeight: "700", color: '#fff'}}>Gender</Text>
                <RadioGroup 
                    style={{flexDirection: 'row',}}
                    defaultChoice={props.genderIndex} 
                    onChoose={(value,index)=>props.onChangeGender(value,index)}
                    >
                    <RadioButton style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}} value={"male"}>
                        <Radio/><Text style={{paddingHorizontal: 10, color: '#E807BB'}}>Male</Text> 
                    </RadioButton>
                    <RadioButton style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}} value={"female"}>
                        <Radio/><Text style={{paddingHorizontal: 10, color: '#E807BB'}}>Female</Text>
                    </RadioButton>
                </RadioGroup>
            </View>
            <View style={styles.inputContainer}>
                <Text style={{paddingVertical: 5, fontWeight: "700", color: '#fff'}}>Contact</Text>
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
            <CheckBox
                center
                title='I agree to all terms of service and privacy policy.'
                checked={props.checked}
                onPress={() => props.onAgreeChange()}
                titleProps={{style:styles.rememberText}}
                containerStyle={{backgroundColor: "transparent", borderWidth: 0}}
            />
            <View style={styles.buttonContainer}>
                <LgButton disabled={!(props.checked)} text='Create Account' onPress={() => props.onSubmitPress()} />
            </View>
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
        height: 75,
        width: '100%',
        padding: 10,
        justifyContent: 'center',
        borderRadius: 5,
        flexDirection: 'column', 
        alignItems: 'flex-start'
    },
    buttonContainer: {
        paddingTop: 30,
        marginHorizontal: 20,
        marginBottom: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    rememberText: {
        fontSize: 14,
        color: '#fff',
        fontFamily: 'Roboto',
        marginLeft: 8,
    },
}
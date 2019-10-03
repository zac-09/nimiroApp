import React from 'react';
import { Form } from 'native-base';
import { BlockInput } from '../inputs';
import PhoneInput from 'react-native-phone-input';
import { LgButton } from '../buttons';
import { View, Text } from 'react-native';
import {Radio, RadioGroup,RadioButton} from "radio-react-native";

const RegisterForm = props => {
    return (
        <Form style={styles.container}>
            <BlockInput
                placeholder='First name'
                value={props.fName}
                onChangeText={(text) => props.onFNameChange(text)}
            />
            <BlockInput
                placeholder='Last name'
                value={props.lName}
                onChangeText={(text) => props.onLNameChange(text)}
            />
            <BlockInput
                placeholder='Display name'
                value={props.dName}
                onChangeText={(text) => props.onDNameChange(text)}
            />
            <View style={styles.inputContainer}>
                <PhoneInput
                    initialCountry='ug'
                    value={props.phoneNumber}
                    onChangePhoneNumber={(number) => props.onChangePhoneNumber(number)}
                />
            </View>
            <BlockInput
                placeholder='Email address'
                keyboardType='email-address'
                value={props.email}
                onChangeText={(text) => props.onEmailChange(text)}
            />
            <BlockInput
                placeholder='Password'
                isSecure={true}
                value={props.password}
                onChangeText={(text) => props.onPasswordChange(text)}
            />
            <View style={{...styles.inputContainer, height: 60, flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center'}}>
                <Text style={{paddingVertical: 5, fontWeight: "700", color: '#fff'}}>Gender</Text>
                <RadioGroup 
                    style={{flexDirection: 'row',}}
                    defaultChoice={props.genderIndex} 
                    onChoose={(value,index)=>props.onChangeGender(value,index)}
                    >
                    <RadioButton style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}} value={"male"}>
                        <Radio/><Text style={{paddingHorizontal: 10, color: 'blue'}}>Male</Text> 
                    </RadioButton>
                    <RadioButton style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}} value={"female"}>
                        <Radio/><Text style={{paddingHorizontal: 10, color: '#E807BB'}}>Female</Text>
                    </RadioButton>
                </RadioGroup>
            </View>
            <View style={{...styles.inputContainer, height: 60, flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center'}}>
                <Text style={{paddingVertical: 5, fontWeight: "700", color: '#fff'}}>Rotary level</Text>
                <RadioGroup 
                    style={{flexDirection: 'row'}}
                    defaultChoice={props.rotaryLevelIndex} 
                    onChoose={(value,index)=>props.onChangeRotaryLevel(value,index)}
                    >
                    <RadioButton style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}} value={"rotarian"}>
                        <Radio/><Text style={{paddingHorizontal: 10}}>Rotarian</Text> 
                    </RadioButton>
                    <RadioButton style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}} value={"rotaractor"}>
                        <Radio/><Text style={{paddingHorizontal: 10}}>Rotaractor</Text>
                    </RadioButton>
                    <RadioButton style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}} value={"interactor"}>
                        <Radio/><Text style={{paddingHorizontal: 10}}>Interactor</Text>
                    </RadioButton>
                </RadioGroup>
            </View>
            <BlockInput
                placeholder='Club'
                value={props.club}
                onChangeText={(text) => props.onChangeClub(text)}
            />
            <BlockInput
                placeholder='Fraternity role'
                value={props.fraternity}
                onChangeText={(text) => props.onChangeFraternity(text)}
            />
            <BlockInput
                placeholder='Buddy group'
                value={props.buddy}
                onChangeText={(text) => props.onChangeBuddy(text)}
            />
            <BlockInput
                placeholder='Classification'
                value={props.classification}
                onChangeText={(text) => props.onChangeClassification(text)}
            />
            <View style={styles.buttonContainer}>
                <LgButton text='Connect to Fraternity' onPress={() => props.onSubmitPress()} />
            </View>
            <Text style={{textAlign: 'center', color: '#F80A0A', marginVertical: 10}}>
                By clicking “Connect to fraternity” below, you agree to 
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
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
        height: 40,
        width: '100%',
        padding: 10,
        marginTop: 5,
        marginBottom: 5,
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
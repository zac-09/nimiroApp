import React from 'react';
import { Form, View } from 'native-base';
import { UnderlinedInput } from '../inputs';
import { LgButton } from '../buttons';
import  NewButton  from '../buttons/NewButton';

const ForgotForm = props => {
    return (
        <Form style={styles.container}>
            <UnderlinedInput
                label='Email'
                keyboardType='email-address'
                value={props.email}
                onChangeText={(text) => props.onEmailChange(text)}
            />
            <View style={styles.buttonContainer}>
                <NewButton width={190} text='Send Recovery Email' onPress={() => props.onSubmitPress()} />
            </View>
        </Form>
    )
}

export default ForgotForm;

const styles = {
    container: {
        width: '100%',
        paddingHorizontal: 30
    },
    buttonContainer: {
        paddingTop: 30,
        marginHorizontal: 40,
        alignItems: 'center',
        justifyContent: 'center',
    }
}
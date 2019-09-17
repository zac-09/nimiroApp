import React from 'react';
import { Form } from 'native-base';
import { BlockInput } from '../inputs';

const RegisterForm = props => {
    return (
        <Form style={styles.container}>
            <BlockInput
                placeholder='First name'
                value={props.fName}
                onChangeText={(text) => props.onUsernameChange(text)}
            />
            <BlockInput
                label='Other names'
                value={props.sName}
                onChangeText={(text) => props.onOtherNameChange(text)}
            />
            <BlockInput
                label='Display name'
                value={props.sName}
                onChangeText={(text) => props.onDisplayNameChange(text)}
            />
        </Form>
    )
}

export default RegisterForm;

const styles = {
    container: {
        width: '100%',
        paddingHorizontal: 30
    }
}
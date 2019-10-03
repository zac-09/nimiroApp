import React from 'react';
import { View } from 'native-base';
import { TextInput } from 'react-native';

const BlockInput = props => {
    return (
        <View style={styles.textContainer}>
            <TextInput
                style={props.inputStyle || styles.textInput}
                keyboardType={props.keyboardType || "default"}
                maxLength={props.maxLength}
                secureTextEntry={props.isSecure}
                disabled={props.disabled}
                returnKeyType={props.returnKeyType || "next"}
                value={props.value}
                onChangeText={text => props.onChangeText(text)}
                placeholder={props.placeholder}
            />
        </View>
    )
}

export default BlockInput;

const styles = {
    textContainer: {
        backgroundColor: '#fff',
        height: 40,
        width: '100%',
        padding: 10,
        marginTop: 5,
        marginBottom: 5,
        justifyContent: 'center',
        borderRadius: 5
    },
    textInput: {
        backgroundColor: 'transparent',
        color: '#000'
    }
}
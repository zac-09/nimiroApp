import React from 'react';
import { View } from 'native-base';
import { Input } from 'react-native-elements';

const BlockInput = props => {
    return (
        <View style={styles.textContainer}>
            <Input
                placeholder={props.label}
                errorStyle={{ color: 'red' }}
                errorMessage={props.inputError}
                containerStyle={{borderBottomWidth: 0}}
                inputStyle={props.inputStyle || styles.textInput}
                keyboardType={props.keyboardType || "default"}
                maxLength={props.maxLength}
                secureTextEntry={props.isSecure}
                disabled={props.disabled}
                returnKeyType={props.returnKeyType || "next"}
                value={props.value}
                onChangeText={text => props.onChangeText(text)}
                placeholder={props.placeholder}
                placeholderTextColor='#fff'
                underlineColorAndroid="transparent"
            />
        </View>
    )
}

export default BlockInput;

const styles = {
    textContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0)',
        height: 60,
        width: '100%',
        paddingTop: 10,
        paddingBottom: 10,
        justifyContent: 'center',
        borderRadius: 5
    },
    textInput: {
        backgroundColor: 'transparent',
        color: '#fff',
        borderBottomWidth: 0,
        fontSize: 14
    }
}
import React from "react";
import { View } from "react-native";
import { Input } from "react-native-elements";
//import { Item, Input, Label, InputGroup, Icon, Text } from "native-base";

/* function UnderlinedInput(props) {
  return (
    <View>
      <Item floatingLabel style={styles.item}>
        <Label style={props.labelStyle || styles.label}>{props.label}</Label>
        <InputGroup 
          iconRight 
          error={props.inputError ? true : false}>
          <Icon name='ios-checkmark-circle' style={{color:'#00C497'}}/>
          <Input
            style={props.inputStyle || styles.input}
            keyboardType={props.keyboardType || "default"}
            maxLength={props.maxLength}
            secureTextEntry={props.isSecure}
            disabled={props.disabled}
            returnKeyType={props.returnKeyType || "next"}
            value={props.value}
            onChangeText={text => props.onChangeText(text)}
          />
          {props.inputError ? <Text style={styles.error}>{props.inputError}</Text> : null}
        </InputGroup>
      </Item>
    </View>
  );
} */


function UnderlinedInput(props) {
  return (
    <View style={props.containerStyle || styles.container}>
      <Input
        placeholder={props.label}
        errorStyle={{ color: 'red' }}
        errorMessage={props.inputError}
        inputStyle={props.inputStyle || styles.input}
        keyboardType={props.keyboardType || "default"}
        maxLength={props.maxLength}
        secureTextEntry={props.isSecure}
        disabled={props.disabled}
        returnKeyType={props.returnKeyType || "next"}
        value={props.value}
        onChangeText={text => props.onChangeText(text)}
      />
    </View>
  );
}

const styles = {
  container: {
    marginBottom: 10,
  },
  item: {
    marginLeft: 0
  },
  label: {
    fontFamily: "Roboto",
    color: "#fff",
    paddingTop: 4
  },
  input: {
    fontFamily: "Roboto",
    color: "#000"
  },
  error: {
    fontFamily: "Roboto",
    color: "#f23",
    paddingTop: 4
  }
};

export default UnderlinedInput;
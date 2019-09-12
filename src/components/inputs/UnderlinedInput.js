import React from "react";
import { View } from "react-native";
import { Item, Input, Label } from "native-base";

function UnderlinedInput(props) {
  return (
    <View>
      <Item floatingLabel style={styles.item}>
        <Label style={props.labelStyle || styles.label}>{props.label}</Label>
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
      </Item>
    </View>
  );
}

const styles = {
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
  }
};

export default UnderlinedInput;
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Text, StyleSheet, TouchableOpacity, Dimensions } from "react-native";

const NewButton = (props) => {
  return (
    <TouchableOpacity
      style={{ width: props.width, ...props.style }}
      onPress={props.onPress}
    >
      <LinearGradient
        colors={["#F9038E", "#850127"]}
        style={{
          padding: props.padding ? props.padding : 15,
          alignItems: "center",
          borderRadius: 20,
        }}
        start={[0.0, 0.1]}
        //  end={[1,.9]}
      >
        <Text
          style={{
            backgroundColor: "transparent",
            fontSize: props.textSize ? props.textSize : 15,
            color: "#fff",
          }}
        >
          {props.text}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default NewButton;

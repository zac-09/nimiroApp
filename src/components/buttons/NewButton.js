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
        colors={["#fff", "#fff"]}
        style={{
          padding: props.padding ? props.padding : 15,
          alignItems: "center",
          borderRadius: 8,
        }}
        start={[0.0, 0.1]}
        //  end={[1,.9]}
      >
        <Text
          style={{
            backgroundColor: "transparent",
            fontSize: props.textSize ? props.textSize : 15,
            color: "#F9038E",
          }}
        >
          {props.text}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default NewButton;

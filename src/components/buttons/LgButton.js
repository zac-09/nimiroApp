import React from "react";
import { Text } from "react-native";
import { Button } from "native-base";
import { Feather } from "@expo/vector-icons";

function LgButton(props) {
  return (
    <Button
      full
      style={styles.container}
      onPress={() => !props.busy && props.onPress()}
    >
      {props.busy === true ? (
        <Feather name="zap" style={styles.icon} />
      ) : (
        <Text style={styles.text}>{props.text}</Text>
      )}
    </Button>
  );
}

const styles = {
  container: {
    backgroundColor: '#850127',
    borderRadius: 20
  },
  text: {
    fontFamily: "Roboto",
    fontSize: 16,
    color: "#FFF"
  },
  icon: {
    color: "#FFF",
    fontSize: 25
  }
};

export default LgButton;
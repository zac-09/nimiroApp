import React from "react";
import { View } from "react-native";
import { Feather } from "@expo/vector-icons";

function BottomMenuItem(props) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Feather
          name={props.icon}
          style={props.active ? styles.icon.active : styles.icon.inactive}
        />
      </View>
    </View>
  );
}

const styles = {
  container: {
    flex: 1,
    padding: 2
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  icon: {
    active: {
      fontSize: 20,
      color: "#000"
    },
    inactive: {
      fontSize: 20,
      color: "#A9A9A9"
    }
  }
};

export default BottomMenuItem;

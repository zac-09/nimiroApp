import React from "react";
import { View, Text } from "react-native";

function ExploreTabItem(props) {
  return (
    <View style={styles.container}>
      <Text
        style={
          props.active === true ? styles.text.active : styles.text.inactive
        }
        onPress={() => props.onPress(props.text)}
      >
        {props.text}
      </Text>
      {props.active === true ? (
        <View style={styles.rule} />
      ) : (
        <View style={styles.transparentRule} />
      )}
    </View>
  );
}

const baseTextStyles = {
  fontSize: 14,
  textAlign: "center",
  color: "#000"
};

const styles = {
  container: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center"
  },
  text: {
    active: {
      ...baseTextStyles,
      fontFamily: "LatoBlack"
    },
    inactive: {
      ...baseTextStyles,
      fontFamily: "LatoRegular",
      opacity: 0.9
    }
  },
  rule: {
    height: 2,
    backgroundColor: "#000",
    alignSelf: "stretch",
    marginHorizontal: 10,
    marginTop: 5
  },
  transparentRule: {
    height: 2,
    backgroundColor: "transparent",
    marginHorizontal: 10,
    marginTop: 5
  }
};

export default ExploreTabItem;

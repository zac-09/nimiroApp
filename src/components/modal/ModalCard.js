import React from "react";
import { View, StyleSheet } from "react-native";

const ModalCard = props => {
  return (
    <View style={{ ...styles.card, ...props.style }}>{props.children}</View>
  );
};
const styles = StyleSheet.create({
  card: {
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.26,
    shadowRadius: 8,
    backgroundColor: "white",
    height: 260,
    flexDirection: "row",
    flexWrap: "wrap"
  }
});

export default ModalCard;

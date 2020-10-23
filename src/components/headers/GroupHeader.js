import React from "react";
import { Header, Left, Body, Title, Right, View } from "native-base";
import { Text, StyleSheet } from "react-native";

import { Ionicons } from "@expo/vector-icons";

const GroupHeader = (props) => {
  return (
    <View style={styles.header}>
      <View style={styles.headerTitles}>
        <Text style={styles.title}>{props.title}</Text>

        <Text style={styles.subTitle}>{props.subTitle}</Text>
      </View>
      {props.icon && (
        <Right>
          <Ionicons
            name="ios-search"
            size={32}
            color="#fff"
            style={{ paddingLeft: 10, paddingRight: 10 }}
          />
        </Right>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: "transparent",
    borderBottomColor: "#4291ee",

    elevation: 3,
    flexDirection: "row",
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 9999,
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  title: {
    fontSize: 18,
    color: "#fff",
  },
  subTitle: {
    fontSize: 16,
    color: "#fff",
  },
  headerTitles: {
    flexDirection: "column",
    padding: 10,
  },
});
export default GroupHeader;

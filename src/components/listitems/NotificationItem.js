import React from "react";
import { View, StyleSheet, Text, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
const NotificationItem = (props) => {
  return (
    <View style={{ ...styles.userContainer, backgroundColor: props.color }}>
      <View style={{ flexDirection: "row" }}>
        <View style={styles.textContainer}>
          <Text style={{ color: "#fff", fontSize: 18}}>{props.date}</Text>
          <Text style={{ color: "#fff", fontSize: 24 }}>{props.content}</Text>
        </View>
        <View style={{ alignSelf: "center", paddingLeft: 20 }}>
          <Ionicons name={props.icon} color="#fff" size={70} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  userContainer: {
    height: 160,
    backgroundColor: "#7623A8",
    borderBottomStartRadius: 60,
    borderBottomWidth: 2,
  },
  textContainer: {
    padding: 20,
    width: 300,
  },
});

export default NotificationItem;

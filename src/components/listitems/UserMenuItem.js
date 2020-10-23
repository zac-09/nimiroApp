import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
const UserItem = (props) => {
  return (
    <TouchableOpacity onPress={props.onPress}>
      <View style={styles.container}>
        <Ionicons
          name={props.icon}
          size={32}
          color="#fff"
          style={{ marginLeft: 30 }}
        />
        <Text style={{ color: "#fff", marginLeft: 20, fontSize: 20 }}>
          {props.title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 20,
  },
});

export default UserItem;

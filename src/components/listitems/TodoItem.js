import React from "react";
import { Text, View, StyleSheet, TouchableWithoutFeedback } from "react-native";
import { formatDate } from "../../utils/Validations";
import { Ionicons } from "@expo/vector-icons";

const TodoItem = (props) => {
  const isAdded = props.isAdded;

  return (
    <TouchableWithoutFeedback onLongPress={props.onLongPress} onPress={props.onPress}>
      <View style={styles.container}>
        <View>
          {isAdded === true ? (
            <Ionicons
              name="ios-checkbox"
              size={23}
              style={styles.icon}
              color="#FB38A0"
            />
          ) : null}

          <Text
            numberOfLines={3}
            style={{ color: "#fff", fontSize: 18, padding: 10, marginLeft:20 }}
          >
            {" "}
            {props.content}
          </Text>
        </View>
        <Text style={{ color: "#ccc", alignSelf: "flex-end", fontSize: 15 }}>
          {formatDate(props.date)}
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(0,0,0,.83)",
    maxHeight: 150,
    borderBottomColor: "#ccc",
    borderBottomWidth: 2,
    padding: 10,
    // marginVertical: 2,
  },
  icon: {
    position: "absolute",
    left: 2,
    top:10
  },
});

export default TodoItem;

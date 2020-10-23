import React from "react";
import { View, Image, TouchableHighlight } from "react-native";
import { Text } from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
const ContactItem = (props) => {
  const avator = props.avatar
    ? { uri: props.avatar }
    : require("../../assets/placeholder.png");
  const status = props.status || "Hey there! I am using RotaApp";
  const isAdded = props.isAdded;
  return (
    <TouchableHighlight
      onPress={() => props.onItemPressed(props._id)}
      activeOpacity={0.985}
      underlayColor="#06545A"
    >
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          {props.icon ? (
            <MaterialIcons name={props.iconName} color="#fff" size={32} />
          ) : (
            <Image style={styles.avator} source={avator} />
          )}
        </View>
        <View style={styles.contentContainer}>
          <Text
            style={{
              fontSize: 15,
              fontWeight: "700",
              color: "#000",
              marginBottom: 10,
            }}
          >
            {props.lName}
          </Text>
          <Text
            numberOfLines={1}
            style={{ width: 200, color: "#fff", fontSize: 13 }}
          >
            {status}
          </Text>
          {isAdded === true ? (
            <Ionicons
              name="ios-checkbox"
              size={23}
              style={styles.icon}
              color="#4291ee"
            />
          ) : null}
        </View>
      </View>
    </TouchableHighlight>
  );
};

export default ContactItem;

const styles = {
  container: {
    flexDirection: "row",
    margin: 10,
    alignItems: "center",
  },
  imageContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: "hidden",
    backgroundColor: "#4291ee",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    position: "absolute",
    right: 15,
  },
  avator: {
    width: "100%",
    height: "100%",
  },
  contentContainer: {
    marginLeft: 10,
    flexDirection: "column",
    justifyContent: "center",
    height: 60,
    flex: 1,
  },
  textContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  detailContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
};

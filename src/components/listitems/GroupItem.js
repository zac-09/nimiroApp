import React from "react";
import { View, Image, TouchableHighlight } from "react-native";
import { Text } from "native-base";
import { MaterialIcons } from "@expo/vector-icons";

const GroupItem = props => {
  const avator = props.avatar
    ? { uri: props.avatar }
    : require("../../assets/placeholder.png");

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
          {/* <View style={styles.cancel}>
            <MaterialIcons name="cancel" color="#fff" size={10} />
          </View> */}
        </View>
        <View style={styles.contentContainer}>
          <Text
            style={{
              fontSize: 15,
              fontWeight: "700",
              color: "#000",
              marginBottom: 5
            }}
          >
            {props.name}
          </Text>
        </View>
      </View>
    </TouchableHighlight>
  );
};

export default GroupItem;

const styles = {
  container: {
    flexDirection: "column",
    margin: 10,
    alignItems: "center"
  },
  imageContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#4291ee",
    alignItems: "center",
    justifyContent: "center"
  },
  avator: {
    width: "100%",
    height: "100%"
  },
  contentContainer: {
    marginLeft: 10,
    flexDirection: "column",
    justifyContent: "center",
    height: 60,
    flex: 1
  },
  textContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10
  },
  detailContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  cancel: {
    position: "absolute",
    bottom: -10,
    right: 20
  }
};

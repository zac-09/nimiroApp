import React from "react";
import { Header, Left, Body, Title, Right, View } from "native-base";
import getHeaderContainerStyle from "./getHeaderContainerStyle";
import { Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
// import { useSelector } from "react-redux";

function ChatHeader(props) {
  const avator = props.avatar
    ? { uri: props.avatar }
    : require("../../assets/placeholder.png");
  // const theme = useSelector((state) => state.themes.data);

  return (
    <View
      style={{
        ...styles.header,
      
      }}
    >
      <View style={styles.imageContainer}>
        <Image style={styles.avator} source={avator} />
      </View>
      <View>
        {!!props.name && (
          <Title style={{ ...styles.title, }}>
            {props.name}
          </Title>
        )}
      </View>
      <Right>
        <Ionicons
          name="md-more"
          size={32}
          color="#fff"
          style={{ paddingLeft: 10, paddingRight: 10 }}
        />
      </Right>
    </View>
  );
}

const styles = {
  header: {
    backgroundColor: "#18022C",
    borderBottomColor: "#4291ee",
    boxShadow: "none",
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
    fontSize: 16,
    color: "#fff",
  },
  imageContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: "hidden",
    marginRight: 10,
  },
  avator: {
    width: "100%",
    height: "100%",
  },
};

export default ChatHeader;

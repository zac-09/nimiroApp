import React from "react";
import {
  TouchableWithoutFeedback,
  View,
  Image,
  TouchableHighlight,
} from "react-native";
import { Text, Right } from "native-base";
import { Badge } from "react-native-elements";
import { formatDate } from "../../utils/Validations";

const ChatItem = (props) => {
  const avator = props.avatar
    ? { uri: props.avatar }
    : require("../../assets/placeholder.png");
  const lastMessage = props.lastMessage.text
    // ? props.lastMessage.text
    // : props.lastMessage;

  // ? props.lastMessage.text : props.lastMessage
  return (
    <TouchableHighlight
      onPress={() => props.onItemPressed(props.id)}
      activeOpacity={0.985}
      underlayColor="#06545A"
    >
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <Image style={styles.avator} source={avator} />
        </View>
        <View style={styles.contentContainer}>
          <View style={styles.textContainer}>
            <Text
              style={{
                fontSize: 15,
                fontWeight: "700",
                color: "#000",
                marginBottom: 10,
              }}
            >
              {props.name}
            </Text>
            <Text
              style={{
                color: props.unread > 0 ? "#53C41A" : "#64676A",
                marginBottom: 10,
                fontSize: 12,
              }}
            >
              {formatDate(props.lastMessageDate)}
            </Text>
          </View>
          <View style={styles.detailContainer}>
            <Text
              numberOfLines={1}
              style={{ width: 200, color: "#64676A", fontSize: 13 }}
            >
              {lastMessage}
            </Text>
            {props.unread > 0 && (
              <Badge value={props.unread} status="success" />
            )}
          </View>
        </View>
      </View>
    </TouchableHighlight>
  );
};

export default ChatItem;

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
  },
  avator: {
    width: "100%",
    height: "100%",
  },
  contentContainer: {
    marginLeft: 10,
    borderBottomColor: "#ccc",
    flexDirection: "column",
    justifyContent: "space-between",
    height: 60,
    flex: 1,
    paddingBottom: 15,
    borderBottomColor: "rgba(205, 210, 214, 0.5)",
    borderBottomWidth: 1,
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

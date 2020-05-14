import React from "react";
import { View, Image, TouchableHighlight,TouchableWithoutFeedback,Dimensions } from "react-native";
import { Text } from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
const GroupItem = (props) => {
  const avator = props.avatar
    ? { uri: props.avatar }
    : require("../../assets/placeholder.png");
  // const status = props.status || 'Hey there! I am using RotaApp'
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
        <View style={styles.button}>
            <TouchableWithoutFeedback> 
        <Ionicons name="ios-close" size={15} color="#fff" />

            </TouchableWithoutFeedback>
          </View> 
        <View style={styles.contentContainer}>
          <Text
            style={{
              fontSize: 12,
              fontWeight: "700",
              color: "#000",
              marginBottom: 10,
            }}
          >
            {props.name}
          </Text>
          {/* <Text numberOfLines={1} style={{ width: 200, color: '#64676A', fontSize: 13 }}>{status}</Text> */}
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
    alignItems: "center",
  },
  imageContainer: {
    width: Dimensions.get('window').width*0.1,
    height: Dimensions.get('window').width*0.1,
    borderRadius: Dimensions.get('window').width*0.1/2,
    overflow: "hidden",
    backgroundColor: "#4291ee",
    alignItems: "center",
    justifyContent: "center",
  },
  avator: {
    width: "100%",
    height: "100%",
  },
  contentContainer: {
    marginTop: 10,
    // flexDirection: 'column',
    justifyContent: "center",
    // height: 60,
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
  button: {
    zIndex: 100,
    position: "absolute",
    bottom: -1,
    right: 0,
    backgroundColor: "#ccc",
    width: 14,
    height: 14,
    borderRadius: 7,
    // overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    marginBottom:10
    
  },
};

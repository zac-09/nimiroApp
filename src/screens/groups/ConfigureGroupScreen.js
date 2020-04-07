import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableWithoutFeedback,
} from "react-native";
import { Lists } from "../../components";

import GroupHeader from "./../../components/headers/GroupHeader";
import { Ionicons } from "@expo/vector-icons";
import { GroupItem } from "../../components/listitems";
const ConfigureGroupScreen = (props) => {
  const [groupName, setGroupName] = useState("");
  const participants = props.navigation.getParam("participants");
  const groupNameHandler = (enteredText) => {
    setGroupName(enteredText);
  };
  return (
    <View style={styles.screen}>
      <GroupHeader title="New group" subTitle="Add subject" />
      <View style={styles.inputContainer}>
        <View style={styles.inputTextAndCam}>
          <View style={styles.camera}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <Ionicons name="ios-camera" size={32} color="#fff" />
            </TouchableWithoutFeedback>
          </View>

          <TextInput
            placeholder="Enter group Name"
            style={styles.input}
            onChangeText={groupNameHandler}
            value={groupName}
          />
        </View>

        <Text>Provide a group Name and an optional group Icon</Text>
      </View>
      <View style={styles.button}>
        <TouchableWithoutFeedback
          onPress={() => {
            props.navigation.navigate({
              routeName: "ConfigureGroupScreen",
              params: {
                participants: groupPartcipants,
              },
            });
          }}
        >
          <Ionicons name="ios-checkmark" size={32} color="#fff" />
        </TouchableWithoutFeedback>
      </View>
      <View style={styles.participants}>
        <Text style={styles.text}> Participants: {participants.length} </Text>
        <Lists.ContactsList
          item
          contacts={props.navigation.getParam("participants")}
          //   onContactItemClicked={removeParticipantHandler}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  inputTextAndCam: {
    flexDirection: "row",
    padding: 10,
  },
  inputContainer: {
    height: 142,
    marginTop: 100,
    // alignItems: "center",
    padding: 10,
  },
  camera: {
    backgroundColor: "#ccc",
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    width: "70%",
    borderBottomColor: "black",
    borderBottomWidth: 1,
    padding: 10,
    marginLeft: 20,
  },
  participants: {
    backgroundColor: "white",
    flex: 1,
  },
  button: {
    zIndex: 2,
    position: "absolute",
    top: 220,
    right: 20,
    backgroundColor: "#4291ee",
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  screen: {
    flex: 1,
    position: "relative",
    backgroundColor: "rgba(246,246,246, 0.95)",
  },
  text: {
    fontSize: 18,
  },
});

export default ConfigureGroupScreen;

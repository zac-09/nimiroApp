import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableWithoutFeedback } from "react-native";
import GroupHeader from "./../../components/headers/GroupHeader";
import { Ionicons } from "@expo/vector-icons";
import { Lists } from "../../components";
const AddParticipantsScreen = props => {
  const [groupPartcipants, setGroupParticipants] = useState([]);

  const addParticipantHandler = userId => {
    setGroupParticipants(currentParticipants => [
      ...groupPartcipants,
      { id: Math.random().toString(), value: userId }
    ]);
  };
  const removeParticipantHandler = userId => {
    setGroupParticipants(currentParticipants => {
      return currentParticipants.filter(user => user.id !== userId);
    });
  };

  return (
    <View style={styles.screen}>
      <Lists.ContactsList item contacts={groupPartcipants} />
      <GroupHeader title="New group" subTitle="Add participants" />
      <Lists.ContactsList
        contacts={props.navigation.getParam("friends")}
        onContactItemClicked={addParticipantHandler}
      />
      <View style={styles.button}>
        <TouchableWithoutFeedback
          onPress={() => props.navigation.navigate("Contacts")}
        >
          <Ionicons name="ios-arrow-round-forward" size={32} color="#fff" />
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    position: "relative",
    backgroundColor: "rgba(246,246,246, 0.95)"
  },
  button: {
    zIndex: 2,
    position: "absolute",
    bottom: 40,
    right: 20,
    backgroundColor: "#53C41A",
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center"
  }
});

export default AddParticipantsScreen;

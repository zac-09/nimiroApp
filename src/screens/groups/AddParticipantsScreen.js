import React, { useState, useEffect } from "react";

import { View, StyleSheet, TouchableWithoutFeedback } from "react-native";
import GroupHeader from "./../../components/headers/GroupHeader";
import { Ionicons } from "@expo/vector-icons";

import { Lists } from "../../components";
const AddParticipantsScreen = (props) => {
  const [groupPartcipants, setGroupParticipants] = useState([]);
  const contacts = props.navigation.getParam("friends");
  let newContacts = contacts.map((el) => ({ ...el, isAdded: false }));
  const [addedContacts, setAddedContatcs] = useState(newContacts);

  const addParticipantHandler = (userId, name, avatar) => {
    let alreadyAdded;
    groupPartcipants.forEach(function (participant) {
      if (participant.id === userId) {
        console.log(participant.id);
        alreadyAdded = true;
      }
    });
    if (!alreadyAdded) {
      let added = newContacts.map((el) =>
        el._id === userId ? { ...el, isAdded: true } : el
      );

      console.log("these are the updataed added", added);
      setAddedContatcs((currentMembers) =>
        currentMembers.map((el) =>
          el._id === userId ? { ...el, isAdded: true } : el
        )
      );
      console.log(newContacts);
      return setGroupParticipants((currentParticipants) => [
        ...currentParticipants,
        { id: userId.toString(), name: name, avatar: avatar, isAdded: true },
      ]);
    }

    return removeParticipantHandler(12, userId, "");
  };

  const removeParticipantHandler = (iud, userId, avatar) => {
    let added = newContacts.map((el) =>
      el._id === userId ? { ...el, isAdded: false } : el
    );

    setAddedContatcs((currentMembers) =>
      currentMembers.map((el) =>
        el._id === userId ? { ...el, isAdded: false } : el
      )
    );
    setGroupParticipants((currentParticipants) => {
      console.log("removed sucessfully");

      return currentParticipants.filter(
        (participant) => participant.id !== userId
      );
    });
  };

  return (
    <View style={styles.screen}>
      <View style={styles.participants}>
        <Lists.ContactsList
          item
          contacts={groupPartcipants}
          onContactItemClicked={removeParticipantHandler}
        />
      </View>

      <GroupHeader title="New group" subTitle="Add participants" icon />
      <Lists.ContactsList
        contacts={addedContacts}
        onContactItemClicked={addParticipantHandler}
      />
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
    backgroundColor: "rgba(246,246,246, 0.95)",
  },
  button: {
    zIndex: 2,
    position: "absolute",
    bottom: 40,
    right: 20,
    backgroundColor: "#4291ee",
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  participants: {
    marginBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: "#ccc",
    alignItems: "flex-end",
    height: 160,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
});

export default AddParticipantsScreen;

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableWithoutFeedback,
} from "react-native";
import { Lists } from "../../components";
import firebaseSDK from "../../backend/Firebase";
import * as firebase from "firebase";
import "firebase/firestore";
import * as ImagePicker from "expo-image-picker";
import Toast from "react-native-root-toast";
import Constants from "expo-constants";

import GroupHeader from "./../../components/headers/GroupHeader";
import { Ionicons } from "@expo/vector-icons";
import { GroupItem } from "../../components/listitems";
const ConfigureGroupScreen = (props) => {
  showToast = (message) => {
    Toast.show(message, {
      duration: Toast.durations.LONG,
      position: Toast.positions.BOTTOM,
      shadow: true,
      animation: true,
      hideOnPress: true,
      delay: 0,
    });
  };
  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== "granted") {
        showToast("Sorry, we need camera roll permissions to make this work!");
      }
    }
  };
  useEffect(() => {
    getPermissionAsync();
  });
  _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
    });

    console.log(result);

    if (!result.cancelled) {
      setAvatar(result.uri);
    }
  };

  success = () => {
    console.log("successfully uploaded");
  };

  failure = async (error) => {
    console.log("failed to upload");
  };
  _createChannel = async (channel) => {
    let channelData = channel;

    console.log("this is added when channel is created", channelData);
    await firebase
      .firestore()
      .collection("channels")
      .add(channelData)
      .then(async (docRef) => {
        channelData.id = docRef.id;

        channelData.participants.forEach(async (friend) => {
          const participationData = {
            channel: docRef.id,
            user: friend.id,
            name:channelData.name ,
            avatar:channelData.avatar
            lastMessage: channelData.lastMessage,
            lastMessageDate: channelData.lastMessageDate,
            unread: 0,
            participants:channelData.participants,
          };
          console.log("hi from then open channel");
          await firebase
            .firestore()
            .collection("channel_participation")
            .doc(friend.id)
            .collection("my_channels")
            .add(participationData);
        });

        console.log(
          "channel succefully created from then and this is the state of new channel"
        );
      })
      .catch(function (error) {
        alert(error);
        console.log("channel falied from then", error);
      });
    props.navigation.navigate({
      routeName: "GroupChatScreen",
      params: {
        groupData: channelData,
      },
    });
  };

  const openChannel = async () => {
    const user = {
      id: firebase.auth().currentUser.uid,
      avatar: firebase.auth().currentUser.photoURL,
      name: firebase.auth().currentUser.displayName,
    };
    let channel = {
      name: groupName,
      creator_id: user.id,
      currentUser: user,
      avatar: avatar,
      type: "group",
      participants: [user, ...participants],
      administrators: [user.id],
      lastMessage: {
        text: "",
        user: null,
        createdAt: new Date(),
      },
      lastMessageDate: new Date(),
    };
    await _createChannel(channel);
  };
  const [groupName, setGroupName] = useState("");
  const [avatar, setAvatar] = useState("");
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
            <TouchableWithoutFeedback
              onPress={() => {
                _pickImage();
              }}
            >
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
            openChannel();
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

import React, { useState } from "react";
import { Header, Left, Body, Title, Right } from "native-base";
import getHeaderContainerStyle from "./getHeaderContainerStyle";
import connect from "../../assets/connect.png";
import { Image, TouchableWithoutFeedback, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import firebaseSDK from "../../backend/Firebase";
import Toast from "react-native-root-toast";
import * as firebase from "firebase";

function header(props) {
  const [logout, setIsLogout] = useState(false);
  const uid = firebase.auth().currentUser.uid;

  const unscribeFeed = firebase
    .firestore()
    .collection("feeds")
    .onSnapshot(() => {});
  const unscribedRoc = firebase
    .firestore()
    .collection("events")
    .onSnapshot(() => {});
  const unscribedChat = firebase
    .firestore()
    .collection("channel_participation")
    .doc(uid)
    .collection("my_channels")
    .onSnapshot(() => {});
  const unscribedMaps = firebase
    .firestore()
    .collection("maps")
    .onSnapshot(() => {});
  logoutHandler = async () => {
    // await firebaseSDK.logout(logoutSucceful, logoutFailed);
    //detach all listners

    await unscribeFeed();
    await unscribedChat();
    await unscribedRoc();
    await unscribedMaps();
    await firebase
      .auth()
      .signOut()
      .then(() => {
        console.log("user successfully signed out");

        return logoutSucceful();
      }, logoutFailed);
  };
  logoutSucceful = () => {
    showToast("logging out");
    props.onLogout();
  };
  logoutFailed = () => {
    showToast("unfortunately we could not sign you out");
  };
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
  return (
    <Header
      iosBarStyle="dark-content"
      androidStatusBarColor="#000"
      style={getHeaderContainerStyle(props.nomargin)}
    >
      <Left style={{ alignItems: "center", justifyContent: "center" }}>
        <Image
          source={connect}
          style={{ width: 150, height: "80%" }}
          resizeMode="contain"
        />
      </Left>
      <Body>
        {!!props.title && <Title style={styles.title}>{props.title}</Title>}
      </Body>
      <Right>
        {logout && (
          <View style={styles.logout}>
            <TouchableWithoutFeedback
              onPress={() => {
                logoutHandler();
              }}
            >
              <Text>Logout</Text>
            </TouchableWithoutFeedback>
          </View>
        )}
        <Ionicons
          onPress={() => {
            setIsLogout((prevState) => !prevState);
          }}
          name="md-more"
          size={32}
          color="#fff"
          style={{ paddingLeft: 10, paddingRight: 10 }}
        />
      </Right>
    </Header>
  );
}

const styles = {
  title: {
    fontSize: 20,
    color: "#fff",
  },
  logout: {
    flexDirection: "row",
    position: "absolute",
    right: 3,
    top: 13,
    width: "50%",
    backgroundColor: "#fff",
    zIndex: 1000,
  },
};

export default header;

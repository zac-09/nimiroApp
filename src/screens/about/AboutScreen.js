import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import bg2 from "../../assets/chat_bg.png";
import { LinearGradient } from "expo-linear-gradient";
import * as firebase from "firebase";
import firebaseSDK from "../../backend/Firebase";
import { Badge } from "react-native-elements";

const AboutScreen = (props) => {
  const [user, setUser] = useState("");
  const [messages, setMessages] = useState(0);
  const [tasks, setTasks] = useState(0);

  const [loading, setIsLoading] = useState(false);
  const getCurrentUser = async () => {
    const user = await firebaseSDK.getUserInfo();
    console.log("the user info is", user);
    setUser(user);
  };
  const getOpenChannel = async () => {
    const uid = firebase.auth().currentUser.uid;
    let unread = 0;
    const myChannels = await firebase
      .firestore()
      .collection("channel_participation")
      .doc(uid)
      .collection("my_channels")
      .onSnapshot((querySnapshot) => {
        const data = [];
        try {
          querySnapshot.forEach(async (doc) => {
            const channelData = doc.data();
            // console.log("the channel data is",channelData)
            channelData.lastMessageDate = doc.data().lastMessageDate.toDate();
            channelData.id = doc.data().channel;
            const uid = firebase.auth().currentUser.uid;
            unread += channelData.unread
            data.push(channelData);
          });
        } catch (error) {
          // this.showToast(error);
        }
        console.log("the unread is",unread)
        setMessages(unread);
        console.log("the snap is", data.length);
      });
    // console.log("the snap is", myChannels);
  };
  const getTasks = async () => {
    const uid = firebase.auth().currentUser.uid;

    const myTasks = await firebase
      .firestore()
      .collection("todo_list")
      .doc(uid)
      .collection("tasks")
      .onSnapshot((querySnapshot) => {
        const data = [];
        try {
          querySnapshot.forEach(async (doc) => {
            const channelData = doc.data();

            data.push(channelData);
          });
        } catch (error) {
          // this.showToast(error);
        }
        setTasks(data.length);
        console.log("the taks is", data.length);
      });
    // console.log("the snap is", myChannels);
  };
  const avatar = user.avatar
    ? user.avatar
    : "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRZNJt3nRJoakparSv7QTMAXmPHv9uisKtgQA&usqp=CAU";

  useEffect(() => {
    setIsLoading(true);
    getTasks();
    getCurrentUser();
    getOpenChannel();
    setIsLoading(false);
    return () => {
      getOpenChannel();
      getTasks();
    };
  }, []);
  if (loading || !user) {
    return (
      <View
        style={{
          ...styles.screen,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color="#ccc" />
      </View>
    );
  }
  return (
    <View style={styles.screen}>
      <ScrollView>
        <LinearGradient
          colors={["#62556F", "#372647", "#150128"]}
          start={[0, 0.1]}
          style={styles.userContainer}
        >
          <ImageBackground source={{ uri: avatar }} style={styles.bgImage}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                backgroundColor: "rgba(21,1,40,0.8)",
              }}
            >
              <View style={styles.textContainer}>
                <Text style={{ color: "#fff", fontSize: 16 }}>
                  2 Appointments today
                </Text>
                <Text style={{ color: "#fff", fontSize: 20 }}>
                  {user.lName + "  " + user.fName}
                </Text>
              </View>
              <View style={styles.iconContainer}>
                <TouchableOpacity
                  onPress={() => {
                    props.navigation.navigate("Roc", {
                      aboutYou: user.aboutYou,
                      Interests: user.Interests,
                    });
                  }}
                >
                  <Ionicons color="white" name="ios-settings" size={45} />
                </TouchableOpacity>
              </View>
            </View>
          </ImageBackground>
        </LinearGradient>
        <View style={styles.aboutContainer}>
          <View style={styles.icons}>
            <TouchableOpacity
              onPress={() => {
                props.navigation.navigate("Chat");
              }}
            >
              <Badge
                value={messages}
                status="success"
                badgeStyle={{
                  marginBottom: 0,
                  backgroundColor: "#7623A8",
                  position: "absolute",
                  right: -9,
                  zIndex: 10,
                }}
              />
              <Ionicons color="#fff" size={40} name="ios-mail" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                console.log("btn pressed");
                props.navigation.navigate("todo");
              }}
            >
              <Badge
                value={tasks}
                status="success"
                badgeStyle={{
                  marginBottom: 0,
                  backgroundColor: "#D770A6",
                  position: "absolute",
                  right: -9,
                  zIndex: 10,
                }}
              />
              <Ionicons name="ios-notifications" color="#fff" size={40} />
            </TouchableOpacity>
          </View>
          <View style={styles.aboutContainer}>
            <Text style={{ color: "#fff", padding: 2, fontSize: 22 }}>
              About Me
            </Text>
            <Text style={styles.text}>{user.aboutYou}</Text>
            <Text
              style={{ color: "#fff", padding: 2, fontSize: 18, marginTop: 10 }}
            >
              Interests
            </Text>
            <Text style={{ color: "#fff", padding: 2, fontSize: 14 }}>
              {user.Interests}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  userContainer: { height: 350, width: "100%" },
  aboutContainer: {
    backgroundColor: "#150128",
    height: "100%",
  },
  bgImage: {
    width: "101%",
    height: "100%",
    justifyContent: "flex-end",
  },
  screen: {
    flex: 1,
    backgroundColor: "#150128",
  },
  textContainer: {
    padding: 20,
  },
  iconContainer: {
    padding: 20,
  },
  icons: {
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  text: {
    color: "#fff",
    padding: 4,
    marginTop: 10,
  },
});

export default AboutScreen;

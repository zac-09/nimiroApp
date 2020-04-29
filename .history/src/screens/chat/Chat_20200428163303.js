import React from "react";
import { View, Text } from "native-base";
import { Lists } from "../../components";
import { Ionicons } from "@expo/vector-icons";
import Storage from "../../utils/Storage";
import Toast from "react-native-root-toast";
import * as firebase from "firebase";
import * as Contacts from "expo-contacts";
import * as Permissions from "expo-permissions";
import firebaseSDK from "../../backend/Firebase";
import { formatPhoneNumber } from "../../utils/Validations";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

export default class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chats: [],
      loading: false,
    };

    const uid = firebase.auth().currentUser.uid;

    this.myChannels = firebase
      .firestore()
      .collection("channel_participation")
      .doc(uid)
      .collection("my_channels")
      .orderBy("lastMessageDate", "desc");

    this.threadsUnscribe = "null";
  }

  async componentDidMount() {
    //this.setState({loading: true})
    this.threadsUnscribe = this.myChannels.onSnapshot(
      await this.loadChannelList
    );
  }

  componentWillUnmount() {
    //this.threadsUnscribe();
  }

  loadChannelList = async (querySnapshot) => {
    const data = [];
    try {
      querySnapshot.forEach(async (doc) => {
        const chat = doc.data();
        chat.lastMessageDate = doc.data().lastMessageDate.toDate();

        await firebase
          .firestore()
          .collection("channels")
          .doc(chat.channel)
          .get()
          .then(async (doc) => {
            if (doc.exists) {
              const channelData = doc.data();
              channelData.lastMessageDate = doc.data().lastMessageDate.toDate()
              channelData.id = doc.id;
              const uid = firebase.auth().currentUser.uid;
              // this.myChannels
              //   .where("channel", "==", doc.id)
              //   .get().then((document)=>{
              //     console.log("this is data from de channel",document.data())
              // channelData.lastMessageDate = document.data().lastMessageDate.toDate();
              // channelData.unread = document.data().unread
              //   })
              ///
               firebase
                .firestore()
                .collection("channel_participation")
                .doc(uid)
                .collection("my_channels")
                .where("channel", "==", doc.id)
                .get()
                .then((querySnapshot) => {
                  console.log("final call is executed");
                  querySnapshot.forEach((docu) => {
                    if (docu.data().user === uid) {
                      // console.log("uids matched",docu.data())
                      channelData.lastMessageDate = docu
                        .data()
                        .lastMessageDate.toDate();
                      channelData.unread = docu.data().unread;
                      channelData.lastMessage = docu.data().lastMessage;
                    }
                  });
                });

              /////

              if (channelData.type === "chat") {
                channelData.avatar = channelData.participants[1].avatar;
                channelData.participants.forEach(function (el) {
                  if (el._id !== uid) {
                    channelData.name = el.name;
                  }
                });
              }

              console.log("this is doc id", channelData.id);
              // console.log("the data is" ,channelData)
              data.push(channelData);
            }
          });
      });
    } catch (error) {
      this.showToast(error);
    }
    // console.log("this is the data loadded from channel",data)
    await this.setState({ chats: data, loading: false });
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

  navigate = (route, data) => {
    this.props.navigation.navigate(route, data);
  };

  openChannel = async (channelId) => {
    let channeData = {};
    console.log("channel received via open channel", channelId);
    await firebase
      .firestore()
      .collection("channels")
      .doc(channelId)
      .get()
      .then((doc) => {
        if (doc.exists) {
          console.log("this is from document then", doc.data());
          const user = {
            _id: firebase.auth().currentUser.uid,
            avatar: firebase.auth().currentUser.photoURL,
            name: firebase.auth().currentUser.displayName,
          };
          channeData = doc.data();
          channeData.participants.forEach(function (el) {
            if (el._id !== user._id) {
              channeData.friend = el;
            }
          });
          channeData.id = doc.id;
          channeData.currentUser = user;
          console.log("data loaded from channel");
        } else {
          console.log("Channel data isn't recorded in the database");
        }
      });
    // console.log("this is the data pushed to the chat screen!", channeData);
    if (channeData.type === "chat") {
      return this.navigate("ChatScreen", {
        channel: channeData,
        isNewChannel: false,
      });
    }
    return this.navigate("GroupChatScreen", {
      groupData: channeData,
      isNewChannel: false,
    });
  };

  render() {
    const { chats } = this.state;
    return (
      <View
        style={{
          flex: 1,
          position: "relative",
          backgroundColor: "rgba(246,246,246, 0.95)",
        }}
      >
        <Lists.ChatList chat={chats} onChatItemClicked={this.openChannel} />
        <View
          style={{
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
            alignItems: "center",
          }}
        >
          <TouchableWithoutFeedback
            onPress={() => this.props.navigation.navigate("Contacts")}
          >
            <Ionicons name="ios-chatbubbles" size={32} color="#fff" />
          </TouchableWithoutFeedback>
        </View>
      </View>
    );
  }
}

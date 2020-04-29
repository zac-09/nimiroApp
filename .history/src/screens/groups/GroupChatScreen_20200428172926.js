import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Keyboard,
  Platform,
  KeyboardAvoidingView,
  Dimensions,
  Modal,
  Text,
  Alert,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as ImagePicker from "expo-image-picker";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Headers } from "../../components";
import ModalCard from "../../components/modal/ModalCard";
import styled from "styled-components";
import bg2 from "../../assets/chat_bg.png";
import { GiftedChat,Bubble } from "react-native-gifted-chat";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-root-toast";
import * as firebase from "firebase";
import "firebase/firestore";
import AnimatedLoader from "react-native-animated-loader";
import firebaseSDK from "../../backend/Firebase";

const HEIGHT = Dimensions.get("window").height;

class ChatScreen extends React.Component {
  constructor(props) {
    super(props);

    const channel = props.navigation.getParam("groupData");

    this.state = {
      channel: channel,

      isTyping: false,
      inputHeight: 85,
      currentMessage: "",
      minInputToolbarHeight: 85,
      user: channel.currentUser,
      friend: channel.friend,
      messages: [],
      loading: false,
      offset: false,
      isBtnPressed: false,
      ModalVisible: false,
    };

    this.threadsUnscribe = null;
  }

  async componentDidMount() {
    this.setState({ loading: true });
    await this._attachListeners();
    this._clearUnread();
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { messages } = this.state;
    if (messages.length !== nextState.messages.length) {
      this._clearUnread();
    }
    return true;
  }

  componentWillUnmount() {
    if (this.threadsUnscribe) {
      this.threadsUnscribe();
    }
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  setModalVisible() {
    this.setState((prevState, props) => {
      return { ModalVisible: !prevState.ModalVisible };
    });
    this.setState({ isTyping: false });
    console.log(" add button  is pressed");
  }
  setBtnIsPressed() {
    this.setState((prevState, props) => {
      return { isBtnPressed: !prevState.isBtnPressed };
    });
    console.log("button  is pressed");
  }
  _attachListeners = async () => {
    this.keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      this._keyboardDidShow
    );

    this.keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      this._keyboardDidHide
    );

    if (this.state.isNewChannel) {
      //No channel in Db don't attach message listeners
      //only create channel when user sends a message.

      this.setState({ loading: false });
    } else {
      this.threadsUnscribe = firebase
        .firestore()
        .collection("channels")
        .doc(this.state.channel.id)
        .collection("messages")
        .orderBy("createdAt", "desc")
        .onSnapshot(this.onThreadsCollectionUpdate);
    }
  };

  _clearUnread = async () => {
    const uid = await firebase.auth().currentUser.uid;
    await firebase
      .firestore()
      .collection("channel_participation")
      .doc(uid)
      .collection("my_channels")
      .where("channel", "==", this.state.channel.id)
      .where("user", "==", uid)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach(async (doc) => {
          await firebase
            .firestore()
            .collection("channel_participation")
            .doc(uid)
            .collection("my_channels")
            .doc(doc.id)
            .update({
              unread: 0,
            });
        });
      });
  };

  _updateFriendsChannel = async (lastMessage) => {
    const uid = await firebase.auth().currentUser.uid;
    await firebase
      .firestore()
      .collection("channel_participation")
      .doc(this.state.friend._id)
      .collection("my_channels")
      .where("channel", "==", this.state.channel.id)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach(async (doc) => {
          if (doc.data().user !== uid) {
            await firebase
              .firestore()
              .collection("channel_participation")
              .doc(this.state.friend._id)
              .collection("my_channels")
              .doc(doc.id)
              .update({
                unread: firebase.firestore.FieldValue.increment(1),
                lastMessage: lastMessage,
                lastMessageDate: new Date(),
              });
          }
        });
      });
  };

  existSameSentMessage = (messages, newMessage) => {
    for (let i = 0; i < messages.length; i++) {
      const temp = messages[i];
      if (
        newMessage._id == temp._id &&
        temp.text == newMessage.text &&
        temp.user == newMessage.user
      ) {
        return true;
      }
    }

    return false;
  };

  onThreadsCollectionUpdate = (querySnapshot) => {
    const data = [];
    try {
      querySnapshot.forEach((doc) => {
        const message = doc.data();
        message._id = doc.id;
        message.createdAt = doc.data().createdAt.toDate();

        if (!this.existSameSentMessage(data, message)) {
          data.push(message);
        }
      });
      console.log("message successfully pushed to db");
    } catch (error) {
      this.showToast(error);
      console.log(
        "an error occured while loading messages from firetore",
        error
      );
    }
    console.log("mesages from firebase are the following", data);
    this.setState({ messages: data, loading: false });
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

  _keyboardDidShow = (e) => {
    this.setState({ isTyping: true });
    const { inputHeight } = this.state;
    let keyboardHeight = e.endCoordinates.height;
    console.log(keyboardHeight);
    this.setState({
      minInputToolbarHeight: keyboardHeight + inputHeight,
      offset: true,
    });
  };

  _keyboardDidHide = () => {
    if (this.state.currentMessage === "") {
      this.setState({ isTyping: false });
      this.setState({ isBtnPressed: false });
    }
    this.setState({ ModalVisible: false });

    const { inputHeight } = this.state;
    this.setState({
      minInputToolbarHeight: inputHeight,
      offset: false,
    });
  };

  _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
    });

    console.log(result);
    const { channel } = this.state;

    if (!result.cancelled) {
      this.setState({ loading: true });
      await firebaseSDK.uploadBlob(
        result.uri,
        channel.id,
        this.sendImage,
        this.showToast
      );
      await this.setState((prevState) => ({
        currentMessage: "",
      }));
      await this.setState({ loading: false });
    }
  };

  _pickVideo = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
    });

    console.log(result);
    const { channel } = this.state;

    if (!result.cancelled) {
      this.setState({ loading: true });
      await firebaseSDK.uploadBlob(
        result.uri,
        channel.id,
        this.sendVideo,
        this.showToast
      );
      await this.setState((prevState) => ({
        currentMessage: "",
      }));
      await this.setState({ loading: false });
    }
  };

  sendImage = (url) => {
    const message = {
      createdAt: new Date(),
      image: url,
      text: this.state.currentMessage,
      user: this.state.user,
    };

    this.updateDB(message);
  };

  sendVideo = (url) => {
    const message = {
      createdAt: new Date(),
      video: url,
      text: this.state.currentMessage,
      user: this.state.user,
    };

    this.updateDB(message);
  };

  onSend = async () => {
    if (this.state.currentMessage.length > 0) {
      const message = {
        createdAt: new Date(),
        text: this.state.currentMessage,
        user: this.state.user,
      };
      await this.setState({
        currentMessage: "",
      });
      this.updateDB(message);
    }
  };
  sendMsg() {
    const message = [
      {
        id: 1,
        createdAt: new Date(),
        text: this.state.currentMessage,
        user: this.state.user,
      },
    ];
    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, message),
    }));
  }
  updateDB = async (message) => {
    //attach message listeners now....
    console.log("tring to retrieve messages", this.state.channel.id);
    this.threadsUnscribe = firebase
      .firestore()
      .collection("channels")
      .doc(this.state.channel.id)
      .collection("messages")
      .orderBy("createdAt", "desc")
      .onSnapshot(this.onThreadsCollectionUpdate);

    await firebase
      .firestore()
      .collection("channels")
      .doc(this.state.channel.id)
      .collection("messages")
      .add(message);

    const lastMessage = message.text
      ? message.text
      : message.image
      ? "Photo"
      : "Video";

    await this._updateFriendsChannel(lastMessage);
  };

  renderInputToolbar = () => {
    const { isTyping } = this.state;
    const { isBtnPressed } = this.state;
    return (
      <View style={styles.inputBar}>
        {isBtnPressed === true || isTyping === false ? (
          <View style={styles.inputbtn}>
            <Ionicons
              style={styles.icons}
              name="ios-image"
              size={32}
              color="#4a6aa5"
              onPress={() => {
                this.setModalVisible();
              }}
            />
            <Ionicons
              style={styles.icons}
              name="ios-camera"
              size={32}
              color="#4a6aa5"
              onPress={() => {
                this.setModalVisible();
              }}
            />
            <Ionicons
              style={styles.icons}
              name="ios-add"
              size={32}
              color="#4a6aa5"
              onPress={() => {
                this.setModalVisible();
              }}
            />
          </View>
        ) : null}

        {isTyping === true ? (
          <TouchableOpacity
            style={styles.inputbtn}
            onPress={() => {
              this.setBtnIsPressed();
            }}
          >
            <Ionicons
              style={styles.icons}
              name="ios-arrow-forward"
              size={32}
              color="#4a6aa5"
              onPress={() => {}}
            />
          </TouchableOpacity>
        ) : null}

        {/* <View style={styles.inputContainer}> */}
        <TextInput
          multiline={true}
          enablesReturnKeyAutomatically
          underlineColorAndroid="transparent"
          onChangeText={(text) => this.setState({ currentMessage: text })}
          value={this.state.currentMessage}
          onContentSizeChange={(event) => {
            this.setState({
              inputHeight: event.nativeEvent.contentSize.height,
            });
          }}
          placeholder="Type a message"
          style={{
            ...styles.input,
            // height: Math.min(150, this.state.inputHeight)
          }}
        />

        {/* {isTyping === false && <Ionicons style={styles.icons} name='ios-camera' size={32} color='#bbb'/>} */}
        {/* </View> */}
        <View style={styles.micContainer}>
          {isTyping === true ? (
            <Ionicons
              name="ios-send"
              size={32}
              color="#fff"
              onPress={() => this.onSend()}
            />
          ) : (
            <Ionicons name="ios-mic" size={32} color="#fff" />
          )}
        </View>
      </View>
    );
  };
  renderBubble(props) {
    if (
      props.isSameUser(props.currentMessage, props.previousMessage) &&
      props.isSameDay(props.currentMessage, props.previousMessage)
    ) {
      return <Bubble {...props} />;
    }
    return (
      <View>
        <Text style={styles.name}>{props.currentMessage.user.name}</Text>
        <Bubble {...props} />
      </View>
    );
  }

  render() {
    return (
      <KeyboardAwareScrollView
        resetScrollToCoords={{ x: 0, y: 0 }}
        scrollEnabled={false}
        keyboardShouldPersistTaps={true}
      >
        <View style={{ flex: 1, height: HEIGHT }}>
          <Headers.ChatHeader
            nomargin
            avator={this.state.channel.avatar}
            name={this.state.channel.name}
            // offset={this.state.offset}
          />
          <Container source={bg2}>
            <GiftedChat
              messages={this.state.messages}
              user={this.state.user}
              showUserAvatar={false}
              keyboardShouldPersistTaps={true}
              renderInputToolbar={this.renderInputToolbar}
              
              renderBubble={this.renderBubble}
              minInputToolbarHeight={this.state.minInputToolbarHeight}
            />

            {this.state.ModalVisible && (
              <View style={styles.modal}>
                <ModalCard>
                  <View style={styles.modalIcons}>
                    <View style={styles.micContainer}>
                      <Ionicons
                        name="ios-add"
                        size={32}
                        color="#fff"
                        onPress={() => this.setBtnIsPressed()}
                      />
                    </View>
                    <Text>Add more</Text>
                  </View>

                  <View style={styles.modalIcons}>
                    <View style={styles.micContainer}>
                      <Ionicons
                        name="ios-camera"
                        size={32}
                        color="#fff"
                        onPress={() => this.onSend()}
                      />
                    </View>
                    <Text>camera</Text>
                  </View>
                  <View style={styles.modalIcons}>
                    <View style={styles.micContainer}>
                      <Ionicons
                        name="ios-image"
                        size={32}
                        color="#fff"
                        onPress={() => this.onSend()}
                      />
                    </View>
                    <Text>Gallery</Text>
                  </View>
                  <View style={styles.modalIcons}>
                    <View style={styles.micContainer}>
                      <Ionicons
                        name="md-pin"
                        size={32}
                        color="#fff"
                        onPress={() => this.onSend()}
                      />
                    </View>
                    <Text>Location</Text>
                  </View>
                  <View style={styles.modalIcons}>
                    <View style={styles.micContainer}>
                      <Ionicons
                        name="ios-settings"
                        size={32}
                        color="#fff"
                        onPress={() => this.onSend()}
                      />
                    </View>
                    <Text>settings</Text>
                  </View>
                </ModalCard>
              </View>
            )}
          </Container>
          <AnimatedLoader
            visible={this.state.loading}
            overlayColor="rgba(0,0,0,0.25)"
            source={require("../../assets/anim/trail_loading.json")}
            animationStyle={styles.lottie}
            speed={1}
          />
        </View>
      </KeyboardAwareScrollView>
    );
  }
}

export default ChatScreen;

const Container = styled.ImageBackground`
  flex: 1;
`;

const styles = {
  inputBar: {
    width: "100%",
    // flexDirection: "row",
    // marginBottom: 5,
    position: "absolute",
    zIndex: 1,

    bottom: 0,
    padding: 5,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    flexGrow: 1,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 15,
    marginRight: 10,
    marginLeft: 10,
    flexGrow: 1,
  },
  input: {
    alignItems: "center",
    borderRadius: 15,
    marginRight: 10,
    backgroundColor: "#fff",
    flex: 1,
    padding: 10,
    marginLeft: 5,
    fontSize: 16,
    lineHeight: 16,
    paddingLeft: 10,
    paddingTop: 6,
    paddingBottom: 6,
    marginTop: Platform.select({
      ios: 6,
      android: 0,
      web: 6,
      flexGrow: 1,
    }),
    marginBottom: Platform.select({
      ios: 5,
      android: 3,
      web: 4,
    }),
  },
  micContainer: {
    backgroundColor: "#4a6aa5",
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 5,
    marginLeft: 5,
  },
  icons: {
    marginLeft: 5,
    marginRight: 5,
    position: "relative",
  },
  lottie: {
    width: 200,
    height: 200,
  },

  inputbtn: {
    flexDirection: "row",
    padding: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  modal: {
    flexGrow: 1,
    justifyContent: "flex-end",
    marginTop: -395,
  },
  modalIcons: {
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
  },
};

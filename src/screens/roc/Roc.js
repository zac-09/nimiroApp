import React from "react";
import { View, Text } from "native-base";
import { StyleSheet } from "react-native";
import * as Lists from "../../components/lists";

import * as firebase from "firebase";
import Toast from "react-native-root-toast";
import firebaseSDK from "../../backend/Firebase";
import { ScrollView } from "react-native";
import FeedInput from "../../components/inputs/FeedInput";
import Header from "../../components/headers/Header";
import UserItem from "./../../components/listitems/UserMenuItem";
export default class Roc extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      header: (
        <Header
          navData={navigation}
          nomargin
          title="Nimiro App"
          onLogout={() => {
            showToast("logged out");
            navigation.navigate({ routeName: "SignedOut" });
            firebaseSDK.logout();
          }}
        />
      ),
    };
  };
  constructor(props) {
    super(props);
    this.state = {
      roc: [],
      loading: false,
      user: "",
    };

    this.threadsRef = firebase
      .firestore()
      .collection("events")
      .orderBy("date_created", "desc");

    this.threadsUnscribe = "null";
  }

  componentDidMount() {
    this.setState({ loading: true });
    this.threadsUnscribe = this.threadsRef.onSnapshot(this.loadRocList);
    this.getCurrentUser();
  }

  componentWillUnmount() {
    this.threadsUnscribe();
  }

  loadRocList = (querySnapshot) => {
    const data = [];
    try {
      querySnapshot.forEach((doc) => {
        const roc = doc.data();
        data.push(roc);
      });
    } catch (error) {
      this.showToast(error);
    }

    this.setState({ roc: data, loading: false });
  };

  getCurrentUser = async () => {
    const user = await firebaseSDK.getUserInfo();
    console.log("The user is", this.props);
    this.setState({ user: user });
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

  openComments = (id) => {
    this.props.navigation.navigate("Comments", { postId: id, type: "events" });
  };

  like = (id, num = 1) => {
    console.log(id);
    firebase
      .firestore()
      .collection("events")
      .doc(id)
      .update({
        likes: firebase.firestore.FieldValue.increment(num),
      });
  };

  render() {
    const { roc, user } = this.state;
    return (
      <View style={{ flex: 1, backgroundColor: "#150128" }}>
        <ScrollView>
          <View style={styles.userContainer}>
            <ScrollView>
              <UserItem icon="ios-chatboxes" title="discussions" />
              <UserItem icon="md-pricetag" title="promos" />
              <UserItem
                icon="ios-people"
                title="Virtual coperatives"
                onPress={() => {
                  // this.props.navigation.navigate("Chat");
                }}
              />
              <UserItem icon="ios-cloud-circle" title="update" />

              <UserItem
                icon="md-create"
                title="edit profile"
                onPress={() => {
                  this.props.navigation.navigate("editProfile", {
                    user: this.state.user,
                  });
                }}
              />

              <UserItem icon="ios-cart" title="Purchases" />
              <UserItem
                icon="md-log-out"
                title="logout"
                onPress={() => {
                  this.showToast("logged out");
                  this.props.navigation.navigate({ routeName: "SignedOut" });
                  firebaseSDK.logout();
                }}
              />
            </ScrollView>
          </View>
          <View style={styles.aboutContainer}>
            <Text style={styles.text}>
              <Text style={{ color: "#fff", padding: 2, fontSize: 22 }}>
                About Me
              </Text>
            </Text>
            <Text style={styles.text}>
              {" "}
              {this.props.navigation.getParam("aboutYou")}
            </Text>

            <Text
              style={{ color: "#fff", padding: 2, fontSize: 18, marginTop: 10 }}
            >
              Interests
            </Text>
            <Text style={{ color: "#fff", padding: 2, fontSize: 14 }}>
              {this.props.navigation.getParam("Interests")}
            </Text>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  userContainer: {
    height: 500,
    backgroundColor: "#7623A8",
    borderBottomStartRadius: 60,
    borderBottomWidth: 2,
  },
  aboutContainer: {
    backgroundColor: "#150128",
    height: "100%",
    overflow: "hidden",
    // borderBottomStartRadius:60
  },
  text: {
    color: "#fff",
    padding: 4,
    marginTop: 10,
  },
});

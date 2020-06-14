import React from "react";
import { View, Text } from "native-base";
import * as Lists from "../../components/lists";
import * as firebase from "firebase";
import Toast from "react-native-root-toast";
import FeedInput from "../../components/inputs/FeedInput";
import { logo } from "../../assets";
import { ScrollView } from "react-native";
import firebaseSDK from "../../backend/Firebase";
import { TouchableWithoutFeedback } from "react-native";
export default class Feed extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      feed: [],
      loading: false,
      avator: undefined,
    };

    this.threadsRef = firebase
      .firestore()
      .collection("feeds")
      .orderBy("date_created", "desc");

    this.threadsUnscribe = "null";
  }

  componentDidMount() {
    this.setState({ loading: true });
    this.threadsUnscribe = this.threadsRef.onSnapshot(this.loadFeedList);
    this.getCurrentUser();
  }

  componentWillUnmount() {
    this.threadsUnscribe();
  }

  loadFeedList = (querySnapshot) => {
    const data = [];
    try {
      querySnapshot.forEach((doc) => {
        const feed = doc.data();
        data.push(feed);
      });
    } catch (error) {
      this.showToast(error);
    }

    this.setState({ feed: data, loading: false });
  };

  getCurrentUser = async () => {
    const user = await firebaseSDK.getUserInfo();
    this.setState({ avator: user.avatar });
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
    this.props.navigation.navigate("Comments", { postId: id, type: "feeds" });
  };

  like = (id, num = 1) => {
    console.log(id);
    firebase
      .firestore()
      .collection("feeds")
      .doc(id)
      .update({
        likes: firebase.firestore.FieldValue.increment(num),
      });
  };

  render() {
    const { feed } = this.state;
    return (
      <View style={{ flex: 1,borderRadius:25,overflow:"hidden" }}>
        <ScrollView>
          <FeedInput
            avator={{ uri: this.state.avator }}
            createPost={() =>
              this.props.navigation.navigate("Post", { post: "feeds" })
            }
          />
          <Lists.FeedList
            feed={feed}
            onLike={this.like}
            onUnlike={(id) => this.like(id, -1)}
            onFeedItemClicked={this.openComments}
          />
        </ScrollView>
      </View>
    );
  }
}

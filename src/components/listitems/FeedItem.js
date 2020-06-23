import React from "react";
import firebaseSDK from "../../backend/Firebase";
import { View } from "native-base";
import { Card, Image } from "react-native-elements";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import VideoView from "../video/Video";
import { Ionicons } from "@expo/vector-icons";
import ProgressiveImage from "../images/ProgressiveImage";
import MapPreview from "./../mapPreview/MapPreview";
class FeedItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      liked: false,
    };
    this.preventDefault = false;
  }

  async componentDidMount() {
    const user = await firebaseSDK.getUserInfo(this.props.created_by);
    this.setState({
      user,
    });
  }

  like = () => {
    this.setState(
      (prevState) => ({
        liked: !prevState.liked,
      }),
      () => this.likePost()
    );
  };

  likePost = () => {
    const { liked } = this.state;
    const { onLike, onUnlike, id } = this.props;
    if (liked) {
      onLike(id);
    } else {
      onUnlike(id);
    }
  };

  itemPressed = (id) => {
    if (!this.preventDefault) {
      this.props.onItemPressed(id);
    } else {
      this.preventDefault = false;
    }
  };

  videoPressed = () => {
    this.preventDefault = true;
  };

  render() {
    const { user, liked } = this.state;
    const { id, content, likes, comments, onItemPressed } = this.props;
    const text = content.text;
    const image = content.image;
    const video = content.video;
    const comm = comments.length;
    const map = content.map;
    return (
      <Card containerStyle={styles.containerStyle}>
        <TouchableWithoutFeedback onPress={() => this.itemPressed(id)}>
          <View>
            <View style={styles.header}>
              <View style={styles.avatorContainer}>
                <ProgressiveImage
                  style={styles.avator}
                  source={{ uri: user.avatar }}
                  thumbnail={require("../../../assets/images/placeholder.png")}
                />
              </View>
              <Text style={styles.username}>{user.name}</Text>
            </View>
            <View style={styles.content}>
              {text ? <Text style={styles.contentText}>{text}</Text> : null}
              {image ? (
                <ProgressiveImage
                  style={styles.contentImage}
                  source={{ uri: image }}
                  thumbnail={require("../../../assets/images/loading.jpg")}
                />
              ) : null}
              {video ? (
                <TouchableWithoutFeedback onPress={this.videoPressed}>
                  <VideoView
                    source={video}
                    width="100%"
                    height={IMAGE_DIMENSIONS}
                  />
                </TouchableWithoutFeedback>
              ) : null}
              {map ? (
                <MapPreview location={map} style={styles.mapPreview} />
              ) : null}
            </View>
            <View style={styles.actions}>
              <View style={styles.likesContainer}>
                <Ionicons
                  name={liked ? "ios-heart" : "ios-heart-empty"}
                  size={32}
                  onPress={() => this.like()}
                  color="#2699FB"
                />
                <Text style={styles.actionsText}>{likes}</Text>
              </View>
              <View style={styles.commContainer}>
                <Ionicons
                  name="ios-chatboxes"
                  size={32}
                  onPress={() => this.like()}
                  color="#2699FB"
                />
                <Text style={styles.actionsText}>{comm}</Text>
              </View>
              <TouchableOpacity
                style={{ alignItems: "center", marginLeft: "auto" }}
              >
                <Text style={styles.actionsText}>Share</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Card>
    );
  }
}

export default FeedItem;

const IMAGE_DIMENSIONS = 200;
const AVATAR_DIMENSIONS = 50;

const styles = StyleSheet.create({
  containerStyle: {
    borderRadius: 5,
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    borderWidth: 0,
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatorContainer: {
    width: AVATAR_DIMENSIONS,
    height: AVATAR_DIMENSIONS,
    borderRadius: AVATAR_DIMENSIONS / 2,
    overflow: "hidden",
  },
  avator: {
    width: AVATAR_DIMENSIONS,
    height: AVATAR_DIMENSIONS,
  },
  username: {
    fontSize: 15,
    fontFamily: "Roboto",
    fontWeight: "900",
    color: "#2699FB",
    marginLeft: 20,
  },
  content: {
    flexDirection: "column",
    alignItems: "center",
    marginTop: 10,
  },
  contentText: {
    fontSize: 14,
    fontFamily: "Roboto",
    fontWeight: "300",
    color: "#000",
    marginBottom: 10,
    alignSelf: "flex-start",
  },
  contentImage: {
    width: "100%",
    height: IMAGE_DIMENSIONS,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  likesContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  commContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 20,
  },
  actionsText: {
    fontSize: 15,
    fontFamily: "Roboto",
    color: "#2699FB",
    marginLeft: 8,
  },
  mapPreview: {
    width: "100%",
    maxWidth: 350,
    height: 300,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
});

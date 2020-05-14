import React, { useState } from "react";
import { Header, Left, Body, Title, Right } from "native-base";
import getHeaderContainerStyle from "./getHeaderContainerStyle";
import connect from "../../assets/connect.png";
import { Image, TouchableWithoutFeedback, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import firebaseSDK from "../../backend/Firebase";
import Toast from "react-native-root-toast";
function header(props) {
  const [logout, setIsLogout] = useState(false);
  logoutHandler = async () => {
    firebaseSDK.logout(logoutSuccefull, logoutFailed);
  };
  logoutSuccefull = () => {
    props.navigation.navigate({
      routeName: "SignedOut",
    });
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
    justifyContent:"center",
    alignItems:"center",
    position: "absolute",
    right: 3,
    top: 3,
    width: "10%",
    backgroundColor: "#fff",
    zIndex: 1000,
  },
};

export default header;

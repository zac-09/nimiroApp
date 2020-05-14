import React, { useState } from "react";
import { Header, Left, Body, Title, Right } from "native-base";
import getHeaderContainerStyle from "./getHeaderContainerStyle";
import connect from "../../assets/connect.png";
import { Image, TouchableWithoutFeedback, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import Toast from "react-native-root-toast";
import * as firebase from "firebase";


function header(props) {
  const [logout, setIsLogout] = useState(false);
  
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
                // NavigationActions.navigate({ routeName: 'SignedOut' })
                // props.navigation.navigate("SignedOut")
                props.onLogout()
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
    top: 17,
    width: "50%",
    backgroundColor: "#fff",
    zIndex: 1000,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.26,
    shadowRadius: 8,
    borderRadius:6,
    elevation:5
  },
};

export default header;

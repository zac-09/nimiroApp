import React from "react";
import { Header, Left, Body, Title, Right, Text } from "native-base";
import { Ionicons } from '@expo/vector-icons'
import { TouchableWithoutFeedback } from "react-native";

function postHeader (props) {
  return (
    <Header
      iosBarStyle="dark-content"
      androidStatusBarColor="#000"
      style={{elevation: 3, backgroundColor: "#681554", margin: 0, borderBottomColor: '#4291ee'}}
    >
        <TouchableWithoutFeedback onPress={() => props.goBack()}>
            <Left style={{alignItems: 'center', justifyContent: 'center'}}>
                <Ionicons name='ios-arrow-round-back' size={32} color='#fff'/>
            </Left>
        </TouchableWithoutFeedback>
        <Body>
            {!!props.title && <Text style={styles.title}>{props.title}</Text>}
        </Body>
        <TouchableWithoutFeedback onPress={() => props.createPost()}>
            <Right>
                    <Text style={styles.rightText}>Post</Text>
            </Right>
        </TouchableWithoutFeedback>
    </Header>
  );
}

const styles = {
  title: {
    fontSize: 20,
    color: "#fff",
  },
  rightText: {
    fontSize: 20,
    color: "#fff",
    paddingLeft: 20,
    fontWeight: '900'
  },
};

export default postHeader;

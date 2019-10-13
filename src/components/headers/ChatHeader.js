import React from "react";
import { Header, Left, Body, Title, Right, View } from "native-base";
import getHeaderContainerStyle from "./getHeaderContainerStyle";
import { Image } from "react-native";
import { Ionicons } from '@expo/vector-icons'

function ChatHeader (props) {
  return (
    <Header
      iosBarStyle="dark-content"
      androidStatusBarColor="#000"
      style={getHeaderContainerStyle(props.nomargin)}
    >
      <Left style={{alignItems: 'center', justifyContent: 'center'}}>
        <View style={styles.imageContainer}>
            <Image style={styles.avator} source={{uri: props.avator}}/>
        </View>
      </Left>
      <Body>
        {!!props.title && <Title style={styles.title}>{props.name}</Title>}
      </Body>
      <Right>
        <Ionicons 
          name='md-more' 
          size={32} 
          color='#fff' 
          style={{paddingLeft: 10, paddingRight: 10}}/>
      </Right>
    </Header>
  );
}

const styles = {
  title: {
    fontSize: 18,
    color: "#fff",
    paddingLeft: 20,
  },
  imageContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden'
 },
 avator: {
    width: '100%',
    height: '100%'
 },
};

export default ChatHeader;

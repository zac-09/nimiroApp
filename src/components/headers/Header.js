import React from "react";
import { Header, Left, Body, Title, Right } from "native-base";
import getHeaderContainerStyle from "./getHeaderContainerStyle";
import { connect } from '../../assets';
import { Image } from "react-native";
import { Ionicons } from '@expo/vector-icons'

function header (props) {
  return (
    <Header
      iosBarStyle="dark-content"
      androidStatusBarColor="#000"
      style={getHeaderContainerStyle(props.nomargin)}
    >
      <Left style={{alignItems: 'center', justifyContent: 'center'}}>
        <Image source={connect} style={{width: 150, height: '80%'}} resizeMode='contain'/>
      </Left>
      <Body>
        {!!props.title && <Title style={styles.title}>{props.title}</Title>}
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
  }
};

export default header;

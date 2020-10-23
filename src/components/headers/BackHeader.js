import React from "react";
import { Header, Left, Body, Title, Right, Text } from "native-base";
import { Ionicons } from '@expo/vector-icons'
import { TouchableWithoutFeedback } from "react-native";

function backHeader (props) {
    const rightAction = props.rightAction ? props.rightAction : () => {}
    return (
        <Header
        iosBarStyle="dark-content"
        androidStatusBarColor="#000"
        style={{elevation: 2, backgroundColor: "transparent", margin: 0, borderBottomColor: '#fff',borderBottomWidth:0}}
        >
            <TouchableWithoutFeedback onPress={() => props.goBack()}>
                <Left style={{alignItems: 'center', justifyContent: 'center'}}>
                    <Ionicons name='ios-arrow-round-back' size={32} color='#fff'/>
                </Left>
            </TouchableWithoutFeedback>
            <Body>
                {!!props.title && <Text style={styles.title}>{props.title}</Text>}
            </Body>
            <TouchableWithoutFeedback onPress={() => rightAction()}>
                <Right>
                        {props.rightChildren}
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

export default backHeader;

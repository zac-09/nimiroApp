import React from "react";
import { Header, Left, Body, Title, Right } from "native-base";
import getHeaderContainerStyle from "./getHeaderContainerStyle";

function header (props) {
  return (
    <Header
      iosBarStyle="dark-content"
      androidStatusBarColor="#000"
      style={getHeaderContainerStyle(props.nomargin)}
    >
      <Left />
      <Body>
        {!!props.title && <Title style={styles.title}>{props.title}</Title>}
      </Body>
      <Right />
    </Header>
  );
}

const styles = {
  title: {
    fontFamily: "LatoBold",
    fontSize: 18,
    color: "#000"
  }
};

export default header;

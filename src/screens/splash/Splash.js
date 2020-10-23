import React from "react";
import styled from "styled-components/native";
import { logo, bg2 } from "../../assets";
import { View, Text } from "react-native";
import LottieView from "lottie-react-native";

class Splash extends React.Component {
  componentDidMount() {
    this.animation.play();
  }

  render() {
    return (
      <Container source={bg2}>
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Logo source={logo} resizeMode="contain" />
          <Text style={{ color: "#fff", fontSize: 20 }}>Nimiro App</Text>
          <View
            style={{
              height: 100,
              width: 500,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <LottieView
              ref={(anim) => (this.animation = anim)}
              source={require("../../assets/anim/trail_loading.json")}
              style={{
                height: 200,
                width: 400,
                backgroundColor: "transparent",
              }}
            />
          </View>
        </View>
      </Container>
    );
  }
}

export default Splash;
const Container = styled.ImageBackground`
  display: flex;
  width: 100%;
  height: 100%;
`;

const Header = styled.Text`
  text-align: center;
  font-size: 25;
  font-weight: bold;
  color: #f7a81b;
  margin-bottom: 20;
`;

const Logo = styled.Image`
  width: 100%;
  margin-bottom: 20;
`;

const Slogan = styled.Text`
  text-align: center;
  font-size: 16;
  font-weight: bold;
  color: #850127;
  text-transform: capitalize;
  font-style: italic;
`;

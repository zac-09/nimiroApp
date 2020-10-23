import React from "react";
import styled from "styled-components/native";
import AnimatedLoader from "react-native-animated-loader";
import { logo, bg2 } from "../../assets";
import { Forms } from "../../components";
import firebaseSDK from "../../backend/Firebase";
import Toast from "react-native-root-toast";
import * as firebase from "firebase";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

class User extends React.Component {
  state = {
    role: "farmer",
    farmingInterest: "Animal Farming",
    Interests: "",
    aboutYou: "",
    farmingIndex: 0,
    rolelevelIndex: 0,
    loading: false,
  };

  navigate = (route) => {
    this.props.navigation.navigate(route);
  };

  handleUser = () => {
    this.setState({ loading: true });

    const { role, farmingInterest, Interests, aboutYou } = this.state;
    let _id = firebase.auth().currentUser.uid;
    // console.log("the role is farming",role,farmingInterest,Interests,aboutYou)
    // this.setState({ loading: false });

    // return
    const data = {
      role,
      farmingInterest,
      Interests,
    
      aboutYou,
    };

    firebaseSDK.uploadUserData(data, this.success, this.failure);
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

  success = async () => {
    this.setState({ loading: false });
    this.navigate("Login");
  };

  failure = (error) => {
    this.setState({ loading: false });
    this.showToast(error.message.toString());
  };

  render() {
    const {
      loading,
      role,
      Interests,
      farmingInterest,
      farmingIndex,
      rolelevelIndex,
      aboutYou,
    } = this.state;
    return (
      <Container>
        <Content source={bg2}>
          <Logo
            source={logo}
            resizeMode="contain"
            style={{ alignSelf: "flex-start", marginTop: -75 }}
          />
          <KeyboardAwareScrollView>
            <Forms.UserForm
              // style={{marginTop:-50}}
              roleIndex={rolelevelIndex}
              farmingIndex={farmingIndex}
              interest={Interests}
              aboutYou={aboutYou}
              onChangeFarmingInterest={(value, index) =>
                this.setState({ farmingInterest: value, farmingIndex: index })
              }
              onChangeRole={(value, index) =>
                this.setState({ role: value, rolelevelIndex: index })
              }
              onChangeInterests={(text) => this.setState({ Interests: text })}
              onChangeAboutYou={(text) => this.setState({ aboutYou: text })}
              onSubmitPress={() => this.handleUser()}
            />
          </KeyboardAwareScrollView>
        </Content>
        <AnimatedLoader
          visible={loading}
          overlayColor="rgba(0,0,0,0.25)"
          source={require("../../assets/anim/trail_loading.json")}
          animationStyle={styles.lottie}
          speed={1}
        />
      </Container>
    );
  }
}

export default User;

const styles = {
  accountContainer: {
    backgroundColor: "#155DEC",
    position: "absolute",
    bottom: 0,
    right: 0,
    left: 0,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
  },
  accountText: {
    fontSize: 14,
    color: "#fff",
    fontFamily: "Roboto",
    textAlign: "center",
  },
  lottie: {
    width: 200,
    height: 200,
  },
};
const Container = styled.View`
  width: 100%;
  height: 100%;
`;

const Content = styled.ImageBackground`
  width: 100%;
  height: 100%;
  align-items: center;
  position: relative;
`;

const Logo = styled.Image`
  width: 30%;
`;

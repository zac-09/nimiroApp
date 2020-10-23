import React from "react";
import styled from "styled-components/native";
import AnimatedLoader from "react-native-animated-loader";
import {  bg2 } from "../../assets";
import logo from './../../assets/logo.png'
import { Forms } from "../../components";
import {
  TouchableOpacity,
  Text,
  Dimensions,
  Image,
  ScrollView,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import firebaseSDK from "../../backend/Firebase";
import Toast from "react-native-root-toast";
import { validator } from "../../utils/Validations";
import Storage from "../../utils/Storage";
import * as firebase from "firebase";

const { width, height } = Dimensions.get("screen");

class Login extends React.Component {
  state = {
    checked: false,
    email: "",
    emailError: null,
    password: "",
    passwordError: null,
    loading: false,
  };

  navigate = (route) => {
    this.props.navigation.navigate(route);
  };

  handleLogin = () => {
    //write login logic here
    const { email, emailError, password, passwordError, checked } = this.state;
    const isValid = !(emailError || passwordError);
    console.log(isValid);
    if (isValid === true) {
      this.setState({ loading: true });
      const user = {
        email,
        password,
      };
      firebaseSDK.login(user, this.success, this.failure);
    } else {
      this.showToast("Some fields are invalid");
    }
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
    const { email, password, checked } = this.state;
    const uid = firebase.auth().currentUser.uid;
    console.log(`Your user id is: ${uid}`);
    if (checked) {
      await Storage.set("userid", uid);
      await Storage.set("password", password);
      await Storage.set("email", email);
    }

    this.setState({ loading: false });
    this.navigate("SignedIn");
  };

  failure = (error) => {
    this.setState({ loading: false });
    this.showToast(error.message.toString());
  };

  render() {
    const {
      email,
      emailError,
      password,
      passwordError,
      checked,
      loading,
    } = this.state;
    return (
      <ScrollView>
        <Container  source={bg2}>
          <KeyboardAwareScrollView style={{ flex: 1, minHeight: height }}>
            <Content>
              <Image source={logo} resizeMode="contain" style={styles.logo} />
              <Text style={{color:"#fff",fontSize:20,marginBottom:20}}>Welcome To Nimiro</Text>
              <Forms.SignInForm
                email={email}
                password={password}
                onEmailChange={(text) =>
                  this.setState({
                    email: text,
                    emailError: validator("email", text),
                  })
                }
                emailError={emailError}
                onPasswordChange={(text) =>
                  this.setState({
                    password: text,
                    passwordError: validator("password", text),
                  })
                }
                passwordError={passwordError}
                onRemeberChange={() =>
                  this.setState((prev) => ({ checked: !prev.checked }))
                }
                onPasswordRecovery={() => this.navigate("Forgot")}
                onSubmitPress={this.handleLogin}
                checked={checked}
              />
              <TouchableOpacity
                style={styles.accountContainer}
                onPress={() => this.navigate("Register")}
              >
                <Text style={styles.accountText}>
                  Don't have an account? Sign up here
                </Text>
              </TouchableOpacity>
            </Content>
          </KeyboardAwareScrollView>
          <AnimatedLoader
            visible={loading}
            overlayColor="rgba(0,0,0,0.25)"
            source={require("../../assets/anim/trail_loading.json")}
            animationStyle={styles.lottie}
            speed={1}
          />
        </Container>
      </ScrollView>
    );
  }
}

export default Login;

const styles = {
  accountContainer: {
    marginTop: 20,
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
  logo: {
    marginTop:20,
    width: 0.7 * width,
    // marginBottom: 10,
   
  },
};
const Container = styled.ImageBackground`
  flex: 1;
`;

const Content = styled.View`
  flex: 1;
  align-items: center;
  position: relative;
`;

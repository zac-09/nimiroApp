import React from 'react';
import { Splash } from './src/screens';
import * as Font from 'expo-font';
import Storage from './src/utils/Storage';
import createRootNavigator from './src/navigations/AppNavigator';
import {StatusBar} from 'react-native';
import firebaseSDK from './src/backend/Firebase';

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      fontLoaded: false,
      signedIn: false,
      checkedSignIn: false,
      isSplashReady: false
    };
  }

  async componentWillMount() {
    //action to start loading font
    await Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf")
    });
    this.setState({fontLoaded: true});
    //action to stop loading font
  }

  componentDidMount() {
    StatusBar.setHidden(true);
    Storage.isLoggedIn()
      .then(res => this.setState({ signedIn: res, checkedSignIn: true }, () => this._localSignIn()))
      .catch(err => alert("An error occurred"));
  }

  _localSignIn = async () => {
    const {signedIn} = this.state

    if(!signedIn) {
      this.setState({
        isSplashReady: true
      })
      return;
    }
    console.log('Checking async storage');
    let email = '', password = ''
    await Storage.get('email')
    .then(res => email = res)

    await Storage.get('password')
    .then(res => password = res)

    const user = {
      email,
      password
    }

    await firebaseSDK.login(user, id => console.log(id), console.warn)
    this.setState({
      isSplashReady: true
    })
  }

  render(){
    const { checkedSignIn, signedIn, isSplashReady, fontLoaded } = this.state;
    //@TODO 1: If we haven't checked AsyncStorage yet, don't render anything (better ways to do this)
    if (!isSplashReady) {
      return <Splash />;
    }

    const Layout = createRootNavigator(signedIn);
    return fontLoaded ? <Layout />: <Splash />
  }
}


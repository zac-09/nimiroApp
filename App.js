import React from 'react';
import { Splash } from './src/screens';
import * as Font from 'expo-font';
import Storage from './src/utils/Storage';
import createRootNavigator from './src/navigations/AppNavigator';
import {StatusBar} from 'react-native';

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      fontLoaded: false,
      signedIn: false,
      checkedSignIn: false
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
      .then(res => this.setState({ signedIn: res, checkedSignIn: true }))
      .catch(err => alert("An error occurred"));
  }

  render(){
    const { checkedSignIn, signedIn } = this.state;
    //@TODO 1: If we haven't checked AsyncStorage yet, don't render anything (better ways to do this)
    if (!checkedSignIn) {
      return <Splash />;
    }
    const Layout = createRootNavigator(signedIn);
    return this.state.fontLoaded ? <Layout />: <Splash />
  }
}


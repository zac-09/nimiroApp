import React from 'react'
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack';
import * as Screens from '../screens';
import ChatScreen from '../screens/chatscreen/ChatScreen'
import Chat from '../screens/chat/Chat';
import { ImageBackground, Text, View } from 'react-native';
import { bg2 } from '../assets';
import Header from '../components/headers/Header'
import User from '../screens/user/User'
import { Image } from 'react-native';



const AuthStack = createStackNavigator(
    {
        Welcome: Screens.Welcome,
        Login: Screens.Login,
        Register: Screens.Register,
        Forgot: Screens.Forgot,
        Reset: Screens.Reset,
        User: User,
    },
    {
        initialRouteName: "Welcome",
        headerMode: "none"
    }
);

const ChatStack = createStackNavigator(
  {
    Chat: {
      screen: Chat,
    },
    ChatScreen: {
      screen: ChatScreen,
    }
  },
  {
      initialRouteName: "Chat",
      headerMode: "none",
      cardStyle: {backgroundColor: 'transparent'}
  }
)


export const HomeStack = createMaterialTopTabNavigator(
    {
        ROC: {
          screen: Screens.Roc,
          navigationOptions: {
            tabBarLabel: ({ tintColor }) => (
              <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flex: 1}}>
                <Image source={require('../assets/roc.png')} style={{height: 20, width: 20}} />
                <Text style={{fontSize: 14, fontWeight: "900", marginLeft: 10, color: tintColor}}>ROC</Text>
              </View>
            ),
          }
        },
        Feed: Screens.Feed,
        Chat: Screens.Chat,
        Maps: Screens.Maps
    },
    {
        tabBarOptions: {
            labelStyle: {
              fontSize: 14,
              fontWeight: '900'
            },
            tabStyle: {
              width: 100,
            },
            style: {
              backgroundColor: 'transparent',
            }
        },
        navigationOptions: ({navigation}) => ({
          header: (
            <Header nomargin title='RotaApp'/>
          )
        })
    }
);

const InitialStack = createStackNavigator(
  {
    MainScreen: {
      screen: HomeStack,
      navigationOptions: {
        header: <Header nomargin title='RotaApp'/>
      }
    },
    ChatScreen: {
      screen: ChatScreen,
      navigationOptions: {
        header: null
      }
    }
  },
  {
      initialRouteName: "MainScreen",
      cardStyle: {backgroundColor: 'rgba(0,0,0,0)', backfaceVisibility: 'hidden'}
  }
)
const MainStack = createAppContainer(InitialStack);

const Main = ({navigation}) => {
  return (
    <ImageBackground source={bg2} style={{flex: 1}}>
        <MainStack/>
    </ImageBackground>
  )
}



export default createRootNavigator = (signedIn = false) => {
    return createAppContainer(createSwitchNavigator(
      {
        SignedIn: {
          screen: Main
        },
        SignedOut: {
          screen: AuthStack
        },
      },
      {
        initialRouteName: signedIn ? "SignedIn" : "SignedOut"
      }
    ));
};
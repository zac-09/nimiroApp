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
import Comments from '../screens/comments/Comments'
import { Image } from 'react-native';
import Post from '../screens/post/Post';
import Contact from '../screens/contacts/Contacts';



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
        headerMode: "none",
        cardStyle: {backgroundColor: 'rgba(0,0,0,0)', backfaceVisibility: 'hidden'}
    }
);


export const HomeStack = createMaterialTopTabNavigator(
    {
        ROC: Screens.Roc,
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
    },
    Comments: {
      screen: Comments,
      navigationOptions: {
        header: null
      }
    },
    Post: {
      screen: Post,
      navigationOptions: {
        header: null
      }
    },
    Contacts: {
      screen: Contact,
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




const createRootNavigator = (signedIn = false) => {
    return createAppContainer(createSwitchNavigator(
      {
        SignedIn: {
          screen: InitialStack
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

export const Main = ({signedIn}) => {
  const Layout = createRootNavigator(signedIn);
  return (
      <ImageBackground source={bg2} style={{flex: 1}}>
        <View style={{flex: 1,backgroundColor: "rgba(0, 8, 228, 0.7)",}}>
          <Layout/>
        </View>
      </ImageBackground>
  )
}
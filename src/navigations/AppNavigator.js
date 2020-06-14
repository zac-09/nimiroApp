import React from "react";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createMaterialTopTabNavigator } from "react-navigation-tabs";
import { createStackNavigator } from "react-navigation-stack";
import * as Screens from "../screens";
import ChatScreen from "../screens/chatscreen/ChatScreen";
import AddParticipantsScreen from "../screens/groups/AddParticipantsScreen";
import ConfigureGroupScreen from "../screens/groups/ConfigureGroupScreen";
import GroupChatScreen from "../screens/groups/GroupChatScreen";
import firebaseSDK from "../backend/Firebase";
import Chat from "../screens/chat/Chat";
import { ImageBackground, Dimensions, View } from "react-native";
import { bg2 } from "../assets";
import Header from "../components/headers/Header";
import User from "../screens/user/User";
import Comments from "../screens/comments/Comments";
import { Image } from "react-native";
import Post from "../screens/post/Post";
import Contact from "../screens/contacts/Contacts";
import Toast from "react-native-root-toast";
import PickLocationScreen from '../screens/maps/PickLocationscreen'
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
const AuthStack = createStackNavigator(
  {
    // Welcome: Screens.Welcome,
    Login: Screens.Login,
    Register: Screens.Register,
    Forgot: Screens.Forgot,
    Reset: Screens.Reset,
    User: User,
  },
  {
    // initialRouteName: "Welcome",
    headerMode: "none",
    cardStyle: {
      backgroundColor: "rgba(0,0,0,0)",
      backfaceVisibility: "hidden",
    },
  }
);

export const HomeStack = createMaterialTopTabNavigator(
  {
    ROC: Screens.Roc,
    Feed: Screens.Feed,
    Chat: Screens.Chat,
    Maps: Screens.Maps,
  },
  {
    tabBarOptions: {
      labelStyle: {
        fontSize: 14,
        fontWeight: "900",
      },
      tabStyle: {
        width: Dimensions.get("window").width * .26,
      },
      style: {
        backgroundColor: "transparent",
      },
    },
    navigationOptions: ({ navigation }) => ({
      header: (
        <Header
          navData={navigation}
          nomargin
          title="RotaApp"
          onLogout={() => {
            showToast("logged out");
            navigation.navigate({ routeName: "SignedOut" });
            firebaseSDK.logout();
          }}
        />
      ),
    }),
  }
);

const InitialStack = createStackNavigator(
  {
    MainScreen: {
      screen: HomeStack,
      navigationOptions: ({ navigation }) => ({
        header: (
          <Header
            navData={navigation}
            nomargin
            title="RotaApp"
            onLogout={() => {
              showToast("logged out");
              navigation.navigate({ routeName: "SignedOut" });
              firebaseSDK.logout();
            }}
          />
        ),
      }),
    },
    ChatScreen: {
      screen: ChatScreen,
      
    },
    Comments: {
      screen: Comments,
      navigationOptions: {
        header: null,
      },
    },
    Post: {
      screen: Post,
      navigationOptions: {
        header: null,
      },
    },
    PickLocation: {
      screen: PickLocationScreen,
      
    },
    GroupChatScreen: {
      screen: GroupChatScreen,
      
    },
    Contacts: {
      screen: Contact,
      navigationOptions: {
        header: null,
      },
    },
    AddParticipantsScreen: {
      screen: AddParticipantsScreen,
      navigationOptions: {
        header: null,
      },
    },
    ConfigureGroupScreen: {
      screen: ConfigureGroupScreen,
      navigationOptions: {
        header: null,
      },
    },
  },
  {
    initialRouteName: "MainScreen",
    cardStyle: {
      backgroundColor: "rgba(0,0,0,0)",
      backfaceVisibility: "hidden",
    },
  }
);

const createRootNavigator = (signedIn = false) => {
  return createAppContainer(
    createSwitchNavigator(
      {
        SignedIn: {
          screen: InitialStack,
        },
        SignedOut: {
          screen: AuthStack,
        },
      },
      {
        initialRouteName: signedIn ? "SignedIn" : "SignedOut",
      }
    )
  );
};

export const Main = ({ signedIn }) => {
  const Layout = createRootNavigator(signedIn);
  return (
    <ImageBackground source={bg2} style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: "rgba(0, 8, 228, 0.7)" }}>
        <Layout />
      </View>
    </ImageBackground>
  );
};

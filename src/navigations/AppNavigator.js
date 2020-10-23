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
import PickLocationScreen from "../screens/maps/PickLocationscreen";
import NotificationScreen from "./../screens/notifications/NotificationScreen";
import AboutScreen from "./../screens/about/AboutScreen";
import EditScreen from "./../screens/edit/EditProfileScreen";

import logo from "../assets/logo_dark.png";
import { LinearGradient } from "expo-linear-gradient";

import { Ionicons } from "@expo/vector-icons";
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

    // header: null,
    cardStyle: {
      backgroundColor: "rgba(0,0,0,0)",
      backfaceVisibility: "hidden",
    },
    // headerShown:false
  }
);

export const HomeStack = createMaterialTopTabNavigator(
  {
    You: {
      screen: AboutScreen,
      navigationOptions: {
        tabBarIcon: ({ focused, tintcolor }) => (
          <Ionicons name="ios-person" size={30} color="#150128" />
        ),
      },
    },
    nimiro: {
      screen: Screens.Feed,
      navigationOptions: {
        tabBarIcon: ({ focused, tintcolor }) => (
          <Image
            source={logo}
            style={{ width: 37, height: 37 }}
            resizeMode="contain"
          />
        ),
      },
    },
    Notifications: {
      screen: NotificationScreen,
      navigationOptions: {
        tabBarIcon: ({ focused, tintcolor }) => (
          <Ionicons
            name="ios-notifications-outline"
            size={30}
            color="#150128"
          />
        ),
      },
    },
  },
  {
    tabBarOptions: {
      showIcon: true,
      labelStyle: {
        fontSize: 14,
        fontWeight: "900",
        color: "#150128",
        textTransform: "lowercase",
      },
      tabStyle: {
        width: Dimensions.get("window").width * 0.33,
      },
      style: {
        backgroundColor: "#E4E4E4",
      },
    },
    navigationOptions: ({ navigation }) => ({
      header: null,
    }),
  }
);

const InitialStack = createStackNavigator(
  {
    MainScreen: {
      screen: HomeStack,
      navigationOptions: ({ navigation }) => ({
        // header: (
        //   <Header
        //     navData={navigation}
        //     nomargin
        //     title="Nimiro"
        //     onLogout={() => {
        //       showToast("logged out");
        //       navigation.navigate({ routeName: "SignedOut" });
        //       firebaseSDK.logout();
        //     }}
        //   />
        // ),
      }),
    },
    Roc: Screens.Roc,

    ChatScreen: {
      screen: ChatScreen,
    },
    Chat: {
      screen: Screens.Chat,
      navigationOptions: {
        header: null,
      },
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
    editProfile: {
      screen: EditScreen,
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
    // <ImageBackground source={bg2} style={{ flex: 1 }}>
    <LinearGradient
      colors={["#FB38A0", "#681554", "#150128"]}
      style={{
        flex: 1,
        // padding: props.padding ? props.padding : 15,
        // alignItems: "center",
        // borderRadius: 8,
      }}
      start={[0.0, 0.1]}
      //  end={[1,.9]}
    >
      {/* <View style={{ flex: 1, }}> */}
      <Layout />
      {/* </View> */}
    </LinearGradient>

    // </ImageBackground>
  );
};

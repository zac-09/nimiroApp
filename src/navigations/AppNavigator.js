import { createAppContainer, createSwitchNavigator} from 'react-navigation';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack';
import * as Screens from '../screens';


const AuthStack = createStackNavigator(
    {
        Welcome: Screens.Welcome,
        Login: Screens.Login,
        Register: Screens.Register,
        Forgot: Screens.Forgot,
        Reset: Screens.Reset
    },
    {
        initialRouteName: "Welcome",
        headerMode: "none"
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
              fontSize: 12,
            },
            tabStyle: {
              width: 100,
            },
            style: {
              backgroundColor: 'transparent',
            },
        }
    }
);


export default createRootNavigator = (signedIn = false) => {
    return createAppContainer(createSwitchNavigator(
      {
        SignedIn: {
          screen: Screens.Main
        },
        SignedOut: {
          screen: AuthStack
        }
      },
      {
        initialRouteName: signedIn ? "SignedIn" : "SignedOut"
      }
    ));
};
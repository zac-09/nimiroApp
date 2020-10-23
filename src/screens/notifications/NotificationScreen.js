import React from "react";
import { View, StyleSheet, Text, ScrollView } from "react-native";
import NotificationItem from "./../../components/listitems/NotificationItem";
const NotificationScreen = (props) => {
  return (
    <View style={styles.screen}>
      <ScrollView>
        <View>
          <View style={{ backgroundColor: "#8440AD" }}>
            <NotificationItem
              date="Wednesday 19 october 2020"
              color="#D76D9F"
              content="International coffee prices for this year"
              icon="ios-document"
            />
          </View>
          <NotificationItem
            date="Monday 19 November 2020"
            color="#8440AD"
            content="Maize suply deal in malaysia"
            icon="ios-business"
          />
          <View style={{ backgroundColor: "#9091B1" }}>

          <NotificationItem
            date="Saturday 19 January 2021"
            color="#150128"
            content="Get/Book your container for road, Air, Train"
            icon="ios-jet"
          />
          </View>
           <NotificationItem
            date="Saturday 19 January 2021"
            color="#9091B1"
            content="Subscriptions"
            icon="ios-cash"
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#150128",
  },
});

export default NotificationScreen;

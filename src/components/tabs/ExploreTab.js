import React from "react";
import { View } from "react-native";
import { ExploreTabItem } from "../tabItems";

function createTabItems(props) {
  let items = [];
  let labels = props.labels;
  let active = props.active;
  for (let index = 0; index < labels.length; index++) {
    const label = labels[index];
    items.push(
      <ExploreTabItem
        key={index}
        active={active === label}
        text={label}
        onPress={l => props.onItemPress(labels.indexOf(l))}
      />
    );
  }

  return items;
}

function ExploreTab(props) {
  return <View style={styles.container}>{createTabItems(props)}</View>;
}

const styles = {
  container: {
    height: 40,
    flexDirection: "row"
  }
};

export default ExploreTab;

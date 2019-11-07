import React from "react";
import { List } from "native-base";
import { FeedItem } from "../listitems";

function FeedList(props) {
  return (
    <List
      dataArray={props.feed}
      renderRow={feed => <FeedItem {...feed} onItemPressed={id => props.onFeedItemClicked(id)} />}
      keyExtractor={(item, index) => index.toString()}
    />
  );
}

export default FeedList;

import React from "react";
import { List } from "native-base";
import { RocItem } from "../listitems";

function RocList(props) {
  return (
    <List
      dataArray={props.roc}
      renderRow={roc => <RocItem {...roc} onItemPressed={id => props.onRocItemClicked(id)} />}
      keyExtractor={(item, index) => index.toString()}
    />
  );
}

export default RocList;

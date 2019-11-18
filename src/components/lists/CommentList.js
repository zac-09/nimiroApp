import React from "react";
import { List } from "native-base";
import { CommentItem } from "../listitems";

function CommentList(props) {
  return (
    <List
      dataArray={props.comments}
      renderRow={comment => <CommentItem {...comment} onItemPressed={id => props.onCommentItemClicked(id)} />}
      keyExtractor={(item, index) => index.toString()}
    />
  );
}

export default CommentList;

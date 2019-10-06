import React from "react";
import { List } from "native-base";
import { ChatItem } from "../listitems";

function ChatList(props) {
  return (
    <List
      dataArray={props.chat}
      renderRow={chat => <ChatItem {...chat} onItemPressed={id => props.onChatItemClicked(id)} />}
    />
  );
}

export default ChatList;

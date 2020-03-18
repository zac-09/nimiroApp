import React from "react";
import { List } from "native-base";
import { ContactItem } from "../listitems";
import { GroupItem } from "../listitems";

function ContactList(props) {
  const item = props.item ? "GroupItem" : "ContactItem";
  if (item === "ContactItem") {
    return (
      <List
        dataArray={props.contacts}
        renderRow={contact => (
          <ContactItem
            {...contact}
            onItemPressed={id => props.onContactItemClicked(id)}
          />
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    );
  } else {
    return (
      <List
        dataArray={props.contacts}
        renderRow={contact => (
          <GroupItem
            {...contact}
            onItemPressed={id => props.onContactItemClicked(id)}
          />
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    );
  }
}

export default ContactList;

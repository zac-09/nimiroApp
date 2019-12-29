import React from "react";
import { List } from "native-base";
import { ContactItem } from "../listitems";

function ContactList(props) {
  return (
    <List
      dataArray={props.contacts}
      renderRow={contact => <ContactItem {...contact} onItemPressed={id => props.onContactItemClicked(id)} />}
      keyExtractor={(item, index) => index.toString()}
    />
  );
}

export default ContactList;

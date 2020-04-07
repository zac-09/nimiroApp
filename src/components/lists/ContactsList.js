import React from "react";
import { List } from "native-base";
import { ContactItem } from "../listitems";
import { GroupItem } from "../listitems";
import { FlatList } from "react-native";
function ContactList(props) {
  const item = props.item ? "GroupItem" : "ContactItem";
  if (item === "ContactItem") {
    return (
      <List
        dataArray={props.contacts}
        renderRow={(contact) => (
          <ContactItem
            {...contact}
            onItemPressed={(id) =>
              props.onContactItemClicked(id, contact.name, contact.avatar)
            }
            isAdded = {contact.isAdded}
          />
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    );
  } else {
    return (
      // <List
      //   dataArray={props.contacts}
      //   renderRow={contact => (
      //     // console.log(contact);
      //     <GroupItem

      //       {...contact}
      //       onItemPressed={id => props.onContactItemClicked(id,contact.id,contact.name,contact.avatar)}
      //     />
      //   )}
      //   keyExtractor={(item, index) => index.toString()}
      // />
      <FlatList
        ref={(ref) => (this.flatList = ref)}
        onContentSizeChange={() =>
          this.flatList.scrollToEnd({ animated: true })
        }
        onLayout={() => this.flatList.scrollToEnd({ animated: true })}
        data={props.contacts}
        horizontal={true}
        keyExtractor={(item) => item.id}
        renderItem={(itemData) => (
          <GroupItem
            {...itemData.item}
            // onItemPressed = {removeParticipantHandler("",itemData.item.id)}
            onItemPressed={(id) =>
              props.onContactItemClicked(
                id,
                itemData.item.id,
                itemData.item.name,
                itemData.item.avatar
              )
            }
            //  name = {itemData.item.name}
          />
          // <Text>isaac is awesome {itemData.item.name}</Text>
        )}
      />
    );
  }
}

export default ContactList;

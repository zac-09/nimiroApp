import React from "react";
import { Form } from "native-base";
import { BlockInput } from "../inputs";
import InputItem from "./../inputs/InputItem";
import { LgButton } from "../buttons";
import { View, Text, Dimensions ,TextInput} from "react-native";
import { Radio, RadioGroup, RadioButton ,} from "radio-react-native";
import  NewButton  from '../buttons/NewButton';

const UserForm = (props) => {
  return (
    <Form style={styles.container}>
      <View
        style={{
          ...styles.inputContainer,
          height: 60,
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
        }}
      >
        <Text style={{ paddingVertical: 5, fontWeight: "700", color: "#fff" }}>
          Role in agro industry
        </Text>
        <RadioGroup
          style={{ flexDirection: "row" }}
          defaultChoice={props.roleIndex}
          onChoose={(value, index) => props.onChangeRole(value, index)}
        >
          <RadioButton
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
            value={"farmer"}
          >
            <Radio />
            <Text style={{ paddingHorizontal: 10, color: "#fff" }}>farmer</Text>
          </RadioButton>
          <RadioButton
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
            value={"sales person"}
          >
            <Radio />
            <Text style={{ paddingHorizontal: 10, color: "#fff" }}>
              sales Person
            </Text>
          </RadioButton>
          <RadioButton
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
            value={"customer"}
          >
            <Radio />
            <Text style={{ paddingHorizontal: 10, color: "#fff" }}>
              Customer
            </Text>
          </RadioButton>
        </RadioGroup>
      </View>
      <View
        style={{
          ...styles.inputContainer,
          height: 60,
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
        }}
      >
        <Text style={{ paddingVertical: 5, fontWeight: "700", color: "#fff" }}>
          Type of farming of interest
        </Text>
        <RadioGroup
          style={{ flexDirection: "row" }}
          defaultChoice={props.farmingIndex}
          onChoose={(value, index) => props.onChangeFarmingInterest(value, index)}
        >
          <RadioButton
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
            value={"animal farmig"}
          >
            <Radio />
            <Text style={{ paddingHorizontal: 10, color: "#fff" }}>
              Animal farming
            </Text>
          </RadioButton>
          <RadioButton
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
            value={"crop farming"}
          >
            <Radio />
            <Text style={{ paddingHorizontal: 10, color: "#fff" }}>
              crop farming
            </Text>
          </RadioButton>
        </RadioGroup>
      </View>
      <BlockInput
        placeholder="Interests"
        value={props.interest}
        onChangeText={(text) => props.onChangeInterests(text)}
      />
      <View style={styles.inputContainerxBox}>
        <TextInput
          // inputBox={styles.inputContainerxBox}
          style={styles.input} 
            
          placeholder="About you (optional)"
          value={props.aboutYou}
          onChangeText={(text) => props.onChangeAboutYou(text)}
        />
      </View>

      <View style={styles.buttonContainer}>
        <NewButton
        width={200}
          text="Connect to Other farmers"
          onPress={() => props.onSubmitPress()}
        />
      </View>
      <Text
        style={{ textAlign: "center", color: "#F80A0A", marginVertical: 10 }}
      >
        By clicking “connect with farmers” below, you agree to our terms of
        service and privacy policy.
      </Text>
    </Form>
  );
};

export default UserForm;

const styles = {
  container: {
    width: "100%",
    paddingHorizontal: 30,
  },
  inputContainer: {
    backgroundColor: "rgba(255, 255, 255, 0)",
    height: 75,
    width: "100%",
    padding: 10,
    marginTop: 5,
    marginBottom: 5,
    justifyContent: "center",
    borderRadius: 5,
  },
  buttonContainer: {
    paddingTop: 30,
    marginHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    flexGrow: 1,
    // alignItems: "center",
    borderRadius: 15,
    marginRight: 10,
    backgroundColor: "transparent",
    // flex: 1,
    padding: 10,
    marginLeft: 5,
    fontSize: 16,
    lineHeight: 16,
    paddingLeft: 10,
    // paddingTop: 6,
    paddingBottom: 6,
    height: "100%",
    marginTop: -150,
    padding: 10,
    color:"#fff"
  },
  inputContainerxBox: {
    flexDirection: "column",
    borderRadius: 14,
    // alignItems: "center",
    backgroundColor: "transparent",
    padding: 10,
    marginVertical: 10,
    height: 230,
    width: "100%",
    borderColor: "#fff",
    borderWidth: 2,
    // backgroundColor: "#fff",
  },
};

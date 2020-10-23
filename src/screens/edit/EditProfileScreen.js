import React, { useState, useReducer, useCallback, useEffect } from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  Image,
  Dimensions,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import bg from "../../assets/chat_bg.png";
import * as firebase from "firebase";
import firebaseSDK from "../../backend/Firebase";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import { Radio, RadioGroup, RadioButton } from "radio-react-native";

import Toast from "react-native-root-toast";

import EditInputItem from "./../../components/inputs/EditInputItem";
import PhoneInput from "react-native-phone-input";

import * as ImagePicker from "expo-image-picker";

import NewButton from "./../../components/buttons/NewButton";
const FORM_INPUT_UPDATE = "FORM_INPUT_UPDATE";

const formReducer = (state, action) => {
  if (action.type === FORM_INPUT_UPDATE) {
    const updatedValues = {
      ...state.inputValues,
      [action.input]: action.value,
    };
    const updatedValidities = {
      ...state.inputValidities,
      [action.input]: action.isValid,
    };
    let updatedFormIsValid = true;
    for (const key in updatedValidities) {
      updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
    }
    return {
      formIsValid: updatedFormIsValid,
      inputValidities: updatedValidities,
      inputValues: updatedValues,
    };
  }
  return state;
};

const EditProfileScreen = (props) => {
  const userData = props.navigation.getParam("user");
  // console.log("the user data is", userData);
  const [isAvatarChanged, setIsAvatarChanged] = useState(false);
  const showToast = (message) => {
    Toast.show(message, {
      duration: Toast.durations.LONG,
      position: Toast.positions.BOTTOM,
      shadow: true,
      animation: true,
      hideOnPress: true,
      delay: 0,
    });
  };
  const openPickerHandler = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
    });

    console.log(result);

    if (!result.cancelled) {
      inputChangeHandler("avatar", result.uri, true);
      console.log("the image is", result.uri);
    }
  };

  const avator = require("././../../../assets/images/placeholder.png");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const getCurrentUser = async () => {
    const user = await firebaseSDK.getUserInfo();
    // console.log("the user info is", user);
    // setUser(user);
  };
  const uploadUserImage = async () => {
    // await Storage.set("uid", uid);
    const image = formState.inputValues.avatar;

    if (image !== userData.avatar) {
      firebaseSDK.uploadAvator(
        image,
        uploadUserData,
        () => {}
      );
    } else {
      uploadUserData(userData.avatar);
    }
  };

  const uploadUserData = (avatar) => {
    const {
      fName,
      lName,
      country,
      phoneNumber,
      gender,
      interests,
      aboutYou,
    } = formState.inputValues;
    let _id = firebase.auth().currentUser.uid;
    const data = {
      fName,
      lName,
      country,
      interests,
      aboutYou,
      phoneNumber,
      gender,
      avatar,
      _id,
    };
    console.log("the uploaded data is", data);

    firebaseSDK.uploadUserData(
      data,
      () => {},
      () => {}
    );
  };
  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      fName: userData.fName,
      lName: userData.lName,
      interests: userData.Interests,
      aboutYou: userData.aboutYou,

      phoneNumber: userData.phoneNumber,
      gender: userData.gender,
      avatar: userData.avatar,

      country: userData.country,
    },
    inputValidities: {
      fName: true,
      lName: true,
      phoneNumber: true,
      gender: true,
      avatar: true,
      country: true,
      interests: true,
      aboutYou: true,
    },
    formIsValid: true,
  });

  const submitUpdateHandler = async () => {
    if (!formState.formIsValid) {
      Alert.alert("Wrong input!", "Please check the errors in the form.", [
        { text: "Okay" },
      ]);

      return;
    }
    // if (isAvatarChanged) {
    //   setError(null);
    //   setIsLoading(true);
    //   try {
    //     await uploadUserImage();

    //     setIsLoading(false);
    //     showToast("profile successfully updated");
    //   } catch (err) {
    //     setError(err.message);
    //     setIsLoading(false);
    //   }
    //   return;
    // }

    setError(null);
    setIsLoading(true);
    try {
      //   await dispatch(action);
      await uploadUserImage();
      console.log("user successfully updated");
      setIsLoading(false);
      showToast("profile successfully updated");
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    // getCurrentUser();
    if (error) {
      Alert.alert("An Error Occurred!", error, [{ text: "Okay" }]);
    }
  }, [error]);
  const inputChangeHandler = useCallback(
    (inputIdentifier, inputValue, inputValidity) => {
      dispatchFormState({
        type: FORM_INPUT_UPDATE,
        value: inputValue,
        isValid: inputValidity,
        input: inputIdentifier,
      });
    },
    [dispatchFormState]
  );
  if (isLoading || !userData) {
    return (
      <View
        style={{
          ...styles.screen,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color="#ccc" />
      </View>
    );
  }
  return (
    <View style={{ flex: 1, backgroundColor: "#18022C" }}>
      <ImageBackground style={styles.screen} source={bg}>
        <TouchableOpacity
          style={styles.icon}
          onPress={() => {
            props.navigation.goBack();
          }}
        >
          <AntDesign name="arrowleft" color="#fff" size={25} />
        </TouchableOpacity>
        <View style={styles.title}>
          <Text style={styles.titleText}>Edit Profile</Text>
        </View>
        <ScrollView>
          <View style={styles.container}>
            <View>
              <View style={styles.imageContainer}>
                {formState.inputValues.avatar.length > 20 ? (
                  <Image
                    style={{ width: 100, height: 100 }}
                    source={{ uri: formState.inputValues.avatar }}
                  />
                ) : (
                  <Image source={avator} style={styles.image} />
                )}
              </View>
              <View style={styles.iconContainer}>
                <Ionicons
                  name="ios-camera"
                  size={23}
                  onPress={openPickerHandler}
                />
              </View>
            </View>
          </View>
          <View style={styles.emailContainer}>
            <Text style={{ color: "#fff" }}>Email</Text>
            <Text style={{ color: "#fff" }}>{userData.email}</Text>
          </View>

          <KeyboardAvoidingView keyboardVerticalOffset={20} behavior="padding">
            <View style={styles.inputs}>
              <EditInputItem
                errorText="a name is required"
                onInputChange={inputChangeHandler}
                id="fName"
                required
                initialValue={formState.inputValues.fName}
                initiallyValid={!!formState.inputValues.fName}
                style={styles.input}
                field="first name"
              />
              <EditInputItem
                errorText="a name is required"
                onInputChange={inputChangeHandler}
                id="lName"
                required
                initialValue={formState.inputValues.lName}
                initiallyValid={!!formState.inputValues.lName}
                style={styles.input}
                field="last name"
              />
              <EditInputItem
                errorText="a name is required"
                onInputChange={inputChangeHandler}
                id="interests"
                required
                initialValue={formState.inputValues.interests}
                initiallyValid={!!formState.inputValues.interests}
                style={styles.input}
                field="Interests"
              />
              <EditInputItem
                errorText="a name is required"
                onInputChange={inputChangeHandler}
                id="aboutYou"
                required
                initialValue={formState.inputValues.aboutYou}
                initiallyValid={!!formState.inputValues.aboutYou}
                style={styles.input}
                field="about you"
              />

              <View style={styles.fieldNameContainer}>
                <Text style={styles.fieldText}>phoneNumber</Text>
              </View>
              <View style={styles.inputContainer}>
                <Text style={{ color: "#ccc" }}>phoneNumber</Text>
                <PhoneInput
                  allowZeroAfterCountryCode={false}
                  style={styles.inputs}
                  initialCountry="ug"
                  value={formState.inputValues.phoneNumber}
                  onChangePhoneNumber={(number) => {
                    inputChangeHandler("phoneNumber", number, true);
                  }}
                  textStyle={{ color: "#ccc" }}
                  offset={20}
                />
              </View>
              <EditInputItem
                field="country"
                errorText="a country is required"
                onInputChange={inputChangeHandler}
                id="country"
                required
                initialValue={formState.inputValues.country}
                initiallyValid={!!formState.inputValues.country}
                style={styles.input}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={{ paddingVertical: 5, padding: 5, color: "#ccc" }}>
                Gender
              </Text>
              <RadioGroup
                style={{ flexDirection: "row", ...styles.input }}
                // defaultChoice={props.genderIndex}
                onChoose={(value, index) =>
                  inputChangeHandler("gender", value, true)
                }
              >
                <RadioButton
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    marginLeft: 20,
                  }}
                  value={"male"}
                >
                  <Radio />
                  <Text style={{ paddingHorizontal: 10, color: "#ccc" }}>
                    Male
                  </Text>
                </RadioButton>
                <RadioButton
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    marginLeft: 20,
                  }}
                  value={"female"}
                >
                  <Radio />
                  <Text style={{ paddingHorizontal: 10, color: "#ccc" }}>
                    Female
                  </Text>
                </RadioButton>
              </RadioGroup>
            </View>

            <View style={styles.buttonContainer}>
              {isLoading ? (
                <ActivityIndicator size="large" color="#ccc" />
              ) : (
                <NewButton
                  text="update profile"
                  width={Dimensions.get("window").width * 0.5}
                  style={styles.button}
                  onPress={() => {
                    {
                      submitUpdateHandler();
                      // props.navigation.navigate("profile");
                    }
                  }}
                />
              )}
            </View>
          </KeyboardAvoidingView>
        </ScrollView>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    margin: 0,
    padding: 0,
    height: "100%",
    // alignItems: "center",
    // justifyContent: 'center'
  },

  logo: {
    width: 120,
    height: 120,
  },
  title: {
    // alignItems: 'center',
    justifyContent: "center",
    position: "absolute",
    top: 1,
    backgroundColor: "rgba(0,0,0,.2)",
    width: "100%",
    zIndex: 200,
  },
  titleText: {
    color: "#fff",
    // fontFamily: "lato-bold",
    fontSize: 20,
    padding: 10,
    alignSelf: "center",
    // marginLeft:130
  },
  icon: {
    padding: 10,
    zIndex: 1000,
  },
  bottomText: {
    alignSelf: "center",
    marginTop: 30,
  },
  inputs: {
    marginTop: 5,
    flex: 1,
    width: "100%",
    alignItems: "center",
    flexGrow: 1,
    padding: 18,
  },
  buttonContainer: {
    // marginTop: Dimensions.get("window").height * 0.001,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    padding: 20,
  },
  input: {
    marginVertical: 10,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imageContainer: {
    height: 100,
    width: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    marginTop: 20,
    alignItems: "center",
    overflow: "hidden",
  },
  container: {
    padding: 30,
    marginTop: 1,
    // justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    position: "absolute",
    right: 2,
    bottom: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  emailContainer: {
    flex: 1,
    width: "100%",
    paddingLeft: 20,
    // paddingLeft:10,}
  },
  inputs: {
    flexGrow: 1,
    alignItems: "center",
    borderRadius: 15,
    marginRight: 10,
    backgroundColor: "transparent",
    flex: 1,
    padding: 10,
    marginLeft: 5,
    fontSize: 16,
    lineHeight: 16,
    paddingLeft: 10,
    paddingTop: 6,
    paddingBottom: 6,
  },
  inputContainer: {
    flexDirection: "row",
    borderRadius: 14,
    alignItems: "center",
    // backgroundColor: "#fff",
    padding: 10,
    marginVertical: 10,
    borderBottomColor: "#fff",
    borderBottomWidth: 0.5,
  },
  fieldNameContainer: {
    marginVertical: 1,
    alignSelf: "flex-start",
  },
  fieldText: {
    color: "#fff",
    // fontFamily: "nunito",
    fontSize: 16,
  },
  dropDown: {
    backgroundColor: "transparent",
    padding: 40,
    // marginVertical: 10,
    borderWidth: 2,
    // borderBottomColor: "#fff",
    borderRadius: 50,
    width: "90%",
    alignSelf: "center",
    marginTop: 0,
    height: 55,
    overflow: "hidden",
  },
  dateInput: {
    flexGrow: 1,
    alignItems: "center",
    borderRadius: 15,
    marginRight: 10,
    // backgroundColor: "#ccc",
    flex: 1,
    padding: 10,
    marginLeft: 5,
    fontSize: 16,
    lineHeight: 16,
    paddingLeft: 10,
    paddingTop: 6,
    paddingBottom: 6,
  },
});

export default EditProfileScreen;

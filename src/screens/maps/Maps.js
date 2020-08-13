import React from "react";

import MapView, { Marker } from "react-native-maps";
import {
  StyleSheet,
  Platform,
  Text,
  Dimensions,
  TouchableWithoutFeedback,
  View,
  TextInput,
  KeyboardAvoidingView,
} from "react-native";
import Constants from "expo-constants";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
import * as firebase from "firebase";
import Pin from "../../components/markers/Pin";
import NewButton from "../../components/buttons/NewButton";
import DatePicker from "react-native-datepicker";
import { Feather, AntDesign, MaterialIcons } from "@expo/vector-icons";
import { formatDate } from "../../utils/Validations";
import { Radio, RadioGroup, RadioButton } from "radio-react-native";
import Toast from "react-native-root-toast";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import moment from "moment";
import Feed from "../feed/Feed";
export default class Maps extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      location: {
        latitude: 0.347596,
        longitude: 32.58252,
      },
      errorMessage: null,
      markers: [],
      showDetais: false,
      details: null,
      type: "fellowship",
      title: "",
      pickedLocation: "",

      eventDetails: "",
      typeIndex: 0,
      isAddEvent: false,
      date: new Date(),
      expiryDate: new Date(),
      editMode: false,
      editedEvent: null,
      evenId: "",
    };

    this.threadsRef = firebase
      .firestore()
      .collection("maps")
      .where("end_date", ">=", new Date());

    this.threadsUnscribe = "null";
  }
  componentWillReceiveProps(nextProps, nextState) {
    console.log("component has updated");
    const address = this.props.navigation.getParam("pickedLocation");
    if (address !== null || address !== undefined) {
      this.setState({ pickedLocation: address });
      console.log("this is from update", address);
    }

    return true;
  }
  componentDidMount() {
    if (Platform.OS === "android" && !Constants.isDevice) {
      this.setState({
        errorMessage:
          "Oops, this will not work on Sketch in an Android emulator. Try it on your device!",
      });
    } else {
      this._getLocationAsync();
    }
    this.threadsUnscribe = this.threadsRef.onSnapshot(this._getMarkersAsync);
  }

  componentWillUnmount() {
    this.threadsUnscribe();
  }
  addEventsHandler = async () => {
    console.log("btn pressed");
    console.log("date is", this.state.date);

    const uid = firebase.auth().currentUser.uid;
    const {
      pickedLocation,
      title,
      eventDetails,
      type,
      date,
      expiryDate,
      eventId,
    } = this.state;
    if (
      pickedLocation === undefined ||
      pickedLocation === null ||
      pickedLocation === ""
    ) {
      return this.showToast("please try to pick location");
    }
    if (date === undefined || date === null || date === "") {
      return this.showToast("please chose a start date");
    }
    const uploadedData = {
      title,
      location: pickedLocation,
      classification_id:
        type === "fellowship" ? "CIwRusFj5lv1Zt7FCXrp" : "h8HvLOFL3XMOv6NNh98C",
      status_id: "f9My8BXWM85idUmUr6ch",
      description: eventDetails,
      starting_date: new Date(moment(date)),
      end_date: new Date(moment(expiryDate)),
      created_by: uid,
    };
    if (this.state.editMode) {
      await firebase
        .firestore()
        .collection("maps")
        .doc(eventId)
        .update({
          title,
          location: pickedLocation,
          classification_id:
            type === "fellowship"
              ? "CIwRusFj5lv1Zt7FCXrp"
              : "h8HvLOFL3XMOv6NNh98C",
          status_id: "f9My8BXWM85idUmUr6ch",
          description: eventDetails,
          starting_date: new Date(moment(date)),
          end_date: new Date(moment(expiryDate)),
        });
      this.showToast("event successfully edited");
      this.setState({editMode:false})
      return;
    }
    await firebase
      .firestore()
      .collection("maps")
      .add(uploadedData)
      .then(async () => {
        this.setState({ isAddEvent: false });
        const data = {
          comments: [],
          likes: 0,
          created_by: firebase.auth().currentUser.uid,
          date_created: new Date(),
          content: {
            text: title,
            map: pickedLocation,
            details: eventDetails,
          },
        };
        if (type === "fellowship") {
          await firebase
            .firestore()
            .collection("feeds")
            .add(data)
            .then(async (docRef) => {
              await firebase
                .firestore()
                .collection("feeds")
                .doc(docRef.id)
                .update({
                  id: docRef.id,
                });
            });
        } else {
          await firebase
            .firestore()
            .collection("events")
            .add(data)
            .then(async (docRef) => {
              await firebase
                .firestore()
                .collection("events")
                .doc(docRef.id)
                .update({
                  id: docRef.id,
                });
            });
        }

        this.showToast("event successfully added");
      this.setState({isAddEvent:false})

      });
  };
  showToast = (message) => {
    Toast.show(message, {
      duration: Toast.durations.LONG,
      position: Toast.positions.BOTTOM,
      shadow: true,
      animation: true,
      hideOnPress: true,
      delay: 0,
    });
  };

  _getAddress = async (pickedLocation) => {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${pickedLocation.lat},${pickedLocation.lng}&key=AIzaSyAfO6Pi32GUCliRVfwUxc7mK4ZNaQ9a8Mk`
    );

    if (!response.ok) {
      throw new Error("Something went wrong!");
      console.log("an error occore");
    }

    const resData = await response.json();
    if (!resData.results) {
      throw new Error("Something went wrong!");
    }

    const address = resData.results[0].formatted_address;
    console.log("the city is ", address);
    return address;
  };
  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== "granted") {
      this.setState({
        errorMessage: "Permission to access location was denied",
      });
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    // console.log("location acquired from expo",location)
    this.setState({ location: location.coords });
  };

  _getMarkersAsync = async (querySnapshot) => {
    const data = [];
    try {
      querySnapshot.forEach((doc) => {
        const marker = doc.data();
        marker.id = doc.id;
        data.push(marker);
      });
    } catch (error) {
      this.setState({ errorMessage: error.message });
    }

    // console.log("these are the markers",data);
    this.setState({ markers: data, errorMessage: null });
  };

  render() {
    const {
      location,
      markers,
      showDetais,
      details,
      isAddEvent,
      editMode,
    } = this.state;
    const canceled = details
      ? details.status_id === "b0Q7JzsYXBBeBLbG9nb0"
        ? true
        : false
      : false;
    return (
      <View style={styles.container}>
        <MapView
          initialRegion={{
            ...location,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          style={styles.mapStyle}
          onPress={() => {
            this.setState({ isAddEvent: false, editMode: false });
          }}
        >
          {markers.map((el, id) => {
            const markerColor =
              el.status_id === "b0Q7JzsYXBBeBLbG9nb0" ? "red" : "green";
            const isFellowship =
              el.classification_id === "CIwRusFj5lv1Zt7FCXrp" ? true : false;
            const marker = {
              latlng: {
                latitude: el.location.lat,
                longitude: el.location.long,
              },
              title: el.title,
              description: el.description,
            };
            if (isFellowship) {
              return (
                <Marker
                  key={id}
                  coordinate={marker.latlng}
                  pinColor={markerColor}
                  title={marker.title}
                  description={marker.description}
                  onPress={() => {
                    if (el.created_by !== firebase.auth().currentUser.uid) {
                      return this.setState({ details: el, showDetais: true });
                    }
                    this.setState({
                      pickedLocation: el.location,
                      title: el.title,
                      date: formatDate(el.starting_date.toDate()),
                      expiryDate: formatDate(el.end_date.toDate()),
                      eventDetails: el.description,
                      type:
                        el.classification_id === "CIwRusFj5lv1Zt7FCXrp"
                          ? "fellowship"
                          : "function",
                      editMode: true,
                      eventId: el.id,
                      showDetais: false,
                      isAddEvent: false,
                    });
                  }}
                >
                  <Pin color={markerColor} />
                </Marker>
              );
            }
            return (
              <Marker
                key={id}
                coordinate={marker.latlng}
                pinColor={markerColor}
                title={marker.title}
                description={marker.description}
                onPress={() => {
                  if (el.created_by !== firebase.auth().currentUser.uid) {
                    return this.setState({ details: el, showDetais: true });
                  }
                  this.setState({
                    pickedLocation: el.location,
                    title: el.title,
                    date: formatDate(el.starting_date.toDate()),
                    expiryDate: formatDate(el.end_date.toDate()),
                    eventDetails: el.description,
                    type:
                      el.classification_id === "CIwRusFj5lv1Zt7FCXrp"
                        ? "fellowship"
                        : "function",
                    editMode: true,
                    eventId: el.id,
                    showDetais: false,
                    isAddEvent: false,
                  });
                }}
              />
            );
          })}
        </MapView>
        {!showDetais && !isAddEvent && (
          <View style={styles.addContainer}>
            <Feather
              name="plus"
              size={32}
              color="#fff"
              onPress={() => {
                this.setState((prevState) => {
                  return { isAddEvent: true, editMode: false };
                });
              }}
            />
          </View>
        )}

        {showDetais && details && (
          <View
            style={{
              ...styles.detailsContainer,
              backgroundColor: canceled ? "#FF0049" : "#00FB00",
            }}
          >
            <View>
              <Text style={styles.title}>{details.title}</Text>
              <Text style={styles.description}>{details.description}</Text>
              {!canceled && (
                <Text style={styles.dates}>
                  <Text style={styles.label}>Starting date: </Text>
                  {`${formatDate(details.starting_date.toDate())}`}
                </Text>
              )}
              {!canceled && (
                <Text style={styles.dates}>
                  <Text style={styles.label}>End date: </Text>
                  {`${formatDate(details.end_date.toDate())}`}
                </Text>
              )}
              {canceled && (
                <Text style={styles.dates}>
                  <Text style={styles.label}>Status: </Text>Cancelled
                </Text>
              )}
            </View>
            <TouchableWithoutFeedback
              onPress={() =>
                this.setState({ details: null, showDetais: false })
              }
            >
              <View style={styles.closeContainer}>
                <AntDesign name="close" size={32} color="#fff" />
              </View>
            </TouchableWithoutFeedback>
          </View>
        )}
        {isAddEvent === true || editMode === true ? (
          <View style={styles.card}>
            <KeyboardAwareScrollView>
              <KeyboardAvoidingView
                behavior="padding"
                keyboardVerticalOffset={30}
              >
                <View style={styles.cover}>
                  <Text style={styles.text}>Title:</Text>
                  <View style={styles.nameInput}>
                    <TextInput
                      onChangeText={(text) => this.setState({ title: text })}
                      placeholder="Enter Name"
                      style={styles.input}
                      value={this.state.title}
                    />
                  </View>
                </View>
                <View style={styles.cover}>
                  <Text style={styles.text}>type:</Text>
                  <RadioGroup
                    style={{ flexDirection: "row", marginTop: 8, padding: 5 }}
                    defaultChoice={this.state.typeIndex}
                    onChoose={(value, index) =>
                      this.setState({ type: value, typeIndex: index })
                    }
                  >
                    <RadioButton
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      value={"fellowship"}
                    >
                      <Radio />
                      <Text style={{ paddingHorizontal: 10, color: "#fff" }}>
                        fellowship
                      </Text>
                    </RadioButton>
                    <RadioButton
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      value={"function"}
                    >
                      <Radio />
                      <Text style={{ paddingHorizontal: 10, color: "#fff" }}>
                        function
                      </Text>
                    </RadioButton>
                  </RadioGroup>
                </View>
                <View style={styles.cover}>
                  <Text style={styles.text}>Details:</Text>
                  <View style={styles.nameInput}>
                    <TextInput
                      onChangeText={(text) =>
                        this.setState({ eventDetails: text })
                      }
                      placeholder="Enter details"
                      style={styles.input}
                      value={this.state.eventDetails}
                    />
                  </View>
                </View>
                <View style={styles.cover}>
                  <Text style={styles.text}>Location:</Text>
                  <View style={styles.nameInput}>
                    <TextInput
                      placeholder="choose Location"
                      style={styles.input}
                      value={this.state.address}
                    />
                    <MaterialIcons
                      style={styles.icon}
                      name="location-on"
                      onPress={() => {
                        this.props.navigation.navigate("PickLocation");
                      }}
                      size={28}
                      color="#fff"
                    />
                  </View>
                </View>
                <View style={styles.cover}>
                  <Text style={styles.text}>date:</Text>

                  <DatePicker
                    style={{ padding: 5, width: "75%", marginTop: 5 }}
                    date={moment(this.state.date)}
                    mode="datetime"
                    placeholder="select date"
                    format="LLLL"
                    minDate={new Date()}
                    maxDate="2030-01-01"
                    confirmBtnText="Confirm"
                    cancelBtnText="Cancel"
                    is24Hour={false}
                    showIcon={false}
                    customStyles={{
                      dateIcon: {
                        position: "absolute",
                        left: 0,
                        // top: 4,
                        marginLeft: 0,
                        // color: Colors.primary,
                      },
                      dateText: {
                        color: "#fff",
                        marginLeft: -15,
                      },
                      placeholderText: {
                        color: "#fff",
                        marginLeft: -15,
                      },
                      dateInput: {
                        flexGrow: 1,
                        alignItems: "center",
                        borderRadius: 10,
                        marginRight: 10,
                        backgroundColor: "rgba(0, 8, 228, 0.9)",
                        flex: 1,
                        padding: 5,
                        fontSize: 16,
                        lineHeight: 16,
                        paddingLeft: 10,
                        paddingTop: 6,
                        paddingBottom: 6,
                        paddingRight: 0,
                        color: "white",
                        borderWidth: 0.8,
                        borderColor: "#fff",
                      },
                      // ... You can check the source to find the other keys.
                    }}
                    onDateChange={(date) => {
                      this.setState({ date: date });
                    }}
                  />
                </View>
                <View style={styles.cover}>
                  <Text style={styles.text}>expiry date:</Text>

                  <DatePicker
                    style={{ padding: 5, width: "75%", marginTop: 5 }}
                    date={moment(this.state.expiryDate)}
                    mode="datetime"
                    placeholder="choose end date"
                    format="LLLL"
                    minDate={new Date()}
                    maxDate="2030-01-01"
                    confirmBtnText="Confirm"
                    cancelBtnText="Cancel"
                    is24Hour={false}
                    showIcon={false}
                    customStyles={{
                      dateIcon: {
                        position: "absolute",
                        left: 0,
                        // top: 4,
                        marginLeft: 0,
                        // color: Colors.primary,
                      },
                      dateText: {
                        color: "#fff",
                        marginLeft: -15,
                      },
                      placeholderText: {
                        color: "#fff",
                        marginLeft: -15,
                      },
                      dateInput: {
                        flexGrow: 1,
                        alignItems: "center",
                        borderRadius: 10,
                        marginRight: 10,
                        backgroundColor: "rgba(0, 8, 228, 0.9)",
                        flex: 1,
                        padding: 5,
                        fontSize: 16,
                        lineHeight: 16,
                        paddingLeft: 15,
                        paddingTop: 6,
                        paddingBottom: 6,
                        paddingRight: 0,
                        color: "white",
                        borderWidth: 0.8,
                        borderColor: "#fff",
                      },
                      // ... You can check the source to find the other keys.
                    }}
                    onDateChange={(date) => {
                      this.setState({ expiryDate: date });
                    }}
                  />
                </View>

                <NewButton
                  style={{
                    marginTop: 5,
                    marginLeft: Dimensions.get("window").width * 0.33,
                    marginBottom: 4,
                  }}
                  width={100}
                  textSize={13}
                  padding={10}
                  text="post"
                  onPress={() => {
                    this.addEventsHandler();
                  }}
                />
                {/* </View> */}
              </KeyboardAvoidingView>
            </KeyboardAwareScrollView>
          </View>
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",

    // borderRadius: 25,
    // overflow: "hidden",
  },
  mapStyle: {
    width: "100%",
    height: "100%",
  },
  addContainer: {
    zIndex: 2,
    position: "absolute",
    bottom: 40,
    right: 20,
    backgroundColor: "#4291ee",
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  detailsContainer: {
    position: "absolute",
    width: Dimensions.get("window").width - 20,
    bottom: 40,
    zIndex: 2,
    left: 0,
    marginHorizontal: 10,
    backgroundColor: "#00FB00",
    borderRadius: 5,
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontFamily: "Roboto",
    fontSize: 15,
    fontWeight: "900",
    color: "#fff",
    marginBottom: 8,
  },
  label: {
    fontFamily: "Roboto",
    fontSize: 14,
    color: "#fff",
    fontWeight: "900",
  },
  description: {
    fontFamily: "Roboto",
    fontSize: 13,
    fontWeight: "300",
    color: "#fff",
    width: Dimensions.get("window").width - 100,
    marginBottom: 4,
  },
  dates: {
    fontFamily: "Roboto",
    fontSize: 14,
    color: "#fff",
  },
  closeContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  card: {
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.26,
    shadowRadius: 8,
    backgroundColor: "rgba(0, 8, 228, 0.8)",
    height: Dimensions.get("window").height * 0.6,
    flexDirection: "column",
    elevation: 5,
    borderRadius: 18,
    backgroundColor: "rgba(0, 8, 228, 0.9)",
    zIndex: 10000,
    position: "absolute",
    bottom: Dimensions.get("window").height * 0.1,
  },
  content: {
    flexDirection: "row",
    padding: 20,
  },

  nameInput: {
    flexDirection: "row",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
    width: "75%",
    marginTop: 5,
  },
  input: {
    flexGrow: 1,
    alignItems: "center",
    borderRadius: 10,
    marginRight: 10,
    backgroundColor: "rgba(0, 8, 228, 0.9)",
    flex: 1,
    padding: 5,
    fontSize: 16,
    lineHeight: 16,
    paddingLeft: 10,
    paddingTop: 6,
    paddingBottom: 6,
    paddingRight: 0,
    color: "white",
    borderWidth: 0.8,
    borderColor: "#fff",
  },
  text: {
    fontSize: 16,
    padding: 10,
    color: "#fff",
    marginTop: 8,
  },
  cover: {
    flexDirection: "row",
  },
  btn: {
    // width: Dimensions.get("window").width * 0.4,
    borderRadius: 100,
    // shadowColor: "black",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.26,
    // shadowRadius: 8,
    elevation: 5,
    marginLeft: Dimensions.get("window").width * 0.4,
    marginTop: 5,
    marginBottom: 4,
  },
  icon: {
    padding: 5,
  },
});

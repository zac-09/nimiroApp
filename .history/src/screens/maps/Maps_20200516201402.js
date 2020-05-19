import React from "react";
import { View } from "native-base";
import MapView, { Marker } from "react-native-maps";
import {
  StyleSheet,
  Platform,
  Text,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";
import Constants from "expo-constants";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
import * as firebase from "firebase";
import Pin from "../../components/markers/Pin";
import { Feather, AntDesign } from "@expo/vector-icons";
import { formatDate } from "../../utils/Validations";

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
    };

    this.threadsRef = firebase.firestore().collection("maps");

    this.threadsUnscribe = "null";
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
        data.push(marker);
      });
    } catch (error) {
      this.setState({ errorMessage: error.message });
    }

    // console.log("these are the markers",data);
    this.setState({ markers: data, errorMessage: null });
  };

  render() {
    const { location, markers, showDetais, details } = this.state;
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
                    onPress={() =>
                      this.setState({ details: el, showDetais: true })
                    }
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
                  onPress={() =>
                    this.setState({ details: el, showDetais: true })
                  }
                />
              );
            })}
          </MapView>
          {!showDetais && (
            <View style={styles.addContainer}>
              <Feather name="plus" size={32} color="#fff" />
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
});

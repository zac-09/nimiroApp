import React from "react";
import { TouchableOpacity, Image, StyleSheet } from "react-native";

const MapPreview = (props) => {
  let imagePreviewUrl;

  if (props.location) {
    imagePreviewUrl = `https://maps.googleapis.com/maps/api/staticmap?center=0.32740206163444174,32.59780179709196&zoom=14&size=400x200&maptype=roadmap&markers=color:red%7Clabel:A%7C0.32740206163444174,32.59780179709196&key=AIzaSyC2Czo7EVSMA3OvrBG8jkPfzRxguzXFy2w`;
  }
  //0.32740206163444174
  //32.59780179709196
  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={{ ...styles.mapPreview, ...props.style }}
    >
      {props.location ? (
        <Image style={styles.mapImage} source={{ uri: imagePreviewUrl }} />
      ) : (
        props.children
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  mapPreview: {
    justifyContent: "center",
    alignItems: "center",
  },
  mapImage: {
    width: "100%",
    height: "100%",
  },
});

export default MapPreview;

import { Platform } from "react-native";

function getHeaderContainerStyle(nomargin) {
  return {
    backgroundColor: "#E4E4E4",
    borderBottomColor: "transparent",
    boxShadow: "none",
    elevation: 0,
    ...Platform.select({
      android: { marginTop: nomargin ? 0 : 24 }
    })
  };
}

export default getHeaderContainerStyle;

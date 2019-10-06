import { Platform } from "react-native";

function getHeaderContainerStyle(nomargin) {
  return {
    backgroundColor: "transparent",
    borderBottomColor: "transparent",
    boxShadow: "none",
    elevation: 0,
    ...Platform.select({
      android: { marginTop: nomargin ? 0 : 24 }
    })
  };
}

export default getHeaderContainerStyle;

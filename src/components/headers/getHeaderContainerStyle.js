import { Platform } from "react-native";

function getHeaderContainerStyle(nomargin) {
  return {
    backgroundColor: "blue",
    ...Platform.select({
      android: { marginTop: nomargin ? 0 : 24 }
    })
  };
}

export default getHeaderContainerStyle;

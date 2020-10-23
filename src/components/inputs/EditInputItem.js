import React, { useReducer, useEffect } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

const INPUT_CHANGE = "INPUT_CHANGE";
const INPUT_BLUR = "INPUT_BLUR";

const inputReducer = (state, action) => {
  switch (action.type) {
    case INPUT_CHANGE:
      return {
        ...state,
        value: action.value,
        isValid: action.isValid,
      };
    case INPUT_BLUR:
      return {
        ...state,
        touched: true,
      };
    default:
      return state;
  }
};

const Input = (props) => {
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.initialValue ? props.initialValue : "",
    isValid: props.initiallyValid,
    touched: false,
  });

  const { onInputChange, id } = props;

  useEffect(() => {
    if (inputState.touched) {
      onInputChange(id, inputState.value, inputState.isValid);
    }
  }, [inputState, onInputChange, id]);

  const textChangeHandler = (text) => {
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let isValid = true;
    if (props.required && text.trim().length === 0) {
      isValid = false;
    }
    if (props.email && !emailRegex.test(text.toLowerCase())) {
      isValid = false;
    }
    if (props.min != null && +text < props.min) {
      isValid = false;
    }
    if (props.max != null && +text > props.max) {
      isValid = false;
    }
    if (props.minLength != null && text.length < props.minLength) {
      isValid = false;
    }

    dispatch({ type: INPUT_CHANGE, value: text, isValid: isValid });
  };

  const lostFocusHandler = () => {
    dispatch({ type: INPUT_BLUR });
  };

  return (
    <View style={props.style}>
      <View style={styles.fieldNameContainer}>
        <Text style={styles.fieldText}>{props.field}</Text>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          {...props}
          style={styles.input}
          value={inputState.value}
          onChangeText={textChangeHandler}
          onBlur={lostFocusHandler}
          placeholderTextColor="#ccc"
        />
      </View>
      {!inputState.isValid && inputState.touched && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{props.errorText}</Text>
        </View>
      )}
      {props.passwordError && inputState.touched && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{props.passwordErrorMesa}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    width: "100%",
    flexDirection: "row",
    borderRadius: 6,
    alignItems: "center",
    // backgroundColor: "#fff",
    padding: 5,
    marginVertical: 3,
    // borderColor: "#fff",
    // borderWidth: 2,
    // zIndex:0
    borderBottomColor: "#fff",
    borderBottomWidth: 0.5,
  },
  input: {
    flexGrow: 1,
    alignItems: "center",
    borderRadius: 15,
    marginRight: 10,
    // backgroundColor: "#fff",
    flex: 1,
    padding: 5,
    marginLeft: 5,
    fontSize: 16,
    lineHeight: 16,
    paddingLeft: 10,
    paddingTop: 6,
    paddingBottom: 6,
    color: "#ccc",
  },
  errorContainer: {
    marginVertical: 3,
  },
  errorText: {
    // fontFamily: "lato",
    color: "red",
    fontSize: 13,
  },
  fieldNameContainer: {},
  fieldText: {
    color: "#fff",
    // fontFamily: "nunito",
    fontSize: 16,
  },
});

export default Input;

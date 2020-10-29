import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";
import TodoItem from "./../../components/listitems/TodoItem";
import NewButton from "./../../components/buttons/NewButton";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import NewModal from "../../components/modal/NewModal";
import firebaseSDK from "../../backend/Firebase";
import * as firebase from "firebase";
import Toast from "react-native-root-toast";

const TodoScreen = (props) => {
  const [modalVisible, setIsModalVisible] = useState(false);
  const [iseditMode, setIsEditMode] = useState(false);
  const [tasksToBeEdited, setTasksToBeEdited] = useState([]);
  const [task, SetTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const uid = firebase.auth().currentUser.uid;
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
  const addTaskHandler = (taskId) => {
    // if (!iseditMode) {
    //   return;
    // }
    setIsEditMode(true);
    let alreadyAdded;
    // console.log("the task is is",taskId);

    tasksToBeEdited.forEach(function (task) {
      if (task.id === taskId) {
        console.log("the full task is", task);
        console.log("the task id is", taskId);
        alreadyAdded = true;
      }
    });
    if (!alreadyAdded) {
      let added = tasks.map((el) =>
        el.id === taskId ? { ...el, isAdded: true } : el
      );

      // console.log("these are the updataed added", added);
      setTasks((currentMembers) =>
        currentMembers.map((el) =>
          el.id === taskId ? { ...el, isAdded: true } : el
        )
      );
      // console.log(tasksToBeEdited);
      return setTasksToBeEdited((currentParticipants) => [
        ...currentParticipants,
        { id: taskId },
      ]);
      console.log("tasks to be edeyed");
    }

    removeTaskHandler(taskId);
    if (tasksToBeEdited.length < 1) {
      setIsEditMode(false);
    }
  };

  const removeTaskHandler = (taskId) => {
    let added = tasks.map((el) =>
      el.id === taskId ? { ...el, isAdded: false } : el
    );

    setTasks((currentMembers) =>
      currentMembers.map((el) =>
        el.id === taskId ? { ...el, isAdded: false } : el
      )
    );
    setTasksToBeEdited((currentParticipants) => {
      console.log("removed sucessfully");

      return currentParticipants.filter(
        (participant) => participant.id !== taskId
      );
    });
    if (!tasksToBeEdited) {
      setIsEditMode(false);
    }
  };

  const load = async () => {
    await firebase
      .firestore()
      .collection("todo_list")
      .doc(uid)
      .collection("tasks")
      .orderBy("date", "desc")
      .onSnapshot(fetchTasks);
  };
  const fetchTasks = async (snap) => {
    const data = [];

    snap.forEach(async (doc) => {
      // console.log("reached")
      const task = doc.data();
      task.date = doc.data().date.toDate();
      task.id = doc.id;
      //   console.log("reached", task);
      data.push(task);
    });
    const newData = data.map((el) => ({ ...el, isAdded: false }));
    setTasks(newData);

    // console.log("the data fetched is ", data);
    return data;
  };
  const deleteHandler = async () => {
    tasksToBeEdited.forEach(async (task) => {
      await firebase
        .firestore()
        .collection("todo_list")
        .doc(uid)
        .collection("tasks")
        .doc(task.id)
        .delete()
        .then(function () {
          console.log("Document successfully deleted!");
        })
        .catch(function (error) {
          console.error("Error removing document: ", error);
        });
    });
    setTasksToBeEdited([]);
    showToast("task successfully deleted");
  };
  const editHandler = async () => {
    if (tasksToBeEdited.length > 1) {
      return;
    }
    const newtask = tasks.filter(
      (participant) => participant.id == tasksToBeEdited[0].id
    );
    // console.log("the new task us", newTAsk[0]);
    // return
    SetTask(newtask[0].content);
    setIsModalVisible(true);
  };
  const onSubmitHandler = async () => {
    const uid = await firebase.auth().currentUser.uid;

    if (iseditMode) {
      console.log("edit mode true");
      tasksToBeEdited.forEach(async (arrayTask) => {
        await firebase
          .firestore()
          .collection("todo_list")
          .doc(uid)
          .collection("tasks")
          .doc(arrayTask.id)
          .update({ content: task });
      });
      setIsModalVisible(false);
      SetTask("");
      setTasksToBeEdited([]);
      showToast("task successfullly edited");
      return;
    }
    await firebase
      .firestore()
      .collection("todo_list")
      .doc(uid)
      .collection("tasks")
      .add({
        date: new Date(),
        content: task,
      });
    setIsModalVisible(false);
    SetTask("");
    showToast("task successfully created");
  };
  useEffect(() => {
    if (tasksToBeEdited.length < 1) {
      setIsEditMode(false);
    }
  }, [tasksToBeEdited]);
  useEffect(() => {
    async function getData() {
      await load();
    }
    getData();
    // console.log("use effect",fetchTasks())
  }, []);

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        setIsModalVisible(false);
      }}
    >
      <View style={styles.screen}>
        {iseditMode ? (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              padding: 20,
              backgroundColor: "rgba(0,0,0,.7)",
            }}
          >
            {tasksToBeEdited.length < 2 && (
              <TouchableOpacity
                style={styles.icon}
                onPress={() => {
                  // props.navigation.goBack();
                  editHandler();
                }}
              >
                <Text style={{ color: "#fff", fontSize: 16 }}>Edit</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.icon}
              onPress={() => {
                // props.navigation.goBack();
                deleteHandler();
              }}
            >
              <Text style={{ color: "red", fontSize: 16 }}>Delete</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            <TouchableOpacity
              style={styles.icon}
              onPress={() => {
                props.navigation.goBack();
              }}
            >
              <AntDesign name="arrowleft" color="#fff" size={25} />
            </TouchableOpacity>
            <View style={styles.title}>
              <Text style={styles.titleText}>Todo List</Text>
            </View>
          </View>
        )}
        <FlatList
          data={tasks}
          keyExtractor={(item, index) => item.id}
          renderItem={(itemData) => (
            <TodoItem
              isAdded={itemData.item.isAdded}
              content={itemData.item.content}
              date={itemData.item.date}
              onLongPress={() => {
                setIsEditMode(true);

                console.log("long press detected");
                addTaskHandler(itemData.item.id);
              }}
              onPress={() => {
                addTaskHandler(itemData.item.id);
              }}

              // counter={itemData.item.counter}
            />
          )}
        />

        {modalVisible && (
          <View style={styles.modal}>
            <NewModal>
              <Text style={{ fontSize: 18, padding: 20 }}>Add New Task</Text>
              <KeyboardAvoidingView
                behavior="padding"
                style={{ width: "100%" }}
              >
                <View style={styles.inputContainerxBox}>
                  <TextInput
                    style={styles.input}
                    placeholder="About you (optional)"
                    value={task}
                    onChangeText={(text) => SetTask(text)}
                  />
                </View>
              </KeyboardAvoidingView>
              <View style={{ alignSelf: "center" }}>
                <NewButton
                  text="save"
                  width={100}
                  onPress={() => {
                    onSubmitHandler();
                  }}
                />
              </View>
            </NewModal>
          </View>
        )}
        <View
          style={{
            zIndex: 2,
            position: "absolute",
            bottom: 40,
            right: 20,
            backgroundColor: "#FB38A0",
            width: 50,
            height: 50,
            borderRadius: 25,
            overflow: "hidden",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TouchableWithoutFeedback
            onPress={() => setIsModalVisible((prevState) => !prevState)}
          >
            <Ionicons name="ios-add" size={32} color="#fff" />
          </TouchableWithoutFeedback>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  title: {
    // alignItems: 'center',
    justifyContent: "center",
    position: "absolute",
    top: 0,
    backgroundColor: "rgba(0,0,0,.7)",
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
  modal: {
    // flexGrow: 1,
    justifyContent: "center",
    // alignItems:"center",
    zIndex: 100002,
    position: "absolute",
    // bottom: Dimensions.get("window").height * 0.15,
    // left: Dimensions.get("window").width * 0.12,
    width: 350,
    alignSelf: "center",
    marginTop: Dimensions.get("window").height * 0.24,
    // marginTop: -395,
  },
  inputContainerxBox: {
    flexDirection: "column",
    borderRadius: 14,
    // alignItems: "center",
    backgroundColor: "transparent",
    padding: 10,
    marginVertical: 10,
    height: 230,
    width: "90%",
    borderColor: "black",
    borderWidth: 2,
    marginLeft: 10,
    // backgroundColor: "#fff",
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
    color: "black",
  },
});
export default TodoScreen;

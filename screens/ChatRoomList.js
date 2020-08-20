import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Button,
  FlatList,
} from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import HeaderButton from "../components/UI/HeaderButton";
import { useSelector, useDispatch } from "react-redux";
import * as chatlistActions from "../store/actions/chatlist";
import Colors from "../constants/Color";
import ChatGroupItem from "../components/UI/chatGroupItem";

const ChatRoomListScreen = (props) => {
  const userChatGroups = useSelector((state) => state.chatList.chatGroupList);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const loadGroups = useCallback(async () => {
    // setIsRefreshing(true);
    setError(null);
    try {
      await dispatch(chatlistActions.setChatGroups());
    } catch (err) {
      setError(err.message);
    }
    // setIsRefreshing(false);
  }, [dispatch, setError]);
  useEffect(() => {
    setIsLoading(true);
    loadGroups().then(() => {
      setIsLoading(false);
    });
  }, [dispatch, loadGroups]);
  useEffect(() => {
    const willFocusSub = props.navigation.addListener("willFocus", loadGroups);

    return () => {
      willFocusSub.remove();
    };
  }, [loadGroups]);
  if (error) {
    return (
      <View style={styles.centred}>
        <Text style={{ color: "red", fontSize: 20 }}>An Error Occured!</Text>
        <Button title={"TRY AGAIN"} onPress={loadGroups} />
      </View>
    );
  }
  if (isLoading) {
    return (
      <View style={styles.centred}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }
  return (
    <View style={styles.screen}>
      <FlatList
        style={{ flex: 1 }}
        data={userChatGroups}
        keyExtractor={(item) => item.groupName}
        renderItem={(itemData) => (
          <ChatGroupItem
            title={itemData.item.groupName}
            people={itemData.item.users.length}
            onPress={() => {
              props.navigation.navigate("ChatScreen", {
                groupName: itemData.item.groupName,
              });
            }}
          />
        )}
      />
    </View>
  );
};

ChatRoomListScreen.navigationOptions = (navData) => {
  return {
    headerTitle: "Your Chat Groups",
    headerRight: () => {
      return (
        <HeaderButtons HeaderButtonComponent={HeaderButton}>
          <Item
            title="Add"
            iconName={Platform.OS === "android" ? "md-add" : "ios-add"}
            onPress={() => {
              navData.navigation.navigate("NewChat");
            }}
          />
        </HeaderButtons>
      );
    },
  };
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  centred: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ChatRoomListScreen;

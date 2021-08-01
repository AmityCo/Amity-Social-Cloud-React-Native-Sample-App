import React, { useState, useEffect } from 'react';
import { Pressable, View, StyleSheet, ScrollView } from 'react-native';
import { Surface, ActivityIndicator, Text } from 'react-native-paper';
import { observeUser, getCommunity } from '@amityco/ts-sdk';

const Community = ({
  route: {
    params: { community: communityFromParent },
  },
  navigation,
  ...args
}) => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);
  const [community, setCommunity] = useState({});

  useEffect(() => {
    console.log(2, !!community?.communityId);
    if (community?.communityId) {
      observeUser(community.userId, setUser);
    }
  }, [community]);

  const fetCommunity = async () => {
    console.log(1);
    setLoading(true);
    try {
      const result = await getCommunity(communityFromParent.communityId);

      setCommunity(result);
    } catch (error) {
      //  console.error(error, error.name, error.message, error.toString());
      if (error.response) {
        // Request made and server responded
        console.log('error response', error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        console.log('error request', error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('error message', error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetCommunity();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log(community, user, args);

  return (
    // <Modal
    //   animationType="slide"
    //   transparent
    //   visible={visible}
    //   onClose={onClose}
    //   onRequestClose={onClose}
    // >
    <Surface style={styles.content}>
      <View style={styles.top}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            paddingTop: 15,
            paddingHorizontal: 15,
          }}
        >
          {loading ? (
            <ActivityIndicator />
          ) : (
            <>
              <Text style={{ fontSize: 20 }}>{community.displayName}</Text>
              <Text style={{ fontSize: 15, color: 'gray', marginBottom: 15 }}>{user.userId}</Text>
            </>
          )}
        </ScrollView>
      </View>
      <View style={styles.bottom}>
        <Pressable style={styles.btn} onPress={() => navigation.goBack()}>
          <Text style={styles.btnText}>Back</Text>
        </Pressable>
      </View>
    </Surface>
    // </Modal>
  );
};

export const styles = StyleSheet.create({
  content: {
    flex: 1,
    // alignItems: 'center',
    // backgroundColor: 'white',
    // marginTop: 50,
    // borderTopRightRadius: 15,
    // borderTopLeftRadius: 15,
    // flexGrow: 1,
  },

  top: { flex: 8, width: '100%' },
  bottom: { flex: 1, alignItems: 'center' },

  btn: {
    backgroundColor: '#F194FF',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    width: 100,
    backgroundColor: '#2196F3',
  },
  btnText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },

  // content: {
  //   width: "100%",
  //   alignItems: "center",
  // },

  // postInput: {
  //   width: "90%",
  //   height: 100,
  //   textAlignVertical: "top",
  //   fontSize: 18,
  //   backgroundColor: "#F1F1F1",
  //   padding: 10,
  //   marginBottom: 20,
  //   borderRadius: 5,
  // },

  // filesContainer: {
  //   width: "100%",
  //   marginBottom: 15,
  // },

  // filesArea: {
  //   justifyContent: "flex-start",
  //   alignSelf: "center",
  //   flexDirection: "row",
  //   flexWrap: "wrap",
  //   width: "90%",
  //   // backgroundColor: "black",
  // },

  // btnArea: {
  //   width: "100%",
  //   flexDirection: "row",
  //   justifyContent: "space-evenly",
  // },
  // btn: {
  //   backgroundColor: "#F194FF",
  //   borderRadius: 20,
  //   padding: 10,
  //   elevation: 2,
  //   width: 100,
  //   backgroundColor: "#2196F3",
  // },
  // btnText: {
  //   color: "white",
  //   fontWeight: "bold",
  //   textAlign: "center",
  // },
});

export default Community;

import React, { useState, useEffect } from "react";
import { Header } from "react-native-elements";
import { View, FlatList, StyleSheet, ActivityIndicator } from "react-native";

import { queryCommunities } from "@amityco/ts-sdk";
import { client } from "../../LoginPage";

import Community from "./Community";
import CommunityItem from "./CommunityItem";

function CommunitiesScreen() {
  const [loading, setLoading] = useState(false);
  const [community, setCommunity] = useState({});
  const [communities, setCommunities] = useState([]);

  useEffect(() => {
    onQueryCommunities();
  }, []);

  const onQueryCommunities = async () => {
    setLoading(true);

    try {
      const result = await queryCommunities();

      setCommunities(result);

      // setCommunities((cms) => [...cms, ...result]);
    } catch (error) {
      //  console.error(error, error.name, error.message, error.toString());
      if (error.response) {
        // Request made and server responded
        console.log("error response", error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        console.log("error request", error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log("error message", error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Header
        backgroundColor="#26cb7c"
        centerComponent={{ text: "Communities", style: { color: "#fff" } }}
      />
      {loading ? (
        <ActivityIndicator style={{ marginTop: 25 }} />
      ) : (
        <FlatList
          style={styles.feed}
          data={communities}
          renderItem={({ item }) => (
            <CommunityItem
              community={item}
              onUpdate={onQueryCommunities}
              onViewCommunity={setCommunity}
            />
          )}
          keyExtractor={(item) => item.communityId}
          showsVerticalScrollIndicator={false}
        ></FlatList>
      )}

      {!!community?.communityId && (
        <Community community={community} onClose={() => setCommunity({})} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EBECF4",
  },
  header: {
    paddingTop: 64,
    paddingBottom: 16,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#EBECF4",
    shadowColor: "#454D65",
    shadowOffset: { height: 5 },
    shadowRadius: 15,
    shadowOpacity: 0.2,
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "500",
  },
  feed: {
    marginHorizontal: 16,
  },
  feedItem: {
    backgroundColor: "#FFF",
    borderRadius: 5,
    padding: 8,
    flexDirection: "row",
    marginVertical: 8,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 16,
  },
  name: {
    fontSize: 15,
    fontWeight: "500",
    color: "#454D65",
  },
  timestamp: {
    fontSize: 11,
    color: "#C4C6CE",
    marginTop: 4,
  },
  post: {
    marginTop: 16,
    fontSize: 14,
    color: "#838899",
  },
  postImage: {
    width: undefined,
    height: 150,
    borderRadius: 5,
    marginVertical: 16,
  },
});

export default CommunitiesScreen;

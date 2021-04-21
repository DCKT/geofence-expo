import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";

TaskManager.defineTask("test", ({ data: { eventType, region }, error }) => {
  if (error) {
    // check `error.message` for more details.
    return;
  }
  if (eventType === Location.LocationGeofencingEventType.Enter) {
    console.log("You've entered region:", region);
  } else if (eventType === Location.LocationGeofencingEventType.Exit) {
    console.log("You've left region:", region);
  }
});

export default function App() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }
      let bg = await Location.requestBackgroundPermissionsAsync();
      if (bg.status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      await Location.startGeofencingAsync("test", [
        {
          identifier: "test-1",
          latitude: -21.39742,
          longitude: -154.39865,
          radius: 200,
        },
      ]);
    })();
  }, []);

  let text = "Waiting..";
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.paragraph}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

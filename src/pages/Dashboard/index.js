import React, { useState, useEffect, Component } from "react";
import {
  Alert,
  Linking,
  Dimensions,
  Text,
  View,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import scan from "../../assets/scan.png";

import { Container, Scan } from "./styles";
import { Camera } from "expo-camera";

const { width } = Dimensions.get("window");

export default function Dashboard() {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [scanned, setScanned] = useState(null);
  const [lastScannedUrl, setLastScannedUrl] = useState(null);

  const { width } = Dimensions.get("window");
  const qrSize = width * 0.7;

  const requestCameraPermission = async () => {
    const { status } = await Camera.requestPermissionsAsync();

    setHasCameraPermission(status === "granted");
  };

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);

    setLastScannedUrl(data);
    setScanned(false);
  };

  const maybeRenderUrl = () => {
    if (!lastScannedUrl) {
      return;
    }

    return (
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.url} onPress={handlePressUrl}>
          <Text numberOfLines={1} style={styles.urlText}>
            {lastScannedUrl}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={handlePressCancel}
        >
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const handlePressUrl = () => {
    Alert.alert(
      "Abrir o Link?",
      lastScannedUrl,
      [
        {
          text: "Sim",
          onPress: () => Linking.openURL(lastScannedUrl),
        },
        { text: "Não", onPress: () => {} },
      ],
      { cancellable: false }
    );
  };

  const handlePressCancel = () => {
    setLastScannedUrl(null);
  };

  useEffect(() => {
    requestCameraPermission();
  }, []);

  const opacity = "rgba(0, 0, 0, .6)";

  const styles = StyleSheet.create({
    container: {
      width: "100%",
      height: "100%",
    },
    topBar: {
      position: "absolute",
      backgroundColor: "rgba(103,225,49,0.5)",

      top: 0,
      width: "100%",
      padding: 5,
      flexDirection: "row",
      justifyContent: "center",
    },
    bottomBar: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: "rgba(103,225,49,0.5)",
      padding: 15,
      flexDirection: "row",
    },
    url: {
      flex: 1,
    },
    urlText: {
      color: "#fff",
      fontSize: 20,
    },
    scanText: {
      color: "#fff",
      fontSize: 25,
      marginTop: 15,
      height: 50,
    },
    cancelButton: {
      marginLeft: 10,
      alignItems: "center",
      justifyContent: "center",
    },
    cancelButtonText: {
      color: "rgba(255,255,255,0.8)",
      fontSize: 18,
    },
    cameraContainer: {
      backgroundColor: "#fff",
    },
  });

  return (
    <Container>
      <Camera
        ratio="16:9"
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={[StyleSheet.absoluteFillObject, styles.container]}
      ></Camera>

      <Scan source={scan} />

      <View style={styles.topBar}>
        <Text numberOfLines={1} style={styles.scanText}>
          Escaneie o QR CODE
        </Text>
      </View>

      {maybeRenderUrl()}

      <StatusBar hidden />
    </Container>
  );
}

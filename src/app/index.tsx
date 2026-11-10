import React, { useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert
} from "react-native";

import {
  CameraView,
  useCameraPermissions
} from "expo-camera";

import { router } from "expo-router";

import {
  Screen,
  Button,
  C
} from "../components/ui";

import { masks } from "../data/masks";

export default function HomeScreen() {
  const [permission, requestPermission] =
    useCameraPermissions();

  const [scanning, setScanning] = useState(false);

  const [scanned, setScanned] = useState(false);

  const handleBarcode = ({ data }: { data: string }) => {
    if (scanned) return;

    setScanned(true);

    const found = masks.find(
      item =>
        data.toUpperCase().includes(item.qrValue) ||
        item.id === data.toLowerCase()
    );

    setScanning(false);

    if (found) {
      router.push(`/mask/${found.id}`);
    } else {
      Alert.alert(
        "QR Tidak Ditemukan",
        "QR Code belum tersedia dalam data dummy."
      );
    }
  };

  if (scanning) {
    if (!permission?.granted) {
      return (
        <Screen>
          <Text style={styles.title}>
            Akses Kamera
          </Text>

          <Text style={styles.body}>
            Izinkan aplikasi menggunakan kamera
            untuk memindai QR Code topeng.
          </Text>

          <Button
            title="Izinkan Kamera"
            onPress={requestPermission}
          />

          <Button
            title="Kembali"
            secondary
            onPress={() => setScanning(false)}
            style={{ marginTop: 12 }}
          />
        </Screen>
      );
    }

    return (
      <View style={styles.cameraPage}>
        <CameraView
          style={StyleSheet.absoluteFill}
          facing="back"
          barcodeScannerSettings={{
            barcodeTypes: ["qr"]
          }}
          onBarcodeScanned={
            scanned ? undefined : handleBarcode
          }
        />

        <View style={styles.cameraOverlay}>
          <Text style={styles.cameraTitle}>
            Arahkan kamera ke QR Code
          </Text>

          <View style={styles.scanFrame} />

          <Pressable
            style={styles.close}
            onPress={() => {
              setScanning(false);
              setScanned(false);
            }}
          >
            <Text style={styles.closeText}>
              Tutup Pemindai
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <Screen>
      <View style={styles.top}>
        <Text style={styles.brand}>
          TOPENG MALANGAN
        </Text>

        <Text style={styles.kicker}>
          JELAJAHI CERITA DI BALIK TOPENG
        </Text>
      </View>

      <View style={styles.hero}>
        <Text style={styles.heroSmall}>
          WARISAN BUDAYA NUSANTARA
        </Text>

        <Text style={styles.heroTitle}>
          Scan Topeng
        </Text>

        <Text style={styles.heroDesc}>
          Arahkan kamera ke barcode atau QR
          di belakang topeng untuk melihat
          video dan informasi karakternya.
        </Text>

        <View style={styles.qrIcon}>
          <Text style={styles.qrSymbol}>
            ▦
          </Text>
        </View>

        <Button
          title="◎   Mulai Scan QR"
          onPress={() => {
            setScanned(false);
            setScanning(true);
          }}
          style={{ width: "100%" }}
        />
      </View>

      <View style={styles.bottom}>
        <Text style={styles.bottomTitle}>
          Kenali Karakter Topengmu
        </Text>

        <Text style={styles.body}>
          Tonton video, pelajari deskripsi,
          lalu ikuti kuis personal karakter.
        </Text>

        <Button
          title="Jelajahi Video Topeng  →"
          secondary
          onPress={() => router.push("/videos")}
          style={{ marginTop: 14 }}
        />

        <Button
          title="Mulai Kuis Karakter"
          onPress={() => router.push("/quiz")}
          style={{ marginTop: 10 }}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  top: {
    alignItems: "center",
    marginBottom: 18,
    marginTop: 8
  },

  brand: {
    fontSize: 15,
    letterSpacing: 3,
    color: C.brown,
    fontWeight: "900"
  },

  kicker: {
    fontSize: 9,
    letterSpacing: 1.5,
    color: C.muted,
    marginTop: 5
  },

  hero: {
    backgroundColor: C.sand,
    borderRadius: 24,
    padding: 22,
    alignItems: "center",
    minHeight: 370,
    justifyContent: "center"
  },

  heroSmall: {
    color: C.brown,
    fontWeight: "800",
    fontSize: 9,
    letterSpacing: 1.5
  },

  heroTitle: {
    fontSize: 30,
    fontWeight: "900",
    color: C.dark,
    marginTop: 8
  },

  heroDesc: {
    color: C.dark,
    textAlign: "center",
    lineHeight: 20,
    marginTop: 8,
    fontSize: 12
  },

  qrIcon: {
    width: 130,
    height: 130,
    backgroundColor: "#3D2B1F",
    borderRadius: 15,
    marginVertical: 20,
    alignItems: "center",
    justifyContent: "center"
  },

  qrSymbol: {
    fontSize: 75,
    color: "white"
  },

  bottom: {
    paddingTop: 22
  },

  bottomTitle: {
    color: C.dark,
    fontWeight: "800",
    fontSize: 19
  },

  body: {
    color: C.muted,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 8
  },

  title: {
    fontSize: 24,
    fontWeight: "800",
    color: C.dark,
    marginBottom: 12
  },

  cameraPage: {
    flex: 1,
    backgroundColor: "black"
  },

  cameraOverlay: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 70,
    paddingBottom: 55,
    backgroundColor: "#00000033"
  },

  cameraTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "800"
  },

  scanFrame: {
    width: 250,
    height: 250,
    borderWidth: 4,
    borderColor: "#FFF2D9",
    borderRadius: 22
  },

  close: {
    backgroundColor: C.brown,
    padding: 15,
    borderRadius: 12
  },

  closeText: {
    color: "white",
    fontWeight: "700"
  }
});
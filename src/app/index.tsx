
import { useEffect, useRef, useState } from "react";

import {
  ActivityIndicator,
  Alert,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  CameraView,
  useCameraPermissions,
} from "expo-camera";

import { router } from "expo-router";

import api from "../services/api";

// =====================================================
// WARNA FIGMA
// =====================================================

const COLORS = {
  background: "#F4E8D9",
  sand: "#E2B486",
  brown: "#8C4F2D",
  dark: "#3D2B1F",
  cream: "#FFF8EF",
  white: "#FFFFFF",
  muted: "#8C7768",
};

// =====================================================
// MENGAMBIL ID TOPENG DARI QR CODE
// =====================================================

function getTopengIdFromQR(value: string): string | null {
  const cleanValue = value.trim();

  if (/^\d+$/.test(cleanValue)) {
    return cleanValue;
  }

  try {
    const url = new URL(cleanValue);

    const parts = url.pathname
      .split("/")
      .filter(Boolean);

    const lastPart = parts[parts.length - 1];

    if (lastPart && /^\d+$/.test(lastPart)) {
      return lastPart;
    }
  } catch {
    const parts = cleanValue.split("/");
    const lastPart = parts[parts.length - 1];

    if (lastPart && /^\d+$/.test(lastPart)) {
      return lastPart;
    }
  }

  return null;
}

// =====================================================
// HALAMAN UTAMA SCAN TOPENG
// =====================================================

export default function HomeScreen() {
  const [permission, requestPermission] =
    useCameraPermissions();

  const [loading, setLoading] = useState(false);
  const [torch, setTorch] = useState(false);

  const scannedRef = useRef(false);

  // ===================================================
  // IZIN KAMERA
  // ===================================================

  useEffect(() => {
    if (
      permission &&
      !permission.granted &&
      permission.canAskAgain
    ) {
      requestPermission();
    }
  }, [permission?.granted]);

  // ===================================================
  // PROSES SCAN QR
  // ===================================================

  const handleBarcode = async ({
    data,
  }: {
    data: string;
  }) => {
    if (scannedRef.current || loading) return;

    scannedRef.current = true;
    setLoading(true);

    try {
      console.log("QR terbaca:", data);

      const topengId = getTopengIdFromQR(data);

      if (!topengId) {
        throw new Error(
          "QR Code tidak memiliki ID topeng yang valid."
        );
      }

      console.log("ID Topeng:", topengId);

      // Mengambil data topeng dari Laravel
      const topeng = await api.getDetailTopeng(topengId);

      if (!topeng || !topeng.topeng_id) {
        throw new Error(
          "Data topeng tidak ditemukan di database."
        );
      }

      console.log("Data topeng Laravel:", topeng);

      // Membuka halaman detail topeng
      // Membuka halaman detail topeng
// Membuka halaman Video Topeng.
// ID topeng hasil QR tetap dibawa ke halaman berikutnya.
router.push({
  pathname: "/videos",
  params: {
    id: String(topeng.topeng_id),
  },
} as any);

    } catch (error) {
      console.error("Gagal scan QR:", error);

      Alert.alert(
        "Topeng Tidak Ditemukan",
        error instanceof Error
          ? error.message
          : "Gagal mengambil data topeng dari server.",
        [
          {
            text: "Scan Lagi",
            onPress: () => {
              scannedRef.current = false;
              setLoading(false);
            },
          },
          {
            text: "Tutup",
            onPress: () => {
              scannedRef.current = false;
              setLoading(false);
            },
          },
        ]
      );

    } finally {
      setLoading(false);
    }
  };

  // ===================================================
  // TOMBOL KAMERA / FLASH
  // ===================================================

  const handleCameraButton = async () => {
    if (!permission?.granted) {
      const result = await requestPermission();

      if (!result.granted) {
        Alert.alert(
          "Izin Kamera",
          "Izinkan aplikasi menggunakan kamera untuk memindai QR Code."
        );
      }

      return;
    }

    setTorch((previous) => !previous);
  };

  // ===================================================
  // TAMPILAN SCAN QR
  // ===================================================

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.brand}>
          TOPENG MALANGAN
        </Text>

        <Text style={styles.subtitle}>
          JELAJAHI CERITA DI BALIK TOPENG
        </Text>
      </View>

      {/* KARTU SCANNER */}
      <View style={styles.scannerCard}>

        {/* DEKORASI AWAN */}
        <View style={styles.cloudLeft} />
        <View style={styles.cloudRight} />

        <Text style={styles.smallTitle}>
          WARISAN BUDAYA NUSANTARA
        </Text>

        <Text style={styles.title}>
          Scan Topeng
        </Text>

        <Text style={styles.description}>
          Arahkan kamera ke barcode di belakang
          topeng untuk mulai scan
        </Text>

        {/* KAMERA SCANNER */}
        <View style={styles.cameraFrame}>
          {permission?.granted ? (
            <>
              <CameraView
                style={StyleSheet.absoluteFill}
                facing="back"
                enableTorch={torch}
                barcodeScannerSettings={{
                  barcodeTypes: ["qr"],
                }}
                onBarcodeScanned={
                  scannedRef.current || loading
                    ? undefined
                    : handleBarcode
                }
              />

              {/* FRAME QR */}
              <View style={styles.qrOverlay}>
                <View style={styles.qrTarget}>
                  <View style={styles.cornerTopLeft} />
                  <View style={styles.cornerTopRight} />
                  <View style={styles.cornerBottomLeft} />
                  <View style={styles.cornerBottomRight} />
                </View>
              </View>
            </>
          ) : (
            <View style={styles.cameraPlaceholder}>
              <Text style={styles.qrSymbol}>
                ▦
              </Text>

              <Text style={styles.permissionText}>
                Aktifkan kamera untuk scan QR
              </Text>
            </View>
          )}

          {/* LOADING SCAN */}
          {loading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator
                size="large"
                color={COLORS.white}
              />

              <Text style={styles.loadingText}>
                Mengambil data topeng...
              </Text>
            </View>
          )}
        </View>

        {/* TOMBOL KAMERA */}
        <Pressable
          style={({ pressed }) => [
            styles.cameraButton,
            pressed && { opacity: 0.75 },
          ]}
          onPress={handleCameraButton}
          disabled={loading}
        >
          <Text style={styles.cameraIcon}>
            ◎
          </Text>
        </Pressable>

        {/* ILUSTRASI BAWAH */}
        <View style={styles.templeLeft}>
          <Text style={styles.templeIcon}>♜</Text>
        </View>

        <View style={styles.templeRight}>
          <Text style={styles.templeIcon}>♜</Text>
        </View>

        <View style={styles.cloudBottomLeft} />
        <View style={styles.cloudBottomRight} />

      </View>
    </View>
  );
}

// =====================================================
// STYLE SCAN QR
// =====================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 10,
    paddingTop: 12,
  },

  header: {
    alignItems: "center",
    paddingTop: 18,
    paddingBottom: 22,
  },

  brand: {
    color: COLORS.brown,
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: 3,
  },

  subtitle: {
    color: COLORS.muted,
    fontSize: 10,
    letterSpacing: 2,
    marginTop: 7,
  },

  scannerCard: {
    flex: 1,
    backgroundColor: COLORS.sand,
    alignItems: "center",
    borderRadius: 3,
    paddingTop: 36,
    paddingHorizontal: 20,
    overflow: "hidden",
    position: "relative",
    marginBottom: 8,
  },

  smallTitle: {
    color: COLORS.brown,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 2,
    textAlign: "center",
    marginTop: 5,
  },

  title: {
    color: COLORS.dark,
    fontSize: 24,
    fontWeight: "900",
    marginTop: 16,
  },

  description: {
    color: COLORS.dark,
    fontSize: 13,
    lineHeight: 20,
    textAlign: "center",
    marginTop: 8,
    maxWidth: 280,
  },

  cameraFrame: {
    width: 206,
    height: 286,
    backgroundColor: COLORS.dark,
    borderRadius: 13,
    marginTop: 25,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },

  cameraPlaceholder: {
    flex: 1,
    width: "100%",
    backgroundColor: "#2A1E17",
    alignItems: "center",
    justifyContent: "center",
  },

  qrSymbol: {
    color: COLORS.white,
    fontSize: 75,
  },

  permissionText: {
    color: COLORS.white,
    fontSize: 11,
    textAlign: "center",
    marginTop: 10,
    paddingHorizontal: 15,
  },

  qrOverlay: {
    ...StyleSheet.absoluteFill,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#00000022",
  },

  qrTarget: {
    width: 150,
    height: 150,
    borderColor: COLORS.white,
    borderWidth: 2,
    position: "relative",
  },

  cornerTopLeft: {
    position: "absolute",
    width: 23,
    height: 23,
    top: -2,
    left: -2,
    borderTopWidth: 5,
    borderLeftWidth: 5,
    borderColor: COLORS.white,
  },

  cornerTopRight: {
    position: "absolute",
    width: 23,
    height: 23,
    top: -2,
    right: -2,
    borderTopWidth: 5,
    borderRightWidth: 5,
    borderColor: COLORS.white,
  },

  cornerBottomLeft: {
    position: "absolute",
    width: 23,
    height: 23,
    bottom: -2,
    left: -2,
    borderBottomWidth: 5,
    borderLeftWidth: 5,
    borderColor: COLORS.white,
  },

  cornerBottomRight: {
    position: "absolute",
    width: 23,
    height: 23,
    bottom: -2,
    right: -2,
    borderBottomWidth: 5,
    borderRightWidth: 5,
    borderColor: COLORS.white,
  },

  loadingOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "#000000AA",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },

  loadingText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: "700",
  },

  cameraButton: {
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: COLORS.brown,
    borderWidth: 5,
    borderColor: "#B77A4C",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 25,
    marginBottom: 100,
    zIndex: 2,
    elevation: 5,
  },

  cameraIcon: {
    fontSize: 36,
    color: COLORS.white,
    fontWeight: "800",
  },

  cloudLeft: {
    position: "absolute",
    top: 8,
    left: 12,
    width: 80,
    height: 15,
    backgroundColor: "#B77A4C",
    borderRadius: 30,
    opacity: 0.8,
  },

  cloudRight: {
    position: "absolute",
    top: 12,
    right: 10,
    width: 95,
    height: 17,
    backgroundColor: "#B77A4C",
    borderRadius: 30,
    opacity: 0.8,
  },

  templeLeft: {
    position: "absolute",
    left: 10,
    bottom: 30,
  },

  templeRight: {
    position: "absolute",
    right: 10,
    bottom: 30,
  },

  templeIcon: {
    color: "#A16A3E",
    fontSize: 65,
    opacity: 0.8,
  },

  cloudBottomLeft: {
    position: "absolute",
    left: -15,
    bottom: 0,
    width: 145,
    height: 25,
    backgroundColor: "#A16A3E",
    borderRadius: 50,
  },

  cloudBottomRight: {
    position: "absolute",
    right: -15,
    bottom: 0,
    width: 125,
    height: 25,
    backgroundColor: "#A16A3E",
    borderRadius: 50,
  },
});

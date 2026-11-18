import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert, StatusBar, StyleSheet, Text, View } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { router } from "expo-router";
import api from "../services/api";

// WARNA FIGMA

const COLORS = {
  background: "#F4E8D9",
  sand: "#E2B486",
  brown: "#8C4F2D",
  dark: "#3D2B1F",
  cream: "#FFF8EF",
  white: "#FFFFFF",
  muted: "#4A3728", // Dibuat jauh lebih gelap/pekat agar kontras maksimal
};

// MENGAMBIL ID TOPENG DARI QR CODE

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

// HALAMAN UTAMA SCAN TOPENG

export default function HomeScreen() {
  const [permission, requestPermission] =
    useCameraPermissions();

  const [loading, setLoading] = useState(false);

  const scannedRef = useRef(false);

  // IZIN KAMERA

  useEffect(() => {
    if (
      permission &&
      !permission.granted &&
      permission.canAskAgain
    ) {
      requestPermission();
    }
  }, [permission?.granted]);

  // PROSES SCAN QR

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

        {/* Subtitle diperbesar ukurannya & dibuat sangat jelas */}
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
// STYLE SCAN QR (FONT DIPERBESAR & DIPERTEGAS)
// =====================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 12,
    paddingTop: 12,
  },

  header: {
    alignItems: "center",
    paddingTop: 16,
    paddingBottom: 18,
  },

  brand: {
    color: COLORS.brown,
    fontSize: 22, // Jauh lebih besar dari sebelumnya (19)
    fontWeight: "900",
    letterSpacing: 2.5,
  },

  subtitle: {
    color: COLORS.muted,
    fontSize: 13, // Jauh lebih besar dan jelas dari sebelumnya (11)
    fontWeight: "800", // Dibuat sangat tebal
    letterSpacing: 2.0,
    marginTop: 6,
    textAlign: "center",
  },

  scannerCard: {
    flex: 1,
    backgroundColor: COLORS.sand,
    alignItems: "center",
    borderRadius: 6,
    paddingTop: 24,
    paddingHorizontal: 20,
    paddingBottom: 40,
    overflow: "hidden",
    position: "relative",
    marginBottom: 8,
  },

  smallTitle: {
    color: COLORS.brown,
    fontSize: 12, // Diperbesar dari 11
    fontWeight: "800",
    letterSpacing: 1.5,
    textAlign: "center",
    marginTop: 4,
  },

  title: {
    color: COLORS.dark,
    fontSize: 26, // Diperbesar dari 23
    fontWeight: "900",
    marginTop: 8,
  },

  description: {
    color: COLORS.dark,
    fontSize: 14.5, // Diperbesar dari 13.5
    lineHeight: 20,
    textAlign: "center",
    marginTop: 6,
    maxWidth: 300,
    fontWeight: "600",
  },

  cameraFrame: {
    width: 215,
    height: 265,
    backgroundColor: COLORS.dark,
    borderRadius: 14,
    marginTop: 16,
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
    fontSize: 70,
  },

  permissionText: {
    color: COLORS.white,
    fontSize: 13,
    textAlign: "center",
    marginTop: 8,
    paddingHorizontal: 15,
    fontWeight: "700",
  },

  qrOverlay: {
    ...StyleSheet.absoluteFill,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#00000022",
  },

  qrTarget: {
    width: 145,
    height: 145,
    borderColor: COLORS.white,
    borderWidth: 2,
    position: "relative",
  },

  cornerTopLeft: {
    position: "absolute",
    width: 20,
    height: 20,
    top: -2,
    left: -2,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderColor: COLORS.white,
  },

  cornerTopRight: {
    position: "absolute",
    width: 20,
    height: 20,
    top: -2,
    right: -2,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderColor: COLORS.white,
  },

  cornerBottomLeft: {
    position: "absolute",
    width: 20,
    height: 20,
    bottom: -2,
    left: -2,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderColor: COLORS.white,
  },

  cornerBottomRight: {
    position: "absolute",
    width: 20,
    height: 20,
    bottom: -2,
    right: -2,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderColor: COLORS.white,
  },

  loadingOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "#000000AA",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  loadingText: {
    color: COLORS.white,
    fontSize: 14,
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
    fontSize: 55,
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
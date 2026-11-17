import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  router,
  useLocalSearchParams,
} from "expo-router";
import { C, Screen } from "../components/ui";
import {
  characterResults,
  QuizType,
} from "../data/masks";
import api, {
  BASE_URL,
  getTopengImage,
  Topeng,
} from "../services/api";

// URL E-Commerce dengan port 5173 sesuai permintaan
const ECOMMERCE_URL = "http://10.10.3.33:5173";

export default function ResultScreen() {
  const { type } = useLocalSearchParams<{ type: string }>();

  const resultKey = (
    Object.keys(characterResults).includes(type || "")
      ? type
      : "bijaksana"
  ) as QuizType;

  const result = characterResults[resultKey];

  const [topeng, setTopeng] = useState<Topeng | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadTopeng() {
      try {
        setLoading(true);
        const response = await api.getTopeng();
        
        const listData: Topeng[] = Array.isArray(response)
          ? response
          : (response as any)?.data || (response as any)?.topeng || [];

        const found = listData.find((item: any) => {
          const namaTopeng = (item?.topeng_nama || item?.nama || "").toLowerCase();
          const keyword = result.keyword.toLowerCase();
          const typeParam = (type || "").toLowerCase();
          const firstWord = keyword.split(" ")[0];

          return (
            namaTopeng.includes(keyword) || 
            keyword.includes(namaTopeng) ||
            namaTopeng.includes(typeParam) ||
            (firstWord.length > 2 && namaTopeng.includes(firstWord))
          );
        });

        if (active) {
          setTopeng(found || listData[0] || null);
        }
      } catch (error) {
        console.error("Gagal mengambil topeng hasil kuis:", error);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadTopeng();

    return () => {
      active = false;
    };
  }, [result.keyword, type]);

  const openShop = async () => {
    try {
      await Linking.openURL(ECOMMERCE_URL);
    } catch {
      Alert.alert(
        "Website Tidak Dapat Dibuka",
        "Periksa alamat website E-Commerce dan koneksi internet."
      );
    }
  };

  const getImageUrl = () => {
    if (!topeng) return null;
    const helperImage = getTopengImage(topeng);
    if (helperImage) return helperImage;

    const rawImage = 
      (topeng as any).image || 
      (topeng as any).foto || 
      (topeng as any).gambar || 
      (topeng as any).topeng_foto ||
      (topeng as any).file_path;

    if (!rawImage) return null;
    if (rawImage.startsWith("http")) return rawImage;
    return `${BASE_URL}/${rawImage.replace(/^\/+/, "")}`;
  };

  const image = getImageUrl();

  return (
    <Screen>
      <View style={styles.container}>
        {/* Header Wrapper dengan Siluet Gunung & Gambar Bulat Mengambang */}
        <View style={styles.headerWrapper}>
          <View style={styles.topHeader}>
            <View style={styles.mountainLeft} />
            <View style={styles.mountainRight} />
            
            <View style={styles.headerBar}>
              <Pressable
                onPress={() => router.replace("/quiz")}
                style={styles.backButton}
              >
                <Text style={styles.backText}>←</Text>
              </Pressable>
              <Text style={styles.headerTitle}>
                Hasil Kuis Karakter
              </Text>
              <View style={{ width: 36 }} />
            </View>
          </View>

          {/* Container Gambar Bulat di Tengah Header & Body */}
          <View style={styles.portraitContainer}>
            {loading ? (
              <View style={styles.imagePlaceholder}>
                <ActivityIndicator color={C.brown} size="large" />
              </View>
            ) : image ? (
              <Image
                source={{ uri: image }}
                style={styles.image}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Text style={styles.placeholderText}>
                  Gambar Kosong
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Konten Utama */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.bodyContent}>
            <Text style={styles.complete}>
              Kuis Selesai!
            </Text>

            <Text style={styles.small}>
              HASIL PERJALANAN & KEPRIBADIANMU
            </Text>

            <View style={styles.resultCard}>
              <Text style={styles.name}>
                Kamu adalah {result.name}
              </Text>
            </View>

            <Text style={styles.description}>
              {result.description}
            </Text>

            {/* CARD PROMOSI E-COMMERCE */}
            <View style={styles.tip}>
              <View style={styles.badgeContainer}>
                <Text style={styles.badgeText}>⭐ EKSKLUSIF & AUTENTIK</Text>
              </View>

              <Text style={styles.tipTitle}>
                Bawa Pulang Mahakarya Asli {result.name}!
              </Text>

              <Text style={styles.tipText}>
                Jangan hanya kenali karakternya, miliki ukiran kayu buatan tangan pengrajin lokal Malang. Dapatkan koleksi eksklusif dengan kualitas terbaik langsung dari sanggar budaya.
              </Text>
            </View>

            {/* TOMBOL-TOMBOL AKSI */}
            <Pressable
              onPress={openShop}
              style={({ pressed }) => [
                styles.customButton,
                styles.shopButtonBg,
                pressed && { opacity: 0.85 },
              ]}
            >
              <Text style={styles.customButtonText}>
                Jelajahi Katalog & Beli Sekarang    →
              </Text>
            </Pressable>

            <Pressable
              onPress={() => router.replace("/quiz")}
              style={({ pressed }) => [
                styles.customButton,
                styles.secondaryButtonBg,
                pressed && { opacity: 0.85 },
              ]}
            >
              <Text style={styles.customButtonText}>
                ↻   Coba Kuis Lagi
              </Text>
            </Pressable>

            <Pressable
              onPress={() => router.replace("/")}
              style={({ pressed }) => [
                styles.customButton,
                styles.secondaryButtonBg,
                pressed && { opacity: 0.85 },
              ]}
            >
              <Text style={styles.customButtonText}>
                ⌂   Kembali ke Kamera Utama
              </Text>
            </Pressable>
          </View>
        </ScrollView>

        {/* Ornamen Siluet Bukit di Sudut Bawah */}
        <View style={styles.bottomMountainsContainer} pointerEvents="none">
          <View style={styles.bottomMountainLeft} />
          <View style={styles.bottomMountainRight} />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5EBE0",
    position: "relative",
  },
  headerWrapper: {
    position: "relative",
    alignItems: "center",
    marginBottom: 95,
  },
  topHeader: {
    backgroundColor: "#6B3E26",
    width: "100%",
    height: 190,
    paddingTop: 12,
    overflow: "hidden",
    position: "relative",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  headerBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    zIndex: 10,
  },
  backButton: {
    width: 36,
    height: 36,
    justifyContent: "center",
  },
  backText: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "900",
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "900",
    textAlign: "center",
    letterSpacing: 0.5,
  },
  mountainLeft: {
    position: "absolute",
    left: -20,
    top: 45,
    width: 130,
    height: 150,
    backgroundColor: "#54301C",
    transform: [{ rotate: "25deg" }],
    opacity: 0.6,
    borderTopLeftRadius: 20,
  },
  mountainRight: {
    position: "absolute",
    right: -20,
    top: 35,
    width: 140,
    height: 160,
    backgroundColor: "#54301C",
    transform: [{ rotate: "-25deg" }],
    opacity: 0.6,
    borderTopRightRadius: 20,
  },
  portraitContainer: {
    position: "absolute",
    bottom: -90,
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    borderWidth: 5,
    borderColor: "#F5EBE0",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    zIndex: 20,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imagePlaceholder: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "#D9AF88",
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
  },
  placeholderText: {
    fontSize: 14,
    fontWeight: "800",
    textAlign: "center",
    color: C.dark,
  },
  scrollContent: {
    paddingBottom: 80,
    alignItems: "center",
  },
  bodyContent: {
    width: "88%",
    alignItems: "center",
  },
  complete: {
    color: "#4A3224",
    fontSize: 28,
    fontWeight: "900",
    marginBottom: 8,
    textAlign: "center",
    letterSpacing: 0.5,
  },
  small: {
    color: "#8A6347",
    fontSize: 15,
    marginTop: 10,
    marginBottom: 16,
    fontWeight: "900",
    letterSpacing: 1,
    textAlign: "center",
  },
  resultCard: {
    backgroundColor: "#87502F",
    borderRadius: 16,
    width: "100%",
    padding: 20,
    marginTop: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  name: {
    color: C.white,
    fontSize: 28,
    fontWeight: "900",
    textAlign: "center",
    lineHeight: 36,
  },
  description: {
    color: "#543825",
    textAlign: "center",
    lineHeight: 28,
    fontSize: 18,
    marginTop: 18,
    paddingHorizontal: 6,
    fontWeight: "600",
  },
  tip: {
    backgroundColor: "#FAF2E6",
    borderRadius: 16,
    padding: 20,
    width: "100%",
    marginTop: 20,
    borderWidth: 1.5,
    borderColor: "#D4B499",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  badgeContainer: {
    backgroundColor: "#C87D55",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginBottom: 12,
  },
  badgeText: {
    color: C.white,
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 1,
  },
  tipTitle: {
    color: C.dark,
    fontWeight: "900",
    fontSize: 20,
    lineHeight: 26,
  },
  tipText: {
    color: "#553D2E",
    lineHeight: 26,
    fontSize: 16,
    marginTop: 10,
    fontWeight: "500",
  },
  customButton: {
    width: "100%",
    borderRadius: 14,
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  shopButtonBg: {
    backgroundColor: "#87502F",
    marginTop: 24,
  },
  secondaryButtonBg: {
    backgroundColor: "#A66B40",
    marginTop: 14,
  },
  customButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
    textAlign: "center",
    letterSpacing: 0.5,
  },
  bottomMountainsContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 50,
    overflow: "hidden",
  },
  bottomMountainLeft: {
    position: "absolute",
    bottom: -35,
    left: -30,
    width: 100,
    height: 80,
    backgroundColor: "#E2D3C1",
    transform: [{ rotate: "35deg" }],
    borderTopLeftRadius: 40,
    opacity: 0.9,
  },
  bottomMountainRight: {
    position: "absolute",
    bottom: -35,
    right: -30,
    width: 100,
    height: 80,
    backgroundColor: "#E2D3C1",
    transform: [{ rotate: "-35deg" }],
    borderTopRightRadius: 40,
    opacity: 0.9,
  },
});
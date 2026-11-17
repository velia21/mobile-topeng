import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
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
import { Button, C, Screen } from "../../components/ui";
import api, {
  Topeng,
  getTopengImage,
} from "../../services/api";

export default function MaskDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [topeng, setTopeng] = useState<Topeng | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadDetail() {
      try {
        setLoading(true);
        setError("");

        if (!id) {
          throw new Error("ID topeng tidak ditemukan.");
        }

        const data = await api.getDetailTopeng(id);

        if (active) {
          setTopeng(data);
        }
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "Gagal mengambil deskripsi topeng."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadDetail();

    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return (
      <Screen>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={C.brown} />
          <Text style={styles.muted}>
            Membuka cerita topeng...
          </Text>
        </View>
      </Screen>
    );
  }

  if (!topeng || error) {
    return (
      <Screen>
        <View style={styles.center}>
          <Text style={styles.error}>{error}</Text>
          <Button
            title="Kembali"
            onPress={() => router.back()}
          />
        </View>
      </Screen>
    );
  }

  const image = getTopengImage(topeng);

  return (
    <Screen>
      <View style={styles.container}>
        {/* Header Wrapper */}
        <View style={styles.headerWrapper}>
          <View style={styles.topHeader}>
            <View style={styles.mountainLeft} />
            <View style={styles.mountainRight} />
            
            <View style={styles.headerBar}>
              <Pressable
                onPress={() => router.back()}
                style={styles.backButton}
              >
                <Text style={styles.backText}>←</Text>
              </Pressable>
              <Text style={styles.headerTitle}>
                Deskripsi Topeng
              </Text>
              <View style={{ width: 36 }} />
            </View>
          </View>

          {/* Container Gambar Bulat */}
          <View style={styles.portraitContainer}>
            {image ? (
              <Image
                source={{ uri: image }}
                style={styles.image}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Text style={styles.muted}>
                  Gambar belum tersedia
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
            <Text style={styles.name}>
              {topeng.topeng_nama}
            </Text>

            <Text style={styles.description}>
              {topeng.topeng_deskripsi ||
                "Deskripsi belum tersedia di database."}
            </Text>

            <Button
              title="Ikuti Kuis    →"
              onPress={() => router.push("/quiz")}
              style={styles.quizButton}
            />
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
    fontSize: 20, // Diperbesar dari 18
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
    width: 170, // Diperbesar dari 160
    height: 170, // Diperbesar dari 160
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
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  scrollContent: {
    paddingBottom: 80,
    alignItems: "center",
  },
  bodyContent: {
    width: "88%",
    alignItems: "flex-start",
  },
  name: {
    fontSize: 30, // Diperbesar dari 26
    fontWeight: "900",
    color: "#2C1810",
    marginBottom: 16,
    textAlign: "left",
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 17, // Diperbesar dari 15
    color: "#4A3224",
    lineHeight: 28, // Diperbesar agar lebih longgar dan mudah dibaca
    textAlign: "left",
    marginBottom: 32,
    fontWeight: "650" as any, // Ketebalan ditingkatkan
  },
  quizButton: {
    width: "100%",
    backgroundColor: "#A65E2D",
    borderRadius: 14,
    paddingVertical: 18,
  },
  bottomMountainsContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
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
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    padding: 20,
  },
  muted: {
    color: "#76533D",
    fontSize: 16, // Diperbesar
    fontWeight: "700",
    textAlign: "center",
  },
  error: {
    color: "#87502F",
    fontSize: 17, // Diperbesar
    fontWeight: "800",
    textAlign: "center",
  },
});

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

  const story =
    topeng.topeng_cerita ||
    topeng.topeng_kisah;

  return (
    <Screen>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <Pressable
          onPress={() => router.back()}
          style={styles.back}
        >
          <Text style={styles.backText}>‹</Text>
        </Pressable>

        <Text style={styles.header}>
          Deskripsi Topeng
        </Text>

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

        <Text style={styles.name}>
          {topeng.topeng_nama}
        </Text>

        <Text style={styles.character}>
          {topeng.sifat_topeng || "Karakter Topeng Malangan"}
        </Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Deskripsi Topeng
          </Text>

          <Text style={styles.description}>
            {topeng.topeng_deskripsi ||
              "Deskripsi belum tersedia di database."}
          </Text>
        </View>

        <View style={styles.storySection}>
          <Text style={styles.sectionTitle}>
            Tahukah Kamu?
          </Text>

          <Text style={styles.description}>
            {story ||
              "Informasi kisah khusus topeng ini belum tersedia di database."}
          </Text>
        </View>

        <Button
          title="Ikuti Kuis   →"
          onPress={() => router.push("/quiz")}
          style={styles.quizButton}
        />

      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 25,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },

  back: {
    width: 30,
    marginBottom: 5,
  },

  backText: {
    color: C.white,
    fontSize: 27,
    fontWeight: "700",
  },

  header: {
    color: C.white,
    fontSize: 16,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 15,
  },

  portraitContainer: {
    width: 145,
    height: 145,
    borderRadius: 80,
    backgroundColor: "#F6E5D0",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    marginBottom: 12,
    borderWidth: 6,
    borderColor: "#F6E5D0",
  },

  image: {
    width: "100%",
    height: "100%",
  },

  imagePlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  name: {
    fontSize: 21,
    fontWeight: "900",
    color: C.dark,
  },

  character: {
    fontSize: 11,
    color: C.brown,
    marginTop: 4,
    fontWeight: "700",
  },

  section: {
    marginTop: 13,
  },

  sectionTitle: {
    fontSize: 13,
    color: C.dark,
    fontWeight: "900",
    marginBottom: 5,
  },

  description: {
    fontSize: 11,
    color: "#563D2D",
    lineHeight: 17,
  },

  storySection: {
    backgroundColor: "#F4D9BB",
    padding: 13,
    borderRadius: 12,
    marginTop: 15,
  },

  quizButton: {
    marginTop: 18,
    backgroundColor: "#A65E2D",
  },

  muted: {
    color: C.muted,
  },

  error: {
    color: C.brown,
    textAlign: "center",
  },
});

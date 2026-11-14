
import { useEffect, useState } from "react";

import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  router,
  useLocalSearchParams,
} from "expo-router";

import { Button, C, Screen } from "../components/ui";

import {
  characterResults,
  QuizType,
} from "../data/masks";

import api, {
  ECOMMERCE_URL,
  getTopengImage,
  Topeng,
} from "../services/api";

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
        const data = await api.getTopeng();

        const found = data.find((item) =>
          item.topeng_nama
            .toLowerCase()
            .includes(result.keyword.toLowerCase())
        );

        if (active) {
          setTopeng(found || null);
        }
      } catch (error) {
        console.error("Gagal mengambil topeng hasil:", error);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadTopeng();

    return () => {
      active = false;
    };
  }, [result.keyword]);

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

  const image = topeng ? getTopengImage(topeng) : null;

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.complete}>
          Kuis Selesai!
        </Text>

        {loading ? (
          <View style={styles.loading}>
            <ActivityIndicator color={C.brown} />
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
              Gambar karakter belum tersedia
            </Text>
          </View>
        )}

        <Text style={styles.small}>
          HASIL PERJALANANMU
        </Text>

        <View style={styles.resultCard}>
          <Text style={styles.name}>
            Kamu adalah {result.name}
          </Text>
        </View>

        <Text style={styles.description}>
          {result.description}
        </Text>

        <View style={styles.tip}>
          <Text style={styles.tipTitle}>
            Kenali Topeng Pilihanmu
          </Text>

          <Text style={styles.tipText}>
            Temukan koleksi topeng, informasi produk,
            dan berbagai pilihan pembelian melalui
            website E-Commerce Topeng Malangan.
          </Text>
        </View>

        <Button
          title="Masuk ke Halaman E-Commerce"
          onPress={openShop}
          style={styles.shopButton}
        />

        <Button
          title="↻   Coba Lagi"
          secondary
          onPress={() => router.replace("/quiz")}
          style={styles.secondaryButton}
        />

        <Button
          title="⌂   Kembali ke Kamera"
          secondary
          onPress={() => router.replace("/")}
          style={styles.secondaryButton}
        />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    alignItems: "center",
    paddingBottom: 30,
    paddingTop: 5,
  },

  complete: {
    color: C.white,
    fontSize: 17,
    fontWeight: "900",
    marginBottom: 15,
  },

  image: {
    width: 135,
    height: 135,
    borderRadius: 75,
    borderWidth: 6,
    borderColor: "#E9C5A1",
    backgroundColor: C.sand,
  },

  imagePlaceholder: {
    width: 135,
    height: 135,
    borderRadius: 75,
    backgroundColor: "#D9AF88",
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
  },

  placeholderText: {
    fontSize: 10,
    textAlign: "center",
    color: C.dark,
  },

  loading: {
    height: 135,
    justifyContent: "center",
  },

  small: {
    color: "#8A6347",
    fontSize: 10,
    marginTop: 17,
    fontWeight: "800",
  },

  resultCard: {
    backgroundColor: "#87502F",
    borderRadius: 12,
    width: "90%",
    padding: 14,
    marginTop: 12,
  },

  name: {
    color: C.white,
    fontSize: 17,
    fontWeight: "900",
    textAlign: "center",
  },

  description: {
    color: "#76533D",
    textAlign: "center",
    lineHeight: 18,
    fontSize: 11,
    marginTop: 14,
  },

  tip: {
    backgroundColor: "#F0D4B4",
    borderRadius: 12,
    padding: 13,
    width: "100%",
    marginTop: 16,
  },

  tipTitle: {
    color: C.dark,
    fontWeight: "900",
    fontSize: 12,
  },

  tipText: {
    color: "#654B3A",
    lineHeight: 17,
    fontSize: 10,
    marginTop: 6,
  },

  shopButton: {
    width: "100%",
    marginTop: 18,
    backgroundColor: "#87502F",
  },

  secondaryButton: {
    width: "100%",
    marginTop: 10,
    backgroundColor: "#A66B40",
  },
});

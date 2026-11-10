
import {
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text
} from "react-native";

import {
    router,
    useLocalSearchParams
} from "expo-router";

import * as Linking from "expo-linking";

import {
    Button,
    C,
    Screen
} from "../components/ui";

import {
    characterResults,
    masks
} from "../data/masks";

// GANTI DENGAN URL WEBSITE E-COMMERCE ASLI
const ECOMMERCE_URL =
  "https://contoh-toko-topeng.com";

export default function ResultScreen() {
  const { type } = useLocalSearchParams<{
    type: string;
  }>();

  const result =
    characterResults[type || "bijaksana"] ||
    characterResults.bijaksana;

  const mask =
    masks.find(item => item.id === result.maskId) ||
    masks[0];

  const openShop = async () => {
    try {
      await Linking.openURL(ECOMMERCE_URL);
    } catch {
      Alert.alert(
        "Website Tidak Dapat Dibuka",
        "Periksa kembali URL website e-commerce."
      );
    }
  };

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.complete}>
          ✦ KUIS SELESAI! ✦
        </Text>

        <Image
          source={{ uri: mask.image }}
          style={styles.image}
        />

        <Text style={styles.small}>
          HASIL PERJALANANMU
        </Text>

        <Text style={styles.name}>
          Kamu adalah {result.name}
        </Text>

        <Text style={styles.tagline}>
          {result.tagline}
        </Text>

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
            website e-commerce Topeng Malangan.
          </Text>
        </View>

        <Button
          title="Kunjungi Website E-Commerce"
          onPress={openShop}
          style={{
            width: "100%",
            marginTop: 18
          }}
        />

        <Button
          title="↻  Coba Lagi"
          secondary
          onPress={() => router.replace("/quiz")}
          style={{
            width: "100%",
            marginTop: 10
          }}
        />

        <Button
          title="⌂  Kembali ke Beranda"
          secondary
          onPress={() => router.replace("/")}
          style={{
            width: "100%",
            marginTop: 10
          }}
        />
      </ScrollView>
    </Screen>
  );
}

import { View } from "react-native";

const styles = StyleSheet.create({
  content: {
    alignItems: "center",
    paddingBottom: 30,
    paddingTop: 8
  },

  complete: {
    color: C.brown,
    fontWeight: "900",
    letterSpacing: 1.5,
    fontSize: 14,
    marginBottom: 18
  },

  image: {
    width: 175,
    height: 175,
    borderRadius: 90,
    borderWidth: 7,
    borderColor: "#E4C29F",
    backgroundColor: C.sand
  },

  small: {
    color: C.muted,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.5,
    marginTop: 20
  },

  name: {
    color: C.dark,
    fontSize: 23,
    fontWeight: "900",
    textAlign: "center",
    marginTop: 8
  },

  tagline: {
    color: C.orange,
    fontWeight: "800",
    marginTop: 6
  },

  description: {
    color: "#6D5544",
    textAlign: "center",
    lineHeight: 21,
    fontSize: 13,
    marginTop: 14
  },

  tip: {
    backgroundColor: "#E7C7A5",
    borderRadius: 15,
    padding: 16,
    width: "100%",
    marginTop: 18
  },

  tipTitle: {
    color: C.dark,
    fontWeight: "900",
    fontSize: 14
  },

  tipText: {
    color: "#654B3A",
    lineHeight: 19,
    fontSize: 12,
    marginTop: 6
  }
});
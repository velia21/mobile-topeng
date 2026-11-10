
import {
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View
} from "react-native";

import { router } from "expo-router";

import {
    C,
    Screen
} from "../components/ui";

import { masks } from "../data/masks";

export default function VideosScreen() {
  return (
    <Screen>
      <Text style={styles.title}>
        Video Topeng
      </Text>

      <Text style={styles.sub}>
        Jelajahi berbagai karakter Topeng Malangan.
        Pilih topeng untuk melihat video dan informasinya.
      </Text>

      <ScrollView
        showsVerticalScrollIndicator={false}
      >
        {masks.map((mask, index) => (
          <Pressable
            key={mask.id}
            style={styles.card}
            onPress={() =>
              router.push(`/mask/${mask.id}`)
            }
          >
            <Image
              source={{ uri: mask.image }}
              style={styles.image}
            />

            <View style={styles.info}>
              <Text style={styles.number}>
                VIDEO {String(index + 1).padStart(2, "0")}
              </Text>

              <Text style={styles.name}>
                {mask.name}
              </Text>

              <Text style={styles.character}>
                {mask.character}
              </Text>

              <Text style={styles.link}>
                Lihat Video & Deskripsi →
              </Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>

      <Pressable
        onPress={() => router.back()}
        style={styles.back}
      >
        <Text style={{ color: C.brown, fontWeight: "700" }}>
          ← Kembali
        </Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 26,
    fontWeight: "900",
    color: C.dark,
    marginTop: 8
  },

  sub: {
    color: C.muted,
    lineHeight: 19,
    marginVertical: 10,
    fontSize: 13
  },

  card: {
    backgroundColor: C.cream,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 14,
    flexDirection: "row",
    minHeight: 125
  },

  image: {
    width: 112,
    height: 135,
    backgroundColor: C.sand
  },

  info: {
    flex: 1,
    padding: 13,
    justifyContent: "center"
  },

  number: {
    fontSize: 9,
    color: C.orange,
    fontWeight: "900",
    letterSpacing: 1
  },

  name: {
    color: C.dark,
    fontWeight: "900",
    fontSize: 16,
    marginTop: 5
  },

  character: {
    color: C.muted,
    fontSize: 12,
    marginTop: 4
  },

  link: {
    color: C.brown,
    fontWeight: "800",
    fontSize: 11,
    marginTop: 12
  },

  back: {
    paddingVertical: 12
  }
});
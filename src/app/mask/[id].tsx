import React from "react";

import {
  ScrollView,
  Text,
  Image,
  StyleSheet,
  Pressable
} from "react-native";

import {
  useLocalSearchParams,
  router
} from "expo-router";

import {
  useVideoPlayer,
  VideoView
} from "expo-video";

import {
  Screen,
  Button,
  C
} from "../../components/ui";

import { masks } from "../../data/masks";

export default function MaskDetailScreen() {
  const { id } = useLocalSearchParams<{
    id: string;
  }>();

  const mask =
    masks.find(item => item.id === id) ?? masks[0];

  const player = useVideoPlayer(
    mask.videoUrl,
    player => {
      player.loop = false;
    }
  );

  return (
    <Screen>
      <ScrollView
        showsVerticalScrollIndicator={false}
      >
        <Pressable onPress={() => router.back()}>
          <Text style={styles.back}>
            ← Kembali
          </Text>
        </Pressable>

        <Text style={styles.heading}>
          Deskripsi Topeng
        </Text>

        <Image
          source={{ uri: mask.image }}
          style={styles.image}
        />

        <Text style={styles.name}>
          {mask.name}
        </Text>

        <Text style={styles.character}>
          {mask.character}
        </Text>

        <Text style={styles.videoTitle}>
          Video Topeng
        </Text>

        <VideoView
          player={player}
          style={styles.video}
          nativeControls
          contentFit="contain"
        />

        <Text style={styles.section}>
          Deskripsi Topeng
        </Text>

        <Text style={styles.desc}>
          {mask.description}
        </Text>

        <Text style={styles.section}>
          Kisah Karakter
        </Text>

        <Text style={styles.desc}>
          {mask.story}
        </Text>

        <Button
          title="Ikuti Kuis  →"
          onPress={() => router.push("/quiz")}
          style={{
            marginTop: 22,
            marginBottom: 28
          }}
        />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  back: {
    color: C.brown,
    fontWeight: "800",
    marginBottom: 14
  },

  heading: {
    fontSize: 23,
    color: C.dark,
    fontWeight: "900",
    marginBottom: 14
  },

  image: {
    width: "100%",
    height: 210,
    borderRadius: 18,
    backgroundColor: C.sand
  },

  name: {
    fontSize: 22,
    color: C.dark,
    fontWeight: "900",
    marginTop: 15
  },

  character: {
    color: C.orange,
    fontWeight: "700",
    marginTop: 4
  },

  videoTitle: {
    fontSize: 17,
    color: C.dark,
    fontWeight: "900",
    marginTop: 22,
    marginBottom: 10
  },

  video: {
    width: "100%",
    height: 205,
    borderRadius: 16,
    backgroundColor: "#1F1A17"
  },

  section: {
    fontSize: 16,
    color: C.dark,
    fontWeight: "900",
    marginTop: 20,
    marginBottom: 7
  },

  desc: {
    color: "#654B3A",
    lineHeight: 21,
    fontSize: 13
  }
});
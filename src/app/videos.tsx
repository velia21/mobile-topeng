
import { router, useLocalSearchParams } from "expo-router";
import { VideoView, useVideoPlayer } from "expo-video";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Button, C, Screen } from "../components/ui";
import api, {
  Topeng,
  getTopengImage,
  getVideoUrl,
} from "../services/api";

export default function VideosScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [topeng, setTopeng] = useState<Topeng | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const player = useVideoPlayer(null, (player) => {
    player.loop = false;
  });

  // Mengambil data topeng berdasarkan ID QR
  useEffect(() => {
    let active = true;

    const loadTopeng = async () => {
      try {
        setLoading(true);
        setError("");

        if (!id) {
          throw new Error("ID topeng tidak ditemukan.");
        }

        const result = await api.getDetailTopeng(String(id));

        if (!active) return;

        if (!result || !result.topeng_id) {
          throw new Error("Data topeng tidak ditemukan.");
        }

        setTopeng(result);

        // Mengambil satu video yang sesuai dengan topeng
        const video = result.videos?.[0];
        const url = video ? getVideoUrl(video) : null;

        if (!url) {
          throw new Error("Video untuk topeng ini belum tersedia.");
        }

        setVideoUrl(url);
      } catch (err: any) {
        if (active) {
          setError(
            err?.message ||
              "Terjadi kesalahan saat mengambil data topeng."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadTopeng();

    return () => {
      active = false;
    };
  }, [id]);

  // Memuat dan memutar video
  useEffect(() => {
    if (!videoUrl) return;

    let active = true;

    const loadVideo = async () => {
      try {
        await player.replaceAsync(videoUrl);

        if (active) {
          player.play();
        }
      } catch (err) {
        console.error("Gagal memuat video:", err);

        if (active) {
          setError(
            "Video gagal diputar. Periksa koneksi atau alamat video."
          );
        }
      }
    };

    loadVideo();

    return () => {
      active = false;
      player.pause();
    };
  }, [videoUrl, player]);

  // Tampilan loading
  if (loading) {
    return (
      <Screen>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={C.orange} />
          <Text style={styles.loadingText}>
            Memuat video topeng...
          </Text>
        </View>
      </Screen>
    );
  }

  // Tampilan jika terjadi kesalahan
  if (error || !topeng) {
    return (
      <Screen>
        <View style={styles.center}>
          <Text style={styles.errorTitle}>
            Video Tidak Tersedia
          </Text>

          <Text style={styles.errorText}>
            {error || "Data topeng tidak ditemukan."}
          </Text>

          <Button
            title="Kembali"
            onPress={() => router.back()}
            style={styles.backButton}
          />
        </View>
      </Screen>
    );
  }

  // Ambil gambar setelah data topeng tersedia
  const imageUrl = getTopengImage(topeng);

  return (
    <Screen>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {/* JUDUL */}
        <Text style={styles.heading}>
          Video Topeng Malangan
        </Text>

        <Text style={styles.subtitle}>
          Saksikan kisah dan karakter dari topeng yang kamu pindai.
        </Text>

        {/* VIDEO */}
        <View style={styles.videoContainer}>
          <VideoView
            player={player}
            style={styles.video}
            nativeControls
            contentFit="contain"
          />
        </View>

        {/* INFORMASI TOPENG */}
        <View style={styles.infoContainer}>
          <Text style={styles.topengName}>
            {topeng.topeng_nama}
          </Text>

          <Text style={styles.description}>
            {topeng.topeng_deskripsi ||
              "Belum ada deskripsi untuk topeng ini."}
          </Text>

          {/* GAMBAR TOPENG */}
          {imageUrl ? (
            <Image
              source={{ uri: imageUrl }}
              style={styles.topengImage}
              resizeMode="cover"
            />
          ) : null}
        </View>

        {/* TOMBOL NAVIGASI */}
        <View style={styles.buttonContainer}>
          <View style={styles.buttonItem}>
            <Button
              title="Lanjut Baca"
              onPress={() =>
                router.push(
                  `/mask/${topeng.topeng_id}` as any
                )
              }
              style={styles.readButton}
            />
          </View>

          <View style={styles.buttonItem}>
            <Button
              title="Ikuti Kuis"
              onPress={() =>
                router.push({
                  pathname: "/quiz",
                  params: {
                    id: String(topeng.topeng_id),
                  },
                } as any)
              }
              style={styles.quizButton}
            />
          </View>
        </View>

        {/* FOOTER */}
        <Text style={styles.footerText}>
          Kenali lebih dalam budaya dan karakter Topeng Malangan.
        </Text>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 35,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 25,
  },

  heading: {
    fontSize: 23,
    fontWeight: "bold",
    color: C.dark,
  },

  subtitle: {
    fontSize: 14,
    color: C.muted,
    marginTop: 6,
    marginBottom: 20,
    lineHeight: 21,
  },

  loadingText: {
    marginTop: 12,
    color: C.brown,
    fontSize: 14,
  },

  videoContainer: {
    width: "100%",
    aspectRatio: 9 / 16,
    maxHeight: 520,
    alignSelf: "center",
    backgroundColor: "#211812",
    borderRadius: 18,
    overflow: "hidden",
  },

  video: {
    width: "100%",
    height: "100%",
  },

  infoContainer: {
    marginTop: 22,
  },

  topengName: {
    fontSize: 22,
    fontWeight: "bold",
    color: C.dark,
    marginBottom: 9,
  },

  description: {
    fontSize: 14,
    lineHeight: 23,
    color: C.brown,
  },

  topengImage: {
    width: "100%",
    height: 190,
    borderRadius: 15,
    marginTop: 18,
    backgroundColor: C.sand,
  },

  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 24,
  },

  buttonItem: {
    flex: 1,
  },

  readButton: {
    backgroundColor: C.orange,
  },

  quizButton: {
    backgroundColor: C.brown,
  },

  backButton: {
    marginTop: 20,
    backgroundColor: C.orange,
  },

  errorTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: C.dark,
    marginBottom: 8,
  },

  errorText: {
    fontSize: 14,
    color: C.muted,
    textAlign: "center",
    lineHeight: 22,
  },

  footerText: {
    textAlign: "center",
    fontSize: 12,
    color: C.muted,
    marginTop: 18,
    lineHeight: 19,
  },
});

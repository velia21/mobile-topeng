import { router, useLocalSearchParams } from "expo-router";
import { VideoView, useVideoPlayer } from "expo-video";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { C, Screen } from "../components/ui";
import api, {
  Topeng,
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

          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [
              styles.customButton,
              styles.readButtonBg,
              { width: "100%", marginTop: 20 },
              pressed && { opacity: 0.85 },
            ]}
          >
            <Text style={styles.customButtonText}>Kembali</Text>
          </Pressable>
        </View>
      </Screen>
    );
  }

  // Membuat ringkasan deskripsi (pendek/poin penting saja)
  const rawDesc = topeng.topeng_deskripsi || "Belum ada deskripsi untuk topeng ini.";
  const shortDescription = rawDesc.length > 130 ? rawDesc.substring(0, 130) + "..." : rawDesc;

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

        {/* INFORMASI TOPENG (RINGKASAN) */}
        <View style={styles.infoContainer}>
          <Text style={styles.topengName}>
            {topeng.topeng_nama}
          </Text>

          <Text style={styles.description}>
            {shortDescription}
          </Text>
        </View>

        {/* TOMBOL NAVIGASI DENGAN FONT & UKURAN DIPERBESAR */}
        <View style={styles.buttonContainer}>
          <Pressable
            onPress={() =>
              router.push(
                `/mask/${topeng.topeng_id}` as any
              )
            }
            style={({ pressed }) => [
              styles.customButton,
              styles.readButtonBg,
              pressed && { opacity: 0.85 },
            ]}
          >
            <Text style={styles.customButtonText}>
              📖  Lanjut Baca
            </Text>
          </Pressable>

          <Pressable
            onPress={() =>
              router.push({
                pathname: "/quiz",
                params: {
                  id: String(topeng.topeng_id),
                },
              } as any)
            }
            style={({ pressed }) => [
              styles.customButton,
              styles.quizButtonBg,
              pressed && { opacity: 0.85 },
            ]}
          >
            <Text style={styles.customButtonText}>
              ✨  Ikuti Kuis
            </Text>
          </Pressable>
        </View>

        {/* FOOTER */}
        <Text style={styles.footerText}>
          KENALI LEBIH DALAM BUDAYA DAN KARAKTER TOPENG MALANGAN.
        </Text>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 25,
  },

  heading: {
    fontSize: 30,
    fontWeight: "900",
    color: C.dark,
  },

  subtitle: {
    fontSize: 17,
    color: C.muted,
    marginTop: 8,
    marginBottom: 20,
    lineHeight: 25,
    fontWeight: "600",
  },

  loadingText: {
    marginTop: 14,
    color: C.brown,
    fontSize: 18,
    fontWeight: "700",
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
    marginTop: 24,
  },

  topengName: {
    fontSize: 28,
    fontWeight: "900",
    color: C.dark,
    marginBottom: 10,
  },

  description: {
    fontSize: 17,
    lineHeight: 27,
    color: C.brown,
    fontWeight: "600",
  },

  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 28,
  },

  customButton: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 18, // Diperbesar dari 14 agar tombol lebih tinggi dan mantap
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },

  readButtonBg: {
    backgroundColor: C.orange,
  },

  quizButtonBg: {
    backgroundColor: C.brown,
  },

  customButtonText: {
    color: "#FFFFFF",
    fontSize: 17, // Diperbesar agar teks lebih jelas dan menonjol
    fontWeight: "900", // Ekstra tebal
    textAlign: "center",
    letterSpacing: 0.5,
  },

  errorTitle: {
    fontSize: 26,
    fontWeight: "900",
    color: C.dark,
    marginBottom: 10,
    textAlign: "center",
  },

  errorText: {
    fontSize: 17,
    color: C.muted,
    textAlign: "center",
    lineHeight: 25,
    fontWeight: "600",
  },

  footerText: {
    textAlign: "center",
    fontSize: 15,
    fontWeight: "900",
    color: C.brown,
    marginTop: 28,
    lineHeight: 22,
    letterSpacing: 1.2,
  },
});
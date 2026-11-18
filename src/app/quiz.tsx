import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Screen } from "../components/ui";
import api from "../services/api";

export default function QuizScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();

  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);

  useEffect(() => {
    let active = true;

    async function fetchAdminQuiz() {
      try {
        setLoading(true);
        setError("");

        const rawData = await api.getQuiz(id);

        if (active) {
          if (rawData && rawData.length > 0) {
            // Memetakan data pertanyaan dan pilihan dengan ekstraksi universal
            const formatted = rawData.map((item: any) => {
              const optionsList =
                item.pilihan ||
                item.options ||
                item.jawaban ||
                item.opsi ||
                item.choices ||
                [];

              const formattedOptions = Array.isArray(optionsList)
                ? optionsList.map((opt: any) => {
                    if (typeof opt === "string") {
                      return { value: opt, label: opt };
                    }

                    const textLabel =
                      opt.pilihan_jawaban ||
                      opt.pilihan_teks ||
                      opt.teks ||
                      opt.label ||
                      "Pilihan jawaban";

                    // Ambil ID topeng atau nama karakter sebagai pengenal sifat/hasil
                    const valueKey =
                      opt.topeng_id ||
                      opt.karakter ||
                      opt.topeng?.topeng_nama ||
                      textLabel;

                    return {
                      value: String(valueKey),
                      label: String(textLabel),
                    };
                  })
                : [];

              return {
                id: item.kuis_id || item.id || item.quiz_id,
                question:
                  item.pertanyaan_teks ||
                  item.pertanyaan ||
                  item.soal ||
                  item.question ||
                  "",
                options: formattedOptions,
              };
            });

            setQuestions(formatted);
          } else {
            setError("Belum ada data pertanyaan kuis di panel admin.");
          }
        }
      } catch (err: any) {
        if (active) {
          setError(err?.message || "Gagal terhubung ke database admin.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    fetchAdminQuiz();

    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return (
      <Screen>
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#A65E2D" />
          <Text style={styles.loadingText}>Memuat kuis dari database admin...</Text>
        </View>
      </Screen>
    );
  }

  if (error || questions.length === 0) {
    return (
      <Screen>
        <View style={styles.center}>
          <Text style={styles.errorTitle}>Kuis Belum Tersedia</Text>
          <Text style={styles.errorText}>
            {error || "Belum ada data pertanyaan kuis yang diatur di panel admin."}
          </Text>
          <Pressable onPress={() => router.back()} style={styles.errorBackButton}>
            <Text style={styles.errorButtonText}>Kembali</Text>
          </Pressable>
        </View>
      </Screen>
    );
  }

  const totalQuestions = questions.length;
  const current = questions[index] || questions[0];
  const selected = answers[index];

  const choose = (value: string) => {
    setAnswers((previous) => {
      const next = [...previous];
      next[index] = value;
      return next;
    });
  };

  const nextQuestion = () => {
    if (!selected) {
      Alert.alert(
        "Pilih Jawaban",
        "Silakan pilih salah satu jawaban terlebih dahulu."
      );
      return;
    }

    if (index < totalQuestions - 1) {
      setIndex((previous) => previous + 1);
      return;
    }

    for (let i = 0; i < totalQuestions; i++) {
      if (!answers[i]) {
        Alert.alert(
          "Pertanyaan Belum Lengkap",
          `Masih ada pertanyaan yang belum dijawab pada nomor ${i + 1}. Silakan lengkapi terlebih dahulu.`
        );
        setIndex(i);
        return;
      }
    }

    // Hitung kemunculan pilihan terbanyak secara dinamis berdasarkan jawaban user
    const counts: Record<string, number> = {};
    answers.forEach((answer) => {
      if (answer) {
        counts[answer] = (counts[answer] || 0) + 1;
      }
    });

    let bestResult = Object.keys(counts)[0] || "1";
    let maxCount = -1;
    for (const [key, count] of Object.entries(counts)) {
      if (count > maxCount) {
        maxCount = count;
        bestResult = key;
      }
    }

    // Arahkan ke halaman hasil dengan membawa topeng_id / kategori terpilih
    router.replace({
      pathname: "/result",
      params: {
        type: bestResult,
        topeng_id: id || "",
      },
    });
  };

  return (
    <Screen>
      <View style={styles.container}>
        {/* Header Cokelat dengan Siluet Gunung & Judul */}
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
          </View>

          <Text style={styles.headerTitle}>
            Topeng Malangan Mana{"\n"}yang Mewakili Dirimu?
          </Text>
        </View>

        {/* Konten Utama (Scrollable) */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Stepper / Progress Bar Angka */}
          <View style={styles.stepContainer}>
            <View style={styles.stepLine} />
            <View style={styles.steps}>
              {questions.map((_, i) => {
                const isAnswered = Boolean(answers[i]);
                const isCurrent = i === index;
                const isActive = isAnswered || isCurrent;

                return (
                  <Pressable
                    key={i}
                    onPress={() => setIndex(i)}
                    style={[
                      styles.step,
                      isActive && styles.stepActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.stepText,
                        isActive && styles.stepTextActive,
                      ]}
                    >
                      {i + 1}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <Text style={styles.progressText}>
            Pertanyaan {index + 1} dari {totalQuestions}
          </Text>

          {/* Pertanyaan */}
          <Text style={styles.question}>
            {index + 1}. {current?.question || ""}
          </Text>

          {/* Opsi Jawaban dari Admin */}
          {(current?.options || []).map((option: any, i: number) => {
            const active = selected === option.value;

            return (
              <Pressable
                key={i}
                onPress={() => choose(option.value)}
                style={[
                  styles.option,
                  active && styles.optionActive,
                ]}
              >
                <View
                  style={[
                    styles.letter,
                    active && styles.letterActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.letterText,
                      active && styles.letterTextActive,
                    ]}
                  >
                    {String.fromCharCode(65 + i)}
                  </Text>
                </View>

                <Text
                  style={[
                    styles.optionText,
                    active && styles.optionTextActive,
                  ]}
                >
                  {option.label}
                </Text>
              </Pressable>
            );
          })}

          {/* Tombol Lanjut / Lihat Hasil */}
          <Pressable
            onPress={nextQuestion}
            style={({ pressed }) => [
              styles.nextButton,
              pressed && { opacity: 0.85 },
            ]}
          >
            <Text style={styles.nextButtonText}>
              {index === totalQuestions - 1
                ? "Lihat Hasil    →"
                : "Lanjut    →"}
            </Text>
          </Pressable>
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
  topHeader: {
    backgroundColor: "#6B3E26",
    width: "100%",
    height: 190,
    paddingTop: 12,
    overflow: "hidden",
    position: "relative",
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  headerBar: {
    flexDirection: "row",
    alignItems: "center",
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
    marginTop: 10,
    lineHeight: 28,
    paddingHorizontal: 20,
    zIndex: 10,
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
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 80,
  },
  stepContainer: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  stepLine: {
    position: "absolute",
    width: "78%",
    height: 3,
    backgroundColor: "#E2D3C1",
    top: "50%",
    marginTop: -1.5,
    zIndex: 1,
  },
  steps: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "88%",
    alignItems: "center",
    zIndex: 2,
  },
  step: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FAF2E6",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#EAD6C3",
  },
  stepActive: {
    backgroundColor: "#7A4E31",
    borderColor: "#7A4E31",
  },
  stepText: {
    color: "#7A4E31",
    fontSize: 15,
    fontWeight: "800",
  },
  stepTextActive: {
    color: "#FFFFFF",
  },
  progressText: {
    color: "#8A6347",
    fontSize: 15,
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  question: {
    fontSize: 19,
    lineHeight: 28,
    fontWeight: "900",
    color: "#2C1810",
    marginBottom: 18,
  },
  option: {
    backgroundColor: "#FAF2E6",
    borderRadius: 14,
    padding: 16,
    minHeight: 60,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
    borderWidth: 1.5,
    borderColor: "#EADBCC",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  optionActive: {
    backgroundColor: "#A65E2D",
    borderColor: "#A65E2D",
  },
  letter: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#7A4E31",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  letterActive: {
    backgroundColor: "#FFFFFF",
  },
  letterText: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 15,
  },
  letterTextActive: {
    color: "#7A4E31",
  },
  optionText: {
    color: "#2C1810",
    fontSize: 16,
    fontWeight: "700",
    flex: 1,
    lineHeight: 22,
  },
  optionTextActive: {
    color: "#FFFFFF",
  },
  nextButton: {
    marginTop: 24,
    backgroundColor: "#A65E2D",
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  nextButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 25,
    backgroundColor: "#F5EBE0",
    gap: 12,
  },
  loadingText: {
    color: "#54301C",
    fontSize: 17,
    fontWeight: "800",
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: "#2C1810",
    textAlign: "center",
  },
  errorText: {
    fontSize: 16,
    color: "#553D2E",
    textAlign: "center",
    lineHeight: 24,
  },
  errorBackButton: {
    backgroundColor: "#6B3E26",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 10,
  },
  errorButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
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
});

import { useState } from "react";

import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { router } from "expo-router";

import { Button, C, Screen } from "../components/ui";

import { quizQuestions } from "../data/masks";

export default function QuizScreen() {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);

  const current = quizQuestions[index];
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
        "Silakan pilih jawaban terlebih dahulu."
      );
      return;
    }

    if (index < quizQuestions.length - 1) {
      setIndex((previous) => previous + 1);
      return;
    }

    const counts: Record<string, number> = {
      bijaksana: 0,
      berani: 0,
      lembut: 0,
      ceria: 0,
    };

    answers.forEach((answer) => {
      counts[answer] = (counts[answer] || 0) + 1;
    });

    const priority = [
      "bijaksana",
      "berani",
      "lembut",
      "ceria",
    ];

    const result = priority.reduce((best, current) =>
      counts[current] > counts[best] ? current : best
    );

    router.replace({
      pathname: "/result",
      params: {
        type: result,
      },
    });
  };

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

        <Text style={styles.title}>
          Kuis Personal Karakter
        </Text>

        <Text style={styles.progressText}>
          Pertanyaan {index + 1} dari 5
        </Text>

        <View style={styles.steps}>
          {quizQuestions.map((_, i) => (
            <View
              key={i}
              style={[
                styles.step,
                i <= index && styles.stepActive,
              ]}
            >
              <Text
                style={[
                  styles.stepText,
                  i <= index && styles.stepTextActive,
                ]}
              >
                {i + 1}
              </Text>
            </View>
          ))}
        </View>

        <Text style={styles.question}>
          {current.question}
        </Text>

        {current.options.map((option, i) => {
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

        <Button
          title={
            index === 4
              ? "Lihat Hasil   →"
              : "Lanjut   →"
          }
          onPress={nextQuestion}
          style={styles.nextButton}
        />

        <Text style={styles.note}>
          Pilih jawaban yang paling menggambarkan dirimu.
        </Text>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    paddingBottom: 22,
  },

  back: {
    marginBottom: 5,
  },

  backText: {
    color: C.white,
    fontSize: 27,
    fontWeight: "700",
  },

  title: {
    fontSize: 16,
    color: C.white,
    fontWeight: "900",
    marginBottom: 15,
  },

  progressText: {
    color: "#765037",
    fontSize: 11,
    textAlign: "center",
    marginBottom: 12,
  },

  steps: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#EAC9A8",
    padding: 8,
    borderRadius: 30,
    marginBottom: 15,
  },

  step: {
    width: 26,
    height: 26,
    borderRadius: 15,
    backgroundColor: C.white,
    justifyContent: "center",
    alignItems: "center",
  },

  stepActive: {
    backgroundColor: "#9B572F",
  },

  stepText: {
    color: C.brown,
    fontSize: 11,
    fontWeight: "800",
  },

  stepTextActive: {
    color: C.white,
  },

  question: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: "900",
    color: C.dark,
    marginBottom: 18,
  },

  option: {
    backgroundColor: C.cream,
    borderRadius: 10,
    padding: 11,
    minHeight: 47,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 9,
  },

  optionActive: {
    backgroundColor: "#A65F32",
  },

  letter: {
    width: 23,
    height: 23,
    borderRadius: 15,
    backgroundColor: "#F0DDC9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  letterActive: {
    backgroundColor: "#7E4325",
  },

  letterText: {
    color: C.brown,
    fontWeight: "900",
    fontSize: 10,
  },

  letterTextActive: {
    color: C.white,
  },

  optionText: {
    color: C.dark,
    fontSize: 11,
    fontWeight: "600",
    flex: 1,
  },

  optionTextActive: {
    color: C.white,
  },

  nextButton: {
    marginTop: 14,
    backgroundColor: "#A65E2D",
  },

  note: {
    color: "#8C654A",
    textAlign: "center",
    fontSize: 9,
    marginTop: 10,
  },
});

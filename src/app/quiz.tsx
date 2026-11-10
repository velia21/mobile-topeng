import React, { useState } from "react";

import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Alert
} from "react-native";

import { router } from "expo-router";

import {
  Screen,
  Button,
  C
} from "../components/ui";

import { quizQuestions } from "../data/masks";

export default function QuizScreen() {
  const [index, setIndex] = useState(0);

  const [answers, setAnswers] = useState<string[]>([]);

  const current = quizQuestions[index];

  const selected = answers[index];

  const choose = (value: string) => {
    const next = [...answers];

    next[index] = value;

    setAnswers(next);
  };

  const nextQuestion = () => {
    if (!selected) {
      Alert.alert(
        "Pilih Jawaban",
        "Silakan pilih salah satu jawaban terlebih dahulu."
      );

      return;
    }

    if (index < quizQuestions.length - 1) {
      setIndex(index + 1);

      return;
    }

    const counts: Record<string, number> = {};

    answers.forEach(answer => {
      counts[answer] = (counts[answer] || 0) + 1;
    });

    const result = Object.keys(counts).sort(
      (a, b) => counts[b] - counts[a]
    )[0];

    router.replace({
      pathname: "/result",
      params: {
        type: result || "bijaksana"
      }
    });
  };

  return (
    <Screen>
      <Pressable onPress={() => router.back()}>
        <Text style={styles.back}>
          ← Kembali
        </Text>
      </Pressable>

      <Text style={styles.title}>
        Kuis Personal Karakter
      </Text>

      <Text style={styles.progress}>
        Pertanyaan {index + 1} dari {quizQuestions.length}
      </Text>

      <View style={styles.progressTrack}>
        <View
          style={[
            styles.progressFill,
            {
              width: `${
                ((index + 1) / quizQuestions.length) * 100
              }%`
            }
          ]}
        />
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingBottom: 20
        }}
      >
        <Text style={styles.question}>
          {current.question}
        </Text>

        {current.options.map((option, i) => {
          const active = selected === option.value;

          return (
            <Pressable
              key={option.value}
              onPress={() => choose(option.value)}
              style={[
                styles.option,
                active && styles.optionActive
              ]}
            >
              <View
                style={[
                  styles.letter,
                  active && styles.letterActive
                ]}
              >
                <Text
                  style={{
                    color: active ? "white" : C.brown,
                    fontWeight: "900"
                  }}
                >
                  {String.fromCharCode(65 + i)}
                </Text>
              </View>

              <Text
                style={[
                  styles.optionText,
                  active && { color: "white" }
                ]}
              >
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <Button
        title={
          index === quizQuestions.length - 1
            ? "Lihat Hasil  →"
            : "Lanjut  →"
        }
        onPress={nextQuestion}
      />

      <Text style={styles.note}>
        Pilih satu jawaban untuk melanjutkan.
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  back: {
    color: C.brown,
    fontWeight: "800",
    marginBottom: 18
  },

  title: {
    color: C.dark,
    fontSize: 24,
    fontWeight: "900"
  },

  progress: {
    color: C.muted,
    fontSize: 12,
    marginTop: 15,
    marginBottom: 7
  },

  progressTrack: {
    height: 7,
    borderRadius: 10,
    backgroundColor: "#E2D0BD",
    overflow: "hidden"
  },

  progressFill: {
    height: 7,
    backgroundColor: C.orange,
    borderRadius: 10
  },

  question: {
    color: C.dark,
    fontSize: 19,
    fontWeight: "900",
    lineHeight: 27,
    marginTop: 28,
    marginBottom: 20
  },

  option: {
    backgroundColor: C.cream,
    borderRadius: 13,
    padding: 13,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 11,
    borderWidth: 1,
    borderColor: "#E5D5C4",
    minHeight: 57
  },

  optionActive: {
    backgroundColor: C.orange,
    borderColor: C.orange
  },

  letter: {
    width: 29,
    height: 29,
    borderRadius: 20,
    backgroundColor: "#F0DDC9",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12
  },

  letterActive: {
    backgroundColor: C.brown
  },

  optionText: {
    color: C.dark,
    fontSize: 13,
    fontWeight: "600",
    flex: 1
  },

  note: {
    color: C.muted,
    textAlign: "center",
    fontSize: 10,
    marginTop: 8,
    marginBottom: 8
  }
});
import { useGame } from "@/app/context/GameContext";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { AnimatedButton } from "../components/ui/AnimatedButton";
import { Card } from "../components/ui/Card";
import { GradientBackground } from "../components/ui/GradientBackground";
import { CONFIG } from "../constants/config";

export default function QuestionScreen() {
  const {
    currentQuestion,
    selectedAnswer,
    setSelectedAnswer,
    scannedEndpoint,
    addScore,
    nextLevel,
  } = useGame();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleSubmitAnswer = async () => {
    if (!selectedAnswer || !currentQuestion || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const fullUrl = `${CONFIG.BASE_URL}/${scannedEndpoint}`;

      const response = await fetch(fullUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          answer: selectedAnswer,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      const isCorrect = currentQuestion.Answer.includes(selectedAnswer);

      if (isCorrect) {
        addScore(currentQuestion.pointsRewarded[0]);
        nextLevel();
        router.push("/success");
      } else {
        Alert.alert("Incorrect Answer", "Try again!");
      }
    } catch (error) {
      console.error("Error submitting answer:", error);
      Alert.alert("Error", "Failed to submit answer. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  if (!currentQuestion) {
    return (
      <GradientBackground>
        <SafeAreaView style={styles.container}>
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={64} color="#FFF" />
            <Text style={styles.errorText}>No question available</Text>
            <AnimatedButton
              title="Go Back"
              onPress={handleGoBack}
              variant="secondary"
            />
          </View>
        </SafeAreaView>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
              <Ionicons name="arrow-back" size={24} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Question</Text>
            <View style={styles.placeholder} />
          </View>

          {/* Question Card */}
          <Card style={styles.questionCard}>
            {/* Age Group Badge */}
            {currentQuestion["Age group"] &&
              currentQuestion["Age group"].length > 0 && (
                <View style={styles.ageGroupContainer}>
                  <Text style={styles.ageGroupLabel}>Age Group:</Text>
                  <View style={styles.ageGroupBadges}>
                    {currentQuestion["Age group"].map((age, index) => (
                      <View key={index} style={styles.ageGroupBadge}>
                        <Text style={styles.ageGroupText}>{age}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

            {/* Question */}
            <Text style={styles.questionText}>{currentQuestion.question}</Text>

            {/* Hint */}
            {currentQuestion.hint && (
              <View style={styles.hintContainer}>
                <Ionicons name="bulb" size={16} color={CONFIG.COLORS.warning} />
                <Text style={styles.hintText}>{currentQuestion.hint}</Text>
              </View>
            )}

            {/* Choices */}
            <View style={styles.choicesContainer}>
              {currentQuestion.choices.map((choice, index) => (
                <TouchableOpacity
                  key={choice}
                  style={[
                    styles.choiceButton,
                    selectedAnswer === choice && styles.selectedChoice,
                  ]}
                  onPress={() => handleAnswerSelect(choice)}
                  disabled={isSubmitting}
                >
                  <View style={styles.choiceContent}>
                    <View
                      style={[
                        styles.choiceIndicator,
                        selectedAnswer === choice && styles.selectedIndicator,
                      ]}
                    >
                      <Text
                        style={[
                          styles.choiceIndex,
                          selectedAnswer === choice &&
                            styles.selectedChoiceIndex,
                        ]}
                      >
                        {String.fromCharCode(65 + index)}
                      </Text>
                    </View>
                    <Text
                      style={[
                        styles.choiceText,
                        selectedAnswer === choice && styles.selectedChoiceText,
                      ]}
                    >
                      {choice}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            {/* Points Info */}
            <View style={styles.pointsContainer}>
              <Ionicons name="star" size={16} color={CONFIG.COLORS.accent} />
              <Text style={styles.pointsText}>
                Earn {currentQuestion.pointsRewarded[0]} points for correct
                answer!
              </Text>
            </View>

            {/* Submit Button */}
            <AnimatedButton
              title={isSubmitting ? "Submitting..." : "Submit Answer"}
              onPress={handleSubmitAnswer}
              variant="success"
              disabled={!selectedAnswer || isSubmitting}
              style={styles.submitButton}
            />
          </Card>
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    marginTop: 10,
  },
  backButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 25,
    padding: 12,
  },
  headerTitle: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "600",
  },
  placeholder: {
    width: 49,
  },
  questionCard: {
    marginBottom: 20,
  },
  ageGroupContainer: {
    marginBottom: 20,
  },
  ageGroupLabel: {
    fontSize: 14,
    color: CONFIG.COLORS.gray,
    marginBottom: 8,
    fontWeight: "500",
  },
  ageGroupBadges: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  ageGroupBadge: {
    backgroundColor: CONFIG.COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ageGroupText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "500",
  },
  questionText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    lineHeight: 30,
  },
  hintContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#FFF8E1",
    padding: 12,
    borderRadius: 12,
    marginBottom: 25,
    gap: 8,
  },
  hintText: {
    flex: 1,
    fontSize: 14,
    color: "#F57C00",
    fontStyle: "italic",
    lineHeight: 20,
  },
  choicesContainer: {
    gap: 12,
    marginBottom: 25,
  },
  choiceButton: {
    borderWidth: 2,
    borderColor: "#E0E0E0",
    borderRadius: 16,
    padding: 16,
    backgroundColor: "#FAFAFA",
  },
  selectedChoice: {
    borderColor: CONFIG.COLORS.primary,
    backgroundColor: CONFIG.COLORS.primary,
  },
  choiceContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  choiceIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
  },
  selectedIndicator: {
    backgroundColor: "#FFF",
  },
  choiceIndex: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#666",
  },
  selectedChoiceIndex: {
    color: CONFIG.COLORS.primary,
  },
  choiceText: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  selectedChoiceText: {
    color: "#FFF",
  },
  pointsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 25,
    padding: 12,
    backgroundColor: "#FFF9C4",
    borderRadius: 12,
  },
  pointsText: {
    fontSize: 14,
    color: "#F57F17",
    fontWeight: "600",
  },
  submitButton: {
    marginTop: 10,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },
  errorText: {
    fontSize: 18,
    color: "#FFF",
    textAlign: "center",
  },
});

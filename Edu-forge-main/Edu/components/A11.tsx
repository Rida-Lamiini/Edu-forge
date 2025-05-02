"use client";

import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";
import { Audio } from "expo-av";

const { width } = Dimensions.get("window");

type ScientificMethodActivityProps = {
  onBack: () => void;
};

type Step = {
  id: string;
  letter: string;
  title: string;
  description: string;
  isCorrect: boolean;
};

export default function A11({
  onBack,
}: ScientificMethodActivityProps) {
  const [steps, setSteps] = useState<Step[]>([
    {
      id: "1",
      letter: "D",
      title: "Formuler une hypothèse :",
      description:
        "lorsque les criquets respirent ; ils dégagent le dioxyde de carbone.",
      isCorrect: false,
    },
    {
      id: "2",
      letter: "A",
      title: "Définir le matériel nécessaire à l'expérience :",
      description: "eau de chaux, criquets, enceintes fermées;",
      isCorrect: false,
    },
    {
      id: "3",
      letter: "C",
      title: "Mettre en ouvre le protocole expérimental :",
      description:
        "on met des criquets dans une boîte fermée avec l'eau de chaux.",
      isCorrect: false,
    },
    {
      id: "4",
      letter: "B",
      title: "Lire les résultats et conclure :",
      description:
        "l'eau de chaux se trouble, donc les criquets dégagent le dioxyde de carbone.",
      isCorrect: false,
    },
  ]);

  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [selectedStepId, setSelectedStepId] = useState<string | null>(null);
  const [orderedSteps, setOrderedSteps] = useState<string[]>([]);

  const correctOrder = ["2", "1", "3", "4"]; // A, D, C, B

  useEffect(() => {
    // Shuffle the steps initially
    setSteps(shuffleArray([...steps]));
  }, []);

  const shuffleArray = (array: Step[]) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  async function playSound(correct: boolean) {
    const soundFile = correct
      ? require("../assets/sounds/correct.mp3")
      : require("../assets/sounds/incorrect.mp3");

    try {
      const { sound } = await Audio.Sound.createAsync(soundFile);
      setSound(sound);
      await sound.playAsync();
    } catch (error) {
      console.error("Error playing sound", error);
    }
  }

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const handleStepSelect = (stepId: string) => {
    if (submitted) return; // Prevent selection after submission

    if (selectedStepId === stepId) {
      // Deselect if already selected
      setSelectedStepId(null);
      return;
    }

    setSelectedStepId(stepId);
  };

  const handleAddToOrder = () => {
    if (!selectedStepId || orderedSteps.includes(selectedStepId) || submitted)
      return;

    setOrderedSteps([...orderedSteps, selectedStepId]);
    setSelectedStepId(null);
  };

  const handleRemoveFromOrder = (index: number) => {
    if (submitted) return;

    const newOrderedSteps = [...orderedSteps];
    newOrderedSteps.splice(index, 1);
    setOrderedSteps(newOrderedSteps);
  };

  const handleSubmit = () => {
    if (orderedSteps.length !== 4) return; // Ensure all steps are ordered

    const correct =
      JSON.stringify(orderedSteps) === JSON.stringify(correctOrder);

    setIsCorrect(correct);
    setSubmitted(true);
    playSound(correct);

    if (correct) {
      setScore(score + 10);
    }

    // Mark each step as correct or incorrect
    const updatedSteps = steps.map((step) => {
      const stepIndex = orderedSteps.indexOf(step.id);
      return {
        ...step,
        isCorrect: stepIndex !== -1 && correctOrder[stepIndex] === step.id,
      };
    });

    setSteps(updatedSteps);
  };

  const handleReset = () => {
    setSubmitted(false);
    setIsCorrect(false);
    setOrderedSteps([]);
    setSelectedStepId(null);
    setSteps(
      shuffleArray([...steps.map((step) => ({ ...step, isCorrect: false }))])
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <LinearGradient
        colors={["#FFF3E0", "#FFE0B2"]}
        style={styles.background}
      />

      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FF9800" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Démarche Expérimentale</Text>

        <Animatable.View animation="bounceIn">
          <LinearGradient
            colors={["#4CAF50", "#388E3C"]}
            style={styles.scoreBadge}
          >
            <Text style={styles.scoreText}>Score: {score}</Text>
          </LinearGradient>
        </Animatable.View>
      </View>

      <View style={styles.activityHeader}>
        <LinearGradient
          colors={["#FF9800", "#F57C00"]}
          style={styles.activityBadge}
        >
          <Text style={styles.activityNumber}>1</Text>
        </LinearGradient>
        <Text style={styles.activityTitle}>
          Principales étapes d'une démarche expérimentale
        </Text>
      </View>

      <View style={styles.instructionContainer}>
        <Text style={styles.instructionText}>
          • En vous aidant du dispositif ci-contre,{" "}
          <Text style={styles.boldText}>choisissez</Text> le bon ordre des
          étapes ci-dessous pour mettre en évidence la respiration des criquets.
        </Text>
      </View>

      <View style={styles.experimentContainer}>
        <View style={styles.experimentImageContainer}>
          <View style={styles.experimentSetup}>
            <View style={styles.container1}>
              <View style={styles.containerLabel}>
                <Text style={styles.labelText}>Enceinte témoin</Text>
              </View>
              <View style={styles.limeWater}></View>
            </View>
            <View style={styles.container2}>
              <View style={styles.containerLabel}>
                <Text style={styles.labelText}>Eau de chaux</Text>
              </View>
              <View style={styles.limeWater}></View>
              <View style={styles.cricket}>
                <MaterialCommunityIcons
                  name="cricket"
                  size={24}
                  color="#795548"
                />
              </View>
            </View>
          </View>
          <Text style={styles.experimentCaption}>
            Dispositif expérimental de la mise en évidence de la respiration
            chez les criquets.
          </Text>
        </View>

        <View style={styles.stepsContainer}>
          <Text style={styles.stepsTitle}>
            Sélectionnez les étapes dans le bon ordre :
          </Text>

          {/* Available steps */}
          <View style={styles.availableSteps}>
            {steps.map((step, index) => (
              <TouchableOpacity
                key={step.id}
                style={[
                  styles.stepCard,
                  selectedStepId === step.id && styles.selectedStep,
                  orderedSteps.includes(step.id) && styles.usedStep,
                ]}
                onPress={() => handleStepSelect(step.id)}
                disabled={orderedSteps.includes(step.id) || submitted}
              >
                <View style={styles.stepLetterContainer}>
                  <Text style={styles.stepLetter}>{step.letter}</Text>
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>{step.title}</Text>
                  <Text style={styles.stepDescription}>{step.description}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {selectedStepId && !submitted && (
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddToOrder}
            >
              <LinearGradient
                colors={["#4CAF50", "#388E3C"]}
                style={styles.addButtonGradient}
              >
                <Text style={styles.addButtonText}>Ajouter à la séquence</Text>
                <Ionicons name="arrow-down" size={20} color="white" />
              </LinearGradient>
            </TouchableOpacity>
          )}

          {/* Ordered steps */}
          <View style={styles.orderedStepsContainer}>
            <Text style={styles.orderedStepsTitle}>Votre séquence :</Text>

            <View style={styles.orderedStepsList}>
              {orderedSteps.map((stepId, index) => {
                const step = steps.find((s) => s.id === stepId)!;
                return (
                  <Animatable.View key={index} animation="fadeIn">
                    <View
                      style={[
                        styles.orderedStepCard,
                        submitted && step.isCorrect && styles.correctStep,
                        submitted && !step.isCorrect && styles.incorrectStep,
                      ]}
                    >
                      <View style={styles.orderedStepNumber}>
                        <Text style={styles.orderedStepNumberText}>
                          {index + 1}
                        </Text>
                      </View>
                      <View style={styles.stepLetterContainer}>
                        <Text style={styles.stepLetter}>{step.letter}</Text>
                      </View>
                      <View style={styles.stepContent}>
                        <Text style={styles.stepTitle}>{step.title}</Text>
                      </View>
                      {!submitted && (
                        <TouchableOpacity
                          style={styles.removeButton}
                          onPress={() => handleRemoveFromOrder(index)}
                        >
                          <Ionicons
                            name="close-circle"
                            size={24}
                            color="#F44336"
                          />
                        </TouchableOpacity>
                      )}
                      {submitted && (
                        <View style={styles.resultIcon}>
                          {step.isCorrect ? (
                            <Ionicons
                              name="checkmark-circle"
                              size={24}
                              color="#4CAF50"
                            />
                          ) : (
                            <Ionicons
                              name="close-circle"
                              size={24}
                              color="#F44336"
                            />
                          )}
                        </View>
                      )}
                    </View>
                  </Animatable.View>
                );
              })}
            </View>
          </View>

          <View style={styles.flowDiagram}>
            {[0, 1, 2, 3].map((index) => (
              <View key={index} style={styles.flowItem}>
                <View
                  style={[
                    styles.flowBox,
                    index < orderedSteps.length && styles.flowBoxFilled,
                  ]}
                >
                  <Text style={styles.flowText}>{index + 1}</Text>
                </View>
                {index < 3 && (
                  <Ionicons name="arrow-forward" size={24} color="#FF9800" />
                )}
              </View>
            ))}
          </View>
        </View>

        {!submitted ? (
          <TouchableOpacity
            style={[
              styles.submitButton,
              orderedSteps.length !== 4 && styles.disabledButton,
            ]}
            onPress={handleSubmit}
            disabled={orderedSteps.length !== 4}
          >
            <LinearGradient
              colors={
                orderedSteps.length === 4
                  ? ["#FF9800", "#F57C00"]
                  : ["#BDBDBD", "#9E9E9E"]
              }
              style={styles.submitButtonGradient}
            >
              <Text style={styles.submitButtonText}>Vérifier l'ordre</Text>
            </LinearGradient>
          </TouchableOpacity>
        ) : (
          <View style={styles.feedbackContainer}>
            <Animatable.View animation={isCorrect ? "bounceIn" : "shake"}>
              <LinearGradient
                colors={
                  isCorrect ? ["#4CAF50", "#388E3C"] : ["#F44336", "#D32F2F"]
                }
                style={styles.feedbackBadge}
              >
                <Ionicons
                  name={isCorrect ? "checkmark-circle" : "close-circle"}
                  size={24}
                  color="white"
                  style={styles.feedbackIcon}
                />
                <Text style={styles.feedbackText}>
                  {isCorrect
                    ? "Bravo ! Vous avez correctement ordonné les étapes de la démarche expérimentale."
                    : "Ce n'est pas le bon ordre. Essayez encore !"}
                </Text>
              </LinearGradient>
            </Animatable.View>

            <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
              <LinearGradient
                colors={["#9E9E9E", "#757575"]}
                style={styles.resetButtonGradient}
              >
                <Ionicons name="refresh" size={20} color="white" />
                <Text style={styles.resetButtonText}>Recommencer</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 100,
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: "100%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 15,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  scoreBadge: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  scoreText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  activityHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginVertical: 10,
  },
  activityBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  activityNumber: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
    color: "#333",
    flex: 1,
  },
  instructionContainer: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 15,
    margin: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  instructionText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
  },
  boldText: {
    fontWeight: "bold",
  },
  experimentContainer: {
    margin: 20,
  },
  experimentImageContainer: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  experimentSetup: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    paddingVertical: 20,
  },
  container1: {
    width: 100,
    height: 200,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#B0BEC5",
    overflow: "hidden",
    position: "relative",
  },
  container2: {
    width: 100,
    height: 200,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#B0BEC5",
    overflow: "hidden",
    position: "relative",
  },
  containerLabel: {
    backgroundColor: "#B0BEC5",
    padding: 5,
    alignItems: "center",
  },
  labelText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#37474F",
  },
  limeWater: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    backgroundColor: "#B3E5FC",
  },
  cricket: {
    position: "absolute",
    top: "40%",
    left: "30%",
  },
  experimentCaption: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#666",
    textAlign: "center",
    marginTop: 10,
  },
  stepsContainer: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  stepsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  availableSteps: {
    marginBottom: 15,
  },
  stepCard: {
    flexDirection: "row",
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedStep: {
    backgroundColor: "#E3F2FD",
    borderColor: "#2196F3",
    borderWidth: 1,
  },
  usedStep: {
    opacity: 0.5,
  },
  correctStep: {
    backgroundColor: "#E8F5E9",
    borderColor: "#4CAF50",
    borderWidth: 1,
  },
  incorrectStep: {
    backgroundColor: "#FFEBEE",
    borderColor: "#F44336",
    borderWidth: 1,
  },
  stepLetterContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FF9800",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  stepLetter: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  stepDescription: {
    fontSize: 14,
    color: "#666",
  },
  addButton: {
    alignSelf: "center",
    borderRadius: 25,
    overflow: "hidden",
    marginVertical: 10,
  },
  addButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
    marginRight: 5,
  },
  orderedStepsContainer: {
    marginTop: 20,
    marginBottom: 15,
  },
  orderedStepsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  orderedStepsList: {
    marginBottom: 10,
  },
  orderedStepCard: {
    flexDirection: "row",
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
    alignItems: "center",
  },
  orderedStepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#FF9800",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  orderedStepNumberText: {
    color: "white",
    fontWeight: "bold",
  },
  removeButton: {
    padding: 5,
  },
  resultIcon: {
    marginLeft: 10,
  },
  flowDiagram: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  flowItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  flowBox: {
    width: 40,
    height: 40,
    borderRadius: 5,
    backgroundColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
  },
  flowBoxFilled: {
    backgroundColor: "#FFB74D",
  },
  flowText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  submitButton: {
    borderRadius: 25,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  disabledButton: {
    opacity: 0.7,
  },
  submitButtonGradient: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  submitButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  feedbackContainer: {
    marginTop: 20,
  },
  feedbackBadge: {
    borderRadius: 15,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  feedbackIcon: {
    marginRight: 10,
  },
  feedbackText: {
    color: "white",
    fontSize: 16,
    flex: 1,
  },
  resetButton: {
    borderRadius: 25,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    alignSelf: "center",
  },
  resetButtonGradient: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  resetButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 5,
  },
});

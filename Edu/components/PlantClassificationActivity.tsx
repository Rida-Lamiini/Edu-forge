"use client";

import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  Animated,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";
import { Audio } from "expo-av";
import InteractiveClassificationTree from "./InteractiveClassificationTree";

const { width } = Dimensions.get("window");

type PlantType = "algue" | "gymnosperme" | "angiosperme" | "pteridophyte";

type Plant = {
  id: number;
  name: string;
  image: any;
  type: PlantType;
  description: string;
};

type PlantClassificationActivityProps = {
  onBack: () => void;
};

export default function PlantClassificationActivity({
  onBack,
}: PlantClassificationActivityProps) {
  const [currentPlant, setCurrentPlant] = useState<Plant | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<PlantType | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [plantIndex, setPlantIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  // Définition des plantes
  const plants: Plant[] = [
    {
      id: 1,
      name: "Haricots verts",
      image: require("../assets/images/green-beans.png"),
      type: "angiosperme",
      description:
        "Les haricots verts ont des graines enfermées dans une gousse (fruit). Ce sont des plantes à fleurs.",
    },
    {
      id: 2,
      name: "Pin",
      image: require("../assets/images/pine.png"),
      type: "gymnosperme",
      description:
        "Le pin a des graines posées sur les écailles de ses cônes. Il n'a pas de fruits.",
    },
    {
      id: 3,
      name: "Fougère",
      image: require("../assets/images/fern.png"),
      type: "pteridophyte",
      description:
        "La fougère a des tiges et des feuilles mais ne produit pas de graines. Elle se reproduit par spores.",
    },
    {
      id: 4,
      name: "Algue marine",
      image: require("../assets/images/seaweed.png"),
      type: "algue",
      description:
        "L'algue n'a ni tiges ni feuilles. Elle vit dans l'eau et se reproduit par spores.",
    },
  ];

  useEffect(() => {
    setCurrentPlant(plants[plantIndex]);
  }, [plantIndex]);

  useEffect(() => {
    if (currentPlant) {
      // Animer l'apparition du contenu
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();

      // Réinitialiser l'état pour la nouvelle plante
      setSelectedAnswer(null);
      setIsCorrect(null);
      setShowResult(false);
    }
  }, [currentPlant]);

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

  const handleAnswer = (answer: PlantType) => {
    if (!currentPlant) return;

    setSelectedAnswer(answer);
    const correct = answer === currentPlant.type;
    setIsCorrect(correct);
    setShowResult(true);

    // Jouer un son
    playSound(correct);

    if (correct) {
      setScore(score + 10);
    }
  };

  const handleNextPlant = () => {
    const nextIndex = (plantIndex + 1) % plants.length;
    setPlantIndex(nextIndex);
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Feather name="arrow-left" size={24} color="#4CAF50" />
      </TouchableOpacity>

      <View style={styles.titleContainer}>
        <Text style={styles.title}>Activité 1</Text>
        <Text style={styles.subtitle}>Retrouvez le nom d'un végétal</Text>
      </View>

      <View style={styles.scoreContainer}>
        <LinearGradient
          colors={["#4CAF50", "#2E7D32"]}
          style={styles.scoreBadge}
        >
          <Text style={styles.scoreText}>Score: {score}</Text>
        </LinearGradient>
      </View>
    </View>
  );

  const renderPlantImage = () => {
    if (!currentPlant) return null;

    return (
      <Animated.View
        style={[
          styles.plantImageContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Text style={styles.plantImageTitle}>
          La photo suivante présente un végétal.
        </Text>
        <Image
          source={currentPlant.image}
          style={styles.plantImage}
          resizeMode="contain"
        />
      </Animated.View>
    );
  };

  const renderClassificationTree = () => {
    return (
      <Animatable.View animation="fadeIn" style={styles.treeContainer}>
        <InteractiveClassificationTree
          onSelect={handleAnswer}
          currentPlantType={currentPlant?.type}
        />
      </Animatable.View>
    );
  };

  const renderQuestionSection = () => (
    <View style={styles.questionSection}>
      <View style={styles.answerSection}>
        <Text style={styles.questionText}>Ce végétal est un(e) :</Text>

        <View style={styles.optionsGrid}>
          {[
            { label: "a. Algue", value: "algue" },
            { label: "b. Gymnosperme", value: "gymnosperme" },
            { label: "c. Angiosperme", value: "angiosperme" },
            { label: "d. Ptéridophyte", value: "pteridophyte" },
          ].map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.optionButton,
                selectedAnswer === option.value &&
                  (isCorrect ? styles.correctOption : styles.incorrectOption),
              ]}
              onPress={() => handleAnswer(option.value as PlantType)}
              disabled={selectedAnswer !== null}
            >
              <View style={styles.optionCheckbox}>
                {selectedAnswer === option.value && (
                  <Feather
                    name={isCorrect ? "check" : "x"}
                    size={16}
                    color={isCorrect ? "#4CAF50" : "#FF5252"}
                  />
                )}
              </View>
              <Text
                style={[
                  styles.optionText,
                  selectedAnswer === option.value &&
                    (isCorrect
                      ? styles.correctOptionText
                      : styles.incorrectOptionText),
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );

  const renderResult = () => {
    if (!showResult || !currentPlant) return null;

    return (
      <Animatable.View
        animation={isCorrect ? "bounceIn" : "shake"}
        style={[
          styles.resultContainer,
          isCorrect ? styles.correctResult : styles.incorrectResult,
        ]}
      >
        <View style={styles.resultHeader}>
          <Feather
            name={isCorrect ? "check-circle" : "alert-circle"}
            size={24}
            color={isCorrect ? "#4CAF50" : "#FF5252"}
          />
          <Text style={styles.resultHeaderText}>
            {isCorrect ? "Correct !" : "Incorrect !"}
          </Text>
        </View>

        <Text style={styles.resultDescription}>{currentPlant.description}</Text>

        <TouchableOpacity style={styles.nextButton} onPress={handleNextPlant}>
          <LinearGradient
            colors={["#4CAF50", "#2E7D32"]}
            style={styles.nextButtonGradient}
          >
            <Text style={styles.nextButtonText}>Plante suivante</Text>
            <Feather name="arrow-right" size={20} color="white" />
          </LinearGradient>
        </TouchableOpacity>
      </Animatable.View>
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#f5f9fc", "#e0f7fa"]}
        style={styles.background}
      />

      {renderHeader()}

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {renderPlantImage()}
        {renderClassificationTree()}
        {renderQuestionSection()}
        {renderResult()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: 15,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.1)",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  titleContainer: {
    flex: 1,
    marginLeft: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
  scoreContainer: {
    marginLeft: 15,
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  plantImageContainer: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    margin: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  plantImageTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
    textAlign: "center",
  },
  plantImage: {
    width: width * 0.7,
    height: 200,
  },
  treeContainer: {
    margin: 20,
  },
  questionSection: {
    margin: 20,
  },
  answerSection: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  questionText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  optionsGrid: {
    marginTop: 10,
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  correctOption: {
    backgroundColor: "#E8F5E9",
    borderColor: "#4CAF50",
    borderWidth: 1,
  },
  incorrectOption: {
    backgroundColor: "#FFEBEE",
    borderColor: "#FF5252",
    borderWidth: 1,
  },
  optionCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  optionText: {
    fontSize: 16,
    color: "#333",
  },
  correctOptionText: {
    color: "#4CAF50",
    fontWeight: "bold",
  },
  incorrectOptionText: {
    color: "#FF5252",
    fontWeight: "bold",
  },
  resultContainer: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    margin: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  correctResult: {
    borderLeftWidth: 5,
    borderLeftColor: "#4CAF50",
  },
  incorrectResult: {
    borderLeftWidth: 5,
    borderLeftColor: "#FF5252",
  },
  resultHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  resultHeaderText: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
    color: "#333",
  },
  resultDescription: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
    marginBottom: 20,
  },
  nextButton: {
    alignSelf: "center",
    borderRadius: 25,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  nextButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  nextButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    marginRight: 10,
  },
});

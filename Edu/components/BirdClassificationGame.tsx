"use client";

import { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";
import { Audio } from "expo-av";
import BirdDecisionTree from "./BirdDecisionTree";

const { width } = Dimensions.get("window");

type Bird = {
  id: number;
  name: string;
  frenchName: string;
  iconName: string;
  iconType: "Ionicons" | "MaterialCommunityIcons";
  iconColor: string;
  type: "blue_tit" | "crested_tit" | "great_tit" | "coal_tit";
  description: string;
  features: string[];
};

type BirdClassificationGameProps = {
  onBack: () => void;
};

const birds: Bird[] = [
  {
    id: 1,
    name: "Blue Tit",
    frenchName: "Mésange bleue",
    iconName: "bird",
    iconType: "MaterialCommunityIcons",
    iconColor: "#1E88E5",
    type: "blue_tit",
    description: "The blue tit has a blue cap and white cheeks.",
    features: ["Calotte bleue"],
  },
  {
    id: 2,
    name: "Crested Tit",
    frenchName: "Mésange huppée",
    iconName: "dove",
    iconType: "MaterialCommunityIcons",
    iconColor: "#7B1FA2",
    type: "crested_tit",
    description: "The crested tit has a distinctive crest on its head.",
    features: ["Huppe sur la tête"],
  },
  {
    id: 3,
    name: "Great Tit",
    frenchName: "Mésange charbonnière",
    iconName: "twitter",
    iconType: "Ionicons",
    iconColor: "#FFC107",
    type: "great_tit",
    description:
      "The great tit has a black head, white cheeks, and a yellow breast with a black stripe.",
    features: ["Bec court", "Poitrine jaune barrée de noir"],
  },
  {
    id: 4,
    name: "Coal Tit",
    frenchName: "Mésange noire",
    iconName: "duck",
    iconType: "MaterialCommunityIcons",
    iconColor: "#424242",
    type: "coal_tit",
    description:
      "The coal tit has a black cap, white cheeks, and two white bands on its wings.",
    features: [
      "Bec court",
      "Joues blanches",
      "Deux bandes blanches sur les ailes",
    ],
  },
];

export default function BirdClassificationGame({
  onBack,
}: BirdClassificationGameProps) {
  const [currentBird, setCurrentBird] = useState<Bird>(birds[0]);
  const [showDecisionTree, setShowDecisionTree] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate the bird card when it appears
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Reset state for new bird
    setSelectedAnswer(null);
    setIsCorrect(null);
  }, [currentBird]);

  async function playSound(isCorrect: boolean) {
    const soundFile = isCorrect
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

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    const correct = answer === currentBird.type;
    setIsCorrect(correct);

    // Play sound effect
    playSound(correct);

    if (correct) {
      setScore(score + 10);
      // Move to next bird after a short delay
      setTimeout(() => {
        const nextIndex =
          (birds.findIndex((p) => p.id === currentBird.id) + 1) % birds.length;
        if (nextIndex === 0) {
          setLevel(level + 1);
        }
        setCurrentBird(birds[nextIndex]);
        setShowDecisionTree(false);
      }, 1500);
    }
  };

  const renderIcon = (bird: Bird, size: number) => {
    if (bird.iconType === "Ionicons") {
      return (
        <Ionicons
          name={bird.iconName as any}
          size={size}
          color={bird.iconColor}
        />
      );
    } else {
      return (
        <MaterialCommunityIcons
          name={bird.iconName as any}
          size={size}
          color={bird.iconColor}
        />
      );
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <LinearGradient
        colors={["#E3F2FD", "#BBDEFB"]}
        style={styles.background}
      />

      <View style={styles.scoreContainer}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#2196F3" />
        </TouchableOpacity>

        <Animatable.View
          animation="pulse"
          easing="ease-out"
          iterationCount="infinite"
          duration={2000}
        >
          <LinearGradient
            colors={["#2196F3", "#1976D2"]}
            style={styles.levelBadge}
          >
            <Text style={styles.levelText}>Level {level}</Text>
          </LinearGradient>
        </Animatable.View>

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
          colors={["#2196F3", "#1976D2"]}
          style={styles.activityBadge}
        >
          <Text style={styles.activityNumber}>2</Text>
        </LinearGradient>
        <Text style={styles.activityTitle}>
          Retrouvez les noms des quatre mésanges
        </Text>
      </View>

      <Animated.View
        style={[
          styles.birdCard,
          {
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim,
          },
        ]}
      >
        <LinearGradient
          colors={["rgba(255,255,255,0.8)", "rgba(240,240,240,0.8)"]}
          style={styles.iconContainer}
        >
          <Animatable.View
            animation="pulse"
            easing="ease-out"
            iterationCount="infinite"
            duration={3000}
          >
            {renderIcon(currentBird, width * 0.25)}
          </Animatable.View>
        </LinearGradient>
        <Text style={styles.birdName}>{currentBird.name}</Text>
        <Text style={styles.birdFrenchName}>{currentBird.frenchName}</Text>
      </Animated.View>

      <Animatable.View animation="fadeIn" delay={300}>
        <TouchableOpacity
          style={styles.helpButton}
          onPress={() => setShowDecisionTree(!showDecisionTree)}
        >
          <LinearGradient
            colors={
              showDecisionTree ? ["#FF5252", "#D32F2F"] : ["#2196F3", "#1976D2"]
            }
            style={styles.helpButtonGradient}
          >
            <Ionicons
              name={showDecisionTree ? "close-circle" : "help-circle"}
              size={24}
              color="white"
            />
            <Text style={styles.helpButtonText}>
              {showDecisionTree
                ? "Masquer la clé de détermination"
                : "Afficher la clé de détermination"}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animatable.View>

      {showDecisionTree && (
        <Animatable.View
          animation="fadeIn"
          style={styles.decisionTreeContainer}
        >
          <BirdDecisionTree onSelect={handleAnswer} />
        </Animatable.View>
      )}

      <Animatable.View
        animation="fadeInUp"
        delay={500}
        style={styles.answerContainer}
      >
        <Text style={styles.questionText}>Cet oiseau est une:</Text>

        <View style={styles.optionsGrid}>
          {[
            { label: "Mésange bleue", value: "blue_tit" },
            { label: "Mésange huppée", value: "crested_tit" },
            { label: "Mésange charbonnière", value: "great_tit" },
            { label: "Mésange noire", value: "coal_tit" },
          ].map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.optionButton,
                selectedAnswer === option.value &&
                  (isCorrect ? styles.correctOption : styles.incorrectOption),
              ]}
              onPress={() => handleAnswer(option.value)}
              disabled={selectedAnswer !== null}
            >
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
              {selectedAnswer === option.value && isCorrect && (
                <Ionicons
                  name="checkmark-circle"
                  size={24}
                  color="white"
                  style={styles.resultIcon}
                />
              )}
              {selectedAnswer === option.value && isCorrect === false && (
                <Ionicons
                  name="close-circle"
                  size={24}
                  color="white"
                  style={styles.resultIcon}
                />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {isCorrect === false && (
          <Animatable.View animation="shake" style={styles.feedbackContainer}>
            <Ionicons name="information-circle" size={24} color="#FF5252" />
            <Text style={styles.feedbackText}>
              Essayez encore ! Utilisez la clé de détermination pour vous aider.
            </Text>
          </Animatable.View>
        )}

        {isCorrect === true && (
          <Animatable.View
            animation="bounceIn"
            style={styles.feedbackContainer}
          >
            <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
            <Text style={styles.feedbackText}>{currentBird.description}</Text>
          </Animatable.View>
        )}
      </Animatable.View>
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
  scoreContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
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
  levelBadge: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  levelText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
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
  },
  birdCard: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    margin: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  iconContainer: {
    width: width * 0.5,
    height: width * 0.5,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    borderRadius: width * 0.25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  birdName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  birdFrenchName: {
    fontSize: 18,
    fontStyle: "italic",
    color: "#666",
    marginTop: 5,
  },
  helpButton: {
    alignSelf: "center",
    marginVertical: 15,
    borderRadius: 25,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  helpButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  helpButtonText: {
    marginLeft: 8,
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  decisionTreeContainer: {
    marginHorizontal: 10,
    marginBottom: 20,
  },
  answerContainer: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    margin: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  questionText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  optionsGrid: {
    flexDirection: "column",
    justifyContent: "space-between",
  },
  optionButton: {
    backgroundColor: "#f0f0f0",
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  correctOption: {
    backgroundColor: "#4CAF50",
  },
  incorrectOption: {
    backgroundColor: "#FF5252",
  },
  optionText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  correctOptionText: {
    color: "white",
  },
  incorrectOptionText: {
    color: "white",
  },
  resultIcon: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  feedbackContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    borderRadius: 15,
    padding: 15,
    marginTop: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  feedbackText: {
    marginLeft: 10,
    fontSize: 15,
    color: "#333",
    flex: 1,
  },
});

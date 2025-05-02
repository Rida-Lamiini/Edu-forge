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
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import * as Animatable from "react-native-animatable";
import { Audio } from "expo-av";

const { width } = Dimensions.get("window");

type Language = "en" | "fr";

type Plant = {
  id: number;
  name: {
    en: string;
    fr: string;
  };
  iconName: string;
  iconType: "Ionicons" | "MaterialCommunityIcons";
  iconColor: string;
  type: "angiosperm" | "gymnosperm" | "pteridophyte" | "algae";
  description: {
    en: string;
    fr: string;
  };
};

type PlantClassificationGameProps = {
  onBack: () => void;
};

const plants: Plant[] = [
  {
    id: 1,
    name: {
      en: "Green Beans",
      fr: "Haricots Verts",
    },
    iconName: "seed",
    iconType: "MaterialCommunityIcons",
    iconColor: "#4CAF50",
    type: "angiosperm",
    description: {
      en: "Green beans have seeds inside their pods. They are flowering plants!",
      fr: "Les haricots verts ont des graines à l'intérieur de leurs gousses. Ce sont des plantes à fleurs !",
    },
  },
  {
    id: 2,
    name: {
      en: "Pine Tree",
      fr: "Pin",
    },
    iconName: "pine-tree",
    iconType: "MaterialCommunityIcons",
    iconColor: "#2E7D32",
    type: "gymnosperm",
    description: {
      en: "Pine trees have seeds on their cones, not inside fruits.",
      fr: "Les pins ont des graines sur leurs cônes, pas à l'intérieur des fruits.",
    },
  },
  {
    id: 3,
    name: {
      en: "Fern",
      fr: "Fougère",
    },
    iconName: "grass",
    iconType: "MaterialCommunityIcons",
    iconColor: "#8BC34A",
    type: "pteridophyte",
    description: {
      en: "Ferns have stems and leaves but no seeds. They reproduce with spores!",
      fr: "Les fougères ont des tiges et des feuilles mais pas de graines. Elles se reproduisent avec des spores !",
    },
  },
  {
    id: 4,
    name: {
      en: "Seaweed",
      fr: "Algue Marine",
    },
    iconName: "waves",
    iconType: "MaterialCommunityIcons",
    iconColor: "#00BCD4",
    type: "algae",
    description: {
      en: "Seaweed has no stems or leaves. It lives in water!",
      fr: "Les algues marines n'ont ni tiges ni feuilles. Elles vivent dans l'eau !",
    },
  },
];

export default function A7({
  onBack,
}: PlantClassificationGameProps) {
  const [language, setLanguage] = useState<Language>("fr");
  const [currentPlant, setCurrentPlant] = useState<Plant>(plants[0]);
  const [showDecisionTree, setShowDecisionTree] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [showTryAgain, setShowTryAgain] = useState(false);

  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  const translations = {
    en: {
      level: "Level",
      score: "Score",
      activityTitle: "What type of plant is this?",
      showDecisionTree: "Show Decision Tree",
      hideDecisionTree: "Hide Decision Tree",
      questionText: "This plant is a:",
      tryAgain: "Try again! Use the decision tree to help you.",
      options: {
        algae: "Algae",
        gymnosperm: "Gymnosperm",
        angiosperm: "Angiosperm",
        pteridophyte: "Pteridophyte",
      },
    },
    fr: {
      level: "Niveau",
      score: "Score",
      activityTitle: "Quel type de plante est-ce ?",
      showDecisionTree: "Afficher la clé de détermination",
      hideDecisionTree: "Masquer la clé de détermination",
      questionText: "Cette plante est une :",
      tryAgain:
        "Essayez encore ! Utilisez la clé de détermination pour vous aider.",
      options: {
        algae: "Algue",
        gymnosperm: "Gymnosperme",
        angiosperm: "Angiosperme",
        pteridophyte: "Ptéridophyte",
      },
    },
  };

  const t = translations[language];

  useEffect(() => {
    // Animate the plant card when it appears
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

    // Reset state for new plant
    setSelectedAnswer(null);
    setIsCorrect(null);
    setShowTryAgain(false);
  }, [currentPlant, language]);

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
    const correct = answer === currentPlant.type;
    setIsCorrect(correct);

    // Play sound effect
    playSound(correct);

    if (correct) {
      setScore(score + 10);
      // Move to next plant after a short delay
      setTimeout(() => {
        const nextIndex =
          (plants.findIndex((p) => p.id === currentPlant.id) + 1) %
          plants.length;
        if (nextIndex === 0) {
          setLevel(level + 1);
        }
        setCurrentPlant(plants[nextIndex]);
        setShowDecisionTree(false);
      }, 1500);
    } else {
      setShowTryAgain(true);
    }
  };

  const handleTryAgain = () => {
    setSelectedAnswer(null);
    setIsCorrect(null);
    setShowTryAgain(false);
    setShowDecisionTree(true);
  };

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "fr" : "en");
  };

  const renderIcon = (plant: Plant, size: number) => {
    if (plant.iconType === "Ionicons") {
      return (
        <Ionicons
          name={plant.iconName as any}
          size={size}
          color={plant.iconColor}
        />
      );
    } else {
      return (
        <MaterialCommunityIcons
          name={plant.iconName as any}
          size={size}
          color={plant.iconColor}
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
        colors={["#f5f9fc", "#e0f7fa"]}
        style={styles.background}
      />

      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#4CAF50" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={toggleLanguage}
          style={styles.languageButton}
        >
          <Text style={styles.languageButtonText}>
            {language === "en" ? "FR" : "EN"}
          </Text>
        </TouchableOpacity>

        <Animatable.View
          animation="pulse"
          easing="ease-out"
          iterationCount="infinite"
          duration={2000}
        >
          <LinearGradient
            colors={["#4CAF50", "#2E7D32"]}
            style={styles.levelBadge}
          >
            <Text style={styles.levelText}>
              {t.level} {level}
            </Text>
          </LinearGradient>
        </Animatable.View>

        <Animatable.View animation="bounceIn">
          <LinearGradient
            colors={["#FF5252", "#D32F2F"]}
            style={styles.scoreBadge}
          >
            <Text style={styles.scoreText}>
              {t.score}: {score}
            </Text>
          </LinearGradient>
        </Animatable.View>
      </View>

      <View style={styles.activityHeader}>
        <LinearGradient
          colors={["#FF5252", "#FF7B7B"]}
          style={styles.activityBadge}
        >
          <Text style={styles.activityNumber}>1</Text>
        </LinearGradient>
        <Text style={styles.activityTitle}>{t.activityTitle}</Text>
      </View>

      <Animated.View
        style={[
          styles.plantCard,
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
            {renderIcon(currentPlant, width * 0.25)}
          </Animatable.View>
        </LinearGradient>
        <Text style={styles.plantName}>{currentPlant.name[language]}</Text>
      </Animated.View>

      <Animatable.View animation="fadeIn" delay={300}>
        <TouchableOpacity
          style={styles.helpButton}
          onPress={() => setShowDecisionTree(!showDecisionTree)}
        >
          <LinearGradient
            colors={
              showDecisionTree ? ["#FF5252", "#D32F2F"] : ["#4CAF50", "#2E7D32"]
            }
            style={styles.helpButtonGradient}
          >
            <Ionicons
              name={showDecisionTree ? "close-circle" : "help-circle"}
              size={24}
              color="white"
            />
            <Text style={styles.helpButtonText}>
              {showDecisionTree ? t.hideDecisionTree : t.showDecisionTree}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animatable.View>

      {showDecisionTree && (
        <Animatable.View
          animation="fadeIn"
          style={styles.decisionTreeContainer}
        >
          <PlantDecisionTree onSelect={handleAnswer} language={language} />
        </Animatable.View>
      )}

      <Animatable.View
        animation="fadeInUp"
        delay={500}
        style={styles.answerContainer}
      >
        <Text style={styles.questionText}>{t.questionText}</Text>

        <View style={styles.optionsGrid}>
          {[
            { label: t.options.algae, value: "algae", icon: "waves" },
            {
              label: t.options.gymnosperm,
              value: "gymnosperm",
              icon: "pine-tree",
            },
            { label: t.options.angiosperm, value: "angiosperm", icon: "seed" },
            {
              label: t.options.pteridophyte,
              value: "pteridophyte",
              icon: "grass",
            },
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
              <MaterialCommunityIcons
                name={option.icon as any}
                size={24}
                color={selectedAnswer === option.value ? "white" : "#555"}
                style={styles.optionIcon}
              />
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

        {isCorrect === false && showTryAgain && (
          <Animatable.View animation="fadeIn" style={styles.feedbackContainer}>
            <Ionicons name="information-circle" size={24} color="#FF5252" />
            <Text style={styles.feedbackText}>{t.tryAgain}</Text>
            <TouchableOpacity
              style={styles.tryAgainButton}
              onPress={handleTryAgain}
            >
              <LinearGradient
                colors={["#FF9800", "#F57C00"]}
                style={styles.tryAgainButtonGradient}
              >
                <Text style={styles.tryAgainButtonText}>
                  {language === "en" ? "Try Again" : "Réessayer"}
                </Text>
                <Ionicons name="refresh-cw" size={20} color="white" />
              </LinearGradient>
            </TouchableOpacity>
          </Animatable.View>
        )}

        {isCorrect === true && (
          <Animatable.View
            animation="bounceIn"
            style={styles.feedbackContainer}
          >
            <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
            <Text style={styles.feedbackText}>
              {currentPlant.description[language]}
            </Text>
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
  header: {
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
  languageButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  languageButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4CAF50",
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
  plantCard: {
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
  plantName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
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
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  optionButton: {
    width: "48%",
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
  optionIcon: {
    marginRight: 8,
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
  tryAgainButton: {
    borderRadius: 20,
    overflow: "hidden",
    marginLeft: 10,
  },
  tryAgainButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  tryAgainButtonText: {
    color: "white",
    fontWeight: "bold",
    marginRight: 5,
  },
});

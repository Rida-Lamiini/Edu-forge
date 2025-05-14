"use client";

import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Animated,
  Platform,
  useWindowDimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";
import { Audio } from "expo-av";
import BirdDecisionTree from "./BirdDecisionTree";

type BirdType =
  | "mesange_bleue"
  | "mesange_huppee"
  | "mesange_charbonniere"
  | "mesange_noire";

type Bird = {
  id: number;
  type: BirdType;
  image: any;
  characteristics: string[];
};

type BirdClassificationGameProps = {
  onBack: () => void;
};

export default function BirdClassificationGame({
  onBack,
}: BirdClassificationGameProps) {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const isMobile = width < 768;

  const [score, setScore] = useState(0);
  const [currentBirdIndex, setCurrentBirdIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<BirdType | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [showKey, setShowKey] = useState(false);
  const [selectedCharacteristics, setSelectedCharacteristics] = useState<
    string[]
  >([]);
  const [zoomedImage, setZoomedImage] = useState(false);
  const [showTryAgain, setShowTryAgain] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  // Birds data
  const birds: Bird[] = [
    {
      id: 1,
      type: "mesange_bleue",
      image: require("../assets/images/blue-tit.png"),
      characteristics: ["blue_cap", "small_size", "yellow_underparts"],
    },
    {
      id: 2,
      type: "mesange_huppee",
      image: require("../assets/images/crested-tit.png"),
      characteristics: ["crest", "small_size", "white_cheeks"],
    },
    {
      id: 3,
      type: "mesange_charbonniere",
      image: require("../assets/images/great-tit.png"),
      characteristics: ["black_cap", "yellow_underparts", "black_stripe"],
    },
    {
      id: 4,
      type: "mesange_noire",
      image: require("../assets/images/coal-tit.png"),
      characteristics: ["black_cap", "white_cheeks", "white_nape"],
    },
  ];

  // French translations only
  const t = {
    title: "Identification des Oiseaux",
    subtitle: "Identifiez les quatre espèces de mésanges",
    story:
      "Salma, une fille de 11 ans passionnée par les animaux de son jardin, a photographié plusieurs mésanges qui se ressemblent. Curieuse d'en savoir plus, elle consulte un livre sur les mésanges avec une clé de détermination.",
    useKey: "Utiliser la clé",
    directAnswer: "Répondre directement",
    identify: "Identifiez cet oiseau :",
    startHere: "Commencez ici",
    characteristics: "Sélectionnez les caractéristiques que vous observez :",
    result: "Votre identification :",
    correct: "Bravo ! Vous avez correctement identifié la",
    incorrect:
      "Ce n'est pas correct. Essayez d'utiliser la clé de détermination pour vous aider.",
    next: "Oiseau suivant",
    complete: "Activité terminée !",
    score: "Score",
    info: "Informations sur l'oiseau",
    closeInfo: "Fermer",
    keyTitle: "Clé de Détermination",
    tryAgain: "Réessayer",
    birdNames: {
      mesange_bleue: "Mésange bleue",
      mesange_huppee: "Mésange huppée",
      mesange_charbonniere: "Mésange charbonnière",
      mesange_noire: "Mésange noire",
    },
    characteristics: {
      blue_cap: "Calotte bleue",
      black_cap: "Calotte noire",
      crest: "Huppe sur la tête",
      small_size: "Petite taille",
      yellow_underparts: "Ventre jaune",
      white_cheeks: "Joues blanches",
      black_stripe: "Bande noire sur le ventre",
      white_nape: "Tache blanche sur la nuque",
    },
    birdInfo: {
      mesange_bleue:
        "La Mésange bleue est un petit oiseau coloré avec une couronne bleue, un ventre jaune et des joues blanches. Elle est commune dans les jardins et les forêts à travers l'Europe.",
      mesange_huppee:
        "La Mésange huppée a une huppe pointue distinctive sur sa tête. Elle préfère les forêts de conifères et est moins commune dans les jardins que les autres espèces de mésanges.",
      mesange_charbonniere:
        "La Mésange charbonnière est la plus grande des mésanges européennes avec une tête noire, des joues blanches et une poitrine jaune avec une bande noire au milieu.",
      mesange_noire:
        "La Mésange noire est petite avec une calotte noire, des joues blanches et une tache blanche sur la nuque. Elle a un bec plus petit et plus fin que les autres mésanges.",
    },
  };

  // Responsive styles
  const responsiveStyles = {
    containerPadding: isMobile ? 10 : 20,
    birdImageSize: isMobile
      ? { width: 221, height: 160 }
      : { width: 280, height: 200 },
    zoomedImageSize: isMobile
      ? { width: 300, height: 300 }
      : { width: 350, height: 350 },
    fontSize: {
      title: isMobile ? 18 : 20,
      subtitle: isMobile ? 12 : 14,
      storyText: isMobile ? 14 : 16,
      answerText: isMobile ? 14 : 16,
    },
    decisionRow: {
      flexDirection: isMobile ? "column" : "row",
      alignItems: "center",
    },
    nodeMargin: isMobile ? { marginVertical: 5 } : { marginHorizontal: 10 },
  };

  useEffect(() => {
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

    // Reset state when bird changes
    setSelectedAnswer(null);
    setIsCorrect(null);
    setSelectedCharacteristics([]);
    setZoomedImage(false);
    setShowTryAgain(false);

    // Animate in the new content
    fadeAnim.setValue(0);
    scaleAnim.setValue(0.95);
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
  }, [currentBirdIndex]);

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

  const handleAnswer = (answer: BirdType) => {
    const correct = answer === birds[currentBirdIndex].type;
    setSelectedAnswer(answer);
    setIsCorrect(correct);
    playSound(correct);

    if (correct) {
      setScore(score + 10);
    } else {
      setShowTryAgain(true);
    }
  };

  const handleNextBird = () => {
    if (currentBirdIndex < birds.length - 1) {
      setCurrentBirdIndex(currentBirdIndex + 1);
    } else {
      alert(`${t.complete} ${t.score}: ${score + (isCorrect ? 10 : 0)}`);
    }
  };

  const handleTryAgain = () => {
    setSelectedAnswer(null);
    setIsCorrect(null);
    setShowTryAgain(false);
    setShowKey(true);
  };

  const renderHeader = () => (
    <View style={[styles.header, isLandscape && styles.headerLandscape]}>
      <View style={styles.headerLeft}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#2196F3" />
        </TouchableOpacity>

        <View style={styles.titleContainer}>
          <Text
            style={[
              styles.title,
              { fontSize: responsiveStyles.fontSize.title },
            ]}
          >
            {t.title}
          </Text>
          <Text
            style={[
              styles.subtitle,
              { fontSize: responsiveStyles.fontSize.subtitle },
            ]}
          >
            {t.subtitle}
          </Text>
        </View>
      </View>

      <View style={styles.scoreContainer}>
        <LinearGradient
          colors={["#4CAF50", "#388E3C"]}
          style={styles.scoreBadge}
        >
          <Text style={styles.scoreText}>
            {t.score}: {score}
          </Text>
        </LinearGradient>
      </View>
    </View>
  );

  const renderStory = () => (
    <Animated.View
      style={[
        styles.storyContainer,
        { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
      ]}
    >
      <Text
        style={[
          styles.storyText,
          { fontSize: responsiveStyles.fontSize.storyText },
        ]}
      >
        {t.story}
      </Text>
    </Animated.View>
  );

  const renderBirdImage = () => (
    <Animated.View
      style={[
        styles.birdCardContainer,
        { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
        zoomedImage && styles.zoomedImageContainer,
      ]}
    >
      <TouchableOpacity
        style={styles.birdImageContainer}
        onPress={() => setZoomedImage(!zoomedImage)}
        activeOpacity={0.9}
      >
        <View style={styles.birdNumberBadge}>
          <Text style={styles.birdNumberText}>{currentBirdIndex + 1}</Text>
        </View>

        <Image
          source={birds[currentBirdIndex].image}
          style={[
            styles.birdImage,
            zoomedImage
              ? responsiveStyles.zoomedImageSize
              : responsiveStyles.birdImageSize,
          ]}
          resizeMode="contain"
        />

        <View style={styles.zoomIndicator}>
          <Feather
            name={zoomedImage ? "minimize" : "maximize"}
            size={16}
            color="#666"
          />
        </View>
      </TouchableOpacity>

      {!zoomedImage && (
        <View style={styles.birdCardActions}>
          <TouchableOpacity
            style={[
              styles.keyToggleButton,
              showKey && styles.keyToggleButtonActive,
            ]}
            onPress={() => setShowKey(!showKey)}
          >
            <Feather
              name={showKey ? "list" : "key"}
              size={20}
              color={showKey ? "#FF5252" : "#2196F3"}
            />
            <Text
              style={[
                styles.keyToggleText,
                showKey && styles.keyToggleTextActive,
              ]}
            >
              {showKey ? t.directAnswer : t.useKey}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </Animated.View>
  );

  const renderFeedback = () => {
    if (isCorrect === null) return null;

    return (
      <Animatable.View
        animation={isCorrect ? "bounceIn" : "shake"}
        style={[
          styles.feedbackContainer,
          isCorrect ? styles.correctFeedback : styles.incorrectFeedback,
        ]}
      >
        <Feather
          name={isCorrect ? "check-circle" : "alert-circle"}
          size={24}
          color={isCorrect ? "#4CAF50" : "#FF5252"}
        />

        <Text style={styles.feedbackText}>
          {isCorrect
            ? `${t.correct} ${t.birdNames[birds[currentBirdIndex].type]}.`
            : t.incorrect}
        </Text>

        {isCorrect ? (
          <TouchableOpacity style={styles.nextButton} onPress={handleNextBird}>
            <LinearGradient
              colors={["#4CAF50", "#388E3C"]}
              style={styles.nextButtonGradient}
            >
              <Text style={styles.nextButtonText}>{t.next}</Text>
              <Feather name="arrow-right" size={16} color="white" />
            </LinearGradient>
          </TouchableOpacity>
        ) : (
          showTryAgain && (
            <TouchableOpacity
              style={styles.tryAgainButton}
              onPress={handleTryAgain}
            >
              <LinearGradient
                colors={["#FF9800", "#F57C00"]}
                style={styles.tryAgainButtonGradient}
              >
                <Text style={styles.tryAgainButtonText}>{t.tryAgain}</Text>
                <Feather name="refresh-cw" size={16} color="white" />
              </LinearGradient>
            </TouchableOpacity>
          )
        )}
      </Animatable.View>
    );
  };

  const renderDeterminationKey = () => {
    if (!showKey) return null;

    return (
      <Animated.View
        style={[
          styles.keyContainer,
          { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
        ]}
      >
        <BirdDecisionTree onSelect={handleAnswer} language="fr" />
      </Animated.View>
    );
  };

  const renderDirectAnswers = () => {
    if (showKey) return null;

    return (
      <Animated.View
        style={[
          styles.answersContainer,
          { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
        ]}
      >
        <Text style={styles.answersTitle}>{t.identify}</Text>

        <View style={styles.answersGrid}>
          {Object.entries(t.birdNames).map(([type, name]) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.answerButton,
                selectedAnswer === type &&
                  (isCorrect ? styles.correctAnswer : styles.incorrectAnswer),
              ]}
              onPress={() => handleAnswer(type as BirdType)}
              disabled={selectedAnswer !== null}
            >
              <Text
                style={[
                  styles.answerText,
                  selectedAnswer === type &&
                    (isCorrect
                      ? styles.correctAnswerText
                      : styles.incorrectAnswerText),
                  { fontSize: responsiveStyles.fontSize.answerText },
                ]}
              >
                {name}
              </Text>

              {selectedAnswer === type && (
                <Feather
                  name={isCorrect ? "check" : "x"}
                  size={20}
                  color="white"
                  style={styles.answerIcon}
                />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>
    );
  };

  return (
    <View
      style={[styles.container, { padding: responsiveStyles.containerPadding }]}
    >
      <LinearGradient
        colors={["#E3F2FD", "#BBDEFB", "#90CAF9"]}
        style={styles.background}
      />

      {renderHeader()}

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          isLandscape && styles.scrollContentLandscape,
        ]}
      >
        {renderStory()}

        <View
          style={[
            styles.mainContent,
            isLandscape && styles.mainContentLandscape,
          ]}
        >
          {renderBirdImage()}

          <View
            style={[
              styles.interactionArea,
              isLandscape && styles.interactionAreaLandscape,
            ]}
          >
            {renderDeterminationKey()}
            {renderDirectAnswers()}
            {renderFeedback()}
          </View>
        </View>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  scrollContentLandscape: {
    paddingHorizontal: 20,
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
  headerLandscape: {
    paddingTop: 20,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
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
    marginRight: 15,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontWeight: "bold",
    color: "#333",
  },
  subtitle: {
    color: "#666",
    marginTop: 2,
  },
  scoreContainer: {
    borderRadius: 20,
    overflow: "hidden",
    marginLeft: 10,
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
  storyContainer: {
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
  storyText: {
    lineHeight: 24,
    color: "#333",
  },
  mainContent: {
    flexDirection: "column",
  },
  mainContentLandscape: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  birdCardContainer: {
    marginBottom: 10,
    alignSelf: "center",
  },
  zoomedImageContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    zIndex: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  birdImageContainer: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: "relative",
  },
  birdNumberBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  birdNumberText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  birdImage: {
    marginBottom: 10,
  },
  zoomIndicator: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  birdCardActions: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  keyToggleButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  keyToggleButtonActive: {
    backgroundColor: "#FFEBEE",
  },
  keyToggleText: {
    marginLeft: 5,
    color: "#2196F3",
    fontWeight: "500",
  },
  keyToggleTextActive: {
    color: "#FF5252",
  },
  interactionArea: {
    flex: 1,
    marginHorizontal: 20,
  },
  interactionAreaLandscape: {
    marginLeft: 0,
  },
  keyContainer: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
    overflow: "hidden",
  },
  answersContainer: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  answersTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
    textAlign: "center",
  },
  answersGrid: {
    flexDirection: "column",
  },
  answerButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    padding: 15,
    marginVertical: 5,
  },
  correctAnswer: {
    backgroundColor: "#4CAF50",
  },
  incorrectAnswer: {
    backgroundColor: "#FF5252",
  },
  answerText: {
    color: "#333",
    fontWeight: "500",
  },
  correctAnswerText: {
    color: "white",
  },
  incorrectAnswerText: {
    color: "white",
  },
  answerIcon: {
    marginLeft: 10,
  },
  feedbackContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  correctFeedback: {
    borderLeftWidth: 4,
    borderLeftColor: "#4CAF50",
  },
  incorrectFeedback: {
    borderLeftWidth: 4,
    borderLeftColor: "#FF5252",
  },
  feedbackText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  nextButton: {
    borderRadius: 20,
    overflow: "hidden",
    marginLeft: 10,
  },
  nextButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  nextButtonText: {
    color: "white",
    fontWeight: "bold",
    marginRight: 5,
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

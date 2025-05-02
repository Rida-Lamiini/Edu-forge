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
  PanResponder,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";
import { Audio } from "expo-av";
import { BlurView } from "expo-blur";

type RespirationMode = "aerial" | "aquatic" | "both";
type RespirationOrgan = "gills" | "lungs" | "skin";
type CategoryPosition = `${RespirationOrgan}-${RespirationMode}`;
type AnimalPosition = "pond" | CategoryPosition;

type Animal = {
  id: number;
  name: string;
  image: any;
  respirationMode: RespirationMode;
  respirationOrgan: RespirationOrgan;
  position: AnimalPosition;
  initialX?: number;
  initialY?: number;
  x?: number;
  y?: number;
};

type Category = {
  id: CategoryPosition;
  organ: RespirationOrgan;
  mode: RespirationMode;
  icon: string;
  color: string;
  animals: Animal[];
};

type PondRespirationActivityProps = {
  onBack: () => void;
};

export default function A8({
  onBack,
}: PondRespirationActivityProps) {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const isMobile = width < 768;

  const [score, setScore] = useState(0);
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [draggingAnimal, setDraggingAnimal] = useState<Animal | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  const [infoAnimal, setInfoAnimal] = useState<Animal | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [categoryRefs, setCategoryRefs] = useState<{
    [key: string]: { x: number; y: number; width: number; height: number };
  }>({});
  const [showHint, setShowHint] = useState(false);
  const [expandedCategory, setExpandedCategory] =
    useState<CategoryPosition | null>(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const pan = useRef(new Animated.ValueXY()).current;

  // Define the animals
  const initialAnimals: Animal[] = [
    {
      id: 1,
      name: "Libellule",
      image: require("../assets/images/dragonfly.png"),
      respirationMode: "aerial",
      respirationOrgan: "lungs",
      position: "pond",
    },
    {
      id: 2,
      name: "Poisson rouge",
      image: require("../assets/images/goldfish.png"),
      respirationMode: "aquatic",
      respirationOrgan: "gills",
      position: "pond",
    },
    {
      id: 3,
      name: "Grenouille",
      image: require("../assets/images/frog.png"),
      respirationMode: "both",
      respirationOrgan: "lungs",
      position: "pond",
    },
    {
      id: 4,
      name: "Escargot aquatique",
      image: require("../assets/images/water-snail.png"),
      respirationMode: "aquatic",
      respirationOrgan: "gills",
      position: "pond",
    },
    {
      id: 5,
      name: "Carpe",
      image: require("../assets/images/carp.png"),
      respirationMode: "aquatic",
      respirationOrgan: "gills",
      position: "pond",
    },
    {
      id: 6,
      name: "Têtard",
      image: require("../assets/images/tadpole.png"),
      respirationMode: "aquatic",
      respirationOrgan: "gills",
      position: "pond",
    },
  ];

  // Initialize categories
  useEffect(() => {
    const organs: RespirationOrgan[] = ["gills", "lungs", "skin"];
    const modes: RespirationMode[] = ["aerial", "aquatic", "both"];

    const categoryColors = {
      gills: {
        aerial: "#FF9800",
        aquatic: "#2196F3",
        both: "#9C27B0",
      },
      lungs: {
        aerial: "#F44336",
        aquatic: "#3F51B5",
        both: "#009688",
      },
      skin: {
        aerial: "#FF5722",
        aquatic: "#00BCD4",
        both: "#8BC34A",
      },
    };

    const categoryIcons = {
      gills: "fish",
      lungs: "lungs",
      skin: "human-handsdown",
    };

    const newCategories: Category[] = [];

    organs.forEach((organ) => {
      modes.forEach((mode) => {
        const id = `${organ}-${mode}` as CategoryPosition;
        newCategories.push({
          id,
          organ,
          mode,
          icon: categoryIcons[organ],
          color: categoryColors[organ][mode],
          animals: [],
        });
      });
    });

    setCategories(newCategories);
  }, []);

  // French translations
  const t = {
    title: "Les modes de respiration dans un étang",
    subtitle: "Chapitre 2 - Règne Animal",
    instructions:
      "Faites glisser les animaux dans les catégories selon leurs modes et organes de respiration.",
    checkAnswer: "Vérifier",
    tryAgain: "Réessayer",
    continue: "Continuer",
    correct: "Correct ! Bien joué !",
    incorrect: "Pas tout à fait correct. Essayez encore !",
    complete: "Activité terminée !",
    score: "Score",
    info: "Information sur l'animal",
    closeInfo: "Fermer",
    respirationModes: {
      aerial: "Respiration aérienne",
      aquatic: "Respiration aquatique",
      both: "Les deux types",
    },
    respirationOrgans: {
      gills: "Branchies",
      lungs: "Poumons",
      skin: "Peau",
    },
    dragInstructions:
      "Appuyez et maintenez un animal, puis faites-le glisser vers la catégorie correcte",
    showHint: "Afficher les indices",
    hideHint: "Masquer les indices",
    dropHere: "Déposez ici",
    animalInfo: {
      1: "Les libellules respirent l'air par un système trachéal. En tant que larves, elles ont des branchies.",
      2: "Le poisson rouge respire sous l'eau à l'aide de branchies qui extraient l'oxygène de l'eau.",
      3: "Les grenouilles peuvent respirer par leurs poumons et aussi partiellement par leur peau.",
      4: "Les escargots aquatiques utilisent des branchies pour respirer sous l'eau.",
      5: "La carpe, comme les autres poissons, utilise des branchies pour extraire l'oxygène de l'eau.",
      6: "Les têtards respirent par des branchies avant de développer des poumons en devenant des grenouilles.",
    },
    hints: {
      1: "Les libellules respirent l'air en utilisant un système trachéal (similaire aux poumons).",
      2: "Les poissons utilisent des branchies pour extraire l'oxygène de l'eau.",
      3: "Les grenouilles peuvent respirer à la fois dans l'air et dans l'eau en utilisant différents organes.",
      4: "Les escargots aquatiques extraient l'oxygène de l'eau.",
      5: "Les carpes sont des poissons qui vivent sous l'eau toute leur vie.",
      6: "Les têtards sont le stade larvaire des grenouilles et vivent entièrement sous l'eau.",
    },
  };

  // Responsive styles
  const responsiveStyles = {
    containerPadding: isMobile ? 10 : 20,
    animalImageSize: isMobile ? 40 : 50,
    categorySize: isMobile ? 100 : 120,
    fontSize: {
      title: isMobile ? 18 : 20,
      subtitle: isMobile ? 12 : 14,
      instructions: isMobile ? 14 : 16,
      categoryLabel: isMobile ? 12 : 14,
    },
    pondImageSize: {
      width: isMobile ? 300 : 350,
      height: isMobile ? 200 : 250,
    },
  };

  // Set up pan responder for drag and drop
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        pan.setOffset({
          x: pan.x._value,
          y: pan.y._value,
        });
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (e, gesture) => {
        pan.flattenOffset();

        if (!draggingAnimal) return;

        // Check if the animal is dropped on a category
        let droppedOnCategory = false;
        let targetCategory: CategoryPosition | null = null;

        Object.entries(categoryRefs).forEach(([categoryId, categoryRect]) => {
          if (
            gesture.moveX > categoryRect.x &&
            gesture.moveX < categoryRect.x + categoryRect.width &&
            gesture.moveY > categoryRect.y &&
            gesture.moveY < categoryRect.y + categoryRect.height
          ) {
            droppedOnCategory = true;
            targetCategory = categoryId as CategoryPosition;
          }
        });

        if (droppedOnCategory && targetCategory) {
          // Update animal position
          const updatedAnimals = animals.map((animal) => {
            if (animal.id === draggingAnimal.id) {
              return {
                ...animal,
                position: targetCategory as AnimalPosition,
                x: 0,
                y: 0,
              };
            }
            return animal;
          });

          setAnimals(updatedAnimals);
          playSound(true);

          // Expand the category where the animal was dropped
          setExpandedCategory(targetCategory);
        } else {
          // Return to original position
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
          }).start();
        }

        setDraggingAnimal(null);
      },
    })
  ).current;

  useEffect(() => {
    // Initialize animals with random positions in the pond
    const animalsWithPositions = initialAnimals.map((animal, index) => {
      const angle = (index / initialAnimals.length) * 2 * Math.PI;
      const radius = isMobile ? 60 : 80;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;

      return {
        ...animal,
        initialX: x,
        initialY: y,
        x,
        y,
      };
    });

    setAnimals(animalsWithPositions);

    // Animate in the content
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
  }, []);

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

  const handleAnimalPress = (animal: Animal) => {
    if (animal.position !== "pond") return;
    setDraggingAnimal(animal);
  };

  const handleAnimalInfo = (animal: Animal) => {
    setInfoAnimal(animal);
    setShowInfo(true);
  };

  const handleCategoryLayout = (categoryId: string, event: any) => {
    const { x, y, width, height } = event.nativeEvent.layout;
    setCategoryRefs((prev) => ({
      ...prev,
      [categoryId]: { x, y, width, height },
    }));
  };

  const handleCheckAnswer = () => {
    // Check if all animals are placed in categories
    const allPlaced = animals.every((animal) => animal.position !== "pond");

    if (!allPlaced) {
      alert("Placez d'abord tous les animaux dans les catégories !");
      return;
    }

    // Check if all placements are correct
    const allCorrect = animals.every((animal) => {
      const correctPosition =
        `${animal.respirationOrgan}-${animal.respirationMode}` as CategoryPosition;
      return animal.position === correctPosition;
    });

    setIsCorrect(allCorrect);
    setShowFeedback(true);
    playSound(allCorrect);

    if (allCorrect) {
      setScore(score + 10);
      setIsComplete(true);
    }
  };

  const handleReset = () => {
    // Reset animals to their initial positions
    const resetAnimals = animals.map((animal) => ({
      ...animal,
      position: "pond",
      x: animal.initialX,
      y: animal.initialY,
    }));

    setAnimals(resetAnimals);
    setShowFeedback(false);
    setIsCorrect(null);
    setExpandedCategory(null);
  };

  const toggleHint = () => {
    setShowHint(!showHint);
  };

  const toggleCategoryExpansion = (categoryId: CategoryPosition) => {
    if (expandedCategory === categoryId) {
      setExpandedCategory(null);
    } else {
      setExpandedCategory(categoryId);
    }
  };

  const getAnimalsInCategory = (categoryId: CategoryPosition) => {
    return animals.filter((animal) => animal.position === categoryId);
  };

  const renderHeader = () => (
    <View style={[styles.header, isLandscape && styles.headerLandscape]}>
      <View style={styles.headerLeft}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#FF9800" />
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

  const renderInstructions = () => (
    <Animated.View
      style={[
        styles.instructionsContainer,
        { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
      ]}
    >
      <Text
        style={[
          styles.instructionsText,
          { fontSize: responsiveStyles.fontSize.instructions },
        ]}
      >
        {t.instructions}
      </Text>
      <Text style={styles.dragInstructionsText}>{t.dragInstructions}</Text>

      <TouchableOpacity style={styles.hintButton} onPress={toggleHint}>
        <LinearGradient
          colors={showHint ? ["#FF9800", "#F57C00"] : ["#9E9E9E", "#757575"]}
          style={styles.hintButtonGradient}
        >
          <Feather
            name={showHint ? "eye-off" : "eye"}
            size={16}
            color="white"
            style={styles.hintIcon}
          />
          <Text style={styles.hintButtonText}>
            {showHint ? t.hideHint : t.showHint}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderPondImage = () => (
    <Animated.View
      style={[
        styles.pondImageContainer,
        { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
      ]}
    >
      <Image
        source={require("../assets/images/pond-ecosystem.png")}
        style={responsiveStyles.pondImageSize}
        resizeMode="contain"
      />

      {animals
        .filter((animal) => animal.position === "pond")
        .map((animal) => (
          <Animated.View
            key={animal.id}
            style={[
              styles.animalContainer,
              {
                transform:
                  draggingAnimal?.id === animal.id
                    ? [{ translateX: pan.x }, { translateY: pan.y }]
                    : [],
                top: 50 + (animal.y || 0),
                left: 20 + (animal.x || 0),
              },
            ]}
            {...(draggingAnimal?.id === animal.id
              ? panResponder.panHandlers
              : {})}
          >
            <TouchableOpacity
              style={[
                styles.animalButton,
                draggingAnimal?.id === animal.id && styles.draggingAnimalButton,
              ]}
              onPress={() => handleAnimalPress(animal)}
              onLongPress={() => handleAnimalInfo(animal)}
            >
              <View style={styles.animalNumberBadge}>
                <Text style={styles.animalNumberText}>{animal.id}</Text>
              </View>
              <Image
                source={animal.image}
                style={{
                  width: responsiveStyles.animalImageSize,
                  height: responsiveStyles.animalImageSize,
                }}
                resizeMode="contain"
              />

              {showHint && (
                <Animatable.View animation="fadeIn" style={styles.hintBubble}>
                  <Text style={styles.hintText}>{t.hints[animal.id]}</Text>
                </Animatable.View>
              )}
            </TouchableOpacity>
          </Animated.View>
        ))}
    </Animated.View>
  );

  const renderCategories = () => (
    <Animated.View
      style={[
        styles.categoriesContainer,
        { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
      ]}
    >
      <View style={styles.categoriesHeader}>
        <View style={styles.organLabelsContainer}>
          <Text style={styles.organLabel}>{t.respirationOrgans.gills}</Text>
          <Text style={styles.organLabel}>{t.respirationOrgans.lungs}</Text>
          <Text style={styles.organLabel}>{t.respirationOrgans.skin}</Text>
        </View>
      </View>

      <View style={styles.categoriesContent}>
        <View style={styles.modeLabelsContainer}>
          <Text style={styles.modeLabel}>{t.respirationModes.aerial}</Text>
          <Text style={styles.modeLabel}>{t.respirationModes.aquatic}</Text>
          <Text style={styles.modeLabel}>{t.respirationModes.both}</Text>
        </View>

        <View style={styles.categoriesGrid}>
          {categories.map((category) => {
            const isExpanded = expandedCategory === category.id;
            const animalsInCategory = getAnimalsInCategory(category.id);

            return (
              <Animatable.View
                key={category.id}
                animation="fadeIn"
                style={styles.categoryWrapper}
              >
                <TouchableOpacity
                  style={[
                    styles.categoryCard,
                    {
                      height:
                        isExpanded && animalsInCategory.length > 0
                          ? responsiveStyles.categorySize * 1.5
                          : responsiveStyles.categorySize,
                      backgroundColor: `${category.color}20`, // 20% opacity
                    },
                    isExpanded && styles.expandedCategory,
                  ]}
                  onPress={() => toggleCategoryExpansion(category.id)}
                  onLayout={(event) => handleCategoryLayout(category.id, event)}
                >
                  <LinearGradient
                    colors={[category.color, `${category.color}80`]}
                    style={styles.categoryHeader}
                  >
                    <MaterialCommunityIcons
                      name={category.icon}
                      size={24}
                      color="white"
                    />
                  </LinearGradient>

                  {animalsInCategory.length === 0 ? (
                    <View style={styles.emptyCategory}>
                      <Text style={styles.emptyCategoryText}>{t.dropHere}</Text>
                    </View>
                  ) : (
                    <View style={styles.categoryAnimals}>
                      {animalsInCategory.map((animal) => (
                        <View key={animal.id} style={styles.categoryAnimal}>
                          <View style={styles.categoryAnimalNumberBadge}>
                            <Text style={styles.categoryAnimalNumberText}>
                              {animal.id}
                            </Text>
                          </View>
                          <Image
                            source={animal.image}
                            style={styles.categoryAnimalImage}
                            resizeMode="contain"
                          />
                        </View>
                      ))}
                    </View>
                  )}

                  {isExpanded && animalsInCategory.length > 0 && (
                    <Animatable.View
                      animation="fadeIn"
                      style={styles.categoryDetails}
                    >
                      {animalsInCategory.map((animal) => (
                        <Text key={animal.id} style={styles.categoryDetailText}>
                          {animal.id}. {animal.name}
                        </Text>
                      ))}
                    </Animatable.View>
                  )}
                </TouchableOpacity>
              </Animatable.View>
            );
          })}
        </View>
      </View>
    </Animated.View>
  );

  const renderActionButtons = () => (
    <View style={styles.actionButtonsContainer}>
      {!isComplete ? (
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleCheckAnswer}
        >
          <LinearGradient
            colors={["#FF9800", "#F57C00"]}
            style={styles.actionButtonGradient}
          >
            <Text style={styles.actionButtonText}>{t.checkAnswer}</Text>
          </LinearGradient>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.actionButton} onPress={onBack}>
          <LinearGradient
            colors={["#4CAF50", "#388E3C"]}
            style={styles.actionButtonGradient}
          >
            <Text style={styles.actionButtonText}>{t.continue}</Text>
          </LinearGradient>
        </TouchableOpacity>
      )}

      {showFeedback && !isComplete && (
        <TouchableOpacity style={styles.actionButton} onPress={handleReset}>
          <LinearGradient
            colors={["#9E9E9E", "#757575"]}
            style={styles.actionButtonGradient}
          >
            <Text style={styles.actionButtonText}>{t.tryAgain}</Text>
          </LinearGradient>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderFeedback = () => {
    if (!showFeedback) return null;

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
          {isCorrect ? t.correct : t.incorrect}
        </Text>
      </Animatable.View>
    );
  };

  const renderAnimalInfo = () => {
    if (!showInfo || !infoAnimal) return null;

    return (
      <View style={styles.infoOverlay}>
        <BlurView intensity={80} style={styles.blurBackground} tint="dark">
          <View style={styles.infoCard}>
            <View style={styles.infoHeader}>
              <Text style={styles.infoTitle}>{infoAnimal.name}</Text>
              <TouchableOpacity onPress={() => setShowInfo(false)}>
                <Feather name="x" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <Image
              source={infoAnimal.image}
              style={styles.infoImage}
              resizeMode="contain"
            />

            <Text style={styles.infoDescription}>
              {t.animalInfo[infoAnimal.id]}
            </Text>

            <TouchableOpacity
              style={styles.closeInfoButton}
              onPress={() => setShowInfo(false)}
            >
              <Text style={styles.closeInfoText}>{t.closeInfo}</Text>
            </TouchableOpacity>
          </View>
        </BlurView>
      </View>
    );
  };

  return (
    <View
      style={[styles.container, { padding: responsiveStyles.containerPadding }]}
    >
      <LinearGradient
        colors={["#FFF3E0", "#FFE0B2", "#FFCC80"]}
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
        {renderInstructions()}

        <View
          style={[
            styles.mainContent,
            isLandscape && styles.mainContentLandscape,
          ]}
        >
          {renderPondImage()}

          <View
            style={[
              styles.interactionArea,
              isLandscape && styles.interactionAreaLandscape,
            ]}
          >
            {renderCategories()}
            {renderFeedback()}
            {renderActionButtons()}
          </View>
        </View>
      </ScrollView>

      {renderAnimalInfo()}
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
  instructionsContainer: {
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
  instructionsText: {
    lineHeight: 24,
    color: "#333",
    marginBottom: 10,
  },
  dragInstructionsText: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#666",
    marginBottom: 15,
  },
  hintButton: {
    alignSelf: "center",
    borderRadius: 20,
    overflow: "hidden",
    marginTop: 10,
  },
  hintButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  hintButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  hintIcon: {
    marginRight: 8,
  },
  mainContent: {
    flexDirection: "column",
  },
  mainContentLandscape: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  pondImageContainer: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 15,
    margin: 20,
    marginBottom: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: "relative",
    minHeight: 280,
  },
  animalContainer: {
    position: "absolute",
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  animalButton: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  draggingAnimalButton: {
    backgroundColor: "rgba(255, 152, 0, 0.3)",
    borderWidth: 2,
    borderColor: "#FF9800",
    transform: [{ scale: 1.1 }],
  },
  animalNumberBadge: {
    position: "absolute",
    top: -5,
    left: -5,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#FF9800",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  animalNumberText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  hintBubble: {
    position: "absolute",
    top: -70,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: 8,
    borderRadius: 10,
    width: 150,
    zIndex: 20,
  },
  hintText: {
    color: "white",
    fontSize: 12,
    textAlign: "center",
  },
  interactionArea: {
    flex: 1,
    marginHorizontal: 20,
  },
  interactionAreaLandscape: {
    marginLeft: 0,
  },
  categoriesContainer: {
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
  categoriesHeader: {
    flexDirection: "row",
    marginBottom: 10,
  },
  organLabelsContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    marginLeft: 80,
  },
  organLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#26A69A",
    textAlign: "center",
    flex: 1,
  },
  categoriesContent: {
    flexDirection: "row",
  },
  modeLabelsContainer: {
    width: 80,
    marginRight: 10,
  },
  modeLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FF9800",
    marginBottom: 40,
    textAlign: "right",
  },
  categoriesGrid: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
  },
  categoryWrapper: {
    width: "30%",
    marginBottom: 15,
  },
  categoryCard: {
    borderRadius: 10,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  expandedCategory: {
    zIndex: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  categoryHeader: {
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyCategory: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  emptyCategoryText: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  categoryAnimals: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
  },
  categoryAnimal: {
    width: 40,
    height: 40,
    margin: 2,
    position: "relative",
  },
  categoryAnimalNumberBadge: {
    position: "absolute",
    top: -5,
    left: -5,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#FF9800",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  categoryAnimalNumberText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  categoryAnimalImage: {
    width: 35,
    height: 35,
  },
  categoryDetails: {
    padding: 10,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },
  categoryDetailText: {
    fontSize: 12,
    color: "#333",
    marginBottom: 3,
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  actionButton: {
    borderRadius: 25,
    overflow: "hidden",
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButtonGradient: {
    paddingVertical: 12,
    paddingHorizontal: 30,
  },
  actionButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
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
  infoOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
  blurBackground: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  infoCard: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    width: "100%",
    maxWidth: 500,
    maxHeight: "90%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 10,
  },
  infoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  infoTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  infoImage: {
    width: "100%",
    height: 200,
    marginBottom: 15,
  },
  infoDescription: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
    marginBottom: 15,
  },
  closeInfoButton: {
    backgroundColor: "#F5F5F5",
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: "center",
  },
  closeInfoText: {
    color: "#333",
    fontWeight: "500",
    textAlign: "center",
  },
});

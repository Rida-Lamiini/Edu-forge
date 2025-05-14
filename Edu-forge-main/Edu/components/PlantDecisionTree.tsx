"use client";

import { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";

type PlantDecisionTreeProps = {
  onSelect: (type: string) => void;
  language: "en" | "fr";
};

export default function PlantDecisionTree({
  onSelect,
  language,
}: PlantDecisionTreeProps) {
  const [activePath, setActivePath] = useState<string | null>(null);

  // Animation values for each node
  const nodeAnimations = [
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
  ];

  // Animation values for each path
  const pathAnimations = [
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
  ];

  const translations = {
    en: {
      title: "Plant Classification Key",
      plants: "Plants",
      withStemLeaves: "With stem and leaves",
      withoutStemLeaves: "Without stem and leaves",
      withSeeds: "With seeds",
      withoutSeeds: "Without seeds",
      seedsInFruit: "Seeds in fruit",
      seedsOnCone: "Seeds on cone scales",
      angiosperm: "Angiosperm",
      gymnosperm: "Gymnosperm",
      pteridophyte: "Pteridophyte",
      algae: "Algae",
      examples: "Examples:",
      angioExamples: "Flowering plants, fruit trees",
      gymnoExamples: "Pine trees, conifers",
      pteriExamples: "Ferns, horsetails",
      algaeExamples: "Seaweed, pond scum",
    },
    fr: {
      title: "Clé de Classification des Plantes",
      plants: "Plantes",
      withStemLeaves: "Avec tige et feuilles",
      withoutStemLeaves: "Sans tige ni feuilles",
      withSeeds: "Avec graines",
      withoutSeeds: "Sans graines",
      seedsInFruit: "Graines dans un fruit",
      seedsOnCone: "Graines sur des écailles de cône",
      angiosperm: "Angiosperme",
      gymnosperm: "Gymnosperme",
      pteridophyte: "Ptéridophyte",
      algae: "Algue",
      examples: "Exemples :",
      angioExamples: "Plantes à fleurs, arbres fruitiers",
      gymnoExamples: "Pins, conifères",
      pteriExamples: "Fougères, prêles",
      algaeExamples: "Algues marines, algues d'étang",
    },
  };

  const t = translations[language];

  useEffect(() => {
    // Animate nodes sequentially
    const nodeAnimSequence = nodeAnimations.map((anim, i) => {
      return Animated.timing(anim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
        delay: i * 150,
      });
    });

    // Animate paths sequentially
    const pathAnimSequence = pathAnimations.map((anim, i) => {
      return Animated.timing(anim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
        delay: i * 150 + 100,
      });
    });

    // Run all animations
    Animated.parallel([...nodeAnimSequence, ...pathAnimSequence]).start();
  }, []);

  const handlePathSelect = (path: string) => {
    setActivePath(path);
  };

  // Interactive tree nodes
  const renderInteractiveTree = () => {
    return (
      <View style={styles.interactiveTreeContainer}>
        <Text style={styles.treeTitle}>{t.title}</Text>

        {/* Root node */}
        <Animated.View
          style={[
            styles.treeNode,
            styles.rootNode,
            {
              opacity: nodeAnimations[0],
              transform: [{ scale: nodeAnimations[0] }],
            },
          ]}
        >
          <MaterialCommunityIcons name="tree" size={24} color="white" />
          <Text style={styles.nodeTitle}>{t.plants}</Text>
        </Animated.View>

        {/* First level decision */}
        <View style={styles.levelContainer}>
          <Animated.View
            style={[styles.pathLine, { opacity: pathAnimations[0] }]}
          />

          <View style={styles.decisionRow}>
            <TouchableOpacity onPress={() => handlePathSelect("withStem")}>
              <Animated.View
                style={[
                  styles.treeNode,
                  activePath === "withStem" && styles.activeNode,
                  {
                    opacity: nodeAnimations[1],
                    transform: [{ scale: nodeAnimations[1] }],
                  },
                ]}
              >
                <MaterialCommunityIcons
                  name="sprout"
                  size={24}
                  color="#4CAF50"
                />
                <Text style={styles.nodeText}>{t.withStemLeaves}</Text>
              </Animated.View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => handlePathSelect("withoutStem")}>
              <Animated.View
                style={[
                  styles.treeNode,
                  activePath === "withoutStem" && styles.activeNode,
                  {
                    opacity: nodeAnimations[2],
                    transform: [{ scale: nodeAnimations[2] }],
                  },
                ]}
              >
                <MaterialCommunityIcons
                  name="waves"
                  size={24}
                  color="#00BCD4"
                />
                <Text style={styles.nodeText}>{t.withoutStemLeaves}</Text>
              </Animated.View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Second level decision - left branch */}
        {activePath === "withStem" && (
          <Animatable.View animation="fadeIn" style={styles.levelContainer}>
            <Animated.View
              style={[
                styles.pathLine,
                styles.leftPath,
                { opacity: pathAnimations[1] },
              ]}
            />

            <View style={styles.decisionRow}>
              <TouchableOpacity onPress={() => handlePathSelect("withSeeds")}>
                <Animated.View
                  style={[
                    styles.treeNode,
                    activePath === "withSeeds" && styles.activeNode,
                    {
                      opacity: nodeAnimations[3],
                      transform: [{ scale: nodeAnimations[3] }],
                    },
                  ]}
                >
                  <MaterialCommunityIcons
                    name="seed"
                    size={24}
                    color="#FF9800"
                  />
                  <Text style={styles.nodeText}>{t.withSeeds}</Text>
                </Animated.View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handlePathSelect("withoutSeeds")}
              >
                <Animated.View
                  style={[
                    styles.treeNode,
                    activePath === "withoutSeeds" && styles.activeNode,
                    {
                      opacity: nodeAnimations[4],
                      transform: [{ scale: nodeAnimations[4] }],
                    },
                  ]}
                >
                  <MaterialCommunityIcons
                    name="leaf"
                    size={24}
                    color="#2196F3"
                  />
                  <Text style={styles.nodeText}>{t.withoutSeeds}</Text>
                </Animated.View>
              </TouchableOpacity>
            </View>
          </Animatable.View>
        )}

        {/* Third level decision - left branch of left branch */}
        {activePath === "withSeeds" && (
          <Animatable.View animation="fadeIn" style={styles.levelContainer}>
            <Animated.View
              style={[
                styles.pathLine,
                styles.leftPath,
                { opacity: pathAnimations[2] },
              ]}
            />

            <View style={styles.decisionRow}>
              <TouchableOpacity
                onPress={() => handlePathSelect("seedsInFruit")}
              >
                <Animated.View
                  style={[
                    styles.treeNode,
                    activePath === "seedsInFruit" && styles.activeNode,
                    {
                      opacity: nodeAnimations[5],
                      transform: [{ scale: nodeAnimations[5] }],
                    },
                  ]}
                >
                  <MaterialCommunityIcons
                    name="fruit-cherries"
                    size={24}
                    color="#E91E63"
                  />
                  <Text style={styles.nodeText}>{t.seedsInFruit}</Text>
                </Animated.View>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => handlePathSelect("seedsOnCone")}>
                <Animated.View
                  style={[
                    styles.treeNode,
                    activePath === "seedsOnCone" && styles.activeNode,
                    {
                      opacity: nodeAnimations[6],
                      transform: [{ scale: nodeAnimations[6] }],
                    },
                  ]}
                >
                  <MaterialCommunityIcons
                    name="pine-tree"
                    size={24}
                    color="#9C27B0"
                  />
                  <Text style={styles.nodeText}>{t.seedsOnCone}</Text>
                </Animated.View>
              </TouchableOpacity>
            </View>
          </Animatable.View>
        )}

        {/* Result nodes */}
        <View style={styles.resultsContainer}>
          <Animated.View
            style={[
              styles.pathLine,
              styles.resultPath,
              { opacity: pathAnimations[3] },
            ]}
          />

          <View style={styles.resultsRow}>
            <TouchableOpacity
              style={[
                styles.resultNode,
                { backgroundColor: "#FF9800" },
                activePath === "seedsInFruit" && styles.highlightedResult,
              ]}
              onPress={() => onSelect("angiosperm")}
            >
              <Ionicons
                name="leaf"
                size={24}
                color="white"
                style={styles.resultIcon}
              />
              <Text style={styles.resultText}>{t.angiosperm}</Text>
              <Text style={styles.exampleText}>
                {t.examples} {t.angioExamples}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.resultNode,
                { backgroundColor: "#9C27B0" },
                activePath === "seedsOnCone" && styles.highlightedResult,
              ]}
              onPress={() => onSelect("gymnosperm")}
            >
              <MaterialCommunityIcons
                name="pine-tree"
                size={24}
                color="white"
                style={styles.resultIcon}
              />
              <Text style={styles.resultText}>{t.gymnosperm}</Text>
              <Text style={styles.exampleText}>
                {t.examples} {t.gymnoExamples}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.resultNode,
                { backgroundColor: "#2196F3" },
                activePath === "withoutSeeds" && styles.highlightedResult,
              ]}
              onPress={() => onSelect("pteridophyte")}
            >
              <MaterialCommunityIcons
                name="grass"
                size={24}
                color="white"
                style={styles.resultIcon}
              />
              <Text style={styles.resultText}>{t.pteridophyte}</Text>
              <Text style={styles.exampleText}>
                {t.examples} {t.pteriExamples}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.resultNode,
                { backgroundColor: "#4CAF50" },
                activePath === "withoutStem" && styles.highlightedResult,
              ]}
              onPress={() => onSelect("algae")}
            >
              <MaterialCommunityIcons
                name="waves"
                size={24}
                color="white"
                style={styles.resultIcon}
              />
              <Text style={styles.resultText}>{t.algae}</Text>
              <Text style={styles.exampleText}>
                {t.examples} {t.algaeExamples}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <ScrollView
      horizontal
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {renderInteractiveTree()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f9f9f9",
    borderRadius: 15,
    padding: 10,
  },
  contentContainer: {
    paddingVertical: 20,
    paddingHorizontal: 10,
    minWidth: 800,
  },
  treeTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  interactiveTreeContainer: {
    alignItems: "center",
  },
  treeNode: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 15,
    minWidth: 180,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    margin: 5,
    flexDirection: "row",
  },
  activeNode: {
    borderWidth: 2,
    borderColor: "#FF5252",
    backgroundColor: "#FFF8E1",
  },
  rootNode: {
    backgroundColor: "#FF5252",
    flexDirection: "row",
  },
  nodeTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginLeft: 8,
  },
  nodeText: {
    fontSize: 16,
    textAlign: "center",
    color: "#333",
    marginLeft: 8,
    fontWeight: "500",
  },
  levelContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: 30,
    position: "relative",
  },
  decisionRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  pathLine: {
    position: "absolute",
    top: -30,
    width: 2,
    height: 30,
    backgroundColor: "#FF5252",
  },
  leftPath: {
    left: "25%",
  },
  rightPath: {
    right: "25%",
  },
  resultsContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: 40,
    position: "relative",
  },
  resultsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    flexWrap: "wrap",
  },
  resultPath: {
    width: "80%",
    height: 2,
    backgroundColor: "#FF5252",
    top: -20,
  },
  resultNode: {
    padding: 15,
    borderRadius: 15,
    minWidth: 150,
    alignItems: "center",
    margin: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 5,
  },
  highlightedResult: {
    transform: [{ scale: 1.05 }],
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  resultText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 5,
  },
  resultIcon: {
    marginBottom: 5,
  },
  exampleText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 12,
    marginTop: 5,
    textAlign: "center",
  },
});

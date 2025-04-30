"use client";

import { useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

type PlantDecisionTreeProps = {
  onSelect: (type: string) => void;
};

export default function PlantDecisionTree({
  onSelect,
}: PlantDecisionTreeProps) {
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
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
  ];

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

  // Interactive tree nodes
  const renderInteractiveTree = () => {
    return (
      <View style={styles.interactiveTreeContainer}>
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
          <Text style={styles.nodeTitle}>Plants</Text>
        </Animated.View>

        {/* First level decision */}
        <View style={styles.levelContainer}>
          <Animated.View
            style={[styles.pathLine, { opacity: pathAnimations[0] }]}
          />

          <View style={styles.decisionRow}>
            <Animated.View
              style={[
                styles.treeNode,
                {
                  opacity: nodeAnimations[1],
                  transform: [{ scale: nodeAnimations[1] }],
                },
              ]}
            >
              <Text style={styles.nodeText}>With stem and leaves</Text>
            </Animated.View>

            <Animated.View
              style={[
                styles.treeNode,
                {
                  opacity: nodeAnimations[2],
                  transform: [{ scale: nodeAnimations[2] }],
                },
              ]}
            >
              <Text style={styles.nodeText}>Without stem and leaves</Text>
            </Animated.View>
          </View>
        </View>

        {/* Second level decision - left branch */}
        <View style={styles.levelContainer}>
          <Animated.View
            style={[
              styles.pathLine,
              styles.leftPath,
              { opacity: pathAnimations[1] },
            ]}
          />

          <View style={styles.decisionRow}>
            <Animated.View
              style={[
                styles.treeNode,
                {
                  opacity: nodeAnimations[3],
                  transform: [{ scale: nodeAnimations[3] }],
                },
              ]}
            >
              <Text style={styles.nodeText}>With seeds</Text>
            </Animated.View>

            <Animated.View
              style={[
                styles.treeNode,
                {
                  opacity: nodeAnimations[4],
                  transform: [{ scale: nodeAnimations[4] }],
                },
              ]}
            >
              <Text style={styles.nodeText}>Without seeds</Text>
            </Animated.View>
          </View>
        </View>

        {/* Third level decision - left branch of left branch */}
        <View style={styles.levelContainer}>
          <Animated.View
            style={[
              styles.pathLine,
              styles.leftPath,
              { opacity: pathAnimations[2] },
            ]}
          />

          <View style={styles.decisionRow}>
            <Animated.View
              style={[
                styles.treeNode,
                {
                  opacity: nodeAnimations[5],
                  transform: [{ scale: nodeAnimations[5] }],
                },
              ]}
            >
              <Text style={styles.nodeText}>Seeds in fruit</Text>
            </Animated.View>

            <Animated.View
              style={[
                styles.treeNode,
                {
                  opacity: nodeAnimations[6],
                  transform: [{ scale: nodeAnimations[6] }],
                },
              ]}
            >
              <Text style={styles.nodeText}>Seeds on cone scales</Text>
            </Animated.View>
          </View>
        </View>

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
              style={[styles.resultNode, { backgroundColor: "#FF9800" }]}
              onPress={() => onSelect("angiosperm")}
            >
              <Ionicons
                name="leaf"
                size={24}
                color="white"
                style={styles.resultIcon}
              />
              <Text style={styles.resultText}>Angiosperm</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.resultNode, { backgroundColor: "#9C27B0" }]}
              onPress={() => onSelect("gymnosperm")}
            >
              <Ionicons
                name="triangle"
                size={24}
                color="white"
                style={styles.resultIcon}
              />
              <Text style={styles.resultText}>Gymnosperm</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.resultNode, { backgroundColor: "#2196F3" }]}
              onPress={() => onSelect("pteridophyte")}
            >
              <Ionicons
                name="flower"
                size={24}
                color="white"
                style={styles.resultIcon}
              />
              <Text style={styles.resultText}>Pteridophyte</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.resultNode, { backgroundColor: "#4CAF50" }]}
              onPress={() => onSelect("algae")}
            >
              <Ionicons
                name="water"
                size={24}
                color="white"
                style={styles.resultIcon}
              />
              <Text style={styles.resultText}>Algae</Text>
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
  interactiveTreeContainer: {
    alignItems: "center",
  },
  treeNode: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 10,
    minWidth: 150,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    margin: 5,
  },
  rootNode: {
    backgroundColor: "#FF5252",
  },
  nodeTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  nodeText: {
    fontSize: 14,
    textAlign: "center",
    color: "#333",
  },
  levelContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: 20,
    position: "relative",
  },
  decisionRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  pathLine: {
    position: "absolute",
    top: -20,
    width: 2,
    height: 20,
    backgroundColor: "#ccc",
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
    marginTop: 30,
    position: "relative",
  },
  resultsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  resultPath: {
    width: "80%",
    height: 2,
    backgroundColor: "#ccc",
    top: -15,
  },
  resultNode: {
    padding: 10,
    borderRadius: 15,
    minWidth: 100,
    alignItems: "center",
    margin: 5,
  },
  resultText: {
    color: "white",
    fontWeight: "bold",
  },
  resultIcon: {
    marginBottom: 5,
  },
});

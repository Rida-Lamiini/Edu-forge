"use client";

import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  useWindowDimensions,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";

type BirdDecisionTreeProps = {
  onSelect: (type: string) => void;
  language: "fr"; // Only French now
};

export default function BirdDecisionTree({
  onSelect,
  language = "fr",
}: BirdDecisionTreeProps) {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const [activePath, setActivePath] = useState<string[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const translations = {
    fr: {
      title: "Clé de détermination des mésanges",
      rootNode: "Oiseaux",
      blueCapNode: "Calotte bleue",
      crestNode: "Huppe sur la tête",
      blackCapNode: "Calotte noire",
      yellowBreastNode: "Poitrine jaune avec bande noire",
      whiteMarkingsNode: "Joues blanches et tache blanche sur la nuque",
      blueTit: "Mésange bleue",
      crestedTit: "Mésange huppée",
      greatTit: "Mésange charbonnière",
      coalTit: "Mésange noire",
      useKey: "Utilisez cette clé pour identifier l'oiseau",
    },
  };

  const t = translations[language];

  const handleNodeClick = (nodeId: string, birdType?: string) => {
    setSelectedNode(nodeId);

    if (birdType) {
      onSelect(birdType);
    } else {
      const newPath =
        {
          root: [],
          "blue-cap": ["blue-cap"],
          crest: ["crest"],
          "black-cap": ["black-cap"],
          "yellow-breast": ["black-cap", "yellow-breast"],
          "white-markings": ["black-cap", "white-markings"],
        }[nodeId] || [];

      setActivePath(newPath);
    }
  };

  const isNodeActive = (nodeId: string) => {
    return activePath.includes(nodeId) || selectedNode === nodeId;
  };

  // Responsive styles
  const responsiveStyles = {
    containerPadding: isMobile ? 10 : 20,
    nodeWidth: isMobile ? 140 : 160,
    wideNodeWidth: isMobile ? 200 : 240,
    resultNodeWidth: isMobile ? 180 : 200,
    fontSize: {
      title: isMobile ? 18 : 20,
      nodeText: isMobile ? 12 : 14,
      resultText: isMobile ? 14 : 16,
    },
    imageSize: {
      width: isMobile ? 100 : 120,
      height: isMobile ? 60 : 80,
    },
    decisionRow: {
      flexDirection: isMobile ? "column" : "row",
      alignItems: "center",
    },
    decisionNodeMargin: isMobile
      ? { marginVertical: 5 }
      : { marginHorizontal: 10 },
  };

  return (
    <View
      style={[styles.container, { padding: responsiveStyles.containerPadding }]}
    >
      <LinearGradient
        colors={["#E3F2FD", "#BBDEFB"]}
        style={styles.background}
      />

      <Text
        style={[styles.title, { fontSize: responsiveStyles.fontSize.title }]}
      >
        {t.title}
      </Text>

      <Text style={styles.instructions}>{t.useKey}</Text>

      {/* Root node */}
      <Animatable.View
        animation="fadeIn"
        delay={100}
        style={styles.rootNodeContainer}
      >
        <TouchableOpacity
          style={[
            styles.rootNode,
            isNodeActive("root") && styles.activeNode,
            { width: responsiveStyles.nodeWidth },
          ]}
          onPress={() => handleNodeClick("root")}
        >
          <MaterialCommunityIcons name="bird" size={24} color="white" />
          <Text style={styles.rootNodeText}>{t.rootNode}</Text>
        </TouchableOpacity>
      </Animatable.View>

      {/* First level decision */}
      <View style={styles.levelContainer}>
        <View style={styles.connectorVertical} />

        <View style={responsiveStyles.decisionRow}>
          <Animatable.View animation="fadeInLeft" delay={200}>
            <TouchableOpacity
              style={[
                styles.decisionNode,
                isNodeActive("blue-cap") && styles.activeNode,
                { width: responsiveStyles.nodeWidth },
                responsiveStyles.decisionNodeMargin,
              ]}
              onPress={() => handleNodeClick("blue-cap")}
            >
              <View style={styles.nodeContent}>
                <Text
                  style={[
                    styles.nodeText,
                    { fontSize: responsiveStyles.fontSize.nodeText },
                  ]}
                >
                  {t.blueCapNode}
                </Text>
                <View
                  style={[
                    styles.colorIndicator,
                    { backgroundColor: "#1E88E5" },
                  ]}
                />
              </View>
            </TouchableOpacity>
          </Animatable.View>

          <Animatable.View animation="fadeInRight" delay={200}>
            <TouchableOpacity
              style={[
                styles.decisionNode,
                isNodeActive("crest") && styles.activeNode,
                { width: responsiveStyles.nodeWidth },
                responsiveStyles.decisionNodeMargin,
              ]}
              onPress={() => handleNodeClick("crest")}
            >
              <View style={styles.nodeContent}>
                <Text
                  style={[
                    styles.nodeText,
                    { fontSize: responsiveStyles.fontSize.nodeText },
                  ]}
                >
                  {t.crestNode}
                </Text>
                <MaterialCommunityIcons
                  name="feather"
                  size={24}
                  color="#7B1FA2"
                />
              </View>
            </TouchableOpacity>
          </Animatable.View>
        </View>
      </View>

      {/* Blue cap result */}
      {activePath.includes("blue-cap") && (
        <Animatable.View animation="fadeIn" style={styles.resultContainer}>
          <View style={styles.connectorToResult} />
          <TouchableOpacity
            style={[
              styles.resultNode,
              {
                backgroundColor: "#1E88E5",
                width: responsiveStyles.resultNodeWidth,
              },
            ]}
            onPress={() => handleNodeClick("blue-tit-result", "blue_tit")}
          >
            <Image
              source={require("../assets/images/blue-tit.png")}
              style={[styles.resultImage, responsiveStyles.imageSize]}
              resizeMode="contain"
            />
            <Text
              style={[
                styles.resultText,
                { fontSize: responsiveStyles.fontSize.resultText },
              ]}
            >
              {t.blueTit}
            </Text>
          </TouchableOpacity>
        </Animatable.View>
      )}

      {/* Crest result */}
      {activePath.includes("crest") && (
        <Animatable.View animation="fadeIn" style={styles.resultContainer}>
          <View style={styles.connectorToResult} />
          <TouchableOpacity
            style={[
              styles.resultNode,
              {
                backgroundColor: "#7B1FA2",
                width: responsiveStyles.resultNodeWidth,
              },
            ]}
            onPress={() => handleNodeClick("crested-tit-result", "crested_tit")}
          >
            <Image
              source={require("../assets/images/crested-tit.png")}
              style={[styles.resultImage, responsiveStyles.imageSize]}
              resizeMode="contain"
            />
            <Text
              style={[
                styles.resultText,
                { fontSize: responsiveStyles.fontSize.resultText },
              ]}
            >
              {t.crestedTit}
            </Text>
          </TouchableOpacity>
        </Animatable.View>
      )}

      {/* Black cap option */}
      {!activePath.includes("blue-cap") && !activePath.includes("crest") && (
        <View style={styles.levelContainer}>
          <View style={styles.connectorVertical} />

          <Animatable.View animation="fadeIn">
            <TouchableOpacity
              style={[
                styles.decisionNode,
                styles.wideNode,
                isNodeActive("black-cap") && styles.activeNode,
                { width: responsiveStyles.wideNodeWidth },
              ]}
              onPress={() => handleNodeClick("black-cap")}
            >
              <View style={styles.nodeContent}>
                <Text
                  style={[
                    styles.nodeText,
                    { fontSize: responsiveStyles.fontSize.nodeText },
                  ]}
                >
                  {t.blackCapNode}
                </Text>
                <View
                  style={[
                    styles.colorIndicator,
                    { backgroundColor: "#212121" },
                  ]}
                />
              </View>
            </TouchableOpacity>
          </Animatable.View>
        </View>
      )}

      {/* Black cap sub-options */}
      {activePath.includes("black-cap") && (
        <View style={styles.levelContainer}>
          <View style={styles.connectorVertical} />

          <View style={responsiveStyles.decisionRow}>
            <Animatable.View animation="fadeInLeft">
              <TouchableOpacity
                style={[
                  styles.decisionNode,
                  isNodeActive("yellow-breast") && styles.activeNode,
                  { width: responsiveStyles.nodeWidth },
                  responsiveStyles.decisionNodeMargin,
                ]}
                onPress={() => handleNodeClick("yellow-breast")}
              >
                <View style={styles.nodeContent}>
                  <Text
                    style={[
                      styles.nodeText,
                      { fontSize: responsiveStyles.fontSize.nodeText },
                    ]}
                  >
                    {t.yellowBreastNode}
                  </Text>
                  <View
                    style={[
                      styles.colorIndicator,
                      { backgroundColor: "#FFC107" },
                    ]}
                  />
                </View>
              </TouchableOpacity>
            </Animatable.View>

            <Animatable.View animation="fadeInRight">
              <TouchableOpacity
                style={[
                  styles.decisionNode,
                  isNodeActive("white-markings") && styles.activeNode,
                  { width: responsiveStyles.nodeWidth },
                  responsiveStyles.decisionNodeMargin,
                ]}
                onPress={() => handleNodeClick("white-markings")}
              >
                <View style={styles.nodeContent}>
                  <Text
                    style={[
                      styles.nodeText,
                      { fontSize: responsiveStyles.fontSize.nodeText },
                    ]}
                  >
                    {t.whiteMarkingsNode}
                  </Text>
                  <View style={styles.whiteMarkingsIcon}>
                    <View style={styles.whiteMarkingsIndicator} />
                  </View>
                </View>
              </TouchableOpacity>
            </Animatable.View>
          </View>
        </View>
      )}

      {/* Yellow breast result */}
      {activePath.includes("yellow-breast") && (
        <Animatable.View animation="fadeIn" style={styles.resultContainer}>
          <View style={styles.connectorToResult} />
          <TouchableOpacity
            style={[
              styles.resultNode,
              {
                backgroundColor: "#FFC107",
                width: responsiveStyles.resultNodeWidth,
              },
            ]}
            onPress={() => handleNodeClick("great-tit-result", "great_tit")}
          >
            <Image
              source={require("../assets/images/great-tit.png")}
              style={[styles.resultImage, responsiveStyles.imageSize]}
              resizeMode="contain"
            />
            <Text
              style={[
                styles.resultText,
                { fontSize: responsiveStyles.fontSize.resultText },
              ]}
            >
              {t.greatTit}
            </Text>
          </TouchableOpacity>
        </Animatable.View>
      )}

      {/* White markings result */}
      {activePath.includes("white-markings") && (
        <Animatable.View animation="fadeIn" style={styles.resultContainer}>
          <View style={styles.connectorToResult} />
          <TouchableOpacity
            style={[
              styles.resultNode,
              {
                backgroundColor: "#424242",
                width: responsiveStyles.resultNodeWidth,
              },
            ]}
            onPress={() => handleNodeClick("coal-tit-result", "coal_tit")}
          >
            <Image
              source={require("../assets/images/coal-tit.png")}
              style={[styles.resultImage, responsiveStyles.imageSize]}
              resizeMode="contain"
            />
            <Text
              style={[
                styles.resultText,
                { fontSize: responsiveStyles.fontSize.resultText },
              ]}
            >
              {t.coalTit}
            </Text>
          </TouchableOpacity>
        </Animatable.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    overflow: "hidden",
    position: "relative",
    flex: 1,
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  title: {
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#1565C0",
  },
  instructions: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
    color: "#546E7A",
    fontStyle: "italic",
  },
  rootNodeContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  rootNode: {
    backgroundColor: "#29B6F6",
    borderRadius: 15,
    padding: 12,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  rootNodeText: {
    color: "white",
    fontWeight: "bold",
    marginLeft: 8,
  },
  levelContainer: {
    marginTop: 15,
    marginBottom: 15,
    position: "relative",
    alignItems: "center",
  },
  connectorVertical: {
    position: "absolute",
    top: -15,
    width: 2,
    height: 15,
    backgroundColor: "#29B6F6",
  },
  connectorToResult: {
    position: "absolute",
    top: -15,
    width: 2,
    height: 15,
    backgroundColor: "#29B6F6",
  },
  decisionNode: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  wideNode: {
    alignSelf: "center",
  },
  activeNode: {
    borderWidth: 2,
    borderColor: "#2196F3",
    backgroundColor: "#E3F2FD",
  },
  nodeContent: {
    alignItems: "center",
  },
  nodeText: {
    textAlign: "center",
    fontWeight: "bold",
    color: "#1565C0",
    marginBottom: 10,
  },
  colorIndicator: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  whiteMarkingsIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#212121",
    justifyContent: "center",
    alignItems: "center",
  },
  whiteMarkingsIndicator: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    backgroundColor: "white",
  },
  resultContainer: {
    alignItems: "center",
    position: "relative",
    marginVertical: 20,
  },
  resultNode: {
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  resultImage: {
    marginBottom: 10,
  },
  resultText: {
    color: "white",
    fontWeight: "bold",
  },
});

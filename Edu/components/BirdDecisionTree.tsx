"\"use client";

import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import * as Animatable from "react-native-animatable";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";

type BirdDecisionTreeProps = {
  onSelect: (type: string) => void;
};

export default function BirdDecisionTree({ onSelect }: BirdDecisionTreeProps) {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#E3F2FD", "#BBDEFB"]}
        style={styles.background}
      />

      <Text style={styles.title}>
        Clé de détermination de quelques mésanges
      </Text>

      <Animatable.View animation="fadeIn" delay={100} style={styles.rootNode}>
        <MaterialCommunityIcons name="bird" size={24} color="#1565C0" />
        <Text style={styles.rootNodeText}>Oiseaux</Text>
      </Animatable.View>

      {/* First level decision - Features */}
      <View style={styles.decisionLevel}>
        <View style={styles.connector} />

        <View style={styles.decisionRow}>
          <Animatable.View
            animation="fadeInLeft"
            delay={200}
            style={[styles.decisionNode, styles.leftNode]}
          >
            <TouchableOpacity style={styles.nodeContent}>
              <Text style={styles.nodeText}>Calotte bleue</Text>
              <View style={styles.iconContainer}>
                <Ionicons name="ios-color-palette" size={40} color="#1E88E5" />
              </View>
            </TouchableOpacity>
          </Animatable.View>

          <Animatable.View
            animation="fadeInRight"
            delay={200}
            style={[styles.decisionNode, styles.rightNode]}
          >
            <TouchableOpacity style={styles.nodeContent}>
              <Text style={styles.nodeText}>Huppe sur la tête</Text>
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons
                  name="feather"
                  size={40}
                  color="#7B1FA2"
                />
              </View>
            </TouchableOpacity>
          </Animatable.View>
        </View>
      </View>

      {/* Second level decision - More Features */}
      <View style={styles.decisionLevel}>
        <View style={[styles.connector, styles.leftConnector]} />

        <View style={styles.decisionRow}>
          <Animatable.View
            animation="fadeInLeft"
            delay={300}
            style={[styles.decisionNode, styles.leftNode]}
          >
            <TouchableOpacity style={styles.nodeContent}>
              <Text style={styles.nodeText}>
                Bec court et Poitrine jaune barrée de noir
              </Text>
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons name="food" size={40} color="#FFC107" />
              </View>
            </TouchableOpacity>
          </Animatable.View>

          <Animatable.View
            animation="fadeInRight"
            delay={300}
            style={[styles.decisionNode, styles.rightNode]}
          >
            <TouchableOpacity style={styles.nodeContent}>
              <Text style={styles.nodeText}>
                Bec court et Joues blanches et Deux bandes blanches sur les
                ailes
              </Text>
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons
                  name="feather"
                  size={40}
                  color="#424242"
                />
              </View>
            </TouchableOpacity>
          </Animatable.View>
        </View>
      </View>

      {/* Results */}
      <View style={styles.resultsContainer}>
        <View style={styles.resultsConnectors}>
          <View style={[styles.resultConnector, { left: "25%" }]} />
          <View style={[styles.resultConnector, { left: "50%" }]} />
          <View style={[styles.resultConnector, { left: "75%" }]} />
        </View>

        <View style={styles.resultsRow}>
          <Animatable.View animation="bounceIn" delay={400}>
            <TouchableOpacity
              style={[styles.resultNode, { backgroundColor: "#1E88E5" }]}
              onPress={() => onSelect("blue_tit")}
            >
              <Text style={styles.resultText}>Mésange bleue</Text>
            </TouchableOpacity>
          </Animatable.View>

          <Animatable.View animation="bounceIn" delay={500}>
            <TouchableOpacity
              style={[styles.resultNode, { backgroundColor: "#7B1FA2" }]}
              onPress={() => onSelect("crested_tit")}
            >
              <Text style={styles.resultText}>Mésange huppée</Text>
            </TouchableOpacity>
          </Animatable.View>

          <Animatable.View animation="bounceIn" delay={600}>
            <TouchableOpacity
              style={[styles.resultNode, { backgroundColor: "#FFC107" }]}
              onPress={() => onSelect("great_tit")}
            >
              <Text style={styles.resultText}>Mésange charbonnière</Text>
            </TouchableOpacity>
          </Animatable.View>

          <Animatable.View animation="bounceIn" delay={700}>
            <TouchableOpacity
              style={[styles.resultNode, { backgroundColor: "#424242" }]}
              onPress={() => onSelect("coal_tit")}
            >
              <Text style={styles.resultText}>Mésange noire</Text>
            </TouchableOpacity>
          </Animatable.View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    overflow: "hidden",
    padding: 15,
    position: "relative",
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#1565C0",
  },
  rootNode: {
    backgroundColor: "#29B6F6",
    borderRadius: 15,
    padding: 10,
    alignItems: "center",
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "center",
    width: 120,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  rootNodeText: {
    color: "white",
    fontWeight: "bold",
    marginLeft: 5,
  },
  decisionLevel: {
    marginTop: 20,
    position: "relative",
  },
  connector: {
    position: "absolute",
    top: -20,
    left: "50%",
    width: 2,
    height: 20,
    backgroundColor: "#29B6F6",
  },
  leftConnector: {
    left: "25%",
  },
  decisionRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  decisionNode: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 10,
    width: "45%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  leftNode: {
    marginRight: 5,
  },
  rightNode: {
    marginLeft: 5,
  },
  nodeContent: {
    alignItems: "center",
    padding: 10,
  },
  nodeText: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "bold",
    color: "#1565C0",
    marginBottom: 8,
  },
  nodeImage: {
    width: 80,
    height: 60,
  },
  resultsContainer: {
    marginTop: 30,
    position: "relative",
  },
  resultsConnectors: {
    position: "absolute",
    top: -20,
    left: 0,
    right: 0,
    height: 20,
  },
  resultConnector: {
    position: "absolute",
    top: 0,
    width: 2,
    height: 20,
    backgroundColor: "#29B6F6",
  },
  resultsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  resultNode: {
    padding: 10,
    borderRadius: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  resultText: {
    color: "white",
    fontWeight: "bold",
  },
  iconContainer: {
    marginTop: 5,
  },
});

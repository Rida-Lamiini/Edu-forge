"use client";

import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import * as Animatable from "react-native-animatable";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type OakDecisionTreeProps = {
  onSelect: (type: string) => void;
};

export default function OakDecisionTree({ onSelect }: OakDecisionTreeProps) {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#FFF8E1", "#FFECB3"]}
        style={styles.background}
      />

      <Text style={styles.title}>Clé de détermination de quelques chênes</Text>

      <Animatable.View animation="fadeIn" delay={100} style={styles.rootNode}>
        <MaterialCommunityIcons name="tree" size={24} color="#795548" />
        <Text style={styles.rootNodeText}>Végétaux</Text>
      </Animatable.View>

      {/* First level decision - Leaf type */}
      <View style={styles.decisionLevel}>
        <View style={styles.connector} />

        <View style={styles.decisionRow}>
          <Animatable.View
            animation="fadeInLeft"
            delay={200}
            style={[styles.decisionNode, styles.leftNode]}
          >
            <TouchableOpacity style={styles.nodeContent}>
              <Text style={styles.nodeText}>Feuille à bord lobé</Text>
              <MaterialCommunityIcons name="leaf" size={40} color="#8D6E63" />
            </TouchableOpacity>
          </Animatable.View>

          <Animatable.View
            animation="fadeInRight"
            delay={200}
            style={[styles.decisionNode, styles.rightNode]}
          >
            <TouchableOpacity
              style={styles.nodeContent}
              onPress={() => onSelect("holm")}
            >
              <Text style={styles.nodeText}>Feuille à bord lisse</Text>
              <MaterialCommunityIcons
                name="leaf-maple"
                size={40}
                color="#5D4037"
              />
            </TouchableOpacity>
          </Animatable.View>
        </View>
      </View>

      {/* Second level decision - Acorn type */}
      <View style={styles.decisionLevel}>
        <View style={[styles.connector, styles.leftConnector]} />

        <View style={styles.decisionRow}>
          <Animatable.View
            animation="fadeInLeft"
            delay={300}
            style={[styles.decisionNode, styles.leftNode]}
          >
            <TouchableOpacity
              style={styles.nodeContent}
              onPress={() => onSelect("pedunculate")}
            >
              <Text style={styles.nodeText}>
                Gland porté par un pédoncule long
              </Text>
              <MaterialCommunityIcons name="seed" size={40} color="#8D6E63" />
            </TouchableOpacity>
          </Animatable.View>

          <Animatable.View
            animation="fadeInRight"
            delay={300}
            style={[styles.decisionNode, styles.rightNode]}
          >
            <TouchableOpacity
              style={styles.nodeContent}
              onPress={() => onSelect("sessile")}
            >
              <Text style={styles.nodeText}>
                Gland porté par un pédoncule court
              </Text>
              <MaterialCommunityIcons
                name="seed-outline"
                size={40}
                color="#795548"
              />
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
              style={[styles.resultNode, { backgroundColor: "#8D6E63" }]}
              onPress={() => onSelect("pedunculate")}
            >
              <Text style={styles.resultText}>Chêne pédonculé</Text>
            </TouchableOpacity>
          </Animatable.View>

          <Animatable.View animation="bounceIn" delay={500}>
            <TouchableOpacity
              style={[styles.resultNode, { backgroundColor: "#795548" }]}
              onPress={() => onSelect("sessile")}
            >
              <Text style={styles.resultText}>Chêne sessile</Text>
            </TouchableOpacity>
          </Animatable.View>

          <Animatable.View animation="bounceIn" delay={600}>
            <TouchableOpacity
              style={[styles.resultNode, { backgroundColor: "#5D4037" }]}
              onPress={() => onSelect("holm")}
            >
              <Text style={styles.resultText}>Chêne vert</Text>
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
    color: "#5D4037",
  },
  rootNode: {
    backgroundColor: "#A1887F",
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
    backgroundColor: "#A1887F",
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
    color: "#5D4037",
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
    backgroundColor: "#A1887F",
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
});

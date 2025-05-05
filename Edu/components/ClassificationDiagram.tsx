"use client";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Line } from "react-native-svg";

type ClassificationDiagramProps = {
  width: number;
  height: number;
};

export default function ClassificationDiagram({
  width,
  height,
}: ClassificationDiagramProps) {
  // Calcul des positions
  const centerX = width / 2;
  const startY = 50;
  const boxWidth = 120;
  const boxHeight = 40;
  const verticalGap = 60;
  const horizontalGap = width / 4;

  return (
    <View style={[styles.container, { width, height }]}>
      <Svg width={width} height={height}>
        {/* Lignes verticales */}
        <Line
          x1={centerX}
          y1={startY + boxHeight}
          x2={centerX}
          y2={startY + verticalGap}
          stroke="#4CAF50"
          strokeWidth={2}
        />
        <Line
          x1={centerX - horizontalGap}
          y1={startY + verticalGap + boxHeight}
          x2={centerX - horizontalGap}
          y2={startY + 2 * verticalGap}
          stroke="#4CAF50"
          strokeWidth={2}
        />
        <Line
          x1={centerX + horizontalGap}
          y1={startY + verticalGap + boxHeight}
          x2={centerX + horizontalGap}
          y2={startY + 2 * verticalGap}
          stroke="#4CAF50"
          strokeWidth={2}
        />
        <Line
          x1={centerX - horizontalGap - horizontalGap / 2}
          y1={startY + 2 * verticalGap + boxHeight}
          x2={centerX - horizontalGap - horizontalGap / 2}
          y2={startY + 3 * verticalGap}
          stroke="#4CAF50"
          strokeWidth={2}
        />
        <Line
          x1={centerX - horizontalGap + horizontalGap / 2}
          y1={startY + 2 * verticalGap + boxHeight}
          x2={centerX - horizontalGap + horizontalGap / 2}
          y2={startY + 3 * verticalGap}
          stroke="#4CAF50"
          strokeWidth={2}
        />

        {/* Lignes horizontales */}
        <Line
          x1={centerX - horizontalGap}
          y1={startY + verticalGap}
          x2={centerX + horizontalGap}
          y2={startY + verticalGap}
          stroke="#4CAF50"
          strokeWidth={2}
        />
        <Line
          x1={centerX - horizontalGap - horizontalGap / 2}
          y1={startY + 2 * verticalGap}
          x2={centerX - horizontalGap + horizontalGap / 2}
          y2={startY + 2 * verticalGap}
          stroke="#4CAF50"
          strokeWidth={2}
        />
      </Svg>

      {/* Boîtes de texte */}
      <View
        style={[styles.rootBox, { top: startY, left: centerX - boxWidth / 2 }]}
      >
        <Text style={styles.rootText}>Végétaux</Text>
      </View>

      <View
        style={[
          styles.nodeBox,
          {
            top: startY + verticalGap,
            left: centerX - horizontalGap - boxWidth / 2,
          },
        ]}
      >
        <Text style={styles.nodeText}>Avec tige et feuilles</Text>
      </View>

      <View
        style={[
          styles.nodeBox,
          {
            top: startY + verticalGap,
            left: centerX + horizontalGap - boxWidth / 2,
          },
        ]}
      >
        <Text style={styles.nodeText}>Sans tige ni feuilles</Text>
      </View>

      <View
        style={[
          styles.nodeBox,
          {
            top: startY + 2 * verticalGap,
            left: centerX - horizontalGap - horizontalGap / 2 - boxWidth / 2,
          },
        ]}
      >
        <Text style={styles.nodeText}>Avec graine</Text>
      </View>

      <View
        style={[
          styles.nodeBox,
          {
            top: startY + 2 * verticalGap,
            left: centerX - horizontalGap + horizontalGap / 2 - boxWidth / 2,
          },
        ]}
      >
        <Text style={styles.nodeText}>Sans graine</Text>
      </View>

      <View
        style={[
          styles.nodeBox,
          {
            top: startY + 3 * verticalGap,
            left: centerX - horizontalGap - horizontalGap - boxWidth / 2,
          },
        ]}
      >
        <Text style={styles.nodeText}>Graines enfermées dans un fruit</Text>
      </View>

      <View
        style={[
          styles.nodeBox,
          {
            top: startY + 3 * verticalGap,
            left: centerX - horizontalGap - boxWidth / 2,
          },
        ]}
      >
        <Text style={styles.nodeText}>
          Graines posées sur les écailles d'un cône
        </Text>
      </View>

      {/* Résultats */}
      <View
        style={[
          styles.resultBox,
          {
            top: startY + 4 * verticalGap,
            left: centerX - horizontalGap - horizontalGap - boxWidth / 2,
          },
        ]}
      >
        <Text style={styles.resultText}>Angiospermes</Text>
      </View>

      <View
        style={[
          styles.resultBox,
          {
            top: startY + 4 * verticalGap,
            left: centerX - horizontalGap - boxWidth / 2,
          },
        ]}
      >
        <Text style={styles.resultText}>Gymnospermes</Text>
      </View>

      <View
        style={[
          styles.resultBox,
          {
            top: startY + 3 * verticalGap,
            left: centerX - horizontalGap + horizontalGap / 2 - boxWidth / 2,
          },
        ]}
      >
        <Text style={styles.resultText}>Ptéridophytes</Text>
      </View>

      <View
        style={[
          styles.resultBox,
          {
            top: startY + 2 * verticalGap,
            left: centerX + horizontalGap - boxWidth / 2,
          },
        ]}
      >
        <Text style={styles.resultText}>Algues</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  rootBox: {
    position: "absolute",
    width: 120,
    height: 40,
    backgroundColor: "#4CAF50",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  rootText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  nodeBox: {
    position: "absolute",
    width: 120,
    height: 40,
    backgroundColor: "#E8F5E9",
    borderWidth: 1,
    borderColor: "#4CAF50",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
    padding: 5,
  },
  nodeText: {
    color: "#333",
    fontSize: 12,
    textAlign: "center",
  },
  resultBox: {
    position: "absolute",
    width: 120,
    height: 40,
    backgroundColor: "#4CAF50",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  resultText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
});

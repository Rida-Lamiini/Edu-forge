"use client";

import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";
import { LinearGradient } from "expo-linear-gradient";
import Svg from "react-native-svg";

const { width } = Dimensions.get("window");

type TreeNode = {
  id: string;
  label: string;
  children?: TreeNode[];
  result?: string;
  icon?: string;
  color?: string;
};

type InteractiveDecisionTreeProps = {
  onSelect: (type: string) => void;
};

export default function InteractiveDecisionTree({
  onSelect,
}: InteractiveDecisionTreeProps) {
  const [expandedNodes, setExpandedNodes] = useState<string[]>(["root"]);
  const [activePath, setActivePath] = useState<string[]>(["root"]);
  const [selectedResult, setSelectedResult] = useState<string | null>(null);

  const treeData: TreeNode = {
    id: "root",
    label: "Plantes",
    children: [
      {
        id: "stem-leaves",
        label: "Avec tige et feuilles",
        children: [
          {
            id: "with-seeds",
            label: "Avec graines",
            children: [
              {
                id: "seeds-in-fruit",
                label: "Graines dans un fruit",
                result: "angiosperme",
                icon: "seed",
                color: "#FF9800",
              },
              {
                id: "seeds-on-cone",
                label: "Graines sur les écailles d'un cône",
                result: "gymnosperme",
                icon: "pine-tree",
                color: "#9C27B0",
              },
            ],
          },
          {
            id: "without-seeds",
            label: "Sans graines",
            result: "ptéridophyte",
            icon: "grass",
            color: "#2196F3",
          },
        ],
      },
      {
        id: "no-stem-leaves",
        label: "Sans tige ni feuilles",
        result: "algue",
        icon: "waves",
        color: "#4CAF50",
      },
    ],
  };

  const toggleNode = (nodeId: string, nodePath: string[] = []) => {
    if (expandedNodes.includes(nodeId)) {
      const newExpanded = expandedNodes.filter(
        (id) => id !== nodeId && !id.startsWith(`${nodeId}-`)
      );
      setExpandedNodes(newExpanded);
      setActivePath(nodePath);
    } else {
      setExpandedNodes([...expandedNodes, nodeId]);
      setActivePath([...nodePath, nodeId]);
    }
  };

  const handleResultSelect = (result: string) => {
    setSelectedResult(result);
    onSelect(result);
  };

  const renderNode = (node: TreeNode, level = 0, path: string[] = ["root"]) => {
    const isExpanded = expandedNodes.includes(node.id);
    const isActive = activePath.includes(node.id);
    const hasChildren = node.children && node.children.length > 0;
    const isResult = !!node.result;
    const currentPath = [...path, node.id];

    const animation =
      level === 0 ? "bounceIn" : isActive ? "fadeInRight" : "fadeIn";
    const delay = level * 100;

    return (
      <View key={node.id} style={styles.nodeContainer}>
        <Animatable.View animation={animation} duration={500} delay={delay}>
          <TouchableOpacity
            onPress={() => {
              if (isResult) {
                handleResultSelect(node.result!);
              } else {
                toggleNode(node.id, path);
              }
            }}
            style={[
              styles.node,
              level === 0 && styles.rootNode,
              isResult && styles.resultNode,
              isActive && styles.activeNode,
              isResult && { backgroundColor: node.color },
            ]}
          >
            {isResult ? (
              <View style={styles.resultContent}>
                <MaterialCommunityIcons
                  name={node.icon as any}
                  size={24}
                  color="white"
                />
                <Text style={styles.resultLabel}>{node.label}</Text>
              </View>
            ) : (
              <View style={styles.nodeContent}>
                <Text
                  style={[
                    styles.nodeLabel,
                    level === 0 && styles.rootLabel,
                    isActive && styles.activeLabel,
                  ]}
                >
                  {node.label}
                </Text>
                {hasChildren && (
                  <Ionicons
                    name={isExpanded ? "chevron-down" : "chevron-forward"}
                    size={20}
                    color={level === 0 ? "white" : "#555"}
                  />
                )}
              </View>
            )}
          </TouchableOpacity>
        </Animatable.View>

        {isExpanded && hasChildren && (
          <Animatable.View animation="fadeIn" style={styles.childrenContainer}>
            {node.children!.map((child) =>
              renderNode(child, level + 1, currentPath)
            )}
          </Animatable.View>
        )}
      </View>
    );
  };

  const renderConnections = () => {
    return (
      <View style={StyleSheet.absoluteFill}>
        <Svg height="100%" width="100%">
          {/* Ajoutez les chemins SVG pour les connexions ici */}
        </Svg>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#f9f9f9", "#e0f7fa"]}
        style={styles.background}
      />
      {renderNode(treeData)}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    borderRadius: 20,
    overflow: "hidden",
    position: "relative",
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  nodeContainer: {
    marginBottom: 10,
  },
  node: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  rootNode: {
    backgroundColor: "#FF5252",
  },
  activeNode: {
    borderWidth: 2,
    borderColor: "#FF9800",
  },
  resultNode: {
    backgroundColor: "#4CAF50",
  },
  nodeContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  resultContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  nodeLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  rootLabel: {
    color: "white",
    fontSize: 18,
  },
  activeLabel: {
    color: "#FF9800",
  },
  resultLabel: {
    color: "white",
    fontWeight: "bold",
    marginLeft: 10,
  },
  childrenContainer: {
    marginLeft: 20,
    marginTop: 10,
    borderLeftWidth: 2,
    borderLeftColor: "#ccc",
    paddingLeft: 15,
  },
});

"use client";

import { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";

type PlantType = "algue" | "gymnosperme" | "angiosperme" | "pteridophyte";

type TreeNodeProps = {
  id: string;
  label: string;
  children?: TreeNodeProps[];
  result?: PlantType;
  icon?: string;
  color?: string;
  onSelect?: (type: PlantType) => void;
};

type InteractiveClassificationTreeProps = {
  onSelect: (type: PlantType) => void;
  currentPlantType?: PlantType;
};

export default function InteractiveClassificationTree({
  onSelect,
  currentPlantType,
}: InteractiveClassificationTreeProps) {
  const [expandedNodes, setExpandedNodes] = useState<string[]>(["root"]);
  const [activePath, setActivePath] = useState<string[]>(["root"]);
  const [selectedResult, setSelectedResult] = useState<PlantType | null>(null);

  // Reset the tree when a new plant is shown
  useEffect(() => {
    setSelectedResult(null);
    setExpandedNodes(["root"]);
    setActivePath(["root"]);
  }, [currentPlantType]);

  const treeData: TreeNodeProps = {
    id: "root",
    label: "Végétaux",
    children: [
      {
        id: "stem-leaves",
        label: "Avec tige et feuilles",
        children: [
          {
            id: "with-seeds",
            label: "Avec graine",
            children: [
              {
                id: "seeds-in-fruit",
                label: "Graines enfermées dans un fruit",
                result: "angiosperme",
                icon: "fruit-cherries",
                color: "#FF9800",
              },
              {
                id: "seeds-on-cone",
                label: "Graines posées sur les écailles d'un cône",
                result: "gymnosperme",
                icon: "pine-tree",
                color: "#2196F3",
              },
            ],
          },
          {
            id: "without-seeds",
            label: "Sans graine",
            result: "pteridophyte",
            icon: "grass",
            color: "#4CAF50",
          },
        ],
      },
      {
        id: "no-stem-leaves",
        label: "Sans tige ni feuilles",
        result: "algue",
        icon: "waves",
        color: "#9C27B0",
      },
    ],
  };

  const toggleNode = (nodeId: string, nodePath: string[] = []) => {
    if (expandedNodes.includes(nodeId)) {
      // Collapse this node and all its children
      const newExpanded = expandedNodes.filter(
        (id) => id !== nodeId && !id.startsWith(`${nodeId}-`)
      );
      setExpandedNodes(newExpanded);
      setActivePath(nodePath);
    } else {
      // Expand this node
      setExpandedNodes([...expandedNodes, nodeId]);
      setActivePath([...nodePath, nodeId]);
    }
  };

  const handleResultSelect = (result: PlantType) => {
    setSelectedResult(result);
    onSelect(result);
  };

  const renderNode = (
    node: TreeNodeProps,
    level = 0,
    path: string[] = ["root"]
  ) => {
    const isExpanded = expandedNodes.includes(node.id);
    const isActive = activePath.includes(node.id);
    const hasChildren = node.children && node.children.length > 0;
    const isResult = !!node.result;
    const currentPath = [...path, node.id];

    // Determine animation based on level
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
                  <MaterialCommunityIcons
                    name={isExpanded ? "chevron-down" : "chevron-right"}
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Classification des végétaux</Text>
      <Text style={styles.subtitle}>
        Cliquez sur les nœuds pour explorer l'arbre de classification
      </Text>
      {renderNode(treeData)}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: "white",
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
    fontStyle: "italic",
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
    backgroundColor: "#4CAF50",
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

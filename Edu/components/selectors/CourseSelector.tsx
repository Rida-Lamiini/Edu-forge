"use client";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";

type ChapitreType = "chapitre1" | "chapitre2" | "chapitre3";

type CourseSelectorProps = {
  onSelectChapitre: (chapitre: ChapitreType) => void;
};

type Chapitre = {
  id: ChapitreType;
  title: string;
  description: string;
  icon: string;
  iconType: "Ionicons" | "MaterialCommunityIcons";
  colors: string[];
  sequencesCount: number;
};

const chapitres: Chapitre[] = [
  {
    id: "chapitre1",
    title: "Chapitre 1",
    description: "Les écosystèmes et leurs composantes.",
    icon: "leaf",
    iconType: "Ionicons",
    colors: ["#4CAF50", "#2E7D32"],
    sequencesCount: 2,
  },
  {
    id: "chapitre2",
    title: "Chapitre 2",
    description: "Les systèmes organiques selon l'environnement.",
    icon: "atom",
    iconType: "MaterialCommunityIcons",
    colors: ["#2196F3", "#1565C0"],
    sequencesCount: 2,
  },
  {
    id: "chapitre3",
    title: "Chapitre 3",
    description: "La cellule, unité structurale et fonctionnelle du vivant.",
    icon: "flask",
    iconType: "MaterialCommunityIcons",
    colors: ["#9C27B0", "#7B1FA2"],
    sequencesCount: 2,
  },
];

export default function CourseSelector({
  onSelectChapitre,
}: CourseSelectorProps) {
  const renderIcon = (chapitre: Chapitre, size: number) => {
    if (chapitre.iconType === "Ionicons") {
      return <Ionicons name={chapitre.icon as any} size={size} color="white" />;
    } else {
      return (
        <MaterialCommunityIcons
          name={chapitre.icon as any}
          size={size}
          color="white"
        />
      );
    }
  };

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={["#f5f9fc", "#e0f7fa"]}
        style={styles.background}
      />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Science de la vie et de la terre</Text>
        <Text style={styles.headerSubtitle}>Livret de l'éléve</Text>
      </View>

      <View style={styles.coursesContainer}>
        {chapitres.map((chapitre, index) => (
          <Animatable.View
            key={chapitre.id}
            animation="fadeInUp"
            delay={index * 100}
            style={styles.courseCardWrapper}
          >
            <TouchableOpacity
              style={styles.courseCard}
              onPress={() => onSelectChapitre(chapitre.id)}
            >
              <LinearGradient
                colors={chapitre.colors}
                style={styles.courseHeader}
              >
                <View style={styles.courseIconContainer}>
                  {renderIcon(chapitre, 40)}
                </View>
                <Text style={styles.courseTitle}>{chapitre.title}</Text>
              </LinearGradient>

              <View style={styles.courseContent}>
                <Text style={styles.courseDescription}>
                  {chapitre.description}
                </Text>

                <View style={styles.courseFooter}>
                  <View style={styles.courseStats}>
                    <MaterialCommunityIcons
                      name="book-open-variant"
                      size={16}
                      color="#666"
                    />
                    <Text style={styles.courseStatsText}>
                      {chapitre.sequencesCount} Séquences
                    </Text>
                  </View>

                  <View style={styles.courseAction}>
                    <Text
                      style={[
                        styles.courseActionText,
                        { color: chapitre.colors[0] },
                      ]}
                    >
                      Commencer
                    </Text>
                    <Ionicons
                      name="chevron-forward"
                      size={16}
                      color={chapitre.colors[0]}
                    />
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </Animatable.View>
        ))}
      </View>
    </ScrollView>
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
    height: "100%",
  },
  header: {
    padding: 20,
    paddingTop: 60,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#666",
  },
  coursesContainer: {
    padding: 15,
  },
  courseCardWrapper: {
    marginBottom: 20,
  },
  courseCard: {
    backgroundColor: "white",
    borderRadius: 15,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  courseHeader: {
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  courseIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  courseTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  courseContent: {
    padding: 20,
  },
  courseDescription: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
    lineHeight: 22,
  },
  courseFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  courseStats: {
    flexDirection: "row",
    alignItems: "center",
  },
  courseStatsText: {
    marginLeft: 5,
    color: "#666",
    fontSize: 14,
  },
  courseAction: {
    flexDirection: "row",
    alignItems: "center",
  },
  courseActionText: {
    fontWeight: "bold",
    marginRight: 5,
    fontSize: 14,
  },
});

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
type SequenceType = "sequence1" | "sequence2";
type SeanceType = "seance1" | "seance2" | "seance3";
type ActivityType =
  | "activity1"
  | "activity2"
  | "activity3"
  | "activity4"
  | "activity5";

type ActivitySelectorProps = {
  chapitre: ChapitreType;
  sequence: SequenceType;
  seance: SeanceType;
  onSelectActivity: (activity: ActivityType) => void;
  onBack: () => void;
};

type Activity = {
  id: ActivityType;
  title: string;
  description: string;
  icon: string;
  iconType: "Ionicons" | "MaterialCommunityIcons";
  colors: string[];
  activityNumber: number;
  completed: boolean;
};

// Update activity data to ensure each seance has a set of activities
const seance1Activities: Activity[] = [
  {
    id: "activity1",
    title: "Activité 1",
    description: "Étude des composantes des écosystèmes.",
    icon: "leaf",
    iconType: "MaterialCommunityIcons",
    colors: ["#4CAF50", "#2E7D32"],
    activityNumber: 1,
    completed: false,
  },
  {
    id: "activity2",
    title: "Activité 2",
    description: "Classification des écosystèmes.",
    icon: "tree",
    iconType: "MaterialCommunityIcons",
    colors: ["#FF9800", "#F57C00"],
    activityNumber: 2,
    completed: false,
  },
];

const seance2Activities: Activity[] = [
  {
    id: "activity3",
    title: "Activité 1",
    description: "Interactions entre écosystèmes.",
    icon: "earth",
    iconType: "MaterialCommunityIcons",
    colors: ["#2196F3", "#1976D2"],
    activityNumber: 1,
    completed: false,
  },
  {
    id: "activity4",
    title: "Activité 2",
    description: "Facteurs d'unité entre écosystèmes.",
    icon: "water",
    iconType: "MaterialCommunityIcons",
    colors: ["#26A69A", "#00796B"],
    activityNumber: 2,
    completed: false,
  },
];

const sequence2Seance1Activities: Activity[] = [
  {
    id: "activity1",
    title: "Activité 1",
    description: "Classification des végétaux.",
    icon: "leaf",
    iconType: "MaterialCommunityIcons",
    colors: ["#4CAF50", "#2E7D32"],
    activityNumber: 1,
    completed: false,
  },
  {
    id: "activity2",
    title: "Activité 2",
    description: "Classification des angiospermes.",
    icon: "flower",
    iconType: "MaterialCommunityIcons",
    colors: ["#FF9800", "#F57C00"],
    activityNumber: 2,
    completed: false,
  },
];

const sequence2Seance2Activities: Activity[] = [
  {
    id: "activity3",
    title: "Activité 1",
    description: "Classification des oiseaux.",
    icon: "bird",
    iconType: "MaterialCommunityIcons",
    colors: ["#2196F3", "#1976D2"],
    activityNumber: 1,
    completed: false,
  },
  {
    id: "activity4",
    title: "Activité 2",
    description: "Classification des mammifères.",
    icon: "dog",
    iconType: "MaterialCommunityIcons",
    colors: ["#26A69A", "#00796B"],
    activityNumber: 2,
    completed: false,
  },
];

// Add more activities for other chapitre-sequence-seance combinations
const chapitre2Sequence1Seance1Activities: Activity[] = [
  {
    id: "activity1",
    title: "Activité 1",
    description: "Branchies et respiration aquatique.",
    icon: "fish",
    iconType: "MaterialCommunityIcons",
    colors: ["#2196F3", "#1976D2"],
    activityNumber: 1,
    completed: false,
  },
  {
    id: "activity2",
    title: "Activité 2",
    description: "Étude de la respiration des poissons.",
    icon: "water",
    iconType: "MaterialCommunityIcons",
    colors: ["#00BCD4", "#0097A7"],
    activityNumber: 2,
    completed: false,
  },
];

// Create a function to get the correct activities based on chapitre, sequence, and seance
function getActivitiesForSeance(
  chapitre: ChapitreType,
  sequence: SequenceType,
  seance: SeanceType
): Activity[] {
  if (chapitre === "chapitre1") {
    if (sequence === "sequence1") {
      return seance === "seance1" ? seance1Activities : seance2Activities;
    } else if (sequence === "sequence2") {
      return seance === "seance1"
        ? sequence2Seance1Activities
        : sequence2Seance2Activities;
    }
  } else if (chapitre === "chapitre2") {
    if (sequence === "sequence1") {
      if (seance === "seance1") {
        return chapitre2Sequence1Seance1Activities;
      } else {
        // Return activities for chapitre2, sequence1, seance2
        return chapitre2Sequence1Seance1Activities; // Change this to the correct set when available
      }
    }
  }
  // Default to an empty array if no matching activities
  return [];
}

// Update seanceData to make it simpler
const seanceData = {
  seance1: {
    title: "Séance 1",
    colors: ["#4CAF50", "#2E7D32"],
  },
  seance2: {
    title: "Séance 2",
    colors: ["#2196F3", "#1565C0"],
  },
  seance3: {
    title: "Séance 3",
    colors: ["#FF9800", "#F57C00"],
  },
};

export default function ActivitySelector({
  chapitre,
  sequence,
  seance,
  onSelectActivity,
  onBack,
}: ActivitySelectorProps) {
  const seanceInfo = seanceData[seance];
  const activities = getActivitiesForSeance(chapitre, sequence, seance);

  const renderIcon = (activity: Activity, size: number) => {
    if (activity.iconType === "Ionicons") {
      return <Ionicons name={activity.icon as any} size={size} color="white" />;
    } else {
      return (
        <MaterialCommunityIcons
          name={activity.icon as any}
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
        <LinearGradient
          colors={seanceInfo.colors}
          style={styles.headerGradient}
        >
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{seanceInfo.title}</Text>
          <Text style={styles.headerSubtitle}>Sélectionner une activité</Text>
        </LinearGradient>
      </View>

      <View style={styles.breadcrumbs}>
        <Text style={styles.breadcrumbText}>
          <Text style={styles.breadcrumbChapitre}>
            {chapitreData[chapitre]?.title || chapitre}
          </Text>{" "}
          /{" "}
          <Text style={styles.breadcrumbSequence}>
            {sequenceData[sequence]?.title || sequence}
          </Text>{" "}
          / <Text style={styles.breadcrumbSeance}>{seanceInfo.title}</Text>
        </Text>
      </View>

      <View style={styles.activitiesContainer}>
        {activities.length > 0 ? (
          activities.map((activity, index) => (
            <Animatable.View
              key={activity.id}
              animation="fadeInUp"
              delay={index * 100}
            >
              <TouchableOpacity
                style={styles.activityCard}
                onPress={() => onSelectActivity(activity.id)}
              >
                <LinearGradient
                  colors={activity.colors}
                  style={styles.activityIconContainer}
                >
                  {renderIcon(activity, 40)}
                </LinearGradient>

                <View style={styles.activityInfo}>
                  <View style={styles.activityHeader}>
                    <Text style={styles.activityTitle}>{activity.title}</Text>
                    <View style={styles.activityNumberBadge}>
                      <Text style={styles.activityNumberText}>
                        {activity.activityNumber}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.activityDescription} numberOfLines={2}>
                    {activity.description}
                  </Text>

                  <View style={styles.activityFooter}>
                    {activity.completed ? (
                      <View style={styles.completedBadge}>
                        <Ionicons
                          name="checkmark-circle"
                          size={16}
                          color="#4CAF50"
                        />
                        <Text style={styles.completedText}>Terminé</Text>
                      </View>
                    ) : (
                      <View style={styles.startBadge}>
                        <Text style={styles.startText}>Commencer</Text>
                      </View>
                    )}

                    <Ionicons name="chevron-forward" size={20} color="#999" />
                  </View>
                </View>
              </TouchableOpacity>
            </Animatable.View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons
              name="book-open-page-variant"
              size={60}
              color="#ccc"
            />
            <Text style={styles.emptyStateText}>
              Aucune activité disponible
            </Text>
            <Text style={styles.emptyStateSubtext}>
              Revenez bientôt pour du nouveau contenu!
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const chapitreData = {
  chapitre1: {
    title: "Chapitre 1",
    colors: ["#4CAF50", "#2E7D32"],
  },
  chapitre2: {
    title: "Chapitre 2",
    colors: ["#2196F3", "#1565C0"],
  },
  chapitre3: {
    title: "Chapitre 3",
    colors: ["#9C27B0", "#7B1FA2"],
  },
};

const sequenceData = {
  sequence1: {
    title: "Séquence 1",
    colors: ["#4CAF50", "#2E7D32"],
  },
  sequence2: {
    title: "Séquence 2",
    colors: ["#9C27B0", "#7B1FA2"],
  },
};

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
    marginBottom: 10,
  },
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  backButton: {
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
  },
  breadcrumbs: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    marginBottom: 10,
  },
  breadcrumbText: {
    fontSize: 14,
    color: "#666",
  },
  breadcrumbChapitre: {
    fontWeight: "bold",
    color: "#333",
  },
  breadcrumbSequence: {
    fontWeight: "bold",
    color: "#333",
  },
  breadcrumbSeance: {
    fontWeight: "bold",
    color: "#333",
  },
  activitiesContainer: {
    padding: 15,
  },
  activityCard: {
    backgroundColor: "white",
    borderRadius: 15,
    marginBottom: 15,
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
  },
  activityIconContainer: {
    width: 80,
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
  },
  activityInfo: {
    flex: 1,
    padding: 15,
  },
  activityHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  activityNumberBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  activityNumberText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#666",
  },
  activityDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  activityFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  completedBadge: {
    flexDirection: "row",
    alignItems: "center",
  },
  completedText: {
    marginLeft: 5,
    color: "#4CAF50",
    fontWeight: "bold",
    fontSize: 12,
  },
  startBadge: {
    flexDirection: "row",
    alignItems: "center",
  },
  startText: {
    color: "#2196F3",
    fontWeight: "bold",
    fontSize: 12,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#999",
    marginTop: 20,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: "#999",
    marginTop: 10,
    textAlign: "center",
  },
});

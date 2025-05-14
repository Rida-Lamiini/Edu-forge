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

type CourseType = "biology" | "physics" | "chemistry";
type ChapterType = "plants" | "animals" | "ecosystems";
type SequenceType =
  | "classification"
  | "anatomy"
  | "lifecycle"
  | "scientific_method"
  | "respiration";
type ActivityType =
  | "plants"
  | "oaks"
  | "birds"
  | "cricket_experiment"
  | "pond_respiration";

type ActivitySelectorProps = {
  course: CourseType;
  chapter: ChapterType;
  sequence: SequenceType;
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

const classificationActivities: Activity[] = [
  {
    id: "plants",
    title: "Plant Classification",
    description:
      "Learn to identify different types of plants based on their characteristics",
    icon: "leaf",
    iconType: "MaterialCommunityIcons",
    colors: ["#4CAF50", "#2E7D32"],
    activityNumber: 1,
    completed: false,
  },
  {
    id: "birds",
    title: "Bird Identification",
    description:
      "Learn to identify four types of tit birds using a determination key",
    icon: "bird",
    iconType: "MaterialCommunityIcons",
    colors: ["#2196F3", "#1976D2"],
    activityNumber: 2,
    completed: false,
  },
  {
    id: "oaks",
    title: "Oak Tree Identification",
    description:
      "Learn to identify three types of oak trees using a determination key",
    icon: "tree",
    iconType: "MaterialCommunityIcons",
    colors: ["#FF9800", "#F57C00"],
    activityNumber: 3,
    completed: false,
  },
];

const scientificMethodActivities: Activity[] = [
  {
    id: "cricket_experiment",
    title: "Démarche Expérimentale",
    description:
      "Apprendre les étapes de la démarche expérimentale avec l'exemple de la respiration des criquets",
    icon: "flask",
    iconType: "MaterialCommunityIcons",
    colors: ["#FF9800", "#F57C00"],
    activityNumber: 1,
    completed: false,
  },
];

const respirationActivities: Activity[] = [
  {
    id: "pond_respiration",
    title: "Modes de respiration dans un étang",
    description:
      "Classifiez les animaux d'un étang selon leurs modes et organes de respiration",
    icon: "water",
    iconType: "MaterialCommunityIcons",
    colors: ["#26A69A", "#00796B"],
    activityNumber: 1,
    completed: false,
  },
];

const sequenceData = {
  classification: {
    title: "Classification",
    activities: classificationActivities,
    colors: ["#4CAF50", "#2E7D32"],
  },
  anatomy: {
    title: "Plant Anatomy",
    activities: [],
    colors: ["#FF9800", "#F57C00"],
  },
  lifecycle: {
    title: "Plant Lifecycle",
    activities: [],
    colors: ["#9C27B0", "#7B1FA2"],
  },
  scientific_method: {
    title: "Méthode Scientifique",
    activities: scientificMethodActivities,
    colors: ["#FF9800", "#F57C00"],
  },
  respiration: {
    title: "Respiration",
    activities: respirationActivities,
    colors: ["#26A69A", "#00796B"],
  },
};

export default function ActivitySelector({
  course,
  chapter,
  sequence,
  onSelectActivity,
  onBack,
}: ActivitySelectorProps) {
  const sequenceInfo = sequenceData[sequence];
  const activities = sequenceInfo.activities;

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
          colors={sequenceInfo.colors}
          style={styles.headerGradient}
        >
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{sequenceInfo.title}</Text>
          <Text style={styles.headerSubtitle}>
            Select an activity to start learning
          </Text>
        </LinearGradient>
      </View>

      <View style={styles.breadcrumbs}>
        <Text style={styles.breadcrumbText}>
          <Text style={styles.breadcrumbCourse}>{course}</Text> /{" "}
          <Text style={styles.breadcrumbChapter}>{chapter}</Text> /{" "}
          <Text style={styles.breadcrumbSequence}>{sequenceInfo.title}</Text>
        </Text>
      </View>

      <View style={styles.activitiesContainer}>
        {activities.map((activity, index) => (
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
                      <Text style={styles.completedText}>Completed</Text>
                    </View>
                  ) : (
                    <View style={styles.startBadge}>
                      <Text style={styles.startText}>Start Activity</Text>
                    </View>
                  )}

                  <Ionicons name="chevron-forward" size={20} color="#999" />
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
  breadcrumbCourse: {
    fontWeight: "bold",
    color: "#333",
    textTransform: "capitalize",
  },
  breadcrumbChapter: {
    fontWeight: "bold",
    color: "#333",
    textTransform: "capitalize",
  },
  breadcrumbSequence: {
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
});

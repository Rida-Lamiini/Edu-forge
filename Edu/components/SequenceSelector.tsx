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
type SequenceType = "classification" | "anatomy" | "lifecycle";

type SequenceSelectorProps = {
  course: CourseType;
  chapter: ChapterType;
  onSelectSequence: (sequence: SequenceType) => void;
  onBack: () => void;
};

type Sequence = {
  id: SequenceType;
  title: string;
  description: string;
  icon: string;
  iconType: "Ionicons" | "MaterialCommunityIcons";
  activitiesCount: number;
  progress: number;
  colors: string[];
};

const plantSequences: Sequence[] = [
  {
    id: "classification",
    title: "Classification",
    description:
      "Learn to identify and classify different types of plants and trees",
    icon: "leaf",
    iconType: "Ionicons",
    activitiesCount: 3,
    progress: 0,
    colors: ["#4CAF50", "#2E7D32"],
  },
  {
    id: "anatomy",
    title: "Plant Anatomy",
    description: "Explore the structure and parts of plants",
    icon: "sprout",
    iconType: "MaterialCommunityIcons",
    activitiesCount: 0,
    progress: 0,
    colors: ["#FF9800", "#F57C00"],
  },
  {
    id: "lifecycle",
    title: "Plant Lifecycle",
    description: "Understand how plants grow, reproduce, and develop",
    icon: "flower",
    iconType: "MaterialCommunityIcons",
    activitiesCount: 0,
    progress: 0,
    colors: ["#9C27B0", "#7B1FA2"],
  },
];

const chapterData = {
  plants: {
    title: "Plant Kingdom",
    sequences: plantSequences,
    colors: ["#4CAF50", "#2E7D32"],
  },
  animals: {
    title: "Animal Kingdom",
    sequences: [],
    colors: ["#FF5722", "#E64A19"],
  },
  ecosystems: {
    title: "Ecosystems",
    sequences: [],
    colors: ["#009688", "#00796B"],
  },
};

export default function SequenceSelector({
  course,
  chapter,
  onSelectSequence,
  onBack,
}: SequenceSelectorProps) {
  const chapterInfo = chapterData[chapter];
  const sequences = chapterInfo.sequences;

  const renderIcon = (sequence: Sequence, size: number) => {
    if (sequence.iconType === "Ionicons") {
      return <Ionicons name={sequence.icon as any} size={size} color="#fff" />;
    } else {
      return (
        <MaterialCommunityIcons
          name={sequence.icon as any}
          size={size}
          color="#fff"
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
          colors={chapterInfo.colors}
          style={styles.headerGradient}
        >
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{chapterInfo.title}</Text>
          <Text style={styles.headerSubtitle}>
            Select a sequence to continue
          </Text>
        </LinearGradient>
      </View>

      <View style={styles.breadcrumbs}>
        <Text style={styles.breadcrumbText}>
          <Text style={styles.breadcrumbCourse}>{course}</Text> /{" "}
          <Text style={styles.breadcrumbChapter}>{chapterInfo.title}</Text>
        </Text>
      </View>

      <View style={styles.sequencesContainer}>
        {sequences.length > 0 ? (
          sequences.map((sequence, index) => (
            <Animatable.View
              key={sequence.id}
              animation="fadeInUp"
              delay={index * 100}
            >
              <TouchableOpacity
                style={styles.sequenceCard}
                onPress={() => onSelectSequence(sequence.id)}
                disabled={sequence.activitiesCount === 0}
              >
                <LinearGradient
                  colors={sequence.colors}
                  style={styles.sequenceIconContainer}
                >
                  {renderIcon(sequence, 30)}
                </LinearGradient>

                <View style={styles.sequenceContent}>
                  <View style={styles.sequenceTitleRow}>
                    <Text style={styles.sequenceTitle}>{sequence.title}</Text>
                    {sequence.activitiesCount === 0 && (
                      <View style={styles.comingSoonBadge}>
                        <Text style={styles.comingSoonText}>Coming Soon</Text>
                      </View>
                    )}
                  </View>

                  <Text style={styles.sequenceDescription} numberOfLines={2}>
                    {sequence.description}
                  </Text>

                  <View style={styles.sequenceFooter}>
                    <View style={styles.sequenceStats}>
                      <MaterialCommunityIcons
                        name="notebook"
                        size={16}
                        color="#666"
                      />
                      <Text style={styles.sequenceStatsText}>
                        {sequence.activitiesCount}{" "}
                        {sequence.activitiesCount === 1
                          ? "Activity"
                          : "Activities"}
                      </Text>
                    </View>

                    {sequence.activitiesCount > 0 && (
                      <View style={styles.progressContainer}>
                        <View style={styles.progressBar}>
                          <View
                            style={[
                              styles.progressFill,
                              {
                                width: `${sequence.progress}%`,
                                backgroundColor: sequence.colors[0],
                              },
                            ]}
                          />
                        </View>
                        <Text style={styles.progressText}>
                          {sequence.progress}%
                        </Text>
                      </View>
                    )}
                  </View>
                </View>

                {sequence.activitiesCount > 0 && (
                  <View style={styles.sequenceArrow}>
                    <Ionicons name="chevron-forward" size={20} color="#999" />
                  </View>
                )}
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
              No sequences available yet
            </Text>
            <Text style={styles.emptyStateSubtext}>
              Check back soon for new content!
            </Text>
          </View>
        )}
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
  },
  sequencesContainer: {
    padding: 15,
  },
  sequenceCard: {
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
  sequenceIconContainer: {
    width: 70,
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
  },
  sequenceContent: {
    flex: 1,
    padding: 15,
  },
  sequenceTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  sequenceTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  comingSoonBadge: {
    backgroundColor: "#FFD54F",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  comingSoonText: {
    color: "#5D4037",
    fontSize: 10,
    fontWeight: "bold",
  },
  sequenceDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  sequenceFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sequenceStats: {
    flexDirection: "row",
    alignItems: "center",
  },
  sequenceStatsText: {
    marginLeft: 5,
    color: "#666",
    fontSize: 12,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  progressBar: {
    width: 50,
    height: 6,
    backgroundColor: "#f0f0f0",
    borderRadius: 3,
    marginRight: 5,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: "#666",
  },
  sequenceArrow: {
    justifyContent: "center",
    paddingLeft: 10,
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

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

type ChapterSelectorProps = {
  course: CourseType;
  onSelectChapter: (chapter: ChapterType) => void;
  onBack: () => void;
};

type Chapter = {
  id: ChapterType;
  title: string;
  description: string;
  icon: string;
  iconType: "Ionicons" | "MaterialCommunityIcons";
  sequencesCount: number;
  progress: number;
};

const biologyChapters: Chapter[] = [
  {
    id: "plants",
    title: "Plant Kingdom",
    description:
      "Learn about the diverse world of plants and their classification",
    icon: "leaf",
    iconType: "Ionicons",
    sequencesCount: 3,
    progress: 0,
  },
  {
    id: "animals",
    title: "Animal Kingdom",
    description:
      "Explore the fascinating diversity of animals and their characteristics",
    icon: "paw",
    iconType: "MaterialCommunityIcons",
    sequencesCount: 0,
    progress: 0,
  },
  {
    id: "ecosystems",
    title: "Ecosystems",
    description:
      "Understand how organisms interact with each other and their environment",
    icon: "earth",
    iconType: "MaterialCommunityIcons",
    sequencesCount: 0,
    progress: 0,
  },
];

const courseData = {
  biology: {
    title: "Biology",
    chapters: biologyChapters,
    colors: ["#4CAF50", "#2E7D32"],
  },
  physics: {
    title: "Physics",
    chapters: [],
    colors: ["#2196F3", "#1565C0"],
  },
  chemistry: {
    title: "Chemistry",
    chapters: [],
    colors: ["#9C27B0", "#7B1FA2"],
  },
};

export default function ChapterSelector({
  course,
  onSelectChapter,
  onBack,
}: ChapterSelectorProps) {
  const courseInfo = courseData[course];
  const chapters = courseInfo.chapters.length > 0 ? courseInfo.chapters : [];

  const renderIcon = (chapter: Chapter, size: number) => {
    if (chapter.iconType === "Ionicons") {
      return <Ionicons name={chapter.icon as any} size={size} color="#fff" />;
    } else {
      return (
        <MaterialCommunityIcons
          name={chapter.icon as any}
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
          colors={courseInfo.colors}
          style={styles.headerGradient}
        >
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{courseInfo.title}</Text>
          <Text style={styles.headerSubtitle}>
            Select a chapter to continue
          </Text>
        </LinearGradient>
      </View>

      <View style={styles.breadcrumbs}>
        <Text style={styles.breadcrumbText}>
          <Text style={styles.breadcrumbCourse}>{course}</Text>
        </Text>
      </View>

      <View style={styles.chaptersContainer}>
        {chapters.length > 0 ? (
          chapters.map((chapter, index) => (
            <Animatable.View
              key={chapter.id}
              animation="fadeInUp"
              delay={index * 100}
            >
              <TouchableOpacity
                style={styles.chapterCard}
                onPress={() => onSelectChapter(chapter.id)}
                disabled={chapter.sequencesCount === 0}
              >
                <View
                  style={styles.chapterIconContainer}
                  backgroundColor={courseInfo.colors[0]}
                >
                  {renderIcon(chapter, 30)}
                </View>

                <View style={styles.chapterContent}>
                  <View style={styles.chapterTitleRow}>
                    <Text style={styles.chapterTitle}>{chapter.title}</Text>
                    {chapter.sequencesCount === 0 && (
                      <View style={styles.comingSoonBadge}>
                        <Text style={styles.comingSoonText}>Coming Soon</Text>
                      </View>
                    )}
                  </View>

                  <Text style={styles.chapterDescription} numberOfLines={2}>
                    {chapter.description}
                  </Text>

                  <View style={styles.chapterFooter}>
                    <View style={styles.chapterStats}>
                      <MaterialCommunityIcons
                        name="notebook"
                        size={16}
                        color="#666"
                      />
                      <Text style={styles.chapterStatsText}>
                        {chapter.sequencesCount}{" "}
                        {chapter.sequencesCount === 1
                          ? "Sequence"
                          : "Sequences"}
                      </Text>
                    </View>

                    {chapter.sequencesCount > 0 && (
                      <View style={styles.progressContainer}>
                        <View style={styles.progressBar}>
                          <View
                            style={[
                              styles.progressFill,
                              {
                                width: `${chapter.progress}%`,
                                backgroundColor: courseInfo.colors[0],
                              },
                            ]}
                          />
                        </View>
                        <Text style={styles.progressText}>
                          {chapter.progress}%
                        </Text>
                      </View>
                    )}
                  </View>
                </View>

                {chapter.sequencesCount > 0 && (
                  <View style={styles.chapterArrow}>
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
            <Text style={styles.emptyStateText}>No chapters available yet</Text>
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
  chaptersContainer: {
    padding: 15,
  },
  chapterCard: {
    backgroundColor: "white",
    borderRadius: 15,
    marginBottom: 15,
    padding: 15,
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chapterIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  chapterContent: {
    flex: 1,
  },
  chapterTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  chapterTitle: {
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
  chapterDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  chapterFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  chapterStats: {
    flexDirection: "row",
    alignItems: "center",
  },
  chapterStatsText: {
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
  chapterArrow: {
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

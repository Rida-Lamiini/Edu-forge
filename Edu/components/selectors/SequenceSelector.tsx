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

type SequenceSelectorProps = {
  chapitre: ChapitreType;
  onSelectSequence: (sequence: SequenceType) => void;
  onBack: () => void;
};

type Sequence = {
  id: SequenceType;
  title: string;
  description: string;
  icon: string;
  iconType: "Ionicons" | "MaterialCommunityIcons";
  seancesCount: number;
  progress: number;
};

const chapitre1Sequences: Sequence[] = [
  {
    id: "sequence1",
    title: "Séquence 1",
    description: "Diversité des écosystèmes et leur unité.",
    icon: "leaf",
    iconType: "Ionicons",
    seancesCount: 3,
    progress: 0,
  },
  {
    id: "sequence2",
    title: "Séquence 2",
    description: "Classification des êtres vivants.",
    icon: "paw",
    iconType: "MaterialCommunityIcons",
    seancesCount: 2,
    progress: 0,
  },
];

const chapitreData = {
  chapitre1: {
    title: "Chapitre 1",
    sequences: chapitre1Sequences,
    colors: ["#4CAF50", "#2E7D32"],
  },
  chapitre2: {
    title: "Chapitre 2",
    sequences: [],
    colors: ["#2196F3", "#1565C0"],
  },
  chapitre3: {
    title: "Chapitre 3",
    sequences: [],
    colors: ["#9C27B0", "#7B1FA2"],
  },
};

export default function SequenceSelector({
  chapitre,
  onSelectSequence,
  onBack,
}: SequenceSelectorProps) {
  const chapitreInfo = chapitreData[chapitre];
  const sequences =
    chapitreInfo.sequences.length > 0 ? chapitreInfo.sequences : [];

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
          colors={chapitreInfo.colors}
          style={styles.headerGradient}
        >
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Séquences</Text>
          <Text style={styles.headerSubtitle}>Selectionner une Séquence</Text>
        </LinearGradient>
      </View>

      <View style={styles.breadcrumbs}>
        <Text style={styles.breadcrumbText}>
          <Text style={styles.breadcrumbCourse}>{chapitreInfo.title}</Text>
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
                disabled={sequence.seancesCount === 0}
              >
                <View
                  style={styles.sequenceIconContainer}
                  backgroundColor={chapitreInfo.colors[0]}
                >
                  {renderIcon(sequence, 30)}
                </View>

                <View style={styles.sequenceContent}>
                  <View style={styles.sequenceTitleRow}>
                    <Text style={styles.sequenceTitle}>{sequence.title}</Text>
                    {sequence.seancesCount === 0 && (
                      <View style={styles.comingSoonBadge}>
                        <Text style={styles.comingSoonText}>À venir</Text>
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
                        {sequence.seancesCount}{" "}
                        {sequence.seancesCount === 1 ? "Séance" : "Séances"}
                      </Text>
                    </View>

                    {sequence.seancesCount > 0 && (
                      <View style={styles.progressContainer}>
                        <View style={styles.progressBar}>
                          <View
                            style={[
                              styles.progressFill,
                              {
                                width: `${sequence.progress}%`,
                                backgroundColor: chapitreInfo.colors[0],
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

                {sequence.seancesCount > 0 && (
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
              Aucune séquence disponible
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
  sequencesContainer: {
    padding: 15,
  },
  sequenceCard: {
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
  sequenceIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  sequenceContent: {
    flex: 1,
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

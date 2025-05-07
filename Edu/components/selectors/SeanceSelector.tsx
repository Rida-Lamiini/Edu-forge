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

type SeanceSelectorProps = {
  chapitre: ChapitreType;
  sequence: SequenceType;
  onSelectSeance: (seance: SeanceType) => void;
  onBack: () => void;
};

type Seance = {
  id: SeanceType;
  title: string;
  description: string;
  icon: string;
  iconType: "Ionicons" | "MaterialCommunityIcons";
  colors: string[];
  activitiesCount: number;
  progress: number;
};

// Update sequenceData to ensure each sequence has exactly 2 seances
const sequence1Seances: Seance[] = [
  {
    id: "seance1",
    title: "Séance 1",
    description: "Composantes des écosystèmes",
    icon: "leaf",
    iconType: "Ionicons",
    colors: ["#4CAF50", "#2E7D32"],
    activitiesCount: 2,
    progress: 0,
  },
  {
    id: "seance2",
    title: "Séance 2",
    description: "Unité des écosystèmes",
    icon: "earth",
    iconType: "MaterialCommunityIcons",
    colors: ["#2196F3", "#1565C0"],
    activitiesCount: 2,
    progress: 0,
  },
];

const sequence2Seances: Seance[] = [
  {
    id: "seance1",
    title: "Séance 1",
    description: "Classification des plantes",
    icon: "tree",
    iconType: "MaterialCommunityIcons",
    colors: ["#FF9800", "#F57C00"],
    activitiesCount: 2,
    progress: 0,
  },
  {
    id: "seance2",
    title: "Séance 2",
    description: "Classification des animaux",
    icon: "bird",
    iconType: "MaterialCommunityIcons",
    colors: ["#9C27B0", "#7B1FA2"],
    activitiesCount: 2,
    progress: 0,
  },
];

const chapitre2Sequence1Seances: Seance[] = [
  {
    id: "seance1",
    title: "Séance 1",
    description: "Respiration des animaux aquatiques",
    icon: "fish",
    iconType: "MaterialCommunityIcons",
    colors: ["#2196F3", "#1976D2"],
    activitiesCount: 2,
    progress: 0,
  },
  {
    id: "seance2",
    title: "Séance 2",
    description: "Adaptations respiratoires aquatiques",
    icon: "water",
    iconType: "MaterialCommunityIcons",
    colors: ["#00BCD4", "#0097A7"],
    activitiesCount: 2,
    progress: 0,
  },
];

const chapitre2Sequence2Seances: Seance[] = [
  {
    id: "seance1",
    title: "Séance 1",
    description: "Respiration des animaux terrestres",
    icon: "rabbit",
    iconType: "MaterialCommunityIcons",
    colors: ["#FF5722", "#E64A19"],
    activitiesCount: 2,
    progress: 0,
  },
  {
    id: "seance2",
    title: "Séance 2",
    description: "Adaptations respiratoires terrestres",
    icon: "lungs",
    iconType: "MaterialCommunityIcons",
    colors: ["#795548", "#5D4037"],
    activitiesCount: 2,
    progress: 0,
  },
];

const chapitre3Sequence1Seances: Seance[] = [
  {
    id: "seance1",
    title: "Séance 1",
    description: "Structure cellulaire",
    icon: "microscope",
    iconType: "MaterialCommunityIcons",
    colors: ["#9C27B0", "#7B1FA2"],
    activitiesCount: 2,
    progress: 0,
  },
  {
    id: "seance2",
    title: "Séance 2",
    description: "Organites cellulaires",
    icon: "atom",
    iconType: "MaterialCommunityIcons",
    colors: ["#673AB7", "#512DA8"],
    activitiesCount: 2,
    progress: 0,
  },
];

const chapitre3Sequence2Seances: Seance[] = [
  {
    id: "seance1",
    title: "Séance 1",
    description: "Métabolisme cellulaire",
    icon: "flask",
    iconType: "MaterialCommunityIcons",
    colors: ["#E91E63", "#C2185B"],
    activitiesCount: 2,
    progress: 0,
  },
  {
    id: "seance2",
    title: "Séance 2",
    description: "Échanges cellulaires",
    icon: "arrow-decision",
    iconType: "MaterialCommunityIcons",
    colors: ["#FFC107", "#FFA000"],
    activitiesCount: 2,
    progress: 0,
  },
];

// Update sequenceData with all sequences and their seances
const sequenceData = {
  sequence1: {
    title: "Séquence 1",
    seances: sequence1Seances,
    colors: ["#4CAF50", "#2E7D32"],
  },
  sequence2: {
    title: "Séquence 2",
    seances: sequence2Seances,
    colors: ["#9C27B0", "#7B1FA2"],
  },
};

// Add a mapping for chapitre-sequence combinations to return the correct seances
function getSeancesForChapitreSequence(
  chapitre: ChapitreType,
  sequence: SequenceType
): Seance[] {
  if (chapitre === "chapitre1") {
    return sequence === "sequence1" ? sequence1Seances : sequence2Seances;
  } else if (chapitre === "chapitre2") {
    return sequence === "sequence1"
      ? chapitre2Sequence1Seances
      : chapitre2Sequence2Seances;
  } else if (chapitre === "chapitre3") {
    return sequence === "sequence1"
      ? chapitre3Sequence1Seances
      : chapitre3Sequence2Seances;
  }
  return [];
}

export default function SeanceSelector({
  chapitre,
  sequence,
  onSelectSeance,
  onBack,
}: SeanceSelectorProps) {
  const sequenceInfo = sequenceData[sequence];
  // Get the correct seances based on chapitre and sequence
  const seances = getSeancesForChapitreSequence(chapitre, sequence);

  const renderIcon = (seance: Seance, size: number) => {
    if (seance.iconType === "Ionicons") {
      return <Ionicons name={seance.icon as any} size={size} color="#fff" />;
    } else {
      return (
        <MaterialCommunityIcons
          name={seance.icon as any}
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
          colors={sequenceInfo.colors}
          style={styles.headerGradient}
        >
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Séances</Text>
          <Text style={styles.headerSubtitle}>Sélectionner une séance</Text>
        </LinearGradient>
      </View>

      <View style={styles.breadcrumbs}>
        <Text style={styles.breadcrumbText}>
          <Text style={styles.breadcrumbChapitre}>
            {chapitreData[chapitre]?.title || chapitre}
          </Text>{" "}
          / <Text style={styles.breadcrumbSequence}>{sequenceInfo.title}</Text>
        </Text>
      </View>

      <View style={styles.seancesContainer}>
        {seances.length > 0 ? (
          seances.map((seance, index) => (
            <Animatable.View
              key={seance.id}
              animation="fadeInUp"
              delay={index * 100}
            >
              <TouchableOpacity
                style={styles.seanceCard}
                onPress={() => onSelectSeance(seance.id)}
                disabled={seance.activitiesCount === 0}
              >
                <LinearGradient
                  colors={seance.colors}
                  style={styles.seanceIconContainer}
                >
                  {renderIcon(seance, 30)}
                </LinearGradient>

                <View style={styles.seanceContent}>
                  <View style={styles.seanceTitleRow}>
                    <Text style={styles.seanceTitle}>{seance.title}</Text>
                    {seance.activitiesCount === 0 && (
                      <View style={styles.comingSoonBadge}>
                        <Text style={styles.comingSoonText}>À venir</Text>
                      </View>
                    )}
                  </View>

                  <Text style={styles.seanceDescription} numberOfLines={2}>
                    {seance.description}
                  </Text>

                  <View style={styles.seanceFooter}>
                    <View style={styles.seanceStats}>
                      <MaterialCommunityIcons
                        name="notebook"
                        size={16}
                        color="#666"
                      />
                      <Text style={styles.seanceStatsText}>
                        {seance.activitiesCount}{" "}
                        {seance.activitiesCount === 1
                          ? "Activité"
                          : "Activités"}
                      </Text>
                    </View>

                    {seance.activitiesCount > 0 && (
                      <View style={styles.progressContainer}>
                        <View style={styles.progressBar}>
                          <View
                            style={[
                              styles.progressFill,
                              {
                                width: `${seance.progress}%`,
                                backgroundColor: seance.colors[0],
                              },
                            ]}
                          />
                        </View>
                        <Text style={styles.progressText}>
                          {seance.progress}%
                        </Text>
                      </View>
                    )}
                  </View>
                </View>

                {seance.activitiesCount > 0 && (
                  <View style={styles.seanceArrow}>
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
            <Text style={styles.emptyStateText}>Aucune séance disponible</Text>
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
  seancesContainer: {
    padding: 15,
  },
  seanceCard: {
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
  seanceIconContainer: {
    width: 70,
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
  },
  seanceContent: {
    flex: 1,
    padding: 15,
  },
  seanceTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  seanceTitle: {
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
  seanceDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  seanceFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  seanceStats: {
    flexDirection: "row",
    alignItems: "center",
  },
  seanceStatsText: {
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
  seanceArrow: {
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

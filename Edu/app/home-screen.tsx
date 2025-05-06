"use client";

import { useState } from "react";
import { View, StyleSheet } from "react-native";
import CourseSelector from "../components/selectors/CourseSelector";
import SequenceSelector from "../components/selectors/SequenceSelector";
import SeanceSelector from "../components/selectors/SeanceSelector";
import ActivitySelector from "../components/selectors/ActivitySelector";
import PlantClassificationGame from "../components/PlantClassificationGame";
import OakClassificationGame from "../components/OakClassificationGame";
import BirdClassificationGame from "../components/BirdClassificationGame";
import ScientificMethodActivity from "../components/ScientificMethodActivity";
import PondRespirationActivity from "../components/PondRespirationActivity";
import PlantClassificationActivity from "../components/PlantClassificationActivity";

type ChapitreType = "chapitre1" | "chapitre2" | "chapitre3" | null;
type SequenceType = "sequence1" | "sequence2" | null;
type SeanceType = "seance1" | "seance2" | "seance3" | null;
type ActivityType =
  | "activity1"
  | "activity2"
  | "activity3"
  | "activity4"
  | "activity5"
  | null;

export default function HomeScreen() {
  const [selectedChapitre, setSelectedChapitre] = useState<ChapitreType>(null);
  const [selectedSequence, setSelectedSequence] = useState<SequenceType>(null);
  const [selectedSeance, setSelectedSeance] = useState<SeanceType>(null);
  const [selectedActivity, setSelectedActivity] = useState<ActivityType>(null);

  const handleBackToChapitres = () => {
    setSelectedChapitre(null);
    setSelectedSequence(null);
    setSelectedSeance(null);
    setSelectedActivity(null);
  };

  const handleBackToSequences = () => {
    setSelectedSequence(null);
    setSelectedSeance(null);
    setSelectedActivity(null);
  };

  const handleBackToSeances = () => {
    setSelectedSeance(null);
    setSelectedActivity(null);
  };

  const handleBackToActivities = () => {
    setSelectedActivity(null);
  };

  const renderContent = () => {
    if (!selectedChapitre) {
      return <CourseSelector onSelectChapitre={setSelectedChapitre} />;
    }

    if (!selectedSequence) {
      return (
        <SequenceSelector
          chapitre={selectedChapitre}
          onSelectSequence={setSelectedSequence}
          onBack={handleBackToChapitres}
        />
      );
    }

    if (!selectedSeance) {
      return (
        <SeanceSelector
          chapitre={selectedChapitre}
          sequence={selectedSequence}
          onSelectSeance={setSelectedSeance}
          onBack={handleBackToSequences}
        />
      );
    }

    if (!selectedActivity) {
      return (
        <ActivitySelector
          chapitre={selectedChapitre}
          sequence={selectedSequence}
          seance={selectedSeance}
          onSelectActivity={setSelectedActivity}
          onBack={handleBackToSeances}
        />
      );
    }

    // Render the appropriate activity component based on the selected activity
    switch (selectedActivity) {
      case "activity1":
        return <PlantClassificationGame onBack={handleBackToActivities} />;
      case "activity2":
        return <OakClassificationGame onBack={handleBackToActivities} />;
      case "activity3":
        return <BirdClassificationGame onBack={handleBackToActivities} />;
      case "activity4":
        return <PondRespirationActivity onBack={handleBackToActivities} />;
      case "activity5":
        return <ScientificMethodActivity onBack={handleBackToActivities} />;
      default:
        return <PlantClassificationActivity onBack={handleBackToActivities} />;
    }
  };

  return <View style={styles.container}>{renderContent()}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f9fc",
  },
});

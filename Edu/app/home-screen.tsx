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
import  ClassificationActivity  from "../components/Sequence2Unitedescellulesactivite1";
import  Activite2Screen  from "../components/Sequence2Unitedescellulesactivite2";
import  App  from "../components/Sequence2Unitedescellulesactivite3";
import  Activity4  from "../components/Sequence2Unitedescellulesactivite4";
import  Activite5Screen  from "../components/Sequence2Unitedescellulesactivite5";


type ChapitreType = "chapitre1" | "chapitre2" | "chapitre3" | null;
type SequenceType = "sequence1" | "sequence2" | null;
type SeanceType = "seance1" | "seance2" | null;
type ActivityType =
  | "activity1"
  | "activity2"
  | "activity3"
  | "activity4"
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

  // Function to determine which activity component to render based on chapitre, sequence, seance, and activity
  const getActivityComponent = () => {
    if (chapitre === "chapitre1") {
      if (sequence === "sequence1") {
        if (seance === "seance1") {
          // Chapitre 1, Sequence 1, Seance 1 activities
          if (activity === "activity1")
            return (
              <PlantClassificationActivity onBack={handleBackToActivities} />
            );
          if (activity === "activity2")
            return <ScientificMethodActivity onBack={handleBackToActivities} />;
        } else if (seance === "seance2") {
          // Chapitre 1, Sequence 1, Seance 2 activities
          if (activity === "activity3")
            return <PondRespirationActivity onBack={handleBackToActivities} />;
          if (activity === "activity4")
            return (
              <PlantClassificationActivity onBack={handleBackToActivities} />
            );
        }
      } else if (sequence === "sequence2") {
        if (seance === "seance1") {
          // Chapitre 1, Sequence 2, Seance 1 activities
          if (activity === "activity1")
            return <PlantClassificationGame onBack={handleBackToActivities} />;
          if (activity === "activity2")
            return <OakClassificationGame onBack={handleBackToActivities} />;
        } else if (seance === "seance2") {
          // Chapitre 1, Sequence 2, Seance 2 activities
          if (activity === "activity3")
            return <BirdClassificationGame onBack={handleBackToActivities} />;
          if (activity === "activity4")
            return (
              <PlantClassificationActivity onBack={handleBackToActivities} />
            );
        }
      }
    } else if (chapitre === "chapitre2") {
      // You can add more specific activity mappings for chapitre 2 when needed
      return <PondRespirationActivity onBack={handleBackToActivities} />;
    } else if (chapitre === "chapitre3") {
  if (sequence === "sequence1") {
    if (seance === "seance1") {
      // Chapitre 3, Sequence 1, Seance 1
      if (activity === "activity1")
        return <BirdClassificationGame onBack={handleBackToActivities} />;
      if (activity === "activity2")
        return <BirdClassificationGame onBack={handleBackToActivities} />;
    } else if (seance === "seance2") {
      // Chapitre 3, Sequence 1, Seance 2
      if (activity === "activity1")
        return <BirdClassificationGame onBack={handleBackToActivities} />;
      if (activity === "activity2")
        return <BirdClassificationGame onBack={handleBackToActivities} />;
    }
  } else if (sequence === "sequence2") {
    if (seance === "seance1") {
      if (activity === "activity1")
        return <ClassificationActivity  onBack={handleBackToActivities} />;
      if (activity === "activity2")
        return <Activite2Screen onBack={handleBackToActivities} />;
      if (activity === "activity3")
        return <App onBack={handleBackToActivities} />;
      if (activity === "activity4")
        return <Activity4 onBack={handleBackToActivities} />;
      if (activity === "activity5")
        return <Activite5Screen onBack={handleBackToActivities} />;
    } else if (seance === "seance2") {
      if (activity === "activity3")
        return <PondRespirationActivity onBack={handleBackToActivities} />;
      if (activity === "activity4")
        return <PlantClassificationActivity onBack={handleBackToActivities} />;
    }
  }
}

    // Default activity
    return <PlantClassificationActivity onBack={handleBackToActivities} />;
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

    // Use the getActivityComponent function to render the appropriate activity
    return getActivityComponent();
  };

  // This fixes the error in the function above
  const chapitre = selectedChapitre;
  const sequence = selectedSequence;
  const seance = selectedSeance;
  const activity = selectedActivity;

  return <View style={styles.container}>{renderContent()}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f9fc",
  },
});
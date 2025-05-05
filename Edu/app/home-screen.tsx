"use client";

import { useState } from "react";
import { View, StyleSheet } from "react-native";
import CourseSelector from "../components/CourseSelector";
import ChapterSelector from "../components/ChapterSelector";
import SequenceSelector from "../components/SequenceSelector";
import ActivitySelector from "../components/ActivitySelector";
import PlantClassificationGame from "../components/PlantClassificationGame";
import OakClassificationGame from "../components/OakClassificationGame";
import BirdClassificationGame from "../components/BirdClassificationGame";
import ScientificMethodActivity from "../components/ScientificMethodActivity";
import PondRespirationActivity from "../components/PondRespirationActivity";
import PlantClassificationActivity from "../components/PlantClassificationActivity";

type CourseType = "biology" | "physics" | "chemistry" | null;
type ChapterType = "plants" | "animals" | "ecosystems" | null;
type SequenceType =
  | "classification"
  | "anatomy"
  | "lifecycle"
  | "scientific_method"
  | "respiration"
  | null;
type ActivityType =
  | "plants"
  | "oaks"
  | "birds"
  | "cricket_experiment"
  | "pond_respiration"
  | "plant_classification"
  | null;

export default function HomeScreen() {
  const [selectedCourse, setSelectedCourse] = useState<CourseType>(null);
  const [selectedChapter, setSelectedChapter] = useState<ChapterType>(null);
  const [selectedSequence, setSelectedSequence] = useState<SequenceType>(null);
  const [selectedActivity, setSelectedActivity] = useState<ActivityType>(null);

  const handleBackToCourses = () => {
    setSelectedCourse(null);
    setSelectedChapter(null);
    setSelectedSequence(null);
    setSelectedActivity(null);
  };

  const handleBackToChapters = () => {
    setSelectedChapter(null);
    setSelectedSequence(null);
    setSelectedActivity(null);
  };

  const handleBackToSequences = () => {
    setSelectedSequence(null);
    setSelectedActivity(null);
  };

  const handleBackToActivities = () => {
    setSelectedActivity(null);
  };

  const renderContent = () => {
    if (!selectedCourse) {
      return <CourseSelector onSelectCourse={setSelectedCourse} />;
    }

    if (!selectedChapter) {
      return (
        <ChapterSelector
          course={selectedCourse}
          onSelectChapter={setSelectedChapter}
          onBack={handleBackToCourses}
        />
      );
    }

    if (!selectedSequence) {
      return (
        <SequenceSelector
          course={selectedCourse}
          chapter={selectedChapter}
          onSelectSequence={setSelectedSequence}
          onBack={handleBackToChapters}
        />
      );
    }

    if (!selectedActivity) {
      return (
        <ActivitySelector
          course={selectedCourse}
          chapter={selectedChapter}
          sequence={selectedSequence}
          onSelectActivity={setSelectedActivity}
          onBack={handleBackToSequences}
        />
      );
    }

    // In the switch statement
    switch (selectedActivity) {
      case "plants":
        return <PlantClassificationGame onBack={handleBackToActivities} />;
      case "oaks":
        return <OakClassificationGame onBack={handleBackToActivities} />;
      case "birds":
        return <BirdClassificationGame onBack={handleBackToActivities} />;
      case "cricket_experiment":
        return <ScientificMethodActivity onBack={handleBackToActivities} />;
      case "pond_respiration":
        return <PondRespirationActivity onBack={handleBackToActivities} />;
      case "plant_classification":
        return <PlantClassificationActivity onBack={handleBackToActivities} />;
      default:
        return (
          <ActivitySelector
            course={selectedCourse}
            chapter={selectedChapter}
            sequence={selectedSequence}
            onSelectActivity={setSelectedActivity}
            onBack={handleBackToSequences}
          />
        );
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

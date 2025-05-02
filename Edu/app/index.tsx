"use client";

import { useState } from "react";
import { View, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import CourseSelector from "../components/CourseSelector";
import ChapterSelector from "../components/ChapterSelector";
import SequenceSelector from "../components/SequenceSelector";
import ActivitySelector from "../components/ActivitySelector";
import PlantClassificationGame from "../components/PlantClassificationGame";
import OakClassificationGame from "../components/OakClassificationGame";
import BirdClassificationGame from "../components/BirdClassificationGame";
import PondRespirationMatch from "../components/PondRespirationMatch";

type CourseType = "biology" | "physics" | "chemistry" | null;
type ChapterType = "plants" | "animals" | "ecosystems" | null;
type SequenceType = "classification" | "anatomy" | "lifecycle" | null;
type ActivityType = "plants" | "oaks" | "birds" | null;

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

    switch (selectedActivity) {
      case "plants":
        return <PlantClassificationGame onBack={handleBackToActivities} />;
      case "oaks":
        return <OakClassificationGame onBack={handleBackToActivities} />;
      case "birds":
        return <BirdClassificationGame onBack={handleBackToActivities} />;
      case "pond":
        return <PondRespirationMatch onBack={handleBackToActivities} />;
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

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      {renderContent()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f9fk",
  },
});

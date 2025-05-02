"use client";

import { useState } from "react";
import { View, StyleSheet } from "react-native";
import CourseSelector from "../components/CourseSelector";
import ChapterSelector from "../components/ChapterSelector";
import SequenceSelector from "../components/SequenceSelector";
import ActivitySelector from "../components/ActivitySelector";
import A1 from "../components/A1";
import A2 from "../components/A2";
import A3 from "../components/A3";
import A4 from "../components/A4";
import A5 from "../components/A5";
import A6 from "../components/A6";
import A7 from "../components/A7";
import A8 from "../components/A8";
import A9 from "../components/A9";
import A10 from "../components/A10";
import A11 from "../components/A11";
import A12 from "../components/A12";

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
  | "A1"
  | "A2"
  | "A3"
  | "A4"
  | "A5"
  | "A6"
  | "A7"
  | "A8"
  | "A9"
  | "A10"
  | "A11"
  | "A12";

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
      case "A1":
        return <A1 onBack={handleBackToActivities} />;
      case "A2":
        return <A2 onBack={handleBackToActivities} />;
      case "A3":
        return <A3 onBack={handleBackToActivities} />;
      case "A4":
        return <A4 onBack={handleBackToActivities} />;
      case "A5":
        return <A5 onBack={handleBackToActivities} />;
      case "A6":
        return <A6 onBack={handleBackToActivities} />;
      case "A7":
        return <A7 onBack={handleBackToActivities} />;
      case "A8":
        return <A8 onBack={handleBackToActivities} />;
      case "A9":
        return <A9 onBack={handleBackToActivities} />;
      case "A10":
        return <A10 onBack={handleBackToActivities} />;
      case "A11":
        return <A11 onBack={handleBackToActivities} />;
      case "A12":
        return <A12 onBack={handleBackToActivities} />;
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

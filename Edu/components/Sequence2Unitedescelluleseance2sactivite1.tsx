import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Audio } from 'expo-av';

// Définition des propositions
const propositions = [
  {
    id: 'a',
    text: 'Je n’utilise que le crayon à papier bien taillé pour réaliser le dessin d’observation.',
    vrai: true,
    faux: false,
  },
  {
    id: 'b',
    text: 'Le titre du dessin doit être écrit en-dessous du dessin, au crayon à papier et souligné.',
    vrai: false,
    faux: true,
  },
  {
    id: 'c',
    text: 'Dans un schéma, l’ensemble est représenté avec des tailles et des formes qui doivent forcément être respectées.',
    vrai: true,
    faux: false,
  },
];

// Types
type Answer = {
  vrai: boolean;
  faux: boolean;
};

type AnswersState = Record<string, Answer>;

// Composant principal
const Sequence2Unitedescelluleseance2sactivite1: React.FC<{
  onBack: () => void;
}> = ({ onBack }) => {
  const [userAnswers, setUserAnswers] = useState<AnswersState>({
    a: { vrai: false, faux: false },
    b: { vrai: false, faux: false },
    c: { vrai: false, faux: false },
  });

  const [sound, setSound] = useState<Audio.Sound | null>(null);

  // Jouer la musique au montage
  useEffect(() => {
    playBackgroundMusic();

    return () => {
      stopBackgroundMusic();
    };
  }, []);

  const playBackgroundMusic = async () => {
    try {
      const { sound: newSound } = await Audio.Sound.createAsync(
        require('../assets/sounds/fun-learning-children-happy-education-music-256422.mp3')
      );
      setSound(newSound);
      await newSound.playAsync();
    } catch (error) {
      console.error('Erreur lors de la lecture de la musique:', error);
    }
  };

  const stopBackgroundMusic = async () => {
    if (sound) {
      await sound.stopAsync();
      setSound(null);
    }
  };

  const handleAnswer = (id: string, choix: 'vrai' | 'faux') => {
    setUserAnswers((prev) => ({
      ...prev,
      [id]: {
        vrai: choix === 'vrai',
        faux: choix === 'faux',
      },
    }));
  };

  const verifierReponses = () => {
    let toutesCorrectes = true;

    for (const prop of propositions) {
      const userChoice = userAnswers[prop.id];
      if (!userChoice) continue;

      if (
        (prop.vrai && !userChoice.vrai) ||
        (prop.faux && !userChoice.faux)
      ) {
        toutesCorrectes = false;
        break;
      }
    }

    if (toutesCorrectes) {
      Alert.alert('Bravo!', 'Toutes vos réponses sont correctes!');
    } else {
      Alert.alert('Désolé', "Certaines de vos réponses ne sont pas correctes.");
    }
  };

  const reinitialiser = () => {
    setUserAnswers({
      a: { vrai: false, faux: false },
      b: { vrai: false, faux: false },
      c: { vrai: false, faux: false },
    });
  };

  const afficherSolutions = () => {
    Alert.alert('Solutions', 'Les bonnes réponses ont été affichées.', [
      {
        text: 'OK',
        onPress: () =>
          setUserAnswers({
            a: { vrai: true, faux: false },
            b: { vrai: false, faux: true },
            c: { vrai: true, faux: false },
          }),
      },
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Bouton Retour */}
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Text style={styles.backButtonText}>← Retour</Text>
      </TouchableOpacity>

      {/* En-tête */}
      <View style={styles.header}>
        <Text style={styles.title}>Activité 1 - Conditions pour réussir un dessin et un schéma</Text>
        <Text style={styles.subtitle}>
          Répondez par « Vrai » ou « Faux » en mettant une croix (X) devant chaque proposition.
        </Text>
      </View>

      {/* Tableau des propositions */}
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderText}>Propositions</Text>
          <Text style={styles.tableHeaderText}>Vrai</Text>
          <Text style={styles.tableHeaderText}>Faux</Text>
        </View>
        {propositions.map((prop) => (
          <View key={prop.id} style={styles.tableRow}>
            <Text style={styles.proposition}>{prop.text}</Text>
            <TouchableOpacity
              style={[
                styles.choiceButton,
                userAnswers[prop.id]?.vrai ? styles.selectedTrue : null,
              ]}
              onPress={() => handleAnswer(prop.id, 'vrai')}
            >
              <Text style={styles.choiceText}>✔️</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.choiceButton,
                userAnswers[prop.id]?.faux ? styles.selectedFalse : null,
              ]}
              onPress={() => handleAnswer(prop.id, 'faux')}
            >
              <Text style={styles.choiceText}>❌</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Boutons d'action */}
      <View style={styles.buttonGroup}>
        <TouchableOpacity style={styles.verifyButton} onPress={verifierReponses}>
          <Text style={styles.buttonText}>Vérifier</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.resetButton} onPress={reinitialiser}>
          <Text style={styles.buttonText}>Réinitialiser</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.solutionButton} onPress={afficherSolutions}>
          <Text style={styles.buttonText}>Solution</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Sequence2Unitedescelluleseance2sactivite1;

// Styles modernes
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f9f9f9',
    paddingBottom: 30,
    paddingTop: 20,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
    backgroundColor: 'rgba(0, 123, 255, 0.8)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  header: {
    backgroundColor: '#007BFF',
    paddingVertical: 25,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 20,
    elevation: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#e0e0e0',
    textAlign: 'center',
    marginTop: 8,
  },
  table: {
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 3,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#007BFF',
    paddingVertical: 12,
  },
  tableHeaderText: {
    flex: 1,
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  proposition: {
    flex: 2,
    fontSize: 15,
    color: '#333',
    paddingRight: 10,
  },
  choiceButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginHorizontal: 5,
    paddingVertical: 6,
  },
  selectedTrue: {
    backgroundColor: '#d4edda',
    borderColor: '#28a745',
  },
  selectedFalse: {
    backgroundColor: '#f8d7da',
    borderColor: '#dc3545',
  },
  choiceText: {
    fontSize: 20,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  verifyButton: {
    backgroundColor: '#28a745',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
  },
  resetButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
  },
  solutionButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
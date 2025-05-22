import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';

type ConstituantsDuMicroscopeProps = {
  onBack: () => void;
};

const App: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  // État pour suivre les réponses de l'utilisateur
  const [responses, setResponses] = useState<Record<string, boolean | null>>({
    a: null,
    b: null,
    c: null,
  });

  // État pour afficher les messages
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);

  // Référence du son
  const soundRef = useRef<Audio.Sound | null>(null);

  // Charger et jouer la musique au montage
  useEffect(() => {
    let isMounted = true;

    const playBackgroundMusic = async () => {
      try {
        const { sound } = await Audio.Sound.createAsync(
          require('../assets/sounds/fun-learning-children-happy-education-music-256422.mp3'),
          { shouldPlay: true, isLooping: true }
        );
        if (isMounted) {
          soundRef.current = sound;
        }
      } catch (error) {
        console.error("Erreur lors du chargement de la musique", error);
      }
    };

    playBackgroundMusic();

    return () => {
      isMounted = false;
      if (soundRef.current) {
        soundRef.current.unloadAsync(); // Nettoyage à la fermeture
      }
    };
  }, []);

  // Fonction pour mettre à jour les réponses
  const handleResponse = (id: string, value: boolean) => {
    setResponses((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // Fonction pour vérifier les réponses
  const handleVerify = () => {
    let allCorrect = true;

    const propositions = [
      { id: 'a', correctAnswer: false },
      { id: 'b', correctAnswer: true },
      { id: 'c', correctAnswer: true },
    ];

    for (const prop of propositions) {
      if (responses[prop.id] !== prop.correctAnswer) {
        allCorrect = false;
        break;
      }
    }

    if (allCorrect) {
      setMessage("Félicitations ! Toutes les réponses sont correctes.");
      setMessageType('success');
    } else {
      setMessage("Attention ! Certaines réponses sont incorrectes.");
      setMessageType('error');
    }
  };

  // Fonction pour réinitialiser les réponses
  const handleReset = () => {
    setResponses({
      a: null,
      b: null,
      c: null,
    });
    setMessage('');
    setMessageType(null);
  };

  // Fonction pour afficher les solutions automatiquement
  const handleShowSolutions = () => {
    const solutionResponses = {
      a: false,
      b: true,
      c: true,
    };
    setResponses(solutionResponses);
    setMessage('Les bonnes réponses ont été affichées.');
    setMessageType('success');
  };

  return (
    <View style={styles.container}>
      {/* Bouton de retour */}
      <TouchableOpacity 
        style={styles.backButton}
        onPress={onBack}
      >
        <Ionicons name="arrow-back" size={35} color="#2196f3" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Activité 4 - Fonctions des constituants de la cellule.</Text>
        <Text style={styles.subtitle}>
          Répondez par « Vrai » ou « Faux » en mettant une croix (X) devant chaque proposition.
        </Text>

        {/* Tableau des propositions */}
        <View style={styles.table}>
          <View style={styles.headerRow}>
            <Text style={[styles.cell, styles.header]}>Propositions</Text>
            <Text style={[styles.cell, styles.header]}>Vrai</Text>
            <Text style={[styles.cell, styles.header]}>Faux</Text>
          </View>

          {[
            {
              id: 'a',
              text: 'La membrane plasmique caractérise uniquement la cellule animale.',
            },
            {
              id: 'b',
              text: 'La paroi offre une résistance à la cellule végétale et bactérienne.',
            },
            {
              id: 'c',
              text: 'Le cytoplasme de la cellule eucaryote contient tous les organites cellulaires.',
            },
          ].map((prop) => (
            <View key={prop.id} style={styles.row}>
              <Text style={styles.cell}>{prop.text}</Text>
              <TouchableOpacity
                style={[
                  styles.cell,
                  responses[prop.id] === true && styles.selected,
                ]}
                onPress={() => handleResponse(prop.id, true)}
              >
                <Text style={styles.text}>{responses[prop.id] === true ? 'X' : ''}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.cell,
                  responses[prop.id] === false && styles.selected,
                ]}
                onPress={() => handleResponse(prop.id, false)}
              >
                <Text style={styles.text}>{responses[prop.id] === false ? 'X' : ''}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Message de vérification */}
        {message ? (
          <Text
            style={[
              styles.message,
              messageType === 'success' && styles.successMessage,
              messageType === 'error' && styles.errorMessage,
            ]}
          >
            {message}
          </Text>
        ) : null}

        {/* Boutons en bas */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.verifyButton} onPress={handleVerify}>
            <Text style={styles.buttonText}>Vérifier</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
            <Text style={styles.buttonText}>Réinitialiser</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.solutionButton} onPress={handleShowSolutions}>
            <Text style={styles.buttonText}>Solution</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

// === STYLES ===
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e0f7fa',
  },
  scrollContent: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#00695c',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: '#37474f',
  },
  table: {
    borderWidth: 1,
    borderColor: '#b2ebf2',
    borderRadius: 8,
    backgroundColor: '#ffffff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    overflow: 'hidden',
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#4dd0e1',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
  },
  cell: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff',
  },
  selected: {
    backgroundColor: '#cfd8dc',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  message: {
    marginTop: 20,
    fontSize: 16,
    textAlign: 'center',
    padding: 10,
    borderRadius: 5,
  },
  successMessage: {
    backgroundColor: '#c8e6c9',
    color: '#2e7d32',
  },
  errorMessage: {
    backgroundColor: '#ffcdd2',
    color: '#c62828',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 25,
    marginBottom: 80,
  },
  verifyButton: {
    backgroundColor: '#43a047',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  resetButton: {
    backgroundColor: '#e53935',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  solutionButton: {
    backgroundColor: '#1e88e5',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  backButton: {
    position: 'absolute',
    top: 30,
    left: 20,
    zIndex: 20,
  },
});

export default App;
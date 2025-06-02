import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';

export type CellActivityProps = {
  onBack: () => void;
};

const CellActivity: React.FC<CellActivityProps> = ({ onBack }) => {
  const [responses, setResponses] = useState(['', '', '']);
  const [showSolutions, setShowSolutions] = useState(false);
  const correctAnswers = ['Membrane cytoplasmique', 'Noyau', 'Cytoplasme'];

  const soundRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    const loadAndPlayMusic = async () => {
      try {
        soundRef.current = new Audio.Sound();
        await soundRef.current.loadAsync(
          require('../assets/sounds/fun-learning-children-happy-education-music-256422.mp3')
        );
        await soundRef.current.setIsLoopingAsync(true);
        await soundRef.current.playAsync();
      } catch (error) {
        console.error('Erreur lors de la lecture de la musique:', error);
      }
    };

    loadAndPlayMusic();

    return () => {
      const unloadMusic = async () => {
        if (soundRef.current) {
          await soundRef.current.stopAsync();
          await soundRef.current.unloadAsync();
          soundRef.current = null;
        }
      };
      unloadMusic();
    };
  }, []);

  const verifyAnswers = () => {
    const allCorrect = responses.every((response, index) =>
      response.trim().toLowerCase() === correctAnswers[index].toLowerCase()
    );

    if (allCorrect) {
      Alert.alert('Bravo !', 'Toutes vos réponses sont correctes ! 👏');
    } else {
      Alert.alert('Oops...', 'Certaines réponses sont incorrectes. Réessayez !');
    }
  };

  const resetAnswers = () => {
    setResponses(['', '', '']);
    setShowSolutions(false);
  };

  const showAnswerKey = () => {
    setShowSolutions(true);
    setResponses([...correctAnswers]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#f5f5f7" barStyle="dark-content" />
      
      {/* Bouton Retour fixe en haut */}
      <View style={styles.absoluteBackButton}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={30} color="#2196f3" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Contenu principal avec marge en haut pour le bouton */}
        <View style={styles.contentContainer}>
          {/* Titre */}
          <Text style={styles.title}>Activité sur la cellule animale</Text>

          {/* Instructions */}
          <Text style={styles.instructions}>
            Donnez, sur le document, ce que représentent les éléments numérotés de 1 à 3.
          </Text>

          {/* Conteneur principal pour l'image et les numéros */}
          <View style={styles.imageContainer}>
            {/* Image de la cellule */}
            <Image
              source={require('../assets/images/UniteDesCellules/seance2activite2/cell_diagram.png')}
              style={styles.cellImage}
            />

            {/* Numéro 1 */}
            <View style={[styles.numberPosition, styles.number1]}>
              <Text style={styles.numberLabel}>1.</Text>
            </View>

            {/* Numéro 2 */}
            <View style={[styles.numberPosition, styles.number2]}>
              <Text style={styles.numberLabel}>2.</Text>
            </View>

            {/* Numéro 3 */}
            <View style={[styles.numberPosition, styles.number3]}>
              <Text style={styles.numberLabel}>3.</Text>
            </View>
          </View>

          {/* Zones de saisie des réponses */}
          <View style={styles.answersContainer}>
            {[0, 1, 2].map((index) => (
              <View key={index} style={styles.answerRow}>
                <TextInput
                  style={styles.input}
                  placeholder={`Réponse ${index + 1}`}
                  value={responses[index]}
                  onChangeText={(text) => {
                    const newResponses = [...responses];
                    newResponses[index] = text;
                    setResponses(newResponses);
                  }}
                  editable={!showSolutions}
                />
              </View>
            ))}
          </View>

          {/* Boutons en bas */}
          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.buttonVerify} onPress={verifyAnswers}>
              <Text style={styles.buttonText}>✅ Vérifier</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonReset} onPress={resetAnswers}>
              <Text style={styles.buttonText}>🔄 Réinitialiser</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonSolution} onPress={showAnswerKey}>
              <Text style={styles.buttonText}>🔍 Solution</Text>
            </TouchableOpacity>
          </View>

          {/* Affichage des solutions */}
          {showSolutions && (
            <View style={styles.solutionBox}>
              <Text style={styles.solutionTitle}>✅ Solutions :</Text>
              <Text style={styles.solutionText}>1. Membrane cytoplasmique</Text>
              <Text style={styles.solutionText}>2. Noyau</Text>
              <Text style={styles.solutionText}>3. Cytoplasme</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CellActivity;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f7',
  },
  absoluteBackButton: {
    position: 'absolute',
    top: 15, // Ajusté pour être en dessous de la StatusBar
    left: 15,
    zIndex: 1000,
  },
  backButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  contentContainer: {
    paddingTop: 60, // Espace pour le bouton de retour
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  instructions: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
    fontStyle: 'italic',
  },
  imageContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  cellImage: {
    width: '100%',
    height: 280,
    resizeMode: 'contain',
  },
  numberPosition: {
    position: 'absolute',
    zIndex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    elevation: 2,
  },
  number1: {
    top: '20%',
    left: '10%',
  },
  number2: {
    top: '40%',
    right: '10%',
  },
  number3: {
    bottom: '10%',
    left: '50%',
  },
  numberLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2196f3',
  },
  answersContainer: {
    marginBottom: 20,
  },
  answerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    backgroundColor: '#fff',
    fontSize: 16,
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 20,
    gap: 10,
  },
  buttonVerify: {
    backgroundColor: '#4caf50',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
    elevation: 3,
  },
  buttonReset: {
    backgroundColor: '#f44336',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
    elevation: 3,
  },
  buttonSolution: {
    backgroundColor: '#2196f3',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
    elevation: 3,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  solutionBox: {
    backgroundColor: '#fffde7',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ffeb3b',
    marginTop: 10,
  },
  solutionTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#fbc02d',
    marginBottom: 10,
  },
  solutionText: {
    fontSize: 16,
    marginLeft: 10,
    color: '#555',
  },
});
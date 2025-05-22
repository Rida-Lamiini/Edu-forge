import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  SafeAreaView,
  Dimensions,
  Platform,
  StatusBar,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';

type ConstituantsDuMicroscopeProps = {
  onBack: () => void;
};

const windowWidth = Dimensions.get('window').width || 375;
const windowHeight = Dimensions.get('window').height || 667;

interface Organite {
  id: string;
  name: string;
}

interface Fonction {
  id: string;
  description: string;
  correctAnswer: string;
  currentAnswer: string | null;
}

const App: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [organites] = useState<Organite[]>([
    { id: 'chloroplaste', name: 'Chloroplaste' },
    { id: 'noyau', name: 'Noyau' },
    { id: 'mitochondrie', name: 'Mitochondrie' },
    { id: 'vacuole', name: 'Vacuole' },
  ]);

  const [fonctions, setFonctions] = useState<Fonction[]>([
    { id: 'a', description: 'Caractérise la cellule végétale et produit la matière organique.', correctAnswer: 'chloroplaste', currentAnswer: null },
    { id: 'b', description: 'Renferme le matériel génétique et assure toutes les activités cellulaires.', correctAnswer: 'noyau', currentAnswer: null },
    { id: 'c', description: "Produit l'énergie nécessaire au fonctionnement de la cellule.", correctAnswer: 'mitochondrie', currentAnswer: null },
    { id: 'd', description: 'C\'est un réservoir de la cellule où elle stocke diverses substances.', correctAnswer: 'vacuole', currentAnswer: null },
  ]);

  const [selectedOrganite, setSelectedOrganite] = useState<string | null>(null);
  const [resultModalVisible, setResultModalVisible] = useState(false);
  const [resultData, setResultData] = useState<{
    allCorrect: boolean;
    resultDetails: {id: string, isCorrect: boolean, userAnswer: string, correctAnswer: string}[];
  }>({
    allCorrect: false,
    resultDetails: []
  });

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

  const handleOrganiteSelect = (organiteId: string) => {
    setSelectedOrganite(selectedOrganite === organiteId ? null : organiteId);
  };

  const handlePlaceOrganite = (fonctionId: string) => {
    if (!selectedOrganite) return;

    setFonctions(fonctions.map(f => {
      if (f.id === fonctionId && f.currentAnswer === selectedOrganite) {
        return { ...f, currentAnswer: null };
      } else if (f.id === fonctionId) {
        return { ...f, currentAnswer: selectedOrganite };
      } else if (f.currentAnswer === selectedOrganite) {
        return { ...f, currentAnswer: null };
      }
      return f;
    }));
    setSelectedOrganite(null);
  };

  const verifierReponses = () => {
    const manquantes = fonctions.filter(f => f.currentAnswer === null);
    if (manquantes.length > 0) {
      Alert.alert('Réponses incomplètes', `Il manque des réponses pour ${manquantes.length} question(s).`);
      return;
    }

    const details = fonctions.map(f => ({
      id: f.id,
      isCorrect: f.currentAnswer === f.correctAnswer,
      userAnswer: getOrganiteName(f.currentAnswer),
      correctAnswer: getOrganiteName(f.correctAnswer)
    }));

    const allCorrect = details.every(item => item.isCorrect);

    setResultData({
      allCorrect,
      resultDetails: details
    });

    setResultModalVisible(true);
  };

  const afficherSolutions = () => {
    setFonctions(fonctions.map(f => ({ ...f, currentAnswer: f.correctAnswer })));
    setSelectedOrganite(null);
  };

  const reinitialiser = () => {
    setFonctions(fonctions.map(f => ({ ...f, currentAnswer: null })));
    setSelectedOrganite(null);
  };

  const isOrganiteUsed = (organiteId: string) => {
    return fonctions.some(f => f.currentAnswer === organiteId);
  };

  const getOrganiteName = (id: string | null) => {
    return organites.find(o => o.id === id)?.name || '';
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.container}>
          {/* Bouton de retour */}
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Ionicons name="arrow-back" size={35} color="#2196f3" />
          </TouchableOpacity>

          <Text style={styles.title}>Activité 3: Fonctions des constituants de la cellule</Text>

          <View style={styles.instructionContainer}>
            <Text style={styles.instructionText}>1. Sélectionnez un organite ci-dessous</Text>
            <Text style={styles.instructionText}>2. Touchez un emplacement dans le tableau pour y placer l'organite</Text>
          </View>

          <View style={styles.organitesGrid}>
            {organites.map((organite) => (
              <TouchableOpacity
                key={organite.id}
                style={[
                  styles.organiteButton,
                  isOrganiteUsed(organite.id) && styles.organiteUsed,
                  selectedOrganite === organite.id && styles.organiteSelected
                ]}
                onPress={() => handleOrganiteSelect(organite.id)}
                disabled={isOrganiteUsed(organite.id)}
                activeOpacity={0.6}
              >
                <Text style={styles.organiteButtonText}>{organite.name}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.headerCell}>Organites</Text>
              <Text style={styles.headerCell}>Fonctions</Text>
            </View>
            {fonctions.map((fonction) => (
              <View key={fonction.id} style={styles.tableRow}>
                <TouchableOpacity
                  style={[
                    styles.cell,
                    styles.answerCell,
                    fonction.currentAnswer && styles.cellFilled,
                    selectedOrganite && !fonction.currentAnswer && styles.cellHighlighted
                  ]}
                  onPress={() => handlePlaceOrganite(fonction.id)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.cellLabel}>{fonction.id.toUpperCase()}</Text>
                  <Text style={styles.answerText}>{getOrganiteName(fonction.currentAnswer)}</Text>
                </TouchableOpacity>
                <View style={[styles.cell, styles.descriptionCell]}>
                  <Text style={styles.descriptionText}>{fonction.description}</Text>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.actions}>
            <TouchableOpacity style={[styles.actionButton, styles.solutionButton]} onPress={afficherSolutions}>
              <Text style={styles.actionButtonText}>Solution</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, styles.resetButton]} onPress={reinitialiser}>
              <Text style={styles.actionButtonText}>Réinitialiser</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, styles.validateButton]} onPress={verifierReponses}>
              <Text style={styles.actionButtonText}>Vérifier</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Modal pour afficher les résultats détaillés */}
      <Modal animationType="slide" transparent={true} visible={resultModalVisible} onRequestClose={() => setResultModalVisible(false)}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>
              {resultData.allCorrect ? '🎉 Félicitations ! 🎉' : '📝 Résultats'}
            </Text>
            <Text style={styles.modalSubtitle}>
              {resultData.allCorrect 
                ? 'Toutes vos réponses sont correctes !'
                : 'Voici le détail de vos réponses:'}
            </Text>
            {!resultData.allCorrect && (
              <View style={styles.resultsList}>
                {resultData.resultDetails.map((item) => (
                  <View key={item.id} style={styles.resultItem}>
                    <Text style={styles.resultItemLabel}>Question {item.id.toUpperCase()}:</Text>
                    <View style={styles.resultItemContent}>
                      <Text style={[
                        styles.resultItemText,
                        item.isCorrect ? styles.resultCorrect : styles.resultIncorrect
                      ]}>
                        Votre réponse: {item.userAnswer}
                      </Text>
                      {!item.isCorrect && (
                        <Text style={styles.resultCorrectAnswer}>
                          Réponse correcte: {item.correctAnswer}
                        </Text>
                      )}
                    </View>
                  </View>
                ))}
              </View>
            )}
            <TouchableOpacity style={styles.modalButton} onPress={() => setResultModalVisible(false)}>
              <Text style={styles.modalButtonText}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

// Styles inchangés
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
    textAlign: 'center',
    marginTop: 60,
  },
  instructionContainer: {
    backgroundColor: '#f0f8ff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#2196f3',
  },
  instructionText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  organitesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  organiteButton: {
    width: '48%',
    padding: 12,
    marginBottom: 10,
    backgroundColor: '#e1f5fe',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#b3e5fc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  organiteButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  organiteUsed: {
    backgroundColor: '#e0e0e0',
    borderColor: '#9e9e9e',
  },
  organiteSelected: {
    backgroundColor: '#81d4fa',
    borderColor: '#29b6f6',
  },
  table: {
    borderWidth: 1,
    borderColor: '#4caf50',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#4caf50',
  },
  headerCell: {
    flex: 1,
    padding: 10,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderColor: '#e0e0e0',
  },
  cell: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  answerCell: {
    backgroundColor: '#f5f5f5',
    borderRightWidth: 1,
    borderColor: '#e0e0e0',
    alignItems: 'center',
  },
  cellFilled: {
    backgroundColor: '#e8f5e9',
  },
  cellHighlighted: {
    backgroundColor: '#e3f2fd',
  },
  cellLabel: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#ddd',
    width: 20,
    height: 20,
    borderRadius: 10,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: 'bold',
    lineHeight: 20,
  },
  answerText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  descriptionCell: {
    backgroundColor: '#fff',
  },
  descriptionText: {
    fontSize: 13,
    color: '#333',
    lineHeight: 18,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  actionButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  solutionButton: {
    backgroundColor: '#2196f3',
  },
  resetButton: {
    backgroundColor: '#f44336',
  },
  validateButton: {
    backgroundColor: '#4caf50',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  modalSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 15,
    color: '#555',
  },
  resultsList: {
    marginVertical: 10,
  },
  resultItem: {
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingBottom: 8,
  },
  resultItemLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  resultItemContent: {
    paddingLeft: 10,
  },
  resultItemText: {
    fontSize: 14,
    marginBottom: 2,
  },
  resultCorrect: {
    color: '#4caf50',
  },
  resultIncorrect: {
    color: '#f44336',
  },
  resultCorrectAnswer: {
    fontSize: 14,
    color: '#2196f3',
    fontStyle: 'italic',
  },
  modalButton: {
    backgroundColor: '#2196f3',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15,
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  backButton: {
    position: 'absolute',
    top: 30,
    left: 20,
    zIndex: 20,
  },
});

export default App;
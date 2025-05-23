import React, { useState, useRef, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  Image,
  StyleSheet,
  PanResponder,
  Animated,
  Dimensions,
  TouchableOpacity,
  Alert,
  Modal,
  SafeAreaView,
  NativeScrollEvent,
  NativeSyntheticEvent
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';

type Organism = {
  id: string;
  name: string;
  image: any;
  isPlaced: boolean;
  placedInTable1: boolean;
  placedInTable2: boolean;
  correctCategory1: 'unicellulaire' | 'pluricellulaire';
  correctCategory2: 'eucaryote' | 'procaryote';
};

interface DropZoneRefs {
  unicellulaire: View | null;
  pluricellulaire: View | null;
  eucaryote: View | null;
  procaryote: View | null;
  [key: string]: View | null;
}

const ClassificationActivity: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const images = {
    amibe: require('../assets/images/UniteDesCellules/Activite1/amibe_image.png'),
    paramecie: require('../assets/images/UniteDesCellules/Activite1/paramecie_image.png'),
    cheval: require('../assets/images/UniteDesCellules/Activite1/cheval_image.png'),
    abeille: require('../assets/images/UniteDesCellules/Activite1/abeille_image.png'),
    mais: require('../assets/images/UniteDesCellules/Activite1/mais_image.png'),
    bacterie: require('../assets/images/UniteDesCellules/Activite1/bacterie_image.png'),
  };

  const initialOrganisms: Organism[] = [
    { id: '1', name: 'Amibe', image: images.amibe, isPlaced: false, placedInTable1: false, placedInTable2: false, correctCategory1: 'unicellulaire', correctCategory2: 'eucaryote' },
    { id: '2', name: 'Paramécie', image: images.paramecie, isPlaced: false, placedInTable1: false, placedInTable2: false, correctCategory1: 'unicellulaire', correctCategory2: 'eucaryote' },
    { id: '3', name: 'Cheval', image: images.cheval, isPlaced: false, placedInTable1: false, placedInTable2: false, correctCategory1: 'pluricellulaire', correctCategory2: 'eucaryote' },
    { id: '4', name: 'Abeille', image: images.abeille, isPlaced: false, placedInTable1: false, placedInTable2: false, correctCategory1: 'pluricellulaire', correctCategory2: 'eucaryote' },
    { id: '5', name: 'Maïs', image: images.mais, isPlaced: false, placedInTable1: false, placedInTable2: false, correctCategory1: 'pluricellulaire', correctCategory2: 'eucaryote' },
    { id: '6', name: 'Bactérie', image: images.bacterie, isPlaced: false, placedInTable1: false, placedInTable2: false, correctCategory1: 'unicellulaire', correctCategory2: 'procaryote' },
  ];

  const [organisms, setOrganisms] = useState<Organism[]>(initialOrganisms);
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [tables, setTables] = useState({
    table1: { unicellulaire: [] as string[], pluricellulaire: [] as string[] },
    table2: { eucaryote: [] as string[], procaryote: [] as string[] }
  });
  const [resultsModalVisible, setResultsModalVisible] = useState(false);
  const [checkResult, setCheckResult] = useState({ allCorrect: false, correctCount: 0, totalCount: 0 });
  const [currentDraggingItem, setCurrentDraggingItem] = useState<string | null>(null);
  const [scrollOffset, setScrollOffset] = useState(0);
  const [selectedOrganism, setSelectedOrganism] = useState<string | null>(null);
  const [showPlacementModal, setShowPlacementModal] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const soundObject = useRef<Audio.Sound | null>(null);

  const { width } = Dimensions.get('window');

  useEffect(() => {
    loadBackgroundMusic();
    return () => {
      if (soundObject.current) {
        soundObject.current.unloadAsync();
      }
    };
  }, []);

  const loadBackgroundMusic = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../assets/sounds/fun-learning-children-happy-education-music-256422.mp3')
      );
      soundObject.current = sound;
      await soundObject.current.setIsLoopingAsync(true);
      await soundObject.current.playAsync();
    } catch (error) {
      console.error("Erreur lors du chargement de la musique", error);
    }
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    setScrollOffset(event.nativeEvent.contentOffset.y);
  };

  // Nouvelle approche : utiliser un modal pour placer les organismes
  const handleOrganismSelect = (organismId: string) => {
    setSelectedOrganism(organismId);
    setShowPlacementModal(true);
  };

  const handlePlacement = (organismId: string, category: string, isTable1: boolean) => {
    const newTables = { ...tables };
    
    if (isTable1) {
      // Retirer de toutes les zones du tableau 1
      newTables.table1.unicellulaire = newTables.table1.unicellulaire.filter(id => id !== organismId);
      newTables.table1.pluricellulaire = newTables.table1.pluricellulaire.filter(id => id !== organismId);
      
      // Ajouter dans la nouvelle zone
      newTables.table1[category as 'unicellulaire' | 'pluricellulaire'].push(organismId);
    } else {
      // Retirer de toutes les zones du tableau 2
      newTables.table2.eucaryote = newTables.table2.eucaryote.filter(id => id !== organismId);
      newTables.table2.procaryote = newTables.table2.procaryote.filter(id => id !== organismId);
      
      // Ajouter dans la nouvelle zone
      newTables.table2[category as 'eucaryote' | 'procaryote'].push(organismId);
    }

    setTables(newTables);

    // Mettre à jour l'état des organismes
    setOrganisms(prev =>
      prev.map(org => {
        if (org.id === organismId) {
          return {
            ...org,
            placedInTable1: isTable1 ? true : org.placedInTable1,
            placedInTable2: isTable1 ? org.placedInTable2 : true,
            isPlaced: isTable1 ? 
              (true && org.placedInTable2) : 
              (org.placedInTable1 && true)
          };
        }
        return org;
      })
    );
  };

  const showSolution = () => {
    setTables({
      table1: {
        unicellulaire: organisms.filter(org => org.correctCategory1 === 'unicellulaire').map(org => org.id),
        pluricellulaire: organisms.filter(org => org.correctCategory1 === 'pluricellulaire').map(org => org.id),
      },
      table2: {
        eucaryote: organisms.filter(org => org.correctCategory2 === 'eucaryote').map(org => org.id),
        procaryote: organisms.filter(org => org.correctCategory2 === 'procaryote').map(org => org.id),
      }
    });
    setOrganisms(prev => prev.map(org => ({
      ...org,
      isPlaced: true,
      placedInTable1: true,
      placedInTable2: true
    })));
  };

  const checkAnswers = () => {
    const allPlaced = organisms.every(org => org.placedInTable1 && org.placedInTable2);
    if (!allPlaced) {
      Alert.alert("Classification incomplète", "Veuillez placer tous les organismes dans les deux tableaux avant de vérifier.");
      return;
    }

    let allCorrect = true;
    let correctCount = 0;
    const totalCount = organisms.length * 2;

    organisms.forEach(organism => {
      const isCorrect1 = tables.table1[organism.correctCategory1].includes(organism.id);
      const isCorrect2 = tables.table2[organism.correctCategory2].includes(organism.id);
      if (!isCorrect1 || !isCorrect2) allCorrect = false;
      if (isCorrect1) correctCount++;
      if (isCorrect2) correctCount++;
    });

    setCheckResult({ allCorrect, correctCount, totalCount });
    setResultsModalVisible(true);
  };

  const resetActivity = () => {
    setTables({
      table1: { unicellulaire: [], pluricellulaire: [] },
      table2: { eucaryote: [], procaryote: [] }
    });
    setOrganisms(initialOrganisms.map(org => ({
      ...org,
      isPlaced: false,
      placedInTable1: false,
      placedInTable2: false
    })));
  };

  // Fonction pour rendre les organismes dans une zone de dépôt
  const renderOrganismsInDropZone = (zone: string) => {
    let orgIds: string[] = [];
    
    if (zone === 'unicellulaire' || zone === 'pluricellulaire') {
      orgIds = tables.table1[zone as 'unicellulaire' | 'pluricellulaire'];
    } else {
      orgIds = tables.table2[zone as 'eucaryote' | 'procaryote'];
    }
    
    return orgIds.map(id => {
      const organism = organisms.find(org => org.id === id);
      if (!organism) return null;
      
      return (
        <TouchableOpacity
          key={organism.id}
          style={styles.placedOrganism}
          onPress={() => {
            // Retirer l'organisme de cette zone
            if (zone === 'unicellulaire' || zone === 'pluricellulaire') {
              // Retirer du tableau 1
              setTables(prev => ({
                ...prev,
                table1: {
                  ...prev.table1,
                  [zone]: prev.table1[zone as 'unicellulaire' | 'pluricellulaire'].filter(orgId => orgId !== id)
                }
              }));
              
              // Mettre à jour l'état de l'organisme
              setOrganisms(prev =>
                prev.map(org => {
                  if (org.id === id) {
                    return {
                      ...org,
                      placedInTable1: false,
                      isPlaced: false
                    };
                  }
                  return org;
                })
              );
            } else {
              // Retirer du tableau 2
              setTables(prev => ({
                ...prev,
                table2: {
                  ...prev.table2,
                  [zone]: prev.table2[zone as 'eucaryote' | 'procaryote'].filter(orgId => orgId !== id)
                }
              }));
              
              // Mettre à jour l'état de l'organisme
              setOrganisms(prev =>
                prev.map(org => {
                  if (org.id === id) {
                    return {
                      ...org,
                      placedInTable2: false,
                      isPlaced: false
                    };
                  }
                  return org;
                })
              );
            }
          }}
        >
          <Image source={organism.image} style={styles.organismImage} />
          <Text style={styles.organismName}>{organism.name}</Text>
        </TouchableOpacity>
      );
    });
  };

  // Fonction pour rendre les organismes déplaçables
  const renderDraggableOrganisms = () => {
    return organisms
      .filter(organism => !organism.isPlaced)
      .map(organism => (
        <TouchableOpacity
          key={organism.id}
          style={styles.draggableOrganism}
          onPress={() => handleOrganismSelect(organism.id)}
        >
          <Image source={organism.image} style={styles.organismImage} />
          <Text style={styles.organismName}>{organism.name}</Text>
        </TouchableOpacity>
      ));
  };

  // Modal pour le placement des organismes
  const PlacementModal = () => {
    const organism = organisms.find(org => org.id === selectedOrganism);
    if (!organism) return null;

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={showPlacementModal}
        onRequestClose={() => setShowPlacementModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Placer {organism.name}</Text>
            </View>
            <View style={styles.modalBody}>
              <Image source={organism.image} style={styles.modalOrganismImage} />
              
              {/* Tableau 1 */}
              <View style={styles.placementSection}>
                <Text style={styles.placementTitle}>Classification selon le nombre de cellules</Text>
                <View style={styles.placementButtons}>
                  <TouchableOpacity 
                    style={[styles.placementButton, organism.placedInTable1 && styles.placementButtonDisabled]}
                    onPress={() => {
                      handlePlacement(organism.id, 'unicellulaire', true);
                      if (organism.placedInTable2) {
                        setShowPlacementModal(false);
                      }
                    }}
                    disabled={organism.placedInTable1}
                  >
                    <Text style={styles.placementButtonText}>Unicellulaire</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.placementButton, organism.placedInTable1 && styles.placementButtonDisabled]}
                    onPress={() => {
                      handlePlacement(organism.id, 'pluricellulaire', true);
                      if (organism.placedInTable2) {
                        setShowPlacementModal(false);
                      }
                    }}
                    disabled={organism.placedInTable1}
                  >
                    <Text style={styles.placementButtonText}>Pluricellulaire</Text>
                  </TouchableOpacity>
                </View>
              </View>
              
              {/* Tableau 2 */}
              <View style={styles.placementSection}>
                <Text style={styles.placementTitle}>Classification selon le type de cellules</Text>
                <View style={styles.placementButtons}>
                  <TouchableOpacity 
                    style={[styles.placementButton, organism.placedInTable2 && styles.placementButtonDisabled]}
                    onPress={() => {
                      handlePlacement(organism.id, 'eucaryote', false);
                      if (organism.placedInTable1) {
                        setShowPlacementModal(false);
                      }
                    }}
                    disabled={organism.placedInTable2}
                  >
                    <Text style={styles.placementButtonText}>Eucaryote</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.placementButton, organism.placedInTable2 && styles.placementButtonDisabled]}
                    onPress={() => {
                      handlePlacement(organism.id, 'procaryote', false);
                      if (organism.placedInTable1) {
                        setShowPlacementModal(false);
                      }
                    }}
                    disabled={organism.placedInTable2}
                  >
                    <Text style={styles.placementButtonText}>Procaryote</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.button, styles.modalButton]}
                onPress={() => setShowPlacementModal(false)}
              >
                <Text style={styles.buttonText}>Fermer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const ResultsPanel = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={resultsModalVisible}
      onRequestClose={() => setResultsModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {checkResult.allCorrect ? "Félicitations!" : "Résultats"}
            </Text>
          </View>
          <View style={styles.modalBody}>
            {checkResult.allCorrect ? (
              <View style={styles.successContainer}>
                <Text style={styles.successText}>
                  Toutes vos classifications sont correctes!
                </Text>
                <Text style={styles.successEmoji}>🎉</Text>
              </View>
            ) : (
              <View style={styles.resultsSummary}>
                <Text style={styles.resultsText}>
                  Vous avez {checkResult.correctCount} sur {checkResult.totalCount} classifications correctes.
                </Text>
                <Text style={styles.resultsSubtext}>
                  Continuez à essayer pour trouver la bonne classification!
                </Text>
              </View>
            )}
          </View>
          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[styles.button, styles.modalButton]}
              onPress={() => setResultsModalVisible(false)}
            >
              <Text style={styles.buttonText}>Fermer</Text>
            </TouchableOpacity>
            {!checkResult.allCorrect && (
              <TouchableOpacity
                style={[styles.button, styles.solutionButton, styles.modalButton]}
                onPress={() => {
                  setResultsModalVisible(false);
                  showSolution();
                }}
              >
                <Text style={styles.buttonText}>Voir la solution</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );

  // Afficher le statut de placement pour chaque organisme
  const renderOrganismStatus = () => {
    return organisms.map(organism => {
      const isComplete = organism.placedInTable1 && organism.placedInTable2;
      const isPartial = organism.placedInTable1 || organism.placedInTable2;
      
      return (
        <View key={organism.id} style={styles.statusItem}>
          <Image source={organism.image} style={styles.statusImage} />
          <Text style={styles.statusName}>{organism.name}</Text>
          <View style={styles.statusIndicators}>
            <View style={[
              styles.statusDot, 
              organism.placedInTable1 ? styles.statusDotComplete : styles.statusDotIncomplete
            ]} />
            <View style={[
              styles.statusDot, 
              organism.placedInTable2 ? styles.statusDotComplete : styles.statusDotIncomplete
            ]} />
          </View>
        </View>
      );
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollContainer}
        scrollEnabled={true}
        showsVerticalScrollIndicator={true}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="arrow-back" size={35} color="#2196f3" />
        </TouchableOpacity>
        <Text style={styles.title}>Classification des êtres vivants</Text>

        <View style={styles.tableContainer}>
          <Text style={styles.tableTitle}>Classification selon le nombre de cellules</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.headerText}>Unicellulaires</Text>
              <Text style={styles.headerText}>Pluricellulaires</Text>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCell}>
                {renderOrganismsInDropZone('unicellulaire')}
              </View>
              <View style={styles.tableCell}>
                {renderOrganismsInDropZone('pluricellulaire')}
              </View>
            </View>
          </View>
        </View>

        <View style={styles.tableContainer}>
          <Text style={styles.tableTitle}>Classification selon le type de cellules</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.headerText}>Eucaryotes</Text>
              <Text style={styles.headerText}>Procaryotes</Text>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCell}>
                {renderOrganismsInDropZone('eucaryote')}
              </View>
              <View style={styles.tableCell}>
                {renderOrganismsInDropZone('procaryote')}
              </View>
            </View>
          </View>
        </View>

        <View style={styles.statusContainer}>
          <Text style={styles.subtitle}>Statut de placement</Text>
          <View style={styles.statusLegend}>
            <View style={styles.legendItem}>
              <View style={[styles.statusDot, styles.statusDotComplete]} />
              <Text style={styles.legendText}>Placé</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.statusDot, styles.statusDotIncomplete]} />
              <Text style={styles.legendText}>Non placé</Text>
            </View>
          </View>
          <View style={styles.statusGrid}>
            {renderOrganismStatus()}
          </View>
        </View>

        <View style={styles.organismsContainer}>
          <Text style={styles.subtitle}>Appuyez sur un organisme pour le placer</Text>
          <Text style={styles.instructions}>
            Chaque organisme doit être placé dans les deux tableaux
          </Text>
          <View style={styles.organismsGrid}>
            {renderDraggableOrganisms()}
          </View>
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.button} onPress={checkAnswers}>
            <Text style={styles.buttonText}>Vérifier</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.resetButton]} onPress={resetActivity}>
            <Text style={styles.buttonText}>Réinitialiser</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.solutionButton]} onPress={showSolution}>
            <Text style={styles.buttonText}>Solution</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
      <PlacementModal />
      <ResultsPanel />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f7',
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 30,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 12,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 8,
    color: '#555',
  },
  instructions: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 10,
    color: '#666',
    fontStyle: 'italic',
  },
  backButton: {
    position: 'absolute',
    top: 30,
    left: 20,
    zIndex: 20,
  },
  tableContainer: {
    marginVertical: 12,
  },
  tableTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#444',
  },
  table: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#e3f2fd',
  },
  headerText: {
    flex: 1,
    padding: 10,
    textAlign: 'center',
    fontWeight: '600',
    color: '#0277bd',
    borderRightWidth: 1,
    borderRightColor: '#ddd',
  },
  tableRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  tableCell: {
    flex: 1,
    minHeight: 120,
    padding: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderRightWidth: 1,
    borderRightColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  organismsContainer: {
    marginVertical: 16,
  },
  organismsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 8,
  },
  draggableOrganism: {
    margin: 10,
    alignItems: 'center',
    width: 100,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  placedOrganism: {
    margin: 5,
    alignItems: 'center',
    width: 80,
  },
  organismImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#eaeaea',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  organismName: {
    marginTop: 6,
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '500',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#4caf50',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 110,
    alignItems: 'center',
    elevation: 3,
  },
  resetButton: {
    backgroundColor: '#f44336',
  },
  solutionButton: {
    backgroundColor: '#2196f3',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 5,
  },
  modalHeader: {
    backgroundColor: '#4caf50',
    padding: 16,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  modalBody: {
    padding: 20,
    minHeight: 120,
    justifyContent: 'center',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  modalButton: {
    minWidth: 120,
  },
  successContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  successText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4caf50',
    textAlign: 'center',
    marginBottom: 10,
  },
  successEmoji: {
    fontSize: 40,
    marginTop: 10,
  },
  resultsSummary: {
    alignItems: 'center',
  },
  resultsText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ff9800',
    textAlign: 'center',
    marginBottom: 10,
  },
  resultsSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  bottomPadding: {
    height: 50,
  },
  modalOrganismImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
    marginBottom: 20,
  },
  placementSection: {
    marginVertical: 10,
  },
  placementTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
  },
  placementButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  placementButton: {
    backgroundColor: '#2196f3',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  placementButtonDisabled: {
    backgroundColor: '#bdbdbd',
  },
  placementButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  statusContainer: {
    marginVertical: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    elevation: 2,
  },
  statusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  statusItem: {
    alignItems: 'center',
    width: 80,
    marginVertical: 8,
  },
  statusImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  statusName: {
    fontSize: 10,
    textAlign: 'center',
    marginVertical: 4,
  },
  statusIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginHorizontal: 3,
  },
  statusDotComplete: {
    backgroundColor: '#4caf50',
  },
  statusDotIncomplete: {
    backgroundColor: '#f44336',
  },
  statusLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  legendText: {
    fontSize: 12,
    marginLeft: 5,
  },
});

export default ClassificationActivity;
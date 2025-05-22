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
import { Audio } from 'expo-av'; // Import du module audio

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
  const scrollViewRef = useRef<ScrollView>(null);
  const panRefs = useRef<{ [key: string]: Animated.ValueXY }>({});
  const panResponders = useRef<{ [key: string]: any }>({});
  const dropZoneRefs = useRef<DropZoneRefs>({
    unicellulaire: null,
    pluricellulaire: null,
    eucaryote: null,
    procaryote: null
  });

  const soundObject = useRef<Audio.Sound | null>(null); // Référence vers l'objet son

  const { width } = Dimensions.get('window');
  const tableWidth = width * 0.9;
  const cellWidth = tableWidth / 2;

  const dropZones = {
    unicellulaire: { x: width * 0.25, y: 150, width: cellWidth, height: 120 },
    pluricellulaire: { x: width * 0.75, y: 150, width: cellWidth, height: 120 },
    eucaryote: { x: width * 0.25, y: 350, width: cellWidth, height: 120 },
    procaryote: { x: width * 0.75, y: 350, width: cellWidth, height: 120 },
  };

  // Charger et jouer la musique en boucle au montage
  useEffect(() => {
    loadBackgroundMusic();

    return () => {
      if (soundObject.current) {
        soundObject.current.unloadAsync(); // Nettoyage lorsqu'on quitte la page
      }
    };
  }, []);

  const loadBackgroundMusic = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../assets/sounds/fun-learning-children-happy-education-music-256422.mp3') // 👈 MODIFIE CE CHEMIN SI BESOIN
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

  const createPanResponder = (organismId: string) => {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (e, gestureState) => {
        setCurrentDraggingItem(organismId);
        setScrollEnabled(false);
        panRefs.current[organismId].extractOffset();
      },
      onPanResponderMove: Animated.event(
        [null, {
          dx: panRefs.current[organismId].x,
          dy: panRefs.current[organismId].y
        }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: (e, gestureState) => {
        setScrollEnabled(true);
        panRefs.current[organismId].flattenOffset();

        const dropZone = findDropZone(
          gestureState.moveX,
          gestureState.moveY + scrollOffset
        );

        if (dropZone) {
          handleDrop(organismId, dropZone);
        }

        Animated.spring(panRefs.current[organismId], {
          toValue: { x: 0, y: 0 },
          friction: 5,
          useNativeDriver: false
        }).start();
        setCurrentDraggingItem(null);
      },
      onPanResponderTerminate: () => {
        setScrollEnabled(true);
        Animated.spring(panRefs.current[organismId], {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false
        }).start();
      }
    });
  };

  const findDropZone = (x: number, y: number) => {
    for (const [key, zone] of Object.entries(dropZones)) {
      if (
        x > zone.x - zone.width / 2 &&
        x < zone.x + zone.width / 2 &&
        y > zone.y - zone.height / 2 &&
        y < zone.y + zone.height / 2
      ) {
        return key as keyof typeof dropZones;
      }
    }
    return null;
  };

  const handleDrop = (itemId: string, dropZone: keyof typeof dropZones) => {
    const organism = organisms.find(org => org.id === itemId);
    if (!organism) return;
    const newTables = { ...tables };
    const isTable1 = dropZone === 'unicellulaire' || dropZone === 'pluricellulaire';

    if (isTable1) {
      newTables.table1.unicellulaire = newTables.table1.unicellulaire.filter(id => id !== itemId);
      newTables.table1.pluricellulaire = newTables.table1.pluricellulaire.filter(id => id !== itemId);
      newTables.table1[dropZone].push(itemId);
    } else {
      newTables.table2.eucaryote = newTables.table2.eucaryote.filter(id => id !== itemId);
      newTables.table2.procaryote = newTables.table2.procaryote.filter(id => id !== itemId);
      newTables.table2[dropZone].push(itemId);
    }

    setTables(newTables);

    setOrganisms(prev =>
      prev.map(org => ({
        ...org,
        placedInTable1: isTable1 ? true : org.placedInTable1,
        placedInTable2: !isTable1 ? true : org.placedInTable2,
        isPlaced: org.placedInTable1 || org.placedInTable2
      }))
    );
  };

  useEffect(() => {
    organisms.forEach(org => {
      if (!panRefs.current[org.id]) {
        panRefs.current[org.id] = new Animated.ValueXY();
      }
      panResponders.current[org.id] = createPanResponder(org.id);
    });
  }, [organisms]);

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
    Object.values(panRefs.current).forEach(pan => {
      pan.setValue({ x: 0, y: 0 });
    });
  };

  const renderOrganismsInDropZone = (zone: keyof typeof dropZones) => {
    const orgIds = zone in tables.table1 
      ? tables.table1[zone as keyof typeof tables.table1] 
      : tables.table2[zone as keyof typeof tables.table2];

    return orgIds.map(id => {
      const organism = organisms.find(org => org.id === id);
      return organism ? (
        <View key={organism.id} style={styles.placedOrganism}>
          <Image source={organism.image} style={styles.organismImage} />
          <Text style={styles.organismName}>{organism.name}</Text>
        </View>
      ) : null;
    });
  };

  const renderDraggableOrganisms = () => {
    return organisms.map(organism => {
      if (organism.isPlaced) return null;
      if (!panRefs.current[organism.id]) {
        panRefs.current[organism.id] = new Animated.ValueXY();
      }
      if (!panResponders.current[organism.id]) {
        panResponders.current[organism.id] = createPanResponder(organism.id);
      }
      return (
        <Animated.View
          key={organism.id}
          style={[
            styles.draggableOrganism,
            {
              transform: [
                { translateX: panRefs.current[organism.id].x },
                { translateY: panRefs.current[organism.id].y }
              ],
              zIndex: currentDraggingItem === organism.id ? 100 : 1
            }
          ]}
          {...panResponders.current[organism.id].panHandlers}
        >
          <Image source={organism.image} style={styles.organismImage} />
          <Text style={styles.organismName}>{organism.name}</Text>
        </Animated.View>
      );
    });
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollContainer}
        scrollEnabled={scrollEnabled}
        showsVerticalScrollIndicator={true}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="arrow-back" size={35} color="#2196f3" />
        </TouchableOpacity>

        <Text style={styles.title}>Classification des êtres vivants</Text>

        {/* Contenu de la page */}
        <View style={styles.tableContainer}>
          <Text style={styles.tableTitle}>Classification selon le nombre de cellules</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.headerText}>Unicellulaires</Text>
              <Text style={styles.headerText}>Pluricellulaires</Text>
            </View>
            <View style={styles.tableRow}>
              <View
                style={styles.tableCell}
                ref={ref => dropZoneRefs.current.unicellulaire = ref}
              >
                {renderOrganismsInDropZone('unicellulaire')}
              </View>
              <View
                style={styles.tableCell}
                ref={ref => dropZoneRefs.current.pluricellulaire = ref}
              >
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
              <View
                style={styles.tableCell}
                ref={ref => dropZoneRefs.current.eucaryote = ref}
              >
                {renderOrganismsInDropZone('eucaryote')}
              </View>
              <View
                style={styles.tableCell}
                ref={ref => dropZoneRefs.current.procaryote = ref}
              >
                {renderOrganismsInDropZone('procaryote')}
              </View>
            </View>
          </View>
        </View>

        <View style={styles.organismsContainer}>
          <Text style={styles.subtitle}>Glissez les organismes dans la bonne catégorie</Text>
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
});

export default ClassificationActivity;
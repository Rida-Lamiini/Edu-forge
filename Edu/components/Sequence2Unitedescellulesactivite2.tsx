import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView,
  Dimensions,
  Pressable,
  Animated,
  PanResponder,
  TextInput,
  LayoutChangeEvent,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';

type Activite2ScreenProps = {
  onBack: () => void;
};

const { width } = Dimensions.get('window');

interface DropZone {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface DraggablePosition {
  x: number;
  y: number;
  set?: boolean;
}

const Activite2Screen: React.FC<Activite2ScreenProps> = ({ onBack }) => {
  // Réponses attendues
  const correctAnswers = {
    part1: ['Paroi cellulosique', 'Membrane plasmique', 'Cytoplasme', 'Noyau', 'Chloroplaste'],
    part2: 'vegetale',
    part3: "C'est une cellule végétale car elle a une forme rectangulaire et contient une paroi, des chloroplastes et une grande vacuole"
  };

  // Options à faire glisser
  const dragOptions = [
    'Paroi cellulosique',
    'Membrane plasmique',
    'Cytoplasme',
    'Noyau',
    'Chloroplaste'
  ];

  // États pour les réponses de l'utilisateur
  const [answers, setAnswers] = useState<(string | null)[]>(Array(5).fill(null));
  const [selectedCellType, setSelectedCellType] = useState<string>('');
  const [justification, setJustification] = useState<string>('');
  const [showSolution, setShowSolution] = useState<boolean>(false);
  const [draggedItem, setDraggedItem] = useState<number | null>(null);

  // Références pour les dimensions des zones de dépôt
  const dropZoneRefs = useRef<(View | null)[]>(Array(5).fill(null));

  // Références animées pour les éléments à faire glisser
  const draggableRefs = useRef(dragOptions.map(() => new Animated.ValueXY())).current;
  const initialPositions = useRef<DraggablePosition[]>(Array(dragOptions.length).fill({ x: 0, y: 0, set: false }));
  const isDropped = useRef<boolean[]>(Array(dragOptions.length).fill(false));

  // Musique
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

  // Créer des PanResponders pour chaque élément draggable
  const panResponders = useRef(
    dragOptions.map((_, itemIndex) =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => !showSolution && !isDropped.current[itemIndex],
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
          setDraggedItem(itemIndex);
        },
        onPanResponderMove: Animated.event(
          [null, { dx: draggableRefs[itemIndex].x, dy: draggableRefs[itemIndex].y }],
          { useNativeDriver: false }
        ),
        onPanResponderRelease: (_, gesture: any) => {
          const dropIndex = findDropZone(gesture);
          if (dropIndex !== -1 && !answers[dropIndex]) {
            if (dropZoneRefs.current[dropIndex]) {
              dropZoneRefs.current[dropIndex]?.measure((fx, fy, w, h, px, py) => {
                const newX = px - initialPositions.current[itemIndex].x;
                const newY = py - initialPositions.current[itemIndex].y;

                Animated.spring(draggableRefs[itemIndex], {
                  toValue: { x: newX, y: newY },
                  useNativeDriver: false
                }).start();

                // ✅ Correction ici : Mettre à jour proprement l'état
                setAnswers(prevAnswers => {
                  const updated = [...prevAnswers];
                  updated[dropIndex] = dragOptions[itemIndex];
                  return updated;
                });
                isDropped.current[itemIndex] = true;
              });
            }
          } else {
            Animated.spring(draggableRefs[itemIndex], {
              toValue: { x: 0, y: 0 },
              useNativeDriver: false
            }).start();
          }
          setDraggedItem(null);
        },
      })
    )
  ).current;

  // Trouver la zone de dépôt la plus proche
  const findDropZone = (gesture: any): number => {
    let dropIndex = -1;
    dropZoneRefs.current.forEach((zone, index) => {
      if (zone) {
        zone.measure((fx, fy, w, h, px, py) => {
          const isInZone =
            gesture.moveX >= px &&
            gesture.moveX <= px + w &&
            gesture.moveY >= py &&
            gesture.moveY <= py + h;
          if (isInZone && !answers[index]) {
            dropIndex = index;
          }
        });
      }
    });
    return dropIndex;
  };

  // Sauvegarder les positions initiales
  const saveDraggablePosition = (itemIndex: number, event: LayoutChangeEvent) => {
    const layout = event.nativeEvent.layout;
    if (layout && !initialPositions.current[itemIndex].set) {
      initialPositions.current[itemIndex] = {
        x: layout.x,
        y: layout.y,
        set: true
      };
    }
  };

  // Vérifier les réponses
  const checkAnswers = () => {
    if (answers.includes(null)) {
      Alert.alert('Attention', 'Veuillez placer une réponse dans chaque emplacement numéroté.');
      return;
    }

    const part1Correct = answers.every((answer, index) => answer === correctAnswers.part1[index]);
    const part2Correct = selectedCellType === correctAnswers.part2;
    const part3Correct =
      justification.toLowerCase().includes('végétale') &&
      justification.toLowerCase().includes('rectangulaire') &&
      justification.toLowerCase().includes('paroi') &&
      (justification.toLowerCase().includes('chloroplastes') || justification.toLowerCase().includes('chloroplaste')) &&
      justification.toLowerCase().includes('vacuole');

    if (part1Correct && part2Correct && part3Correct) {
      Alert.alert('Félicitations!', 'Toutes les réponses sont correctes! 🎉');
    } else {
      Alert.alert('Attention', 'Certaines réponses ne sont pas correctes. Vérifiez vos réponses.');
    }
  };

  // Réinitialiser toutes les réponses
  const resetAnswers = () => {
    draggableRefs.forEach((anim, index) => {
      Animated.spring(anim, {
        toValue: { x: 0, y: 0 },
        useNativeDriver: false
      }).start();
      isDropped.current[index] = false;
    });

    setAnswers(Array(5).fill(null));
    setSelectedCellType('');
    setJustification('');
    setShowSolution(false);
  };

  // Afficher la solution
  const displaySolution = () => {
    setShowSolution(true);
    setAnswers([...correctAnswers.part1]);
    setSelectedCellType(correctAnswers.part2);
    setJustification(correctAnswers.part3);

    Alert.alert(
      'Solution',
      `1. ${correctAnswers.part1[0]}
2. ${correctAnswers.part1[1]}
3. ${correctAnswers.part1[2]}
4. ${correctAnswers.part1[3]}
5. ${correctAnswers.part1[4]}
Type de cellule: végétale
Justification: ${correctAnswers.part3}`
    );
  };

  // Basculer la sélection du type de cellule
  const toggleCellType = (type: string) => {
    if (!showSolution) {
      setSelectedCellType(type);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Bouton de retour */}
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Ionicons name="arrow-back" size={35} color="#2196f3" />
      </TouchableOpacity>

      {/* En-tête */}
      <View style={styles.header}>
        <Text style={styles.title}>Activité 2</Text>
        <Text style={styles.subtitle}>Constituants d'une cellule</Text>
      </View>

      {/* Partie 1: Légende des constituants */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Partie 1: Légende des constituants</Text>
        <Text style={styles.question}>
          Donnez, sur la photographie, la légende des constituants numérotés de 1 à 5.
        </Text>
        <View style={styles.contentContainer}>
          {/* Image de la cellule */}
          <View style={styles.imageContainer}>
            <Image
              source={require('../assets/images/UniteDesCellules/Activite2/activite_2.png')}
              style={styles.cellImage}
              resizeMode="contain"
            />
          </View>
          {/* Zones de dépôt numérotées */}
          <View style={styles.dropZonesContainer}>
            {[1, 2, 3, 4, 5].map((num) => (
              <View
                key={`dropzone-${num}`}
                ref={(el) => (dropZoneRefs.current[num - 1] = el)}
                style={styles.dropZoneWrapper}
              >
                <View style={styles.dropZone}>
                  <Text style={styles.dropZoneNumber}>{num}</Text>
                  <View style={styles.dropZoneText}>
                    {(answers[num - 1] || showSolution) && (
                      <Text style={styles.droppedText}>
                        {showSolution ? correctAnswers.part1[num - 1] : answers[num - 1]}
                      </Text>
                    )}
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
        {/* Éléments à faire glisser */}
        <View style={styles.draggablesContainer}>
          <Text style={styles.draggablesTitle}>
            Faites glisser les termes vers les numéros correspondants:
          </Text>
          <View style={styles.draggablesList}>
            {dragOptions.map((option, index) => {
              // Ne pas afficher si déjà déposé
              if (isDropped.current[index]) {
                return null;
              }
              return (
                <Animated.View
                  key={`draggable-${option}`} // ✅ Correction ici : key unique basé sur le texte
                  onLayout={(event) => saveDraggablePosition(index, event)}
                  style={[
                    styles.draggable,
                    {
                      transform: draggableRefs[index].getTranslateTransform(),
                      zIndex: draggedItem === index ? 1000 : 1,
                      opacity: isDropped.current[index] ? 0.5 : 1,
                      backgroundColor: draggedItem === index ? '#b3d9ff' : '#e6f3ff',
                      borderColor: draggedItem === index ? '#4a7dff' : '#99c2ff',
                    },
                  ]}
                  {...panResponders[index].panHandlers}
                >
                  <Text style={styles.draggableText}>{option}</Text>
                </Animated.View>
              );
            })}
          </View>
        </View>
      </View>

      {/* Partie 2: Type de cellule */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Partie 2: Type de cellule</Text>
        <Text style={styles.question}>De quelle cellule s'agit-il ?</Text>
        <View style={styles.checkboxContainer}>
          <Pressable
            style={styles.checkboxWrapper}
            onPress={() => toggleCellType('vegetale')}
          >
            <View
              style={[
                styles.checkbox,
                (selectedCellType === 'vegetale' || (showSolution && correctAnswers.part2 === 'vegetale')) &&
                  styles.checkboxChecked
              ]}
            >
              {(selectedCellType === 'vegetale' || (showSolution && correctAnswers.part2 === 'vegetale')) && (
                <View style={styles.checkboxInner} />
              )}
            </View>
            <Text style={styles.checkboxLabel}>a. Végétale</Text>
          </Pressable>
          <Pressable
            style={styles.checkboxWrapper}
            onPress={() => toggleCellType('bacterienne')}
          >
            <View
              style={[
                styles.checkbox,
                selectedCellType === 'bacterienne' && styles.checkboxChecked
              ]}
            >
              {selectedCellType === 'bacterienne' && <View style={styles.checkboxInner} />}
            </View>
            <Text style={styles.checkboxLabel}>b. Bactérienne</Text>
          </Pressable>
          <Pressable
            style={styles.checkboxWrapper}
            onPress={() => toggleCellType('animale')}
          >
            <View
              style={[
                styles.checkbox,
                selectedCellType === 'animale' && styles.checkboxChecked
              ]}
            >
              {selectedCellType === 'animale' && <View style={styles.checkboxInner} />}
            </View>
            <Text style={styles.checkboxLabel}>c. Animale</Text>
          </Pressable>
        </View>
      </View>

      {/* Partie 3: Justification */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Partie 3: Justification</Text>
        <Text style={styles.question}>Justifiez votre réponse.</Text>
        <Text style={styles.justificationPrompt}>
          C'est une cellule ...... car elle a une forme ...... et contient ......
        </Text>
        <TextInput
          style={[styles.input, styles.multilineInput]}
          multiline
          numberOfLines={4}
          value={showSolution ? correctAnswers.part3 : justification}
          onChangeText={setJustification}
          editable={!showSolution}
          placeholder="Écrivez votre justification ici..."
          placeholderTextColor="#999"
        />
      </View>

      {/* Boutons d'action */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.solutionButton]} onPress={displaySolution}>
          <Text style={styles.buttonText}>Solution</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.resetButton]} onPress={resetAnswers}>
          <Text style={styles.buttonText}>Réinitialiser</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.checkButton]} onPress={checkAnswers}>
          <Text style={styles.buttonText}>Vérifier</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

// Styles complets et validés
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
    paddingBottom: 40,
  },
  header: {
    marginBottom: 25,
    paddingBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: '#e1e5ee',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#4a7dff',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4a7dff',
    marginBottom: 15,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e5ee',
  },
  question: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#34495e',
    lineHeight: 22,
  },
  justificationPrompt: {
    fontStyle: 'italic',
    marginBottom: 12,
    color: '#7f8c8d',
    fontSize: 14,
  },
  contentContainer: {
    flexDirection: 'row',
    marginVertical: 15,
  },
  imageContainer: {
    width: '60%',
    height: width * 0.6,
  },
  cellImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e1e5ee',
    backgroundColor: '#f8f9fa',
  },
  dropZonesContainer: {
    width: '40%',
    paddingLeft: 10,
  },
  dropZoneWrapper: {
    marginBottom: 10,
  },
  dropZone: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 40,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4a7dff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  dropZoneNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: '#4a7dff',
    width: 24,
    height: 24,
    textAlign: 'center',
    lineHeight: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  dropZoneText: {
    flex: 1,
    justifyContent: 'center',
  },
  droppedText: {
    color: '#2c3e50',
    fontSize: 14,
    fontWeight: '500',
  },
  draggablesContainer: {
    marginTop: 20,
  },
  draggablesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#34495e',
    marginBottom: 12,
  },
  draggablesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },
  draggable: {
    padding: 12,
    backgroundColor: '#e6f3ff',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#99c2ff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
    zIndex: 100,
  },
  draggableText: {
    fontSize: 14,
    color: '#2c3e50',
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e1e5ee',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
    fontSize: 15,
    color: '#2c3e50',
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  checkboxContainer: {
    marginVertical: 10,
  },
  checkboxWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#4a7dff',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  checkboxChecked: {
    backgroundColor: '#4a7dff',
  },
  checkboxInner: {
    width: 10,
    height: 10,
    backgroundColor: '#fff',
    borderRadius: 2,
  },
  checkboxLabel: {
    fontSize: 15,
    color: '#34495e',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '30%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  solutionButton: {
    backgroundColor: '#4a7dff',
  },
  resetButton: {
    backgroundColor: '#e74c3c',
  },
  checkButton: {
    backgroundColor: '#2ecc71',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  backButton: {
    position: 'absolute',
    top: 30,
    left: 20,
    zIndex: 20,
  },
});

export default Activite2Screen;
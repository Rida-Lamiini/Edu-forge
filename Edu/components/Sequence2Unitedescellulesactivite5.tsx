import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  SafeAreaView,
  Image,
} from 'react-native';

type Activite5Props = {
  onBack: () => void;
};

interface CorrectSchema {
  A: string;
  B: string;
  C: string;
  D: string;
}

interface CorrectAnswers {
  table: {
    element: string;
    answers: string[];
  }[];
  schema: CorrectSchema;
}

const Activite5Screen: React.FC<Activite5Props> = ({ onBack }) => {
  // Réponses attendues
  const correctAnswers: CorrectAnswers = {
    table: [
      { element: 'Paroi', answers: ['-', '+', '+'] },
      { element: 'Membrane cytoplasmique', answers: ['+', '+', '+'] },
      { element: 'Cytoplasme', answers: ['+', '+', '+'] },
      { element: 'Matériel génétique libre dans le cytoplasme', answers: ['-', '-', '+'] },
      { element: 'Noyau', answers: ['+', '+', '-'] },
      { element: 'Mitochondries', answers: ['+', '+', '-'] },
      { element: 'Chloroplastes', answers: ['-', '+', '-'] },
      { element: 'Vacuole', answers: ['-', '+', '-'] },
    ],
    schema: {
      A: "Membrane cytoplasmique\nCytoplasme\nNoyau\nMitochondries",
      B: "Membrane cytoplasmique\nCytoplasme",
      C: "Paroi\nMembrane cytoplasmique\nCytoplasme",
      D: "Membrane cytoplasmique\nCytoplasme",
    },
  };

  // États pour suivre les réponses de l'utilisateur
  const [schemaResponses, setSchemaResponses] = useState({
    A: '',
    B: '',
    C: '',
    D: '',
  });
  const [showSolution, setShowSolution] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  // Fonction pour mettre à jour les réponses du schéma
  const handleSchemaResponse = (key: keyof typeof schemaResponses, value: string) => {
    setSchemaResponses((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Vérifier les réponses
  const checkAnswers = () => {
    const newErrors: string[] = [];
    
    // Vérification du schéma
    const schemaKeys: Array<keyof typeof schemaResponses> = ['A', 'B', 'C', 'D'];
    schemaKeys.forEach((key) => {
      const userAnswer = schemaResponses[key].trim().split('\n').sort().join('\n');
      const correctAnswer = correctAnswers.schema[key].split('\n').sort().join('\n');
      
      if (userAnswer !== correctAnswer) {
        newErrors.push(`Espace ${key}`);
      }
    });

    setErrors(newErrors);

    if (newErrors.length === 0) {
      setMessage("Félicitations ! Toutes les réponses sont correctes.");
      setMessageType('success');
    } else {
      setMessage(`Attention ! Réponses incorrectes dans : ${newErrors.join(', ')}`);
      setMessageType('error');
    }
  };

  // Afficher la solution
  const displaySolution = () => {
    setShowSolution(true);
    setSchemaResponses(correctAnswers.schema);
    setMessage('Les bonnes réponses ont été affichées.');
    setMessageType('success');
    setErrors([]);
  };

  // Réinitialiser toutes les réponses
  const resetAnswers = () => {
    setSchemaResponses({ A: '', B: '', C: '', D: '' });
    setShowSolution(false);
    setMessage('');
    setMessageType(null);
    setErrors([]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Bouton de retour */}
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>Retour</Text>
        </TouchableOpacity>

        {/* En-tête */}
        <View style={styles.header}>
          <Text style={styles.title}>Activité 5</Text>
          <Text style={styles.subtitle}>Comparaison des différents types de cellules</Text>
        </View>

        {/* Tableau comparatif */}
        <View style={styles.tableContainer}>
          <Text style={styles.tableTitle}>
            Le tableau suivant indique, pour quelques organismes, la présence (+) ou l'absence (-) de certains éléments (composantes) cellulaires.
          </Text>

          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, styles.firstColumn]}>Eléments</Text>
              <View style={styles.columnHeader}>
                <Image
                  source={require('../assets/images/UniteDesCellules/Activite5/cellule_foie.png')}
                  style={styles.headerImage}
                  resizeMode="contain"
                />
                <Text style={styles.tableHeaderCell}>Cellule de foie (Cheval)</Text>
              </View>
              <View style={styles.columnHeader}>
                <Image
                  source={require('../assets/images/UniteDesCellules/Activite5/cellule_feuille.png')}
                  style={styles.headerImage}
                  resizeMode="contain"
                />
                <Text style={styles.tableHeaderCell}>Cellule d'une feuille (Chêne)</Text>
              </View>
              <View style={styles.columnHeader}>
                <Image
                  source={require('../assets/images/UniteDesCellules/Activite5/bacterie_yaourt.png')}
                  style={styles.headerImage}
                  resizeMode="contain"
                />
                <Text style={styles.tableHeaderCell}>Bactérie du Yaourt</Text>
              </View>
            </View>

            {correctAnswers.table.map((row, rowIndex) => (
              <View key={row.element} style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.firstColumn]}>{row.element}</Text>
                {row.answers.map((answer, colIndex) => (
                  <View
                    key={colIndex}
                    style={[
                      styles.tableCell,
                      styles.tableInput,
                    ]}
                  >
                    <Text style={styles.tableText}>
                      {answer}
                    </Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        </View>

        {/* Schéma interactif */}
        <View style={styles.schemaContainer}>
          <Text style={styles.schemaTitle}>Compléter le schéma suivant en écrivant :</Text>
          <Text style={styles.schemaInstructions}>
            <Text style={styles.bold}>a-</Text> Dans l'espace A les éléments communs entre la cellule animale et la cellule végétale.{'\n'}
            <Text style={styles.bold}>b-</Text> Dans l'espace B les éléments communs entre la cellule animale et la cellule bactérienne.{'\n'}
            <Text style={styles.bold}>c-</Text> Dans l'espace C les éléments communs entre la cellule végétale et la cellule bactérienne.{'\n'}
            <Text style={styles.bold}>d-</Text> Dans l'espace D les éléments communs entre les trois types de cellules.
          </Text>

          {/* Diagramme de Venn */}
          <View style={styles.vennContainer}>
            {/* Cercles du diagramme */}
            <View style={[styles.circle, styles.animalCell]} />
            <View style={[styles.circle, styles.plantCell]} />
            <View style={[styles.circle, styles.bacteriaCell]} />
            
            {/* Étiquettes des cellules */}
            <Text style={[styles.cellLabel, styles.animalLabel]}>Cellule animale</Text>
            <Text style={[styles.cellLabel, styles.plantLabel]}>Cellule végétale</Text>
            <Text style={[styles.cellLabel, styles.bacteriaLabel]}>Cellule bactérienne</Text>
            
            {/* Flèches pointant vers les intersections */}
            <View style={[styles.arrowContainer, styles.arrowA]}>
              <View style={styles.arrowLine} />
              <View style={styles.arrowHead} />
              <Text style={styles.arrowLabel}>A</Text>
            </View>
            
            <View style={[styles.arrowContainer, styles.arrowB]}>
              <View style={styles.arrowLine} />
              <View style={styles.arrowHead} />
              <Text style={styles.arrowLabel}>B</Text>
            </View>
            
            <View style={[styles.arrowContainer, styles.arrowC]}>
              <View style={styles.arrowLine} />
              <View style={styles.arrowHead} />
              <Text style={styles.arrowLabel}>C</Text>
            </View>
            
            <View style={[styles.arrowContainer, styles.arrowD]}>
              <View style={styles.arrowLine} />
              <View style={styles.arrowHead} />
              <Text style={styles.arrowLabel}>D</Text>
            </View>

            {/* Zones de texte pour les réponses */}
            <View style={[styles.zone, styles.zoneA]}>
              <Text style={styles.zoneTitle}>Espace A</Text>
              <TextInput
                style={[styles.zoneInput, errors.includes('Espace A') && styles.errorInput]}
                value={schemaResponses.A}
                onChangeText={(text) => handleSchemaResponse('A', text)}
                editable={!showSolution}
                multiline
                textAlignVertical="top"
                placeholder="Éléments communs..."
              />
            </View>
            <View style={[styles.zone, styles.zoneB]}>
              <Text style={styles.zoneTitle}>Espace B</Text>
              <TextInput
                style={[styles.zoneInput, errors.includes('Espace B') && styles.errorInput]}
                value={schemaResponses.B}
                onChangeText={(text) => handleSchemaResponse('B', text)}
                editable={!showSolution}
                multiline
                textAlignVertical="top"
                placeholder="Éléments communs..."
              />
            </View>
            <View style={[styles.zone, styles.zoneC]}>
              <Text style={styles.zoneTitle}>Espace C</Text>
              <TextInput
                style={[styles.zoneInput, errors.includes('Espace C') && styles.errorInput]}
                value={schemaResponses.C}
                onChangeText={(text) => handleSchemaResponse('C', text)}
                editable={!showSolution}
                multiline
                textAlignVertical="top"
                placeholder="Éléments communs..."
              />
            </View>
            <View style={[styles.zone, styles.zoneD]}>
              <Text style={styles.zoneTitle}>Espace D</Text>
              <TextInput
                style={[styles.zoneInput, errors.includes('Espace D') && styles.errorInput]}
                value={schemaResponses.D}
                onChangeText={(text) => handleSchemaResponse('D', text)}
                editable={!showSolution}
                multiline
                textAlignVertical="top"
                placeholder="Éléments communs..."
              />
            </View>
          </View>
        </View>

        {/* Messages de vérification */}
        {message && (
          <Text
            style={[
              styles.message,
              messageType === 'success' && styles.successMessage,
              messageType === 'error' && styles.errorMessage,
            ]}
          >
            {message}
          </Text>
        )}

        {/* Boutons d'action */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.button, styles.checkButton]} onPress={checkAnswers}>
            <Text style={styles.buttonText}>Vérifier</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.resetButton]} onPress={resetAnswers}>
            <Text style={styles.buttonText}>Réinitialiser</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.solutionButton]} onPress={displaySolution}>
            <Text style={styles.buttonText}>Solution</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    padding: 16,
    paddingBottom: 60,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 20,
    padding: 8,
    backgroundColor: '#4a90e2',
    borderRadius: 4,
  },
  backButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    color: '#333',
    marginBottom: 16,
  },
  tableContainer: {
    marginBottom: 24,
  },
  tableTitle: {
    fontSize: 16,
    marginBottom: 12,
  },
  table: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#e0e0e0',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  columnHeader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
  },
  headerImage: {
    width: 50,
    height: 50,
    marginBottom: 4,
  },
  tableHeaderCell: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 12,
  },
  firstColumn: {
    flex: 2,
    textAlign: 'left',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tableCell: {
    flex: 1,
    padding: 12,
    textAlign: 'center',
    justifyContent: 'center',
  },
  tableInput: {
    backgroundColor: '#fff',
  },
  tableText: {
    fontSize: 16,
  },
  schemaContainer: {
    marginBottom: 24,
  },
  schemaTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  schemaInstructions: {
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  bold: {
    fontWeight: 'bold',
  },
  vennContainer: {
    height: 400,
    marginTop: 20,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    opacity: 0.3,
  },
  animalCell: {
    backgroundColor: '#ff9999',
    top: 50,
    left: 30,
  },
  plantCell: {
    backgroundColor: '#99ff99',
    top: 50,
    right: 30,
  },
  bacteriaCell: {
    backgroundColor: '#9999ff',
    bottom: 50,
  },
  cellLabel: {
    position: 'absolute',
    fontWeight: 'bold',
    fontSize: 14,
    color: '#333',
  },
  animalLabel: {
    top: 30,
    left: 60,
  },
  plantLabel: {
    top: 30,
    right: 60,
  },
  bacteriaLabel: {
    bottom: 30,
  },
  arrowContainer: {
    position: 'absolute',
    alignItems: 'center',
  },
  arrowA: {
    top: 30,
    left: '35%',
  },
  arrowB: {
    top: '50%',
    right: 20,
    transform: [{ rotate: '-90deg' }],
  },
  arrowC: {
    bottom: 30,
    left: '35%',
    transform: [{ rotate: '180deg' }],
  },
  arrowD: {
    top: '50%',
    left: '50%',
    transform: [{ translateX: -15 }],
  },
  arrowLine: {
    width: 2,
    height: 30,
    backgroundColor: '#333',
  },
  arrowHead: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderBottomWidth: 12,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#333',
    transform: [{ translateY: -12 }],
  },
  arrowLabel: {
    marginTop: 4,
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
  },
  zone: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    width: 130,
    height: 110,
  },
  zoneA: {
    top: 10,
    left: 10,
  },
  zoneB: {
    top: 10,
    right: 10,
  },
  zoneC: {
    bottom: 10,
    left: 10,
  },
  zoneD: {
    bottom: 10,
    right: 10,
  },
  zoneTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 4,
    textAlign: 'center',
    color: '#333',
  },
  zoneInput: {
    width: '100%',
    height: '80%',
    fontSize: 12,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 4,
    backgroundColor: '#fff',
  },
  errorInput: {
    borderColor: '#f44336',
    borderWidth: 2,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    marginBottom: 20,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 4,
    minWidth: '30%',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  checkButton: {
    backgroundColor: '#4caf50',
  },
  resetButton: {
    backgroundColor: '#f44336',
  },
  solutionButton: {
    backgroundColor: '#2196f3',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  message: {
    marginTop: 16,
    padding: 12,
    borderRadius: 4,
    textAlign: 'center',
    fontSize: 16,
  },
  successMessage: {
    backgroundColor: '#dff0d8',
    color: '#3c763d',
  },
  errorMessage: {
    backgroundColor: '#f2dede',
    color: '#a94442',
  },
});

export default Activite5Screen;
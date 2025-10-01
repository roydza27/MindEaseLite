import { Ionicons } from '@expo/vector-icons';
import React, { useState, useRef } from 'react';
import { Dimensions, PanResponder, StyleSheet, Text, TouchableOpacity, View, Animated } from 'react-native';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';

const { width } = Dimensions.get('window');

interface MoodTrackerProps {
  onNavigate: (screen: string) => void;
}

export default function MoodTracker({ onNavigate }: MoodTrackerProps) {
  const { colors } = useTheme();
  const { t } = useLanguage();
  const [showAccountPopup, setShowAccountPopup] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [moodRating, setMoodRating] = useState(3);
  const [stressLevel, setStressLevel] = useState(3);
  const [anxietyLevel, setAnxietyLevel] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  
  // Animation for rotating selector
  const rotationAnim = useRef(new Animated.Value(0)).current;
  const [currentRotation, setCurrentRotation] = useState(0);

  const questions = [
    {
      id: 1,
      title: t('moodTracker.question1'),
      type: 'mood',
      options: [
        { value: 1, emoji: '😢', label: 'Very Sad', color: '#FF4444' },
        { value: 2, emoji: '😔', label: 'Sad', color: '#FF9800' },
        { value: 3, emoji: '😐', label: 'Neutral', color: '#FFA726' },
        { value: 4, emoji: '😊', label: 'Happy', color: '#4CAF50' },
        { value: 5, emoji: '😄', label: 'Very Happy', color: colors.primary }
      ]
    },
    {
      id: 2,
      title: t('moodTracker.question2'),
      type: 'stress',
      options: [
        { value: 1, label: 'Not at all', description: 'You feel completely relaxed', intensity: 'Very Low' },
        { value: 2, label: 'A little', description: 'Minor stress, manageable', intensity: 'Low' },
        { value: 3, label: 'Moderately', description: 'Some stress, but coping well', intensity: 'Medium' },
        { value: 4, label: 'Quite a bit', description: 'Feeling quite stressed', intensity: 'High' },
        { value: 5, label: 'Extremely', description: 'You are extremely stressed out', intensity: 'Very High' }
      ]
    },
    {
      id: 3,
      title: t('moodTracker.question3'),
      type: 'sleep',
      options: [
        { value: 'excellent', label: 'Excellent', hours: '7-9 HOURS', emoji: '😊', color: '#4CAF50', energy: 'High Energy' },
        { value: 'good', label: 'Good', hours: '6-7 HOURS', emoji: '😌', color: colors.primary, energy: 'Good Energy' },
        { value: 'fair', label: 'Fair', hours: '4-5 HOURS', emoji: '😐', color: '#FFA726', energy: 'Low Energy' },
        { value: 'poor', label: 'Poor', hours: '2-3 HOURS', emoji: '😴', color: '#FF4444', energy: 'Very Low Energy' }
      ]
    }
  ];

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Submit form
      console.log('Mood Tracker Results:', {
        mood: moodRating,
        stress: stressLevel,
        sleep: anxietyLevel
      });
      setIsCompleted(true);
      // Navigate back to main after completion
      setTimeout(() => {
        onNavigate('main');
      }, 2000);
    }
  };

  const handleSkip = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Skip to completion
      setIsCompleted(true);
      setTimeout(() => {
        onNavigate('main');
      }, 2000);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleOptionSelect = (value: any) => {
    if (currentQ.type === 'mood') {
      setMoodRating(value);
    } else if (currentQ.type === 'stress') {
      setStressLevel(value);
    } else if (currentQ.type === 'sleep') {
      setAnxietyLevel(value);
    }
  };

  const getSelectedValue = () => {
    if (currentQ.type === 'mood') return moodRating;
    if (currentQ.type === 'stress') return stressLevel;
    if (currentQ.type === 'sleep') return anxietyLevel;
    return null;
  };

  const isAnswerSelected = () => {
    const selected = getSelectedValue();
    return selected !== null && selected !== '';
  };

  const getMoodEmoji = () => {
    const mood = questions[0].options.find(opt => opt.value === moodRating);
    return mood ? (mood as any).emoji : '😐';
  };

  const getMoodLabel = () => {
    const mood = questions[0].options.find(opt => opt.value === moodRating);
    return mood ? `I Feel ${mood.label}.` : 'I Feel Neutral.';
  };

  const getStressDescription = () => {
    const stress = questions[1].options.find(opt => opt.value === stressLevel);
    return stress ? (stress as any).description : '';
  };

  const renderRotatingSelector = () => {
    const currentMood = questions[0].options.find(opt => opt.value === moodRating) || questions[0].options[2];
    
    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt, gestureState) => {
        // Start of drag
      },
      onPanResponderMove: (evt, gestureState) => {
        const { dx } = gestureState;
        const rotationSensitivity = 0.5; // Adjust sensitivity
        const newRotation = currentRotation + (dx * rotationSensitivity);
        
        // Calculate which mood should be selected based on rotation
        const normalizedRotation = ((newRotation % 360) + 360) % 360;
        const moodIndex = Math.round(normalizedRotation / 72) % 5;
        const selectedMood = questions[0].options[moodIndex];
        
        if (selectedMood && selectedMood.value !== moodRating) {
          setMoodRating(selectedMood.value as number);
        }
        
        setCurrentRotation(newRotation);
        rotationAnim.setValue(newRotation);
      },
      onPanResponderRelease: () => {
        // Snap to nearest mood
        const normalizedRotation = ((currentRotation % 360) + 360) % 360;
        const moodIndex = Math.round(normalizedRotation / 72) % 5;
        const targetRotation = moodIndex * 72;
        
        Animated.spring(rotationAnim, {
          toValue: targetRotation,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }).start();
        
        setCurrentRotation(targetRotation);
      },
    });

    return (
      <View style={styles.rotatingSelectorContainer}>
        {/* Central Mood Display */}
        <View style={[styles.centralMoodCard, { backgroundColor: colors.surface }]}>
          <Text style={styles.centralMoodEmoji}>{(currentMood as any).emoji}</Text>
          <Text style={[styles.centralMoodText, { color: colors.text }]}>
            {currentMood.label}
          </Text>
          <View style={[styles.moodIndicator, { backgroundColor: (currentMood as any).color }]} />
        </View>
        
        {/* Rotating Semi-Circle Selector */}
        <View style={styles.selectorContainer} {...panResponder.panHandlers}>
          {/* Semi-circle background */}
          <View style={[styles.semiCircleBackground, { borderColor: colors.border }]} />
          
          {/* Rotating mood options */}
          <Animated.View 
            style={[
              styles.rotatingContainer,
              {
                transform: [{
                  rotate: rotationAnim.interpolate({
                    inputRange: [0, 360],
                    outputRange: ['0deg', '360deg'],
                  })
                }]
              }
            ]}
          >
            {questions[0].options.map((option, index) => {
              const angle = index * 72; // 72 degrees apart
              const radius = 120;
              const x = Math.cos((angle - 90) * Math.PI / 180) * radius;
              const y = Math.sin((angle - 90) * Math.PI / 180) * radius;
              
              return (
                <View
                  key={option.value}
                  style={[
                    styles.rotatingMoodOption,
                    {
                      left: 150 + x - 25,
                      top: 150 + y - 25,
                      backgroundColor: moodRating === option.value ? (option as any).color : colors.surface,
                      borderColor: moodRating === option.value ? (option as any).color : colors.border,
                      transform: [
                        { scale: moodRating === option.value ? 1.3 : 1 }
                      ],
                    }
                  ]}
                >
                  <Text style={[
                    styles.rotatingMoodEmoji,
                    { 
                      color: moodRating === option.value ? '#FFFFFF' : colors.text,
                    }
                  ]}>
                    {(option as any).emoji}
                  </Text>
                </View>
              );
            })}
          </Animated.View>
          
          {/* Selection indicator at bottom */}
          <View style={[styles.selectionIndicator, { backgroundColor: colors.primary }]} />
        </View>
        
        {/* Instructions */}
        <View style={[styles.instructionsCard, { backgroundColor: colors.surface }]}>
          <Text style={[styles.instructionsText, { color: colors.text }]}>
            Swipe left or right to rotate and select your mood
          </Text>
        </View>
        
        {/* Mood Description */}
        <View style={[styles.moodDescriptionCard, { backgroundColor: colors.surface }]}>
          <Text style={[styles.moodDescription, { color: colors.text }]}>
            {moodRating === 1 && "It's okay to feel sad. Take care of yourself today."}
            {moodRating === 2 && "A little down? Try some gentle self-care activities."}
            {moodRating === 3 && "Feeling neutral? Sometimes that's perfectly fine."}
            {moodRating === 4 && "Great mood! Enjoy this positive energy."}
            {moodRating === 5 && "Fantastic! You're radiating happiness today."}
          </Text>
        </View>
      </View>
    );
  };

  const renderStressButtons = () => {
    return (
      <View style={styles.stressButtonsContainer}>
        {/* Stress Level Display */}
        <View style={[styles.stressDisplayCard, { backgroundColor: colors.surface }]}>
          <Text style={[styles.stressDisplayNumber, { color: colors.primary }]}>{stressLevel}</Text>
          <Text style={[styles.stressDisplayLabel, { color: colors.text }]}>
            {(questions[1].options.find(opt => opt.value === stressLevel) as any)?.intensity}
          </Text>
        </View>
        
        {/* Stress Level Buttons */}
        <View style={styles.stressButtonsGrid}>
          {questions[1].options.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.stressButton,
                {
                  backgroundColor: stressLevel === option.value ? colors.primary : colors.surface,
                  borderColor: stressLevel === option.value ? colors.primary : colors.border,
                }
              ]}
              onPress={() => setStressLevel(option.value as number)}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.stressButtonNumber,
                { color: stressLevel === option.value ? '#FFFFFF' : colors.text }
              ]}>
                {option.value}
              </Text>
              <Text style={[
                styles.stressButtonLabel,
                { color: stressLevel === option.value ? '#FFFFFF' : colors.textSecondary }
              ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
        {/* Stress Description */}
        <View style={[styles.stressDescriptionCard, { backgroundColor: colors.surface }]}>
          <Text style={[styles.stressDescription, { color: colors.text }]}>
            {getStressDescription()}
          </Text>
        </View>
      </View>
    );
  };

  const renderSleepCards = () => {
    return (
      <View style={styles.sleepCardsContainer}>
        {currentQ.options.map((option, index) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.sleepCard,
              { 
                backgroundColor: anxietyLevel === option.value ? colors.primary : colors.surface,
                borderColor: colors.border,
              }
            ]}
            onPress={() => setAnxietyLevel(option.value as string)}
          >
            <View style={styles.sleepCardHeader}>
              <Text style={[
                styles.sleepCardEmoji,
                { color: anxietyLevel === option.value ? '#FFFFFF' : colors.text }
              ]}>
                {(option as any).emoji}
              </Text>
              <View style={[
                styles.sleepCardIndicator,
                { backgroundColor: anxietyLevel === option.value ? '#FFFFFF' : (option as any).color }
              ]} />
            </View>
            
            <View style={styles.sleepCardContent}>
              <Text style={[
                styles.sleepCardLabel,
                { color: anxietyLevel === option.value ? '#FFFFFF' : colors.text }
              ]}>
                {option.label}
              </Text>
              <Text style={[
                styles.sleepCardHours,
                { color: anxietyLevel === option.value ? 'rgba(255, 255, 255, 0.8)' : colors.textSecondary }
              ]}>
                {(option as any).hours}
              </Text>
              <Text style={[
                styles.sleepCardEnergy,
                { color: anxietyLevel === option.value ? 'rgba(255, 255, 255, 0.9)' : colors.textSecondary }
              ]}>
                {(option as any).energy}
              </Text>
            </View>
            
            {anxietyLevel === option.value && (
              <View style={styles.sleepCardSelected}>
                <Ionicons name="checkmark-circle" size={24} color="#FFFFFF" />
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderQuestionContent = () => {
    switch (currentQ.type) {
      case 'mood':
        return renderRotatingSelector();
      case 'stress':
        return renderStressButtons();
      case 'sleep':
        return renderSleepCards();
      default:
        return null;
    }
  };

  // Show completion screen
  if (isCompleted) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.completionContainer}>
          <View style={[styles.completionCard, { backgroundColor: colors.surface }]}>
            <Ionicons name="checkmark-circle" size={80} color="#4CAF50" />
            <Text style={[styles.completionTitle, { color: colors.text }]}>
              {t('moodTracker.completed')}
            </Text>
            <Text style={[styles.completionMessage, { color: colors.textSecondary }]}>
              {t('moodTracker.thankYou')}
            </Text>
            <View style={styles.completionResults}>
              <Text style={[styles.resultItem, { color: colors.text }]}>
                Mood: {getMoodEmoji()} {getMoodLabel()}
              </Text>
              <Text style={[styles.resultItem, { color: colors.text }]}>
                Stress: {stressLevel}/5 - {(questions[1].options.find(opt => opt.value === stressLevel) as any)?.intensity}
              </Text>
              <Text style={[styles.resultItem, { color: colors.text }]}>
                Sleep: {questions[2].options.find(opt => opt.value === anxietyLevel)?.label}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <TouchableOpacity 
          style={[styles.backButton, { backgroundColor: colors.surface }]} 
          onPress={currentQuestion === 0 ? () => onNavigate('main') : handlePrevious}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  backgroundColor: colors.primary,
                  width: `${progress}%` 
                }
              ]} 
            />
          </View>
        </View>
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={[styles.skipText, { color: colors.text }]}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Question Content */}
      <View style={styles.questionContainer}>
        <Text style={[styles.questionTitle, { color: colors.text }]}>{currentQ.title}</Text>
        
        {renderQuestionContent()}
      </View>

      {/* Continue Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[
            styles.continueButton,
            { 
              backgroundColor: isAnswerSelected() ? colors.primary : colors.border,
              opacity: isAnswerSelected() ? 1 : 0.5
            }
          ]}
          onPress={handleNext}
          disabled={!isAnswerSelected()}
        >
          <Text style={[styles.continueButtonText, { color: colors.surface }]}>
            {currentQuestion === questions.length - 1 ? 'Complete' : 'Continue'}
          </Text>
          <Ionicons 
            name={currentQuestion === questions.length - 1 ? "checkmark" : "arrow-forward"} 
            size={20} 
            color={colors.surface} 
          />
        </TouchableOpacity>
      </View>

      {/* Account Popup - Positioned below profile icon */}
      {showAccountPopup && (
        <>
          {/* Overlay to close popup when tapping outside */}
          <TouchableOpacity 
            style={styles.popupOverlay} 
            activeOpacity={1} 
            onPress={() => setShowAccountPopup(false)}
          />
          <View style={styles.popupContainer}>
            <View style={[styles.accountPopup, { backgroundColor: 'rgba(255, 255, 255, 0.95)' }]}>
              {/* Popup Arrow */}
              <View style={[styles.popupArrow, { borderBottomColor: 'rgba(255, 255, 255, 0.95)' }]} />
              
              <View style={styles.popupHeader}>
                <Text style={[styles.popupTitle, { color: '#2C5F5D' }]}>Account</Text>
                <TouchableOpacity onPress={() => setShowAccountPopup(false)}>
                  <Ionicons name="close" size={20} color="#666666" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.userInfo}>
                <View style={[styles.avatar, { backgroundColor: '#2C5F5D' }]}>
                  <Ionicons name="person" size={28} color="#FFFFFF" />
                </View>
                <View style={styles.userDetails}>
                  <Text style={[styles.userName, { color: '#2C5F5D' }]}>Alex Johnson</Text>
                  <Text style={[styles.userEmail, { color: '#666666' }]}>alex.johnson@email.com</Text>
                </View>
              </View>

              <View style={styles.accountOptions}>
                <TouchableOpacity style={[styles.optionItem, { borderBottomColor: 'rgba(0, 0, 0, 0.1)' }]}>
                  <View style={[styles.optionIcon, { backgroundColor: 'rgba(44, 95, 93, 0.1)' }]}>
                    <Ionicons name="settings" size={18} color="#2C5F5D" />
                  </View>
                  <Text style={[styles.optionText, { color: '#2C5F5D' }]}>Manage Account</Text>
                  <Ionicons name="chevron-forward" size={16} color="#999999" />
                </TouchableOpacity>
                
                <TouchableOpacity style={[styles.optionItem, { borderBottomColor: 'rgba(0, 0, 0, 0.1)' }]}>
                  <View style={[styles.optionIcon, { backgroundColor: 'rgba(44, 95, 93, 0.1)' }]}>
                    <Ionicons name="trophy" size={18} color="#2C5F5D" />
                  </View>
                  <Text style={[styles.optionText, { color: '#2C5F5D' }]}>Rewards</Text>
                  <Ionicons name="chevron-forward" size={16} color="#999999" />
                </TouchableOpacity>
                
                <TouchableOpacity style={[styles.optionItem, { borderBottomColor: 'rgba(0, 0, 0, 0.1)' }]}>
                  <View style={[styles.optionIcon, { backgroundColor: 'rgba(44, 95, 93, 0.1)' }]}>
                    <Ionicons name="trending-up" size={18} color="#2C5F5D" />
                  </View>
                  <Text style={[styles.optionText, { color: '#2C5F5D' }]}>Growth</Text>
                  <Ionicons name="chevron-forward" size={16} color="#999999" />
                </TouchableOpacity>
                
                <TouchableOpacity style={[styles.optionItem, { borderBottomWidth: 0 }]}>
                  <View style={[styles.optionIcon, { backgroundColor: 'rgba(255, 68, 68, 0.1)' }]}>
                    <Ionicons name="log-out" size={18} color="#FF4444" />
                  </View>
                  <Text style={[styles.optionText, { color: '#FF4444' }]}>Log Out</Text>
                  <Ionicons name="chevron-forward" size={16} color="#999999" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    flex: 1,
    marginHorizontal: 20,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
  },
  progressFill: {
    height: 6,
    borderRadius: 3,
  },
  skipButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  skipText: {
    fontSize: 16,
    fontWeight: '500',
  },
  questionContainer: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  questionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
  },
  // Rotating Selector Styles
  rotatingSelectorContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  centralMoodCard: {
    width: 200,
    height: 120,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    position: 'relative',
  },
  centralMoodEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  centralMoodText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  moodIndicator: {
    width: 20,
    height: 4,
    borderRadius: 2,
  },
  selectorContainer: {
    width: 300,
    height: 200,
    position: 'relative',
    marginBottom: 30,
  },
  semiCircleBackground: {
    position: 'absolute',
    width: 240,
    height: 120,
    borderTopLeftRadius: 120,
    borderTopRightRadius: 120,
    borderWidth: 3,
    borderBottomWidth: 0,
    top: 80,
    left: 30,
  },
  rotatingContainer: {
    position: 'absolute',
    width: 300,
    height: 200,
  },
  rotatingMoodOption: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  rotatingMoodEmoji: {
    fontSize: 24,
  },
  selectionIndicator: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    bottom: 20,
    left: 146,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  instructionsCard: {
    width: '100%',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  instructionsText: {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
    fontStyle: 'italic',
  },
  moodDescriptionCard: {
    width: '100%',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  moodDescription: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 24,
  },
  // Stress Buttons Styles
  stressButtonsContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  stressDisplayCard: {
    width: 200,
    height: 120,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  stressDisplayNumber: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  stressDisplayLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  stressButtonsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  stressButton: {
    width: 60,
    height: 80,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  stressButtonNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  stressButtonLabel: {
    fontSize: 10,
    textAlign: 'center',
    fontWeight: '500',
  },
  stressDescriptionCard: {
    width: '100%',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  stressDescription: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 24,
  },
  // Sleep Cards Styles
  sleepCardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  sleepCard: {
    width: (width - 60) / 2,
    height: 180,
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    position: 'relative',
  },
  sleepCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sleepCardEmoji: {
    fontSize: 32,
  },
  sleepCardIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  sleepCardContent: {
    flex: 1,
    justifyContent: 'center',
  },
  sleepCardLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  sleepCardHours: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  sleepCardEnergy: {
    fontSize: 12,
    fontWeight: '400',
  },
  sleepCardSelected: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  // Button Styles
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  // Account Popup Styles
  popupOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
  },
  popupContainer: {
    position: 'absolute',
    top: 110,
    right: 20,
    zIndex: 1000,
  },
  accountPopup: {
    width: 280,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  popupArrow: {
    position: 'absolute',
    top: -8,
    right: 30,
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  popupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  popupTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 13,
  },
  accountOptions: {
    marginTop: 8,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  optionIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  optionText: {
    fontSize: 15,
    fontWeight: '500',
    flex: 1,
  },
  // Completion Screen Styles
  completionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  completionCard: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
  },
  completionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 12,
    textAlign: 'center',
  },
  completionMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  completionResults: {
    width: '100%',
    gap: 12,
  },
  resultItem: {
    fontSize: 16,
    fontWeight: '500',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    textAlign: 'center',
  },
});

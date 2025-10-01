import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Dimensions, PanResponder, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';

const { width } = Dimensions.get('window');

interface MoodTrackerProps {
  onNavigate: (screen: string) => void;
}

export default function MoodTracker({ onNavigate }: MoodTrackerProps) {
  const { colors, theme } = useTheme();
  const { t } = useLanguage();
  const [showAccountPopup, setShowAccountPopup] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [moodRating, setMoodRating] = useState(3);
  const [stressLevel, setStressLevel] = useState(3);
  const [anxietyLevel, setAnxietyLevel] = useState('');

  const questions = [
    {
      id: 1,
      title: t('moodTracker.question1'),
      type: 'mood',
      options: [
        { value: 1, emoji: '😢', label: 'Very Sad', color: colors.error },
        { value: 2, emoji: '😔', label: 'Sad', color: '#FF9800' },
        { value: 3, emoji: '😐', label: 'Neutral', color: colors.warning },
        { value: 4, emoji: '😊', label: 'Happy', color: colors.success },
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
        { value: 'excellent', label: 'Excellent', hours: '7-9 HOURS', emoji: '😊', color: colors.success, energy: 'High Energy' },
        { value: 'good', label: 'Good', hours: '6-7 HOURS', emoji: '😌', color: colors.primary, energy: 'Good Energy' },
        { value: 'fair', label: 'Fair', hours: '4-5 HOURS', emoji: '😐', color: colors.warning, energy: 'Low Energy' },
        { value: 'poor', label: 'Poor', hours: '2-3 HOURS', emoji: '😴', color: colors.error, energy: 'Very Low Energy' }
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
      // Reset form
      setCurrentQuestion(0);
      setMoodRating(3);
      setStressLevel(3);
      setAnxietyLevel('');
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
    return mood ? mood.emoji : '😐';
  };

  const getMoodLabel = () => {
    const mood = questions[0].options.find(opt => opt.value === moodRating);
    return mood ? `I Feel ${mood.label}.` : 'I Feel Neutral.';
  };

  const getStressDescription = () => {
    const stress = questions[1].options.find(opt => opt.value === stressLevel);
    return stress ? stress.description : '';
  };

  const renderMoodSlider = () => {
    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        const { locationX } = evt.nativeEvent;
        const sliderWidth = width - 100;
        const segmentWidth = sliderWidth / 4;
        const relativeX = locationX - 50;
        const newRating = Math.round(relativeX / segmentWidth) + 1;
        const clampedRating = Math.max(1, Math.min(5, newRating));
        setMoodRating(clampedRating);
      },
      onPanResponderMove: (evt) => {
        const { locationX } = evt.nativeEvent;
        const sliderWidth = width - 100;
        const segmentWidth = sliderWidth / 4;
        const relativeX = locationX - 50;
        const newRating = Math.round(relativeX / segmentWidth) + 1;
        const clampedRating = Math.max(1, Math.min(5, newRating));
        setMoodRating(clampedRating);
      },
    });

    return (
      <View style={styles.moodSliderContainer}>
        {/* Current Mood Display */}
        <View style={[styles.currentMoodCard, { backgroundColor: colors.surface }]}>
          <Text style={styles.currentMoodEmoji}>{getMoodEmoji()}</Text>
          <Text style={[styles.currentMoodText, { color: colors.text }]}>
            {questions[0].options.find(opt => opt.value === moodRating)?.label}
          </Text>
        </View>
        
        {/* Mood Slider */}
        <View style={styles.moodSlider} {...panResponder.panHandlers}>
          <View style={styles.moodTrack}>
            {questions[0].options.map((option, index) => (
              <View
                key={option.value}
                style={[
                  styles.moodTrackSegment,
                  {
                    backgroundColor: moodRating >= option.value ? option.color : colors.border,
                    opacity: moodRating >= option.value ? 1 : 0.3,
                  }
                ]}
              />
            ))}
          </View>
          
          {/* Slider Handle */}
          <View style={[
            styles.moodHandle,
            {
              left: (moodRating - 1) * (width - 140) / 4 + 50,
              backgroundColor: colors.primary,
            }
          ]}>
            <Text style={styles.moodHandleEmoji}>{getMoodEmoji()}</Text>
          </View>
        </View>
        
        {/* Mood Labels */}
        <View style={styles.moodLabels}>
          {questions[0].options.map((option) => (
            <Text
              key={option.value}
              style={[
                styles.moodLabel,
                { 
                  color: moodRating === option.value ? colors.primary : colors.textSecondary,
                  fontWeight: moodRating === option.value ? 'bold' : 'normal'
                }
              ]}
            >
              {option.label}
            </Text>
          ))}
        </View>
      </View>
    );
  };

  const renderStressWave = () => {
    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        const { locationX } = evt.nativeEvent;
        const sliderWidth = width - 100;
        const segmentWidth = sliderWidth / 4;
        const relativeX = locationX - 50;
        const newLevel = Math.round(relativeX / segmentWidth) + 1;
        const clampedLevel = Math.max(1, Math.min(5, newLevel));
        setStressLevel(clampedLevel);
      },
      onPanResponderMove: (evt) => {
        const { locationX } = evt.nativeEvent;
        const sliderWidth = width - 100;
        const segmentWidth = sliderWidth / 4;
        const relativeX = locationX - 50;
        const newLevel = Math.round(relativeX / segmentWidth) + 1;
        const clampedLevel = Math.max(1, Math.min(5, newLevel));
        setStressLevel(clampedLevel);
      },
    });

    return (
      <View style={styles.stressWaveContainer}>
        {/* Stress Level Display */}
        <View style={[styles.stressLevelCard, { backgroundColor: colors.surface }]}>
          <Text style={[styles.stressLevelNumber, { color: colors.primary }]}>{stressLevel}</Text>
          <Text style={[styles.stressLevelLabel, { color: colors.text }]}>
            {questions[1].options.find(opt => opt.value === stressLevel)?.intensity}
          </Text>
        </View>
        
        {/* Wave Slider */}
        <View style={styles.waveSlider} {...panResponder.panHandlers}>
          <View style={styles.waveTrack}>
            {questions[1].options.map((option, index) => (
              <View
                key={option.value}
                style={[
                  styles.waveSegment,
                  {
                    backgroundColor: stressLevel >= option.value ? colors.primary : colors.border,
                    opacity: stressLevel >= option.value ? 1 : 0.3,
                  }
                ]}
              />
            ))}
          </View>
          
          {/* Slider Handle */}
          <View style={[
            styles.waveHandle,
            {
              left: (stressLevel - 1) * (width - 140) / 4 + 50,
              backgroundColor: colors.primary,
            }
          ]}>
            <View style={[styles.handleGlow, { backgroundColor: colors.primary }]} />
            <Text style={styles.handleNumber}>{stressLevel}</Text>
          </View>
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
            onPress={() => setAnxietyLevel(option.value)}
          >
            <View style={styles.sleepCardHeader}>
              <Text style={[
                styles.sleepCardEmoji,
                { color: anxietyLevel === option.value ? '#FFFFFF' : colors.text }
              ]}>
                {option.emoji}
              </Text>
              <View style={[
                styles.sleepCardIndicator,
                { backgroundColor: anxietyLevel === option.value ? '#FFFFFF' : option.color }
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
                {option.hours}
              </Text>
              <Text style={[
                styles.sleepCardEnergy,
                { color: anxietyLevel === option.value ? 'rgba(255, 255, 255, 0.9)' : colors.textSecondary }
              ]}>
                {option.energy}
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
        return renderMoodWheel();
      case 'stress':
        return renderStressWave();
      case 'sleep':
        return renderSleepCards();
      default:
        return null;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <TouchableOpacity style={[styles.backButton, { backgroundColor: colors.surface }]} onPress={() => onNavigate('main')}>
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
        <TouchableOpacity style={styles.skipButton}>
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
  // Mood Wheel Styles
  moodWheelContainer: {
    height: 400,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centralMoodDisplay: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 10,
  },
  centralEmoji: {
    fontSize: 56,
    marginBottom: 6,
  },
  centralLabel: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  backgroundCircle: {
    position: 'absolute',
    width: 320,
    height: 240,
    borderRadius: 160,
    borderWidth: 2,
    borderStyle: 'dashed',
    opacity: 0.3,
  },
  moodIndicators: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  floatingMoodIndicator: {
    position: 'absolute',
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 12,
  },
  floatingMoodEmoji: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  // Stress Wave Styles
  stressWaveContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  stressLevelCard: {
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
  stressLevelNumber: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  stressLevelLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  waveSlider: {
    width: '100%',
    height: 80,
    position: 'relative',
    marginBottom: 30,
    paddingHorizontal: 50,
  },
  waveTrack: {
    flexDirection: 'row',
    height: 24,
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 28,
  },
  waveSegment: {
    flex: 1,
    height: 24,
  },
  waveHandle: {
    position: 'absolute',
    top: 0,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
  },
  handleGlow: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    opacity: 0.2,
  },
  handleNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
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
});

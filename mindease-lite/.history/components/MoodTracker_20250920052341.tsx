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
  const [isFormComplete, setIsFormComplete] = useState(false);

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
      setIsFormComplete(true);
      // Don't reset form - keep results
    }
  };

  const handleSkip = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setIsFormComplete(true);
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
      onPanResponderGrant: (evt, gestureState) => {
        const { locationX } = evt.nativeEvent;
        const sliderWidth = width - 120;
        const relativeX = locationX - 60;
        const percentage = Math.max(0, Math.min(1, relativeX / sliderWidth));
        // Create more stops (20 stops instead of 4)
        const newRating = Math.round((1 + (percentage * 4)) * 5) / 5;
        setMoodRating(newRating);
      },
      onPanResponderMove: (evt, gestureState) => {
        const { locationX } = evt.nativeEvent;
        const sliderWidth = width - 120;
        const relativeX = locationX - 60;
        const percentage = Math.max(0, Math.min(1, relativeX / sliderWidth));
        // Create more stops (20 stops instead of 4)
        const newRating = Math.round((1 + (percentage * 4)) * 5) / 5;
        setMoodRating(newRating);
      },
      onPanResponderRelease: () => {
        // Optional: Add haptic feedback or sound here
      },
    });

    // Calculate current mood based on continuous value
    const getCurrentMood = () => {
      if (moodRating <= 1.5) return questions[0].options[0]; // Very Sad
      if (moodRating <= 2.5) return questions[0].options[1]; // Sad
      if (moodRating <= 3.5) return questions[0].options[2]; // Neutral
      if (moodRating <= 4.5) return questions[0].options[3]; // Happy
      return questions[0].options[4]; // Very Happy
    };

    const currentMood = getCurrentMood();
    const sliderPosition = ((moodRating - 1) / 4) * (width - 140) + 50;

    return (
      <View style={styles.moodSliderContainer}>
        {/* Current Mood Display */}
        <View style={[styles.currentMoodCard, { backgroundColor: colors.surface }]}>
          <Text style={styles.currentMoodEmoji}>{currentMood.emoji}</Text>
          <Text style={[styles.currentMoodText, { color: colors.text }]}>
            {currentMood.label}
          </Text>
          <Text style={[styles.moodIntensity, { color: colors.textSecondary }]}>
            {moodRating.toFixed(1)}/5.0
          </Text>
        </View>
        
        {/* Continuous Mood Slider */}
        <View style={styles.moodSlider} {...panResponder.panHandlers}>
          {/* Background Track */}
          <View style={styles.moodTrack}>
            {/* Gradient Fill */}
            <View style={[styles.moodTrackFill, { 
              width: `${((moodRating - 1) / 4) * 100}%`,
              backgroundColor: currentMood.color
            }]} />
            
            {/* Mood Markers */}
            <View style={styles.moodMarkers}>
              {questions[0].options.map((option, index) => (
                <View
                  key={option.value}
                  style={[
                    styles.moodMarker,
                    {
                      left: `${(index / 4) * 100}%`,
                      backgroundColor: moodRating >= (index + 1) ? option.color : colors.border,
                    }
                  ]}
                />
              ))}
            </View>
          </View>
          
          {/* Slider Handle */}
          <View style={[
            styles.moodHandle,
            {
              left: sliderPosition - 28,
              backgroundColor: currentMood.color,
              transform: [{ scale: 1.1 }],
            }
          ]}>
            <Text style={styles.moodHandleEmoji}>{currentMood.emoji}</Text>
            <View style={[styles.handleGlow, { backgroundColor: currentMood.color }]} />
          </View>
        </View>
        
        {/* Mood Scale Labels */}
        <View style={styles.moodScaleLabels}>
          <Text style={[styles.scaleLabel, { color: colors.textSecondary }]}>Very Sad</Text>
          <Text style={[styles.scaleLabel, { color: colors.textSecondary }]}>Neutral</Text>
          <Text style={[styles.scaleLabel, { color: colors.textSecondary }]}>Very Happy</Text>
        </View>
        
        {/* Mood Intensity Indicator */}
        <View style={[styles.moodIntensityBar, { backgroundColor: colors.surface }]}>
          <View style={[styles.intensityFill, { 
            width: `${((moodRating - 1) / 4) * 100}%`,
            backgroundColor: currentMood.color
          }]} />
          <Text style={[styles.intensityText, { color: colors.text }]}>
            Mood Intensity: {Math.round(((moodRating - 1) / 4) * 100)}%
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
            {questions[1].options.find(opt => opt.value === stressLevel)?.intensity}
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
              onPress={() => setStressLevel(option.value)}
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
        return renderMoodSlider();
      case 'stress':
        return renderStressButtons();
      case 'sleep':
        return renderSleepCards();
      default:
        return null;
    }
  };

  // Show completion screen if form is complete
  if (isFormComplete) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.completionContainer}>
          <View style={[styles.completionIcon, { backgroundColor: colors.primary }]}>
            <Ionicons name="checkmark" size={48} color={colors.surface} />
          </View>
          <Text style={[styles.completionTitle, { color: colors.text }]}>
            Mood Tracking Complete!
          </Text>
          <Text style={[styles.completionSubtitle, { color: colors.textSecondary }]}>
            Thank you for sharing your mood. Your responses have been recorded.
          </Text>
          
          <View style={styles.resultsContainer}>
            <Text style={[styles.resultsTitle, { color: colors.text }]}>Your Results:</Text>
            <View style={[styles.resultItem, { backgroundColor: colors.surface }]}>
              <Text style={[styles.resultLabel, { color: colors.text }]}>Mood:</Text>
              <Text style={[styles.resultValue, { color: colors.primary }]}>
                {questions[0].options.find(opt => opt.value === moodRating)?.label}
              </Text>
            </View>
            <View style={[styles.resultItem, { backgroundColor: colors.surface }]}>
              <Text style={[styles.resultLabel, { color: colors.text }]}>Stress Level:</Text>
              <Text style={[styles.resultValue, { color: colors.primary }]}>
                {questions[1].options.find(opt => opt.value === stressLevel)?.intensity}
              </Text>
            </View>
            <View style={[styles.resultItem, { backgroundColor: colors.surface }]}>
              <Text style={[styles.resultLabel, { color: colors.text }]}>Sleep Quality:</Text>
              <Text style={[styles.resultValue, { color: colors.primary }]}>
                {questions[2].options.find(opt => opt.value === anxietyLevel)?.label}
              </Text>
            </View>
          </View>
          
          <TouchableOpacity 
            style={[styles.doneButton, { backgroundColor: colors.primary }]}
            onPress={() => onNavigate('main')}
          >
            <Text style={[styles.doneButtonText, { color: colors.surface }]}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <TouchableOpacity style={[styles.headerBackButton, { backgroundColor: colors.surface }]} onPress={() => onNavigate('main')}>
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

      {/* Navigation Buttons */}
      <View style={styles.buttonContainer}>
        {/* Back Button */}
        {currentQuestion > 0 && (
          <TouchableOpacity 
            style={[styles.navBackButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={handlePrevious}
          >
            <Ionicons name="arrow-back" size={20} color={colors.text} />
            <Text style={[styles.backButtonText, { color: colors.text }]}>Back</Text>
          </TouchableOpacity>
        )}
        
        {/* Continue Button */}
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
  headerBackButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navBackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
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
  // Mood Slider Styles
  moodSliderContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  currentMoodCard: {
    width: 220,
    height: 140,
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
  currentMoodEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  currentMoodText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  moodIntensity: {
    fontSize: 14,
    fontWeight: '500',
  },
  moodSlider: {
    width: '100%',
    height: 100,
    position: 'relative',
    marginBottom: 20,
    paddingHorizontal: 50,
    paddingVertical: 20,
  },
  moodTrack: {
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
    marginTop: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  moodTrackFill: {
    height: 32,
    borderRadius: 16,
    opacity: 0.8,
  },
  moodMarkers: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 32,
  },
  moodMarker: {
    position: 'absolute',
    top: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: -4,
  },
  moodHandle: {
    position: 'absolute',
    top: 10,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
    zIndex: 10,
  },
  moodHandleEmoji: {
    fontSize: 26,
    zIndex: 2,
  },
  handleGlow: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    opacity: 0.2,
    zIndex: 1,
  },
  moodScaleLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 50,
    marginBottom: 20,
  },
  scaleLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  moodIntensityBar: {
    width: '100%',
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  intensityFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: 40,
    borderRadius: 20,
    opacity: 0.2,
  },
  intensityText: {
    fontSize: 14,
    fontWeight: '600',
    zIndex: 1,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 16,
  },
  continueButton: {
    flex: 1,
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
    paddingHorizontal: 40,
  },
  completionIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  completionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  completionSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  resultsContainer: {
    width: '100%',
    marginBottom: 40,
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  resultItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resultLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  resultValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  doneButton: {
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  doneButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
});

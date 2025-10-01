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

  const renderMoodWheel = () => {
    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        const centerX = width / 2;
        const centerY = 150;
        const angle = Math.atan2(locationY - centerY, locationX - centerX);
        const normalizedAngle = (angle + Math.PI) / (2 * Math.PI);
        const newRating = Math.round(normalizedAngle * 5) + 1;
        const clampedRating = Math.max(1, Math.min(5, newRating));
        setMoodRating(clampedRating);
      },
      onPanResponderMove: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        const centerX = width / 2;
        const centerY = 150;
        const angle = Math.atan2(locationY - centerY, locationX - centerX);
        const normalizedAngle = (angle + Math.PI) / (2 * Math.PI);
        const newRating = Math.round(normalizedAngle * 5) + 1;
        const clampedRating = Math.max(1, Math.min(5, newRating));
        setMoodRating(clampedRating);
      },
    });

    return (
      <View style={styles.moodWheelContainer} {...panResponder.panHandlers}>
        {/* Circular Mood Wheel */}
        <View style={styles.moodWheel}>
          {questions[0].options.map((option, index) => {
            const angle = (index * 72) - 90; // 72 degrees per segment
            const radius = 80;
            const x = Math.cos(angle * Math.PI / 180) * radius;
            const y = Math.sin(angle * Math.PI / 180) * radius;
            
            return (
              <View
                key={option.value}
                style={[
                  styles.moodSegment,
                  {
                    transform: [{ rotate: `${angle}deg` }],
                    backgroundColor: option.color,
                    opacity: moodRating === option.value ? 1 : 0.3,
                  }
                ]}
              />
            );
          })}
        </View>
        
        {/* Central Mood Display */}
        <View style={[styles.centralMoodDisplay, { backgroundColor: colors.surface }]}>
          <Text style={styles.centralEmoji}>{getMoodEmoji()}</Text>
          <Text style={[styles.centralLabel, { color: colors.text }]}>
            {questions[0].options.find(opt => opt.value === moodRating)?.label}
          </Text>
        </View>
        
        {/* Mood Indicators */}
        <View style={styles.moodIndicators}>
          {questions[0].options.map((option, index) => {
            const angle = (index * 72) - 90;
            const radius = 120;
            const x = Math.cos(angle * Math.PI / 180) * radius;
            const y = Math.sin(angle * Math.PI / 180) * radius;
            
            return (
              <View
                key={option.value}
                style={[
                  styles.moodIndicator,
                  {
                    left: width / 2 + x - 20,
                    top: 150 + y - 20,
                    backgroundColor: moodRating === option.value ? colors.primary : colors.border,
                  }
                ]}
              >
                <Text style={styles.moodIndicatorEmoji}>{option.emoji}</Text>
              </View>
            );
          })}
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
        const sliderWidth = width - 80;
        const segmentWidth = sliderWidth / 4;
        const newLevel = Math.round((locationX - 40) / segmentWidth) + 1;
        const clampedLevel = Math.max(1, Math.min(5, newLevel));
        setStressLevel(clampedLevel);
      },
      onPanResponderMove: (evt) => {
        const { locationX } = evt.nativeEvent;
        const sliderWidth = width - 80;
        const segmentWidth = sliderWidth / 4;
        const newLevel = Math.round((locationX - 40) / segmentWidth) + 1;
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
              left: (stressLevel - 1) * (width - 120) / 4 + 40,
              backgroundColor: colors.primary,
            }
          ]}>
            <View style={[styles.handleGlow, { backgroundColor: colors.primary }]} />
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
        return renderMoodArc();
      case 'stress':
        return renderStressSlider();
      case 'sleep':
        return renderSleepSlider();
      default:
        return null;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: '#2C221E' }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => onNavigate('main')}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${progress}%` }
              ]} 
            />
          </View>
        </View>
        <TouchableOpacity style={styles.skipButton}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Question Content */}
      <View style={styles.questionContainer}>
        <Text style={styles.questionTitle}>{currentQ.title}</Text>
        
        {currentQ.type === 'mood' && (
          <>
            <Text style={styles.moodResponse}>{getMoodLabel()}</Text>
            <Text style={styles.moodEmojiLarge}>{getMoodEmoji()}</Text>
            <View style={styles.chevronIndicator}>
              <Ionicons name="chevron-down" size={20} color="#FFFFFF" />
            </View>
          </>
        )}
        
        {renderQuestionContent()}
      </View>

      {/* Continue Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[
            styles.continueButton,
            { backgroundColor: isAnswerSelected() ? '#A0522D' : '#6D4C41' }
          ]}
          onPress={handleNext}
          disabled={!isAnswerSelected()}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
          <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
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
    backgroundColor: '#2C221E',
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
    backgroundColor: '#6D4C41',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    flex: 1,
    marginHorizontal: 20,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#6D4C41',
    borderRadius: 2,
  },
  progressFill: {
    height: 4,
    backgroundColor: '#8BC34A',
    borderRadius: 2,
  },
  skipButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  skipText: {
    color: '#FFFFFF',
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
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  moodResponse: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  moodEmojiLarge: {
    fontSize: 80,
    textAlign: 'center',
    marginBottom: 20,
  },
  chevronIndicator: {
    alignItems: 'center',
    marginBottom: 40,
  },
  // Mood Arc Styles
  moodArcContainer: {
    height: 200,
    position: 'relative',
  },
  arcBackground: {
    position: 'absolute',
    bottom: 0,
    left: 20,
    right: 20,
    height: 100,
    flexDirection: 'row',
    borderRadius: 50,
    overflow: 'hidden',
  },
  arcSegment: {
    flex: 1,
    height: 100,
  },
  arcEmojis: {
    position: 'absolute',
    bottom: 120,
    left: 0,
    right: 0,
    height: 40,
  },
  arcEmoji: {
    position: 'absolute',
    fontSize: 24,
    top: 0,
  },
  sliderHandle: {
    position: 'absolute',
    bottom: 80,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  handlePointer: {
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 12,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#6D4C41',
  },
  // Stress Slider Styles
  stressContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  stressNumberDisplay: {
    marginBottom: 40,
  },
  stressNumber: {
    fontSize: 120,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  stressOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 30,
  },
  stressOption: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#6D4C41',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stressOptionText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  stressDescription: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '500',
  },
  // Sleep Slider Styles
  sleepContainer: {
    flexDirection: 'row',
    height: 300,
    marginTop: 40,
  },
  sleepOptions: {
    flex: 1,
    justifyContent: 'space-between',
    paddingRight: 20,
  },
  sleepOptionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 60,
  },
  sleepOptionText: {
    flex: 1,
  },
  sleepLabel: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  sleepHours: {
    fontSize: 14,
    color: '#CCCCCC',
    marginTop: 4,
  },
  sleepEmoji: {
    fontSize: 32,
    marginLeft: 20,
  },
  sleepSlider: {
    width: 60,
    alignItems: 'center',
    position: 'relative',
  },
  sliderTrack: {
    width: 4,
    height: 240,
    backgroundColor: '#6D4C41',
    borderRadius: 2,
  },
  sliderHandleVertical: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E5734D',
    justifyContent: 'center',
    alignItems: 'center',
    left: -18,
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
    borderRadius: 12,
    gap: 8,
  },
  continueButtonText: {
    color: '#FFFFFF',
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

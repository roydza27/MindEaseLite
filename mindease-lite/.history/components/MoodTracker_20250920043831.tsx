import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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

  const questions = [
    {
      id: 1,
      title: t('moodTracker.question1'),
      type: 'mood',
      options: [
        { value: 1, emoji: '😢', label: 'Very Sad' },
        { value: 2, emoji: '😔', label: 'Sad' },
        { value: 3, emoji: '😐', label: 'Neutral' },
        { value: 4, emoji: '😊', label: 'Happy' },
        { value: 5, emoji: '😄', label: 'Very Happy' }
      ]
    },
    {
      id: 2,
      title: t('moodTracker.question2'),
      type: 'stress',
      options: [
        { value: 1, label: 'Not at all' },
        { value: 2, label: 'A little' },
        { value: 3, label: 'Moderately' },
        { value: 4, label: 'Quite a bit' },
        { value: 5, label: 'Extremely' }
      ]
    },
    {
      id: 3,
      title: t('moodTracker.question3'),
      type: 'anxiety',
      options: [
        { value: 'low', label: 'Low' },
        { value: 'mild', label: 'Mild' },
        { value: 'moderate', label: 'Moderate' },
        { value: 'high', label: 'High' }
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
        anxiety: anxietyLevel
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
    } else if (currentQ.type === 'anxiety') {
      setAnxietyLevel(value);
    }
  };

  const getSelectedValue = () => {
    if (currentQ.type === 'mood') return moodRating;
    if (currentQ.type === 'stress') return stressLevel;
    if (currentQ.type === 'anxiety') return anxietyLevel;
    return null;
  };

  const isAnswerSelected = () => {
    const selected = getSelectedValue();
    return selected !== null && selected !== '';
  };

  const renderMoodOptions = () => (
    <View style={styles.optionsContainer}>
      {currentQ.options.map((option) => (
        <TouchableOpacity
          key={option.value}
          style={[
            styles.moodOption,
            { borderColor: colors.border },
            moodRating === option.value && { 
              backgroundColor: colors.primary,
              borderColor: colors.primary 
            }
          ]}
          onPress={() => handleOptionSelect(option.value)}
        >
          <Text style={styles.moodEmoji}>{option.emoji}</Text>
          <Text style={[
            styles.moodLabel,
            { color: colors.text },
            moodRating === option.value && { color: '#FFFFFF' }
          ]}>
            {option.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderStressOptions = () => (
    <View style={styles.stressContainer}>
      <View style={styles.stressSlider}>
        {currentQ.options.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.stressOption,
              { borderColor: colors.border },
              stressLevel === option.value && { 
                backgroundColor: colors.primary,
                borderColor: colors.primary 
              }
            ]}
            onPress={() => handleOptionSelect(option.value)}
          >
            <Text style={[
              styles.stressLabel,
              { color: colors.text },
              stressLevel === option.value && { color: '#FFFFFF' }
            ]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderAnxietyOptions = () => (
    <View style={styles.anxietyGrid}>
      {currentQ.options.map((option) => (
        <TouchableOpacity
          key={option.value}
          style={[
            styles.anxietyOption,
            { borderColor: colors.border },
            anxietyLevel === option.value && { 
              backgroundColor: colors.primary,
              borderColor: colors.primary 
            }
          ]}
          onPress={() => handleOptionSelect(option.value)}
        >
          <Text style={[
            styles.anxietyLabel,
            { color: colors.text },
            anxietyLevel === option.value && { color: '#FFFFFF' }
          ]}>
            {option.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderQuestionContent = () => {
    switch (currentQ.type) {
      case 'mood':
        return renderMoodOptions();
      case 'stress':
        return renderStressOptions();
      case 'anxiety':
        return renderAnxietyOptions();
      default:
        return null;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => onNavigate('main')}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Mood & Well-being</Text>
        <TouchableOpacity style={styles.profileContainer} onPress={() => setShowAccountPopup(true)}>
          <View style={styles.profileIcon}>
            <Ionicons name="person" size={24} color="#FFFFFF" />
          </View>
          <View style={styles.notificationDot} />
        </TouchableOpacity>
      </View>

      {/* Progress Bar */}
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
        <Text style={[styles.progressText, { color: colors.textSecondary }]}>
          Question {currentQuestion + 1} of {questions.length}
        </Text>
      </View>

      {/* Question Card */}
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
        <View style={[styles.questionCard, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.questionTitle, { color: colors.text }]}>
            {currentQ.title}
          </Text>
          
          {renderQuestionContent()}
        </View>
      </ScrollView>

      {/* Navigation Buttons */}
      <View style={styles.navigationContainer}>
        {currentQuestion > 0 && (
          <TouchableOpacity 
            style={[styles.navButton, styles.previousButton, { borderColor: colors.border }]}
            onPress={handlePrevious}
          >
            <Ionicons name="arrow-back" size={20} color={colors.text} />
            <Text style={[styles.navButtonText, { color: colors.text }]}>Previous</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity 
          style={[
            styles.navButton, 
            styles.nextButton, 
            { backgroundColor: isAnswerSelected() ? colors.primary : colors.border }
          ]}
          onPress={handleNext}
          disabled={!isAnswerSelected()}
        >
          <Text style={[
            styles.navButtonText, 
            { color: isAnswerSelected() ? '#FFFFFF' : colors.textSecondary }
          ]}>
            {currentQuestion === questions.length - 1 ? 'Submit' : 'Next'}
          </Text>
          <Ionicons 
            name={currentQuestion === questions.length - 1 ? "checkmark" : "arrow-forward"} 
            size={20} 
            color={isAnswerSelected() ? '#FFFFFF' : colors.textSecondary} 
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
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 20,
  },
  profileContainer: {
    position: 'relative',
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFB6C1',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  notificationDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FF4444',
  },
  progressContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: 8,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    textAlign: 'center',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  questionCard: {
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  questionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 32,
    textAlign: 'center',
  },
  // Mood Options
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  moodOption: {
    width: (width - 80) / 5,
    aspectRatio: 1,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  moodEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  moodLabel: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  // Stress Options
  stressContainer: {
    marginTop: 20,
  },
  stressSlider: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stressOption: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 2,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  stressLabel: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  // Anxiety Options
  anxietyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  anxietyOption: {
    width: (width - 80) / 2 - 8,
    paddingVertical: 20,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    marginBottom: 16,
  },
  anxietyLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  // Navigation
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 30,
    paddingTop: 20,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    minWidth: 120,
    justifyContent: 'center',
  },
  previousButton: {
    borderWidth: 2,
    backgroundColor: 'transparent',
  },
  nextButton: {
    marginLeft: 'auto',
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 8,
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

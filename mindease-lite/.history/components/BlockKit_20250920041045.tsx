import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';

const { width } = Dimensions.get('window');

interface BlockKitProps {
  onNavigate: (screen: string) => void;
}

export default function BlockKit({ onNavigate }: BlockKitProps) {
  const { colors, isDark } = useTheme();
  const { t } = useLanguage();
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState(30); // minutes
  const [timeLeft, setTimeLeft] = useState(0);
  const [sessionCount] = useState(1);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [showAccountPopup, setShowAccountPopup] = useState(false);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  const presets = [15, 30, 120, 300]; // 15 min, 30 min, 2 hours, 5 hours
  const presetLabels = [t('blockkit.fifteenMinutes'), t('blockkit.thirtyMinutes'), t('blockkit.twoHours'), t('blockkit.fiveHours')];

  useEffect(() => {
    if (isTimerActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsTimerActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isTimerActive, timeLeft]);

  // Animation effects
  useEffect(() => {
    if (isTimerActive) {
      // Pulse animation
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      
      // Rotation animation
      const rotateAnimation = Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        })
      );

      // Glow animation
      const glowAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: false,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: false,
          }),
        ])
      );

      pulseAnimation.start();
      rotateAnimation.start();
      glowAnimation.start();

      return () => {
        pulseAnimation.stop();
        rotateAnimation.stop();
        glowAnimation.stop();
      };
    } else {
      pulseAnim.setValue(1);
      rotateAnim.setValue(0);
      glowAnim.setValue(0);
    }
  }, [isTimerActive, pulseAnim, rotateAnim, glowAnim]);

  const startTimer = () => {
    setTimeLeft(selectedDuration * 60);
    setEndTime(new Date(Date.now() + selectedDuration * 60 * 1000));
    setIsTimerActive(true);
  };

  const stopTimer = () => {
    setIsTimerActive(false);
    setTimeLeft(0);
    setEndTime(null);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  if (isTimerActive) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.background }]}>
          <Text style={[styles.title, { color: colors.text }]}>{t('blockkit.title')}</Text>
          <TouchableOpacity style={styles.profileContainer} onPress={() => setShowAccountPopup(true)}>
            <View style={styles.profileIcon}>
              <Ionicons name="person" size={24} color="#FFFFFF" />
            </View>
            <View style={styles.notificationDot} />
          </TouchableOpacity>
        </View>

        {/* Funky Timer Display */}
        <View style={styles.timerContainer}>
          <Animated.View 
            style={[
              styles.timerCircle,
              { 
                backgroundColor: colors.primary,
                transform: [{ scale: pulseAnim }],
                shadowColor: colors.primary,
                shadowOpacity: glowOpacity,
                shadowRadius: 20,
                elevation: 20,
              }
            ]}
          >
            <Animated.View 
              style={[
                styles.innerCircle,
                { 
                  backgroundColor: colors.surface,
                  transform: [{ rotate }]
                }
              ]}
            >
              <Text style={[styles.timerText, { color: colors.text }]}>
                {formatTime(timeLeft)}
              </Text>
              <Text style={[styles.timerLabel, { color: colors.textSecondary }]}>
                {t('blockkit.normal')}
              </Text>
            </Animated.View>
          </Animated.View>

          {/* Progress Ring */}
          <View style={styles.progressRing}>
            <View 
              style={[
                styles.progressFill,
                { 
                  backgroundColor: colors.accent,
                  width: `${((selectedDuration * 60 - timeLeft) / (selectedDuration * 60)) * 100}%`
                }
              ]} 
            />
          </View>
        </View>

        {/* Session Info */}
        <View style={[styles.sessionInfo, { backgroundColor: colors.cardBackground }]}>
          <View style={styles.sessionItem}>
            <Ionicons name="time" size={20} color={colors.primary} />
            <Text style={[styles.sessionText, { color: colors.text }]}>
              {endTime ? endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
            </Text>
          </View>
          <View style={styles.sessionItem}>
            <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
            <Text style={[styles.sessionText, { color: colors.text }]}>
              Session {sessionCount}
            </Text>
          </View>
        </View>

        {/* Stop Button */}
        <TouchableOpacity style={[styles.stopButton, { backgroundColor: colors.primary }]} onPress={stopTimer}>
          <Ionicons name="stop" size={24} color="#FFFFFF" />
          <Text style={styles.stopButtonText}>Stop Session</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.text }]}>{t('blockkit.title')}</Text>
        <TouchableOpacity style={styles.profileContainer} onPress={() => setShowAccountPopup(true)}>
          <View style={styles.profileIcon}>
            <Ionicons name="person" size={24} color="#FFFFFF" />
          </View>
          <View style={styles.notificationDot} />
        </TouchableOpacity>
      </View>

      {/* Main Timer Display */}
      <View style={styles.mainTimerContainer}>
        <View style={[styles.timerDisplay, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.mainTimer, { color: colors.text }]}>
            {formatTime(selectedDuration * 60)}
          </Text>
          <View style={styles.timerControls}>
            <TouchableOpacity 
              style={[styles.controlButton, { backgroundColor: colors.primary }]}
              onPress={() => setSelectedDuration(Math.min(300, selectedDuration + 5))}
            >
              <Ionicons name="add" size={20} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.controlButton, { backgroundColor: colors.primary }]}
              onPress={() => setSelectedDuration(Math.max(5, selectedDuration - 5))}
            >
              <Ionicons name="remove" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Preset Buttons */}
      <View style={styles.presetsContainer}>
        {presetLabels.map((label, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.presetButton,
              { backgroundColor: colors.cardBackground },
              selectedDuration === presets[index] && { backgroundColor: colors.primary }
            ]}
            onPress={() => setSelectedDuration(presets[index])}
          >
            <Text style={[
              styles.presetButtonText,
              { color: colors.text },
              selectedDuration === presets[index] && { color: '#FFFFFF' }
            ]}>
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Start Button */}
      <TouchableOpacity 
        style={[styles.startButton, { backgroundColor: colors.primary }]} 
        onPress={startTimer}
      >
        <Ionicons name="play" size={24} color="#FFFFFF" />
        <Text style={styles.startButtonText}>{t('blockkit.startTimer')}</Text>
      </TouchableOpacity>

      {/* Account Popup Modal */}
      <Modal
        visible={showAccountPopup}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowAccountPopup(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.accountPopup, { backgroundColor: colors.cardBackground }]}>
            <View style={styles.popupHeader}>
              <Text style={[styles.popupTitle, { color: colors.text }]}>Account</Text>
              <TouchableOpacity onPress={() => setShowAccountPopup(false)}>
                <Ionicons name="close" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.userInfo}>
              <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
                <Ionicons name="person" size={32} color="#FFFFFF" />
              </View>
              <View style={styles.userDetails}>
                <Text style={[styles.userName, { color: colors.text }]}>Alex Johnson</Text>
                <Text style={[styles.userEmail, { color: colors.textSecondary }]}>alex.johnson@email.com</Text>
              </View>
            </View>

            <View style={styles.accountOptions}>
              <TouchableOpacity style={[styles.optionItem, { borderBottomColor: colors.border }]}>
                <Ionicons name="settings" size={20} color={colors.primary} />
                <Text style={[styles.optionText, { color: colors.text }]}>Manage Account</Text>
                <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
              </TouchableOpacity>
              
              <TouchableOpacity style={[styles.optionItem, { borderBottomColor: colors.border }]}>
                <Ionicons name="trophy" size={20} color={colors.primary} />
                <Text style={[styles.optionText, { color: colors.text }]}>Rewards</Text>
                <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
              </TouchableOpacity>
              
              <TouchableOpacity style={[styles.optionItem, { borderBottomColor: colors.border }]}>
                <Ionicons name="trending-up" size={20} color={colors.primary} />
                <Text style={[styles.optionText, { color: colors.text }]}>Growth</Text>
                <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
              </TouchableOpacity>
              
              <TouchableOpacity style={[styles.optionItem, { borderBottomWidth: 0 }]}>
                <Ionicons name="log-out" size={20} color="#FF4444" />
                <Text style={[styles.optionText, { color: '#FF4444' }]}>Log Out</Text>
                <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    paddingTop: 10,
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
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
  timerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  timerCircle: {
    width: 280,
    height: 280,
    borderRadius: 140,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  innerCircle: {
    width: 240,
    height: 240,
    borderRadius: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerText: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  timerLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  progressRing: {
    position: 'absolute',
    bottom: 50,
    width: 300,
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  sessionInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginHorizontal: 20,
    borderRadius: 12,
    marginBottom: 30,
  },
  sessionItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sessionText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  stopButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    marginHorizontal: 20,
    borderRadius: 25,
    marginBottom: 30,
  },
  stopButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  mainTimerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  timerDisplay: {
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  mainTimer: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  timerControls: {
    flexDirection: 'row',
    gap: 10,
  },
  controlButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  presetsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginBottom: 30,
    gap: 10,
  },
  presetButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginHorizontal: 5,
  },
  presetButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    marginHorizontal: 20,
    borderRadius: 25,
    marginBottom: 30,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  accountPopup: {
    width: width * 0.85,
    borderRadius: 20,
    padding: 20,
  },
  popupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  popupTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
  },
  accountOptions: {
    marginTop: 10,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 12,
    flex: 1,
  },
});
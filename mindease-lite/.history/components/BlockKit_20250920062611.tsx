import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, PanResponder, StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { useDatabase } from '../contexts/DatabaseContext';

interface BlockKitProps {
  onNavigate: (screen: string) => void;
}

// Particle component for floating effects
const Particle = ({ delay, color, size }: { delay: number; color: string; size: number }) => {
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(translateY, {
            toValue: -100,
            duration: 3000,
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.timing(opacity, {
              toValue: 1,
              duration: 500,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0,
              duration: 500,
              useNativeDriver: true,
            }),
          ]),
        ]),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [delay, translateY, opacity]);

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          backgroundColor: color,
          width: size,
          height: size,
          opacity,
          transform: [{ translateY }],
        },
      ]}
    />
  );
};

export default function BlockKit({ onNavigate }: BlockKitProps) {
  const { colors } = useTheme();
  const { t } = useLanguage();
  const { addTimerSession, updateTimerSession } = useDatabase();
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState(30);
  const [timeLeft, setTimeLeft] = useState(0);
  const [sessionCount] = useState(1);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [showAccountPopup, setShowAccountPopup] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const dragAnim = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;

  const presets = [15, 30, 120, 300];
  const presetLabels = [t('blockkit.fifteenMinutes'), t('blockkit.thirtyMinutes'), t('blockkit.twoHours'), t('blockkit.fiveHours')];

  // Pan responder for drag interactions
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      setIsDragging(true);
      dragAnim.setOffset({
        x: (dragAnim.x as any)._value,
        y: (dragAnim.y as any)._value,
      });
    },
    onPanResponderMove: Animated.event(
      [null, { dx: dragAnim.x, dy: dragAnim.y }],
      { useNativeDriver: false }
    ),
    onPanResponderRelease: () => {
      setIsDragging(false);
      dragAnim.flattenOffset();
      Animated.spring(dragAnim, {
        toValue: { x: 0, y: 0 },
        useNativeDriver: true,
      }).start();
    },
  });

  useEffect(() => {
    console.log('Timer useEffect triggered - isTimerActive:', isTimerActive);
    
    if (isTimerActive) {
      console.log('Starting interval timer');
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          console.log('Timer tick - previous time:', prev);
          if (prev <= 1) {
            console.log('Timer finished');
            // Timer completed - update Firebase session
            if (currentSessionId) {
              updateTimerSession(currentSessionId, {
                completed: true,
                endTime: new Date()
              }).then(() => {
                console.log('Timer session completed and saved to Firebase');
              }).catch((error) => {
                console.error('Error updating completed session:', error);
              });
            }
            setIsTimerActive(false);
            setCurrentSessionId(null);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      console.log('Clearing interval timer');
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isTimerActive]);

  // Simplified animation effects
  useEffect(() => {
    if (isTimerActive) {
      // Simple pulse animation only
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

      pulseAnimation.start();

      return () => {
        pulseAnimation.stop();
      };
    } else {
      pulseAnim.setValue(1);
    }
  }, [isTimerActive, pulseAnim]);

  const startTimer = async () => {
    try {
      console.log('Starting timer with duration:', selectedDuration, 'minutes');
      const totalSeconds = selectedDuration * 60;
      console.log('Total seconds:', totalSeconds);
      
      // Create timer session in Firebase
      const sessionId = await addTimerSession({
        duration: selectedDuration,
        completed: false,
        notes: `Focus session - ${selectedDuration} minutes`
      });
      
      setCurrentSessionId(sessionId);
      setTimeLeft(totalSeconds);
      setEndTime(new Date(Date.now() + totalSeconds * 1000));
      setIsTimerActive(true);
      
      console.log('Timer started, session ID:', sessionId);
      
      // Start animation
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } catch (error) {
      console.error('Error starting timer session:', error);
      Alert.alert(
        'Error',
        'Failed to start timer session. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const stopTimer = async () => {
    try {
      setIsTimerActive(false);
      setTimeLeft(0);
      setEndTime(null);
      
      // Update session in Firebase if it exists
      if (currentSessionId) {
        await updateTimerSession(currentSessionId, {
          completed: true,
          endTime: new Date()
        });
        console.log('Timer session completed and saved to Firebase');
      }
      
      setCurrentSessionId(null);
    } catch (error) {
      console.error('Error stopping timer session:', error);
    }
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

  // Removed complex animations to prevent conflicts

  if (isTimerActive) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Floating Particles */}
        {[...Array(8)].map((_, i) => (
          <Particle
            key={i}
            delay={i * 200}
            color={colors.primary}
            size={Math.random() * 6 + 4}
          />
        ))}

        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.background }]}>
          <View style={styles.headerContent}>
            <Text style={[styles.title, { color: colors.text }]}>{t('blockkit.title')}</Text>
            <TouchableOpacity style={styles.profileContainer} onPress={() => setShowAccountPopup(true)}>
              <View style={styles.profileIcon}>
                <Ionicons name="person" size={24} color="#FFFFFF" />
              </View>
              <View style={styles.notificationDot} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Creative Timer Display */}
        <View style={styles.timerContainer}>
          {/* Outer Glow Ring */}
          <Animated.View 
            style={[
              styles.glowRing,
              { 
                borderColor: colors.primary,
                opacity: 0.6,
                transform: [{ scale: pulseAnim }],
              }
            ]}
          />
          
          {/* Main Timer Circle */}
          <Animated.View 
            style={[
              styles.timerCircle,
              {
                backgroundColor: colors.primary,
                transform: [{ scale: pulseAnim }],
                shadowColor: colors.primary,
                shadowOpacity: 0.6,
                shadowRadius: 30,
                elevation: 30,
              }
            ]}
          >
            {/* Static Inner Elements */}
            <View 
              style={[
                styles.innerCircle,
                { 
                  backgroundColor: colors.surface,
                }
              ]}
            >
              {/* Timer Text */}
              <Text style={[styles.timerText, { color: colors.text }]}>
                {formatTime(timeLeft)}
              </Text>
              <Text style={[styles.timerLabel, { color: colors.textSecondary }]}>
                {t('blockkit.normal')}
              </Text>
            </View>
          </Animated.View>

          {/* Progress Rings */}
          <View style={styles.progressContainer}>
            <View style={[styles.progressRing, { borderColor: colors.border }]}>
              <Animated.View 
                style={[
                  styles.progressFill,
                  { 
                    backgroundColor: colors.accent,
                    transform: [{
                      rotate: `${((selectedDuration * 60 - timeLeft) / (selectedDuration * 60)) * 360}deg`
                    }]
                  }
                ]} 
              />
            </View>
          </View>
        </View>

        {/* Session Info with Animation */}
        <Animated.View 
          style={[
            styles.sessionInfo, 
            { 
              backgroundColor: colors.cardBackground,
              transform: [{ scale: scaleAnim }]
            }
          ]}
        >
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
        </Animated.View>

        {/* Stop Button with Haptic Feedback */}
        <TouchableOpacity 
          style={[styles.stopButton, { backgroundColor: colors.primary }]} 
          onPress={stopTimer}
        >
          <Ionicons name="stop" size={24} color="#FFFFFF" />
          <Text style={styles.stopButtonText}>Stop Session</Text>
        </TouchableOpacity>

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

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <View style={styles.headerContent}>
          <Text style={[styles.title, { color: colors.text }]}>{t('blockkit.title')}</Text>
          <TouchableOpacity style={styles.profileContainer} onPress={() => setShowAccountPopup(true)}>
            <View style={styles.profileIcon}>
              <Ionicons name="person" size={24} color="#FFFFFF" />
            </View>
            <View style={styles.notificationDot} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Cyberpunk Timer Display */}
      <Animated.View 
        style={[
          styles.mainTimerContainer,
          {
            transform: [
              { translateX: dragAnim.x },
              { translateY: dragAnim.y },
              { scale: isDragging ? 1.05 : 1 }
            ]
          }
        ]}
        {...panResponder.panHandlers}
      >
        {/* Cyberpunk Timer HUD */}
        <View style={[styles.cyberTimerHUD, { backgroundColor: colors.background }]}>
          {/* HUD Border */}
          <View style={[styles.hudBorder, { borderColor: colors.primary }]}>
            <View style={[styles.hudCorner, styles.hudCornerTL, { borderColor: colors.primary }]} />
            <View style={[styles.hudCorner, styles.hudCornerTR, { borderColor: colors.primary }]} />
            <View style={[styles.hudCorner, styles.hudCornerBL, { borderColor: colors.primary }]} />
            <View style={[styles.hudCorner, styles.hudCornerBR, { borderColor: colors.primary }]} />
          </View>
          
          {/* Main Timer Display */}
          <View style={styles.cyberTimerDisplay}>
            <Text style={[styles.cyberTimerText, { color: colors.primary }]}>
              {formatTime(selectedDuration * 60)}
            </Text>
            <View style={[styles.cyberTimerLabel, { backgroundColor: colors.primary }]}>
              <Text style={styles.cyberTimerLabelText}>SYSTEM TIME</Text>
            </View>
          </View>
          
          {/* Cyberpunk Control Panel */}
          <View style={styles.cyberControlPanel}>
            {/* Time Adjuster */}
            <View style={styles.timeAdjuster}>
              <Text style={[styles.adjusterLabel, { color: colors.textSecondary }]}>MINUTES</Text>
              <View style={styles.adjusterControls}>
                <TouchableOpacity 
                  style={[styles.cyberButton, { borderColor: colors.primary }]}
                  onPress={() => setSelectedDuration(Math.max(5, selectedDuration - 5))}
                >
                  <View style={[styles.cyberButtonInner, { backgroundColor: colors.primary }]}>
                    <Ionicons name="remove" size={16} color="#FFFFFF" />
                  </View>
                </TouchableOpacity>
                
                <View style={[styles.timeDisplay, { borderColor: colors.primary }]}>
                  <Text style={[styles.timeValue, { color: colors.text }]}>{selectedDuration}</Text>
                </View>
                
                <TouchableOpacity 
                  style={[styles.cyberButton, { borderColor: colors.primary }]}
                  onPress={() => setSelectedDuration(Math.min(300, selectedDuration + 5))}
                >
                  <View style={[styles.cyberButtonInner, { backgroundColor: colors.primary }]}>
                    <Ionicons name="add" size={16} color="#FFFFFF" />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            
            {/* Status Indicators */}
            <View style={styles.statusIndicators}>
              <View style={[styles.statusIndicator, { backgroundColor: colors.primary }]}>
                <View style={[styles.statusDot, { backgroundColor: '#00FF00' }]} />
                <Text style={[styles.statusText, { color: colors.text }]}>READY</Text>
              </View>
              <View style={[styles.statusIndicator, { backgroundColor: colors.primary }]}>
                <View style={[styles.statusDot, { backgroundColor: '#FFA500' }]} />
                <Text style={[styles.statusText, { color: colors.text }]}>STANDBY</Text>
              </View>
            </View>
          </View>
        </View>
      </Animated.View>

      {/* Cyberpunk Preset Buttons */}
      <View style={styles.presetsContainer}>
        {presetLabels.map((label, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.cyberPresetButton,
              { borderColor: colors.primary },
              selectedDuration === presets[index] && { 
                backgroundColor: colors.primary,
                transform: [{ scale: 1.05 }]
              }
            ]}
            onPress={() => setSelectedDuration(presets[index])}
          >
            <View style={[
              styles.cyberPresetIcon,
              { borderColor: selectedDuration === presets[index] ? "#FFFFFF" : colors.primary }
            ]}>
              <Ionicons 
                name={selectedDuration === presets[index] ? "checkmark" : "time"} 
                size={14} 
                color={selectedDuration === presets[index] ? "#FFFFFF" : colors.primary} 
              />
            </View>
            <Text style={[
              styles.cyberPresetText,
              { color: colors.text },
              selectedDuration === presets[index] && { color: '#FFFFFF' }
            ]}>
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Cyberpunk Start Button */}
      <TouchableOpacity 
        style={[styles.cyberStartButton, { borderColor: colors.primary }]} 
        onPress={startTimer}
      >
        <View style={[styles.cyberStartButtonInner, { backgroundColor: colors.primary }]}>
          <Ionicons name="play" size={20} color="#FFFFFF" />
          <Text style={styles.cyberStartButtonText}>{t('blockkit.startTimer')}</Text>
        </View>
      </TouchableOpacity>

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
    paddingTop: 50,
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
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
  glowRing: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 160,
    borderWidth: 3,
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
    overflow: 'hidden',
  },
  waveEffect: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 20,
    opacity: 0.3,
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
  progressContainer: {
    position: 'absolute',
    bottom: 50,
  },
  progressRing: {
    width: 300,
    height: 300,
    borderRadius: 150,
    borderWidth: 8,
    borderColor: 'transparent',
    borderTopColor: '#E0E0E0',
  },
  progressFill: {
    position: 'absolute',
    top: -8,
    left: -8,
    width: 300,
    height: 300,
    borderRadius: 150,
    borderWidth: 8,
    borderColor: 'transparent',
    borderTopColor: '#4A90E2',
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
  controlRing: {
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginHorizontal: 5,
    gap: 8,
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
    top: 110, // Increased from 90 to create proper spacing below the profile icon
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
  particle: {
    position: 'absolute',
    borderRadius: 50,
  },
  // Cyberpunk Timer Styles
  cyberTimerHUD: {
    width: 320,
    height: 280,
    borderRadius: 20,
    padding: 20,
    position: 'relative',
  },
  hudBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: 2,
    borderRadius: 20,
  },
  hudCorner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderWidth: 3,
  },
  hudCornerTL: {
    top: -2,
    left: -2,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: 20,
  },
  hudCornerTR: {
    top: -2,
    right: -2,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopRightRadius: 20,
  },
  hudCornerBL: {
    bottom: -2,
    left: -2,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: 20,
  },
  hudCornerBR: {
    bottom: -2,
    right: -2,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomRightRadius: 20,
  },
  cyberTimerDisplay: {
    alignItems: 'center',
    marginBottom: 20,
  },
  cyberTimerText: {
    fontSize: 48,
    fontWeight: 'bold',
    fontFamily: 'monospace',
    letterSpacing: 2,
    marginBottom: 8,
  },
  cyberTimerLabel: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
  },
  cyberTimerLabelText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  cyberControlPanel: {
    flex: 1,
  },
  timeAdjuster: {
    marginBottom: 20,
  },
  adjusterLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 8,
    textAlign: 'center',
  },
  adjusterControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 15,
  },
  cyberButton: {
    width: 50,
    height: 50,
    borderWidth: 2,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  cyberButtonInner: {
    width: 40,
    height: 40,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeDisplay: {
    width: 80,
    height: 50,
    borderWidth: 2,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  timeValue: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  statusIndicators: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  // Cyberpunk Preset Button Styles
  cyberPresetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderRadius: 8,
    marginHorizontal: 5,
    gap: 8,
    backgroundColor: 'transparent',
  },
  cyberPresetIcon: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cyberPresetText: {
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  // Cyberpunk Start Button Styles
  cyberStartButton: {
    borderWidth: 2,
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 30,
    backgroundColor: 'transparent',
  },
  cyberStartButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 10,
    gap: 8,
  },
  cyberStartButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});
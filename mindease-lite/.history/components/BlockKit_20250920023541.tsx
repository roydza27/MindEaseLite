import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width, height } = Dimensions.get('window');

interface BlockKitProps {
  onNavigate: (screen: string) => void;
}

export default function BlockKit({ onNavigate }: BlockKitProps) {
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState(30); // minutes
  const [timeLeft, setTimeLeft] = useState(0);
  const [sessionCount, setSessionCount] = useState(1);
  const [endTime, setEndTime] = useState<Date | null>(null);
  
  const intervalRef = useRef<number | null>(null);

  const presets = [15, 30, 120, 300]; // 15 min, 30 min, 2 hours, 5 hours
  const presetLabels = ['15 Minutes', '30 Minutes', '2 Hours', '5 Hours'];

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
      return `${hours.toString().padStart(2, '0')} : ${minutes.toString().padStart(2, '0')} : ${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')} : ${secs.toString().padStart(2, '0')}`;
  };

  const formatEndTime = (date: Date) => {
    return date.toLocaleTimeString('it-IT', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  if (isTimerActive) {
    // Active Timer Screen
    return (
      <View style={styles.timerContainer}>
        {/* Header */}
        <View style={styles.timerHeader}>
          <Text style={styles.timerTitle}>blockit</Text>
        </View>

        {/* Main Timer Display */}
        <View style={styles.timerDisplay}>
          <Text style={styles.timerText}>
            {formatTime(timeLeft).split(' : ').map((part, index) => (
              <Text key={index} style={[
                styles.timerPart,
                index === 0 ? styles.timerPartBright : 
                index === 1 ? styles.timerPartMedium : styles.timerPartDark
              ]}>
                {part}
                {index < 2 && ' : '}
              </Text>
            ))}
          </Text>
        </View>

        {/* Session Info Card */}
        <View style={styles.sessionCard}>
          <Ionicons name="airplane" size={24} color="#000000" />
          <Text style={styles.sessionNumber}>{sessionCount}</Text>
        </View>

        {/* Stop Button */}
        <TouchableOpacity style={styles.stopButton} onPress={stopTimer}>
          <View style={styles.stopButtonInner} />
        </TouchableOpacity>

        {/* Session End Time */}
        {endTime && (
          <Text style={styles.endTimeText}>
            Fine sessione alle ore {formatEndTime(endTime)}
          </Text>
        )}
      </View>
    );
  }

  // Setup Screen
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>blocliit</Text>
        <TouchableOpacity style={styles.profileContainer}>
          <View style={styles.profileIcon}>
            <Ionicons name="person" size={24} color="#FFFFFF" />
          </View>
          <View style={styles.notificationDot} />
        </TouchableOpacity>
      </View>

      {/* Main Timer Display */}
      <View style={styles.mainTimerContainer}>
        <Text style={styles.mainTimer}>00 : 00</Text>
        <View style={styles.timerAdjuster}>
          <Text style={styles.adjusterLabel}>01</Text>
        </View>
        <View style={styles.modeIndicator}>
          <View style={styles.modeLines}>
            <View style={styles.modeLine} />
            <View style={styles.modeLine} />
            <View style={styles.modeLine} />
          </View>
          <Text style={styles.modeText}>Normal</Text>
          <Ionicons name="chevron-down" size={16} color="#999999" />
        </View>
      </View>

      {/* Preset Duration Buttons */}
      <View style={styles.presetsContainer}>
        {presetLabels.map((label, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.presetButton,
              selectedDuration === presets[index] && styles.presetButtonActive
            ]}
            onPress={() => setSelectedDuration(presets[index])}
          >
            <Text style={[
              styles.presetButtonText,
              selectedDuration === presets[index] && styles.presetButtonTextActive
            ]}>
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Progress Slider */}
      <View style={styles.sliderContainer}>
        <View style={styles.sliderTrack}>
          <View style={[styles.sliderFill, { width: `${(selectedDuration / 300) * 100}%` }]} />
        </View>
        <View style={styles.sliderLabels}>
          <View style={styles.sliderLabel}>
            <View style={styles.sliderIcon} />
            <Text style={styles.sliderLabelText}>Hour</Text>
          </View>
          <View style={styles.sliderLabel}>
            <View style={styles.sliderIcon} />
            <Text style={styles.sliderLabelText}>3 hr</Text>
          </View>
        </View>
      </View>

      {/* Vertical Adjuster */}
      <View style={styles.verticalAdjuster}>
        <View style={styles.adjusterTrack}>
          <View style={[styles.adjusterFill, { height: `${(selectedDuration / 300) * 100}%` }]} />
        </View>
        <View style={styles.adjusterButtons}>
          <TouchableOpacity 
            style={styles.adjusterButton}
            onPress={() => setSelectedDuration(Math.min(300, selectedDuration + 5))}
          >
            <Ionicons name="chevron-up" size={16} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.adjusterButton}
            onPress={() => setSelectedDuration(Math.max(5, selectedDuration - 5))}
          >
            <Ionicons name="chevron-down" size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.startButton} onPress={startTimer}>
          <Text style={styles.startButtonText}>Start Timer</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save Preset</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Setup Screen Styles
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: 'monospace',
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
  mainTimerContainer: {
    alignItems: 'center',
    marginVertical: 40,
  },
  mainTimer: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: 'monospace',
    marginBottom: 10,
  },
  timerAdjuster: {
    marginBottom: 20,
  },
  adjusterLabel: {
    fontSize: 16,
    color: '#999999',
  },
  modeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modeLines: {
    marginRight: 8,
  },
  modeLine: {
    width: 20,
    height: 2,
    backgroundColor: '#FFFFFF',
    marginBottom: 2,
  },
  modeText: {
    fontSize: 14,
    color: '#999999',
    marginRight: 4,
  },
  presetsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  presetButton: {
    width: (width - 60) / 2,
    backgroundColor: '#333333',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 12,
    alignItems: 'center',
  },
  presetButtonActive: {
    backgroundColor: '#2C5F5D',
  },
  presetButtonText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  presetButtonTextActive: {
    color: '#FFFFFF',
  },
  sliderContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sliderTrack: {
    height: 8,
    backgroundColor: '#333333',
    borderRadius: 4,
    marginBottom: 12,
  },
  sliderFill: {
    height: 8,
    backgroundColor: '#2C5F5D',
    borderRadius: 4,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sliderLabel: {
    alignItems: 'center',
  },
  sliderIcon: {
    width: 16,
    height: 16,
    backgroundColor: '#2C5F5D',
    borderRadius: 2,
    marginBottom: 4,
  },
  sliderLabelText: {
    fontSize: 12,
    color: '#999999',
  },
  verticalAdjuster: {
    position: 'absolute',
    right: 20,
    top: height * 0.4,
    alignItems: 'center',
  },
  adjusterTrack: {
    width: 8,
    height: 120,
    backgroundColor: '#333333',
    borderRadius: 4,
    marginBottom: 12,
  },
  adjusterFill: {
    width: 8,
    backgroundColor: '#2C5F5D',
    borderRadius: 4,
  },
  adjusterButtons: {
    alignItems: 'center',
  },
  adjusterButton: {
    width: 32,
    height: 32,
    backgroundColor: '#2C5F5D',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 'auto',
    marginBottom: 40,
    gap: 12,
  },
  startButton: {
    flex: 1,
    backgroundColor: '#2C5F5D',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#2C5F5D',
  },
  startButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    backgroundColor: 'transparent',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#2C5F5D',
  },
  saveButtonText: {
    fontSize: 16,
    color: '#2C5F5D',
    fontWeight: '600',
  },

  // Timer Screen Styles
  timerContainer: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerHeader: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  timerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: 'monospace',
  },
  timerDisplay: {
    alignItems: 'center',
    marginBottom: 40,
  },
  timerText: {
    fontSize: 64,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  timerPart: {
    fontSize: 64,
  },
  timerPartBright: {
    color: '#FFFFFF',
  },
  timerPartMedium: {
    color: '#999999',
  },
  timerPartDark: {
    color: '#666666',
  },
  sessionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginBottom: 60,
  },
  sessionNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginLeft: 12,
  },
  stopButton: {
    width: width * 0.8,
    height: 60,
    backgroundColor: '#FF4444',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  stopButtonInner: {
    width: 20,
    height: 20,
    backgroundColor: '#8B4513',
    borderRadius: 4,
  },
  endTimeText: {
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
  },
});

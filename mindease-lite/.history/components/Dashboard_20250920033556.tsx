import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

const { width } = Dimensions.get('window');

interface DashboardProps {
  onNavigate: (screen: string) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const { colors, isDark } = useTheme();
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Hi, Alex</Text>
        <TouchableOpacity style={styles.profileContainer}>
          <View style={styles.profileIcon}>
            <Ionicons name="person" size={24} color="#FFFFFF" />
          </View>
          <View style={styles.notificationDot} />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Weekly Streaks Card */}
        <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Weekly Streaks</Text>
          <View style={styles.daysContainer}>
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
              <View key={index} style={styles.dayColumn}>
                <Text style={[styles.dayLabel, { color: colors.textSecondary }]}>{day}</Text>
                <View style={[
                  styles.dayCircle,
                  index < 4 ? styles.dayCompleted : styles.dayIncomplete
                ]}>
                  <Ionicons 
                    name={index < 4 ? "checkmark" : "remove"} 
                    size={16} 
                    color="#FFFFFF" 
                  />
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Mood Shifter Card */}
        <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>Mood Shifter</Text>
            <Ionicons name="sparkles" size={20} color={colors.primary} />
          </View>
          <Text style={[styles.cardDescription, { color: colors.textSecondary }]}>Quick exercise to lift your spirits.</Text>
          <TouchableOpacity style={styles.startButton}>
            <Text style={styles.startButtonText}>Start Exercise</Text>
            <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Screen Time Card */}
        <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>Screen Time</Text>
            <Ionicons name="hourglass" size={20} color={colors.primary} />
          </View>
          <View style={styles.screenTimeContainer}>
            <Text style={[styles.screenTimeValue, { color: colors.text }]}>4h 32m</Text>
            <Text style={[styles.screenTimeUnit, { color: colors.textSecondary }]}>/ day</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={styles.progressFill} />
          </View>
          <View style={styles.screenTimeFooter}>
            <Text style={[styles.screenTimeChange, { color: colors.textSecondary }]}>↓ 15% from last week</Text>
            <TouchableOpacity>
              <Text style={styles.viewDetailsText}>View Details</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* New Report Available Banner */}
        <TouchableOpacity style={styles.reportBanner}>
          <Ionicons name="notifications" size={20} color="#2C5F5D" />
          <View style={styles.reportContent}>
            <Text style={styles.reportTitle}>New Report Available</Text>
            <Text style={styles.reportSubtitle}>Your weekly summary is ready.</Text>
          </View>
          <Ionicons name="arrow-forward" size={16} color="#000000" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 16,
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayColumn: {
    alignItems: 'center',
  },
  dayLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  dayCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayCompleted: {
    backgroundColor: '#2C5F5D',
  },
  dayIncomplete: {
    backgroundColor: '#E0E0E0',
  },
  startButton: {
    backgroundColor: '#2C5F5D',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  screenTimeContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  screenTimeValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000000',
  },
  screenTimeUnit: {
    fontSize: 16,
    color: '#666666',
    marginLeft: 4,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginBottom: 12,
  },
  progressFill: {
    height: 8,
    width: '70%',
    backgroundColor: '#2C5F5D',
    borderRadius: 4,
  },
  screenTimeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  screenTimeChange: {
    fontSize: 14,
    color: '#2C5F5D',
    fontWeight: '500',
  },
  viewDetailsText: {
    fontSize: 14,
    color: '#2C5F5D',
    fontWeight: '500',
  },
  reportBanner: {
    backgroundColor: '#E6F4FE',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  reportContent: {
    flex: 1,
    marginLeft: 12,
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 2,
  },
  reportSubtitle: {
    fontSize: 14,
    color: '#666666',
  },
});

import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

interface DashboardProps {
  onNavigate: (screen: string) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Hi, Alex</Text>
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
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Weekly Streaks</Text>
          <View style={styles.daysContainer}>
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
              <View key={index} style={styles.dayColumn}>
                <Text style={styles.dayLabel}>{day}</Text>
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
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Mood Shifter</Text>
            <Ionicons name="sparkles" size={20} color="#2C5F5D" />
          </View>
          <Text style={styles.cardDescription}>Quick exercise to lift your spirits.</Text>
          <TouchableOpacity style={styles.startButton}>
            <Text style={styles.startButtonText}>Start Exercise</Text>
            <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Screen Time Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Screen Time</Text>
            <Ionicons name="hourglass" size={20} color="#2C5F5D" />
          </View>
          <View style={styles.screenTimeContainer}>
            <Text style={styles.screenTimeValue}>4h 32m</Text>
            <Text style={styles.screenTimeUnit}>/ day</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={styles.progressFill} />
          </View>
          <View style={styles.screenTimeFooter}>
            <Text style={styles.screenTimeChange}>↓ 15% from last week</Text>
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
    backgroundColor: '#FFFFFF',
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
  profileIcon: {
    padding: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  moodCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#E6F4FE',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  moodTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
  },
  moodQuestion: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 20,
  },
  emojiContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  emojiCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E6F4FE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 40,
  },
  moodButton: {
    backgroundColor: '#E6F4FE',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  moodButtonText: {
    color: '#2C5F5D',
    fontSize: 16,
    fontWeight: '600',
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    width: (width - 60) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#E6F4FE',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  featureText: {
    fontSize: 14,
    color: '#4A7C7A',
    marginTop: 8,
    textAlign: 'center',
  },
});

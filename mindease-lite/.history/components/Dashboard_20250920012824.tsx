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
        {/* Mood Checker Card */}
        <View style={styles.moodCard}>
          <Text style={styles.moodTitle}>Mood Checker</Text>
          <Text style={styles.moodQuestion}>How are you feeling today?</Text>
          <View style={styles.emojiContainer}>
            <View style={styles.emojiCircle}>
              <Text style={styles.emoji}>😊</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.moodButton}>
            <Text style={styles.moodButtonText}>Check In</Text>
          </TouchableOpacity>
        </View>

        {/* Feature Buttons Grid */}
        <View style={styles.featuresGrid}>
          <TouchableOpacity style={styles.featureCard} onPress={() => onNavigate('notifications')}>
            <Ionicons name="notifications-outline" size={24} color="#4A7C7A" />
            <Text style={styles.featureText}>Notifications</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.featureCard} onPress={() => onNavigate('mood-shifter')}>
            <Ionicons name="refresh-outline" size={24} color="#4A7C7A" />
            <Text style={styles.featureText}>Mood Shifter</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.featureCard} onPress={() => onNavigate('screen-time')}>
            <Ionicons name="time-outline" size={24} color="#4A7C7A" />
            <Text style={styles.featureText}>Screen Time</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.featureCard} onPress={() => onNavigate('mood-listener')}>
            <Ionicons name="headset-outline" size={24} color="#4A7C7A" />
            <Text style={styles.featureText}>Mood Listener</Text>
          </TouchableOpacity>
        </View>
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

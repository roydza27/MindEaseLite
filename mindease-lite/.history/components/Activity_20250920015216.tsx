import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ActivityProps {
  onNavigate: (screen: string) => void;
}

export default function Activity({ onNavigate }: ActivityProps) {
  console.log('Activity component rendering');
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Activity Achievements</Text>
        <TouchableOpacity style={styles.profileIcon}>
          <Ionicons name="person-outline" size={24} color="#000000" />
        </TouchableOpacity>
      </View>

      {/* Test Content */}
      <View style={{ padding: 20, backgroundColor: 'lightblue' }}>
        <Text style={{ fontSize: 24, color: 'black' }}>Activity Page is Working!</Text>
        <Text style={{ fontSize: 16, color: 'black', marginTop: 10 }}>This is a test to make sure the component renders.</Text>
      </View>

      {/* This Month Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>This Month</Text>
          <Text style={styles.progressText}>12/30 Days</Text>
        </View>

        <View style={styles.metricsGrid}>
          <View style={styles.metricCard}>
            <Text style={[styles.metricValue, { color: '#2C5F5D' }]}>12</Text>
            <Text style={styles.metricLabel}>Days of Activity</Text>
          </View>

          <View style={styles.metricCard}>
            <Text style={[styles.metricValue, { color: '#4A90E2' }]}>240</Text>
            <Text style={styles.metricLabel}>Total Minutes</Text>
          </View>

          <View style={styles.metricCard}>
            <Text style={[styles.metricValue, { color: '#FF8C42' }]}>20</Text>
            <Text style={styles.metricLabel}>Average Minutes</Text>
          </View>
        </View>

        <View style={styles.progressContainer}>
          <Text style={styles.progressLabel}>Monthly Goal Progress</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '60%' }]} />
          </View>
          <Text style={styles.progressPercentage}>60%</Text>
        </View>
      </View>

      {/* This Week Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>This Week</Text>
          <Text style={styles.progressText}>4/7 Days</Text>
        </View>

        <View style={styles.metricsGrid}>
          <View style={styles.metricCard}>
            <Text style={[styles.metricValue, { color: '#2C5F5D' }]}>4</Text>
            <Text style={styles.metricLabel}>Days of Activity</Text>
          </View>

          <View style={styles.metricCard}>
            <Text style={[styles.metricValue, { color: '#4A90E2' }]}>80</Text>
            <Text style={styles.metricLabel}>Total Minutes</Text>
          </View>

          <View style={styles.metricCard}>
            <Text style={[styles.metricValue, { color: '#FF8C42' }]}>20</Text>
            <Text style={styles.metricLabel}>Average Minutes</Text>
          </View>
        </View>

        <View style={styles.progressContainer}>
          <Text style={styles.progressLabel}>Weekly Streak</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '43%' }]} />
          </View>
          <Text style={styles.progressPercentage}>3 Days</Text>
        </View>
      </View>

      {/* Achievements Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Achievements</Text>
        
        <View style={styles.achievementsGrid}>
          <View style={styles.achievementCard}>
            <View style={[styles.achievementIcon, { backgroundColor: '#2C5F5D' }]}>
              <Ionicons name="checkmark" size={24} color="#FFFFFF" />
            </View>
            <Text style={styles.achievementTitle}>First Goal Met</Text>
            <Text style={[styles.achievementStatus, { color: '#2C5F5D' }]}>Achieved</Text>
          </View>

          <View style={styles.achievementCard}>
            <View style={[styles.achievementIcon, { backgroundColor: '#2C5F5D' }]}>
              <Ionicons name="time" size={24} color="#FFFFFF" />
            </View>
            <Text style={styles.achievementTitle}>1000 Mins</Text>
            <Text style={[styles.achievementStatus, { color: '#D2691E' }]}>Locked</Text>
          </View>

          <View style={styles.achievementCard}>
            <View style={[styles.achievementIcon, { backgroundColor: '#2C5F5D' }]}>
              <Ionicons name="person" size={24} color="#FFFFFF" />
            </View>
            <Text style={styles.achievementTitle}>5 Day Streak</Text>
            <Text style={[styles.achievementStatus, { color: '#D2691E' }]}>Locked</Text>
          </View>
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
  },
  profileIcon: {
    padding: 4,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
  },
  progressText: {
    fontSize: 16,
    color: '#2C5F5D',
    fontWeight: '600',
  },
  metricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
  },
  progressContainer: {
    marginTop: 8,
  },
  progressLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E6F4FE',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: 8,
    backgroundColor: '#2C5F5D',
    borderRadius: 4,
  },
  progressPercentage: {
    fontSize: 14,
    color: '#2C5F5D',
    fontWeight: '600',
    textAlign: 'right',
  },
  achievementsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  achievementCard: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  achievementTitle: {
    fontSize: 12,
    color: '#000000',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  achievementStatus: {
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
  },
});

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface ActivityProps {
  onNavigate: (screen: string) => void;
}

export default function Activity({ onNavigate }: ActivityProps) {
  console.log('Activity component rendering');
  return (
    <View style={{ flex: 1, backgroundColor: 'red', justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 32, color: 'white', fontWeight: 'bold' }}>ACTIVITY PAGE</Text>
      <Text style={{ fontSize: 18, color: 'white', marginTop: 20 }}>This should be visible!</Text>
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

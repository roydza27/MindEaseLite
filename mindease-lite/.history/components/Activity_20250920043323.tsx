import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';

interface ActivityProps {
  onNavigate: (screen: string) => void;
}

export default function Activity({ onNavigate }: ActivityProps) {
  const { colors } = useTheme();
  const { t } = useLanguage();
  const [showAccountPopup, setShowAccountPopup] = useState(false);
  
  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{t('activity.title')}</Text>
        <TouchableOpacity style={styles.profileContainer} onPress={() => setShowAccountPopup(true)}>
          <View style={styles.profileIcon}>
            <Ionicons name="person" size={24} color="#FFFFFF" />
          </View>
          <View style={styles.notificationDot} />
        </TouchableOpacity>
      </View>

      {/* This Month Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('activity.thisMonth')}</Text>
          <Text style={[styles.progressText, { color: colors.textSecondary }]}>12/30 Days</Text>
        </View>

        <View style={styles.metricsGrid}>
          <View style={[styles.metricCard, { backgroundColor: colors.cardBackground }]}>
            <Text style={[styles.metricValue, { color: colors.primary }]}>12</Text>
            <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>{t('activity.daysOfActivity')}</Text>
          </View>

          <View style={[styles.metricCard, { backgroundColor: colors.cardBackground }]}>
            <Text style={[styles.metricValue, { color: '#4A90E2' }]}>240</Text>
            <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>{t('activity.totalMinutes')}</Text>
          </View>

          <View style={[styles.metricCard, { backgroundColor: colors.cardBackground }]}>
            <Text style={[styles.metricValue, { color: '#FF8C42' }]}>20</Text>
            <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>{t('activity.averageMinutes')}</Text>
          </View>
        </View>

        <View style={styles.progressContainer}>
          <Text style={[styles.progressLabel, { color: colors.textSecondary }]}>{t('activity.monthlyGoal')}</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '60%' }]} />
          </View>
          <Text style={[styles.progressPercentage, { color: colors.primary }]}>60%</Text>
        </View>
      </View>

      {/* This Week Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>This Week</Text>
          <Text style={[styles.progressText, { color: colors.textSecondary }]}>4/7 Days</Text>
        </View>

        <View style={styles.metricsGrid}>
          <View style={[styles.metricCard, { backgroundColor: colors.cardBackground }]}>
            <Text style={[styles.metricValue, { color: colors.primary }]}>4</Text>
            <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>{t('activity.daysOfActivity')}</Text>
          </View>

          <View style={[styles.metricCard, { backgroundColor: colors.cardBackground }]}>
            <Text style={[styles.metricValue, { color: '#4A90E2' }]}>80</Text>
            <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>{t('activity.totalMinutes')}</Text>
          </View>

          <View style={[styles.metricCard, { backgroundColor: colors.cardBackground }]}>
            <Text style={[styles.metricValue, { color: '#FF8C42' }]}>20</Text>
            <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>{t('activity.averageMinutes')}</Text>
          </View>
        </View>

        <View style={styles.progressContainer}>
          <Text style={[styles.progressLabel, { color: colors.textSecondary }]}>Weekly Streak</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '43%' }]} />
          </View>
          <Text style={[styles.progressPercentage, { color: colors.primary }]}>3 Days</Text>
        </View>
      </View>

      {/* Achievements Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Achievements</Text>
        
        <View style={styles.achievementsGrid}>
          <View style={[styles.achievementCard, { backgroundColor: colors.cardBackground }]}>
            <View style={[styles.achievementIcon, { backgroundColor: colors.primary }]}>
              <Ionicons name="checkmark" size={24} color="#FFFFFF" />
            </View>
            <Text style={[styles.achievementTitle, { color: colors.text }]}>First Goal Met</Text>
            <Text style={[styles.achievementStatus, { color: colors.primary }]}>Achieved</Text>
          </View>

          <View style={[styles.achievementCard, { backgroundColor: colors.cardBackground }]}>
            <View style={[styles.achievementIcon, { backgroundColor: colors.primary }]}>
              <Ionicons name="time" size={24} color="#FFFFFF" />
            </View>
            <Text style={[styles.achievementTitle, { color: colors.text }]}>1000 Mins</Text>
            <Text style={[styles.achievementStatus, { color: '#D2691E' }]}>Locked</Text>
          </View>

          <View style={[styles.achievementCard, { backgroundColor: colors.cardBackground }]}>
            <View style={[styles.achievementIcon, { backgroundColor: colors.primary }]}>
              <Ionicons name="person" size={24} color="#FFFFFF" />
            </View>
            <Text style={[styles.achievementTitle, { color: colors.text }]}>5 Day Streak</Text>
            <Text style={[styles.achievementStatus, { color: '#D2691E' }]}>Locked</Text>
          </View>
        </View>
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
    </ScrollView>
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
    top: 90,
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

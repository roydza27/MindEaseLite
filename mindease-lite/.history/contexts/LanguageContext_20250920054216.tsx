import React, { createContext, useContext, useState } from 'react';

export type Language = 'en' | 'es' | 'fr' | 'de' | 'it' | 'pt' | 'ru' | 'ja' | 'ko' | 'zh' | 'ar' | 'hi';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.blockkit': 'BlockKit',
    'nav.moodTracker': 'Mood Tracker',
    'nav.activity': 'Activity',
    'nav.settings': 'Settings',
    
    // Dashboard
    'dashboard.greeting': 'Hi, Alex',
    'dashboard.weeklyStreaks': 'Weekly Streaks',
    'dashboard.moodShifter': 'Mood Shifter',
    'dashboard.moodShifterDesc': 'Quick exercise to lift your spirits.',
    'dashboard.startExercise': 'Start Exercise',
    'dashboard.screenTime': 'Screen Time',
    'dashboard.screenTimeUnit': '/ day',
    'dashboard.sleepTime': 'Sleep Time',
    'dashboard.sleepTimeUnit': 'at rest',
    'dashboard.viewDetails': 'View Details',
    'dashboard.newReport': 'New Report Available',
    'dashboard.reportSubtitle': 'Your weekly summary is ready.',
    
    // Settings
    'settings.title': 'Settings',
    'settings.personalization': 'Personalization',
    'settings.appearance': 'Appearance',
    'settings.language': 'Language',
    'settings.audioMedia': 'Audio & Media',
    'settings.allowBackgroundAudio': 'Allow Background Audio',
    'settings.allowBackgroundAudioDesc': 'Continue playing audio when app is in background',
    'settings.focusProductivity': 'Focus & Productivity',
    'settings.focusMode': 'Focus Mode',
    'settings.focusModeDesc': 'Silence notifications during focus sessions',
    'settings.blockSocialApps': 'Block Social Apps',
    'settings.blockSocialAppsDesc': 'Temporarily disable access to social media',
    'settings.wellnessHealth': 'Wellness & Health',
    'settings.dailyMindfulness': 'Daily Mindfulness Reminders',
    'settings.dailyMindfulnessDesc': 'Receive gentle nudges for reflection and meditation',
    'settings.healthIntegration': 'Health App Integration',
    'settings.healthIntegrationDesc': 'Sync data with your device\'s health app',
    'settings.dataManagement': 'Data Management',
    'settings.resetWellbeing': 'Reset Wellbeing Data',
    'settings.resetWellbeingDesc': 'Permanently delete all mood logs and progress data',
    'settings.reset': 'Reset',
    'settings.notifications': 'Notifications',
    'settings.notificationSettings': 'Notification Settings',
    'settings.notificationSettingsDesc': 'Manage push notifications and alerts',
    'settings.supportLegal': 'Support & Legal',
    'settings.helpSupport': 'Help & Support',
    'settings.helpSupportDesc': 'Get help and contact support',
    'settings.termsOfService': 'Terms of Service',
    'settings.termsOfServiceDesc': 'Read our terms and conditions',
    
    // Appearance Settings
    'appearance.title': 'Appearance',
    'appearance.sectionTitle': 'APPEARANCE',
    'appearance.light': 'Light',
    'appearance.lightDesc': 'Always use light mode',
    'appearance.dark': 'Dark',
    'appearance.darkDesc': 'Always use dark mode',
    'appearance.system': 'System',
    'appearance.systemDesc': 'Follow system settings',
    'appearance.info': 'Choose how MindEase Lite appears. System will automatically switch between light and dark based on your device settings.',
    
    // Language Settings
    'language.title': 'Language',
    'language.sectionTitle': 'LANGUAGE',
    'language.info': 'Choose your preferred language for MindEase Lite. The app will display in the selected language.',
    
    // Activity
    'activity.title': 'Activity Achievements',
    'activity.thisMonth': 'This Month',
    'activity.thisWeek': 'This Week',
    'activity.daysOfActivity': 'Days of Activity',
    'activity.totalMinutes': 'Total Minutes',
    'activity.averageMinutes': 'Average Minutes',
    'activity.monthlyGoal': 'Monthly Goal Progress',
    'activity.weeklyStreak': 'Weekly Streak',
    'activity.achievements': 'Achievements',
    'activity.firstGoalMet': 'First Goal Met',
    'activity.achieved': 'Achieved',
    'activity.locked': 'Locked',
    'activity.thousandMins': '1000 Mins',
    'activity.fiveDayStreak': '5 Day Streak',
    
    // BlockKit
    'blockkit.title': 'blocliit',
    'blockkit.normal': 'Normal',
    'blockkit.fifteenMinutes': '15 Minutes',
    'blockkit.thirtyMinutes': '30 Minutes',
    'blockkit.twoHours': '2 Hours',
    'blockkit.fiveHours': '5 Hours',
    'blockkit.hour': 'Hour',
    'blockkit.threeHours': '3 hr',
    'blockkit.startTimer': 'Start Timer',
    'blockkit.savePreset': 'Save Preset',
    
           // Mood Tracker
           'moodTracker.title': '❤️ Mood Tracker',
           'moodTracker.comingSoon': 'Coming Soon!',
           'moodTracker.description': 'Track your daily mood and emotional well-being',
           'moodTracker.question1': 'How would you rate your overall mood today?',
           'moodTracker.question2': 'How stressed have you felt today?',
           'moodTracker.question3': 'How would you describe your anxiety level?',
           'moodTracker.completed': 'Mood Tracking Complete!',
           'moodTracker.thankYou': 'Thank you for sharing your feelings with us.',
  },
  
  es: {
    // Navigation
    'nav.home': 'Inicio',
    'nav.blockkit': 'BlockKit',
    'nav.moodTracker': 'Seguimiento de Estado de Ánimo',
    'nav.activity': 'Actividad',
    'nav.settings': 'Configuración',
    
    // Dashboard
    'dashboard.greeting': 'Hola, Alex',
    'dashboard.weeklyStreaks': 'Rachas Semanales',
    'dashboard.moodShifter': 'Cambiador de Estado de Ánimo',
    'dashboard.moodShifterDesc': 'Ejercicio rápido para levantar el ánimo.',
    'dashboard.startExercise': 'Iniciar Ejercicio',
    'dashboard.screenTime': 'Tiempo de Pantalla',
    'dashboard.screenTimeUnit': '/ día',
    'dashboard.sleepTime': 'Tiempo de Sueño',
    'dashboard.sleepTimeUnit': 'en reposo',
    'dashboard.viewDetails': 'Ver Detalles',
    'dashboard.newReport': 'Nuevo Informe Disponible',
    'dashboard.reportSubtitle': 'Tu resumen semanal está listo.',
    
    // Settings
    'settings.title': 'Configuración',
    'settings.personalization': 'Personalización',
    'settings.appearance': 'Apariencia',
    'settings.language': 'Idioma',
    'settings.audioMedia': 'Audio y Medios',
    'settings.allowBackgroundAudio': 'Permitir Audio en Segundo Plano',
    'settings.allowBackgroundAudioDesc': 'Continuar reproduciendo audio cuando la app está en segundo plano',
    'settings.focusProductivity': 'Enfoque y Productividad',
    'settings.focusMode': 'Modo Enfoque',
    'settings.focusModeDesc': 'Silenciar notificaciones durante las sesiones de enfoque',
    'settings.blockSocialApps': 'Bloquear Apps Sociales',
    'settings.blockSocialAppsDesc': 'Deshabilitar temporalmente el acceso a redes sociales',
    'settings.wellnessHealth': 'Bienestar y Salud',
    'settings.dailyMindfulness': 'Recordatorios Diarios de Mindfulness',
    'settings.dailyMindfulnessDesc': 'Recibir recordatorios suaves para reflexión y meditación',
    'settings.healthIntegration': 'Integración con App de Salud',
    'settings.healthIntegrationDesc': 'Sincronizar datos con la app de salud de tu dispositivo',
    'settings.dataManagement': 'Gestión de Datos',
    'settings.resetWellbeing': 'Restablecer Datos de Bienestar',
    'settings.resetWellbeingDesc': 'Eliminar permanentemente todos los registros de estado de ánimo y datos de progreso',
    'settings.reset': 'Restablecer',
    'settings.notifications': 'Notificaciones',
    'settings.notificationSettings': 'Configuración de Notificaciones',
    'settings.notificationSettingsDesc': 'Gestionar notificaciones push y alertas',
    'settings.supportLegal': 'Soporte y Legal',
    'settings.helpSupport': 'Ayuda y Soporte',
    'settings.helpSupportDesc': 'Obtener ayuda y contactar soporte',
    'settings.termsOfService': 'Términos de Servicio',
    'settings.termsOfServiceDesc': 'Leer nuestros términos y condiciones',
    
    // Appearance Settings
    'appearance.title': 'Apariencia',
    'appearance.sectionTitle': 'APARIENCIA',
    'appearance.light': 'Claro',
    'appearance.lightDesc': 'Usar siempre modo claro',
    'appearance.dark': 'Oscuro',
    'appearance.darkDesc': 'Usar siempre modo oscuro',
    'appearance.system': 'Sistema',
    'appearance.systemDesc': 'Seguir configuración del sistema',
    'appearance.info': 'Elige cómo aparece MindEase Lite. El sistema cambiará automáticamente entre claro y oscuro según la configuración de tu dispositivo.',
    
    // Language Settings
    'language.title': 'Idioma',
    'language.sectionTitle': 'IDIOMA',
    'language.info': 'Elige tu idioma preferido para MindEase Lite. La app se mostrará en el idioma seleccionado.',
    
    // Activity
    'activity.title': 'Logros de Actividad',
    'activity.thisMonth': 'Este Mes',
    'activity.thisWeek': 'Esta Semana',
    'activity.daysOfActivity': 'Días de Actividad',
    'activity.totalMinutes': 'Minutos Totales',
    'activity.averageMinutes': 'Minutos Promedio',
    'activity.monthlyGoal': 'Progreso del Objetivo Mensual',
    'activity.weeklyStreak': 'Racha Semanal',
    'activity.achievements': 'Logros',
    'activity.firstGoalMet': 'Primer Objetivo Cumplido',
    'activity.achieved': 'Logrado',
    'activity.locked': 'Bloqueado',
    'activity.thousandMins': '1000 Mins',
    'activity.fiveDayStreak': 'Racha de 5 Días',
    
    // BlockKit
    'blockkit.title': 'blocliit',
    'blockkit.normal': 'Normal',
    'blockkit.fifteenMinutes': '15 Minutos',
    'blockkit.thirtyMinutes': '30 Minutos',
    'blockkit.twoHours': '2 Horas',
    'blockkit.fiveHours': '5 Horas',
    'blockkit.hour': 'Hora',
    'blockkit.threeHours': '3 hrs',
    'blockkit.startTimer': 'Iniciar Temporizador',
    'blockkit.savePreset': 'Guardar Preestablecido',
    
           // Mood Tracker
           'moodTracker.title': '❤️ Seguimiento de Estado de Ánimo',
           'moodTracker.comingSoon': '¡Próximamente!',
           'moodTracker.description': 'Rastrea tu estado de ánimo diario y bienestar emocional',
           'moodTracker.question1': '¿Cómo calificarías tu estado de ánimo general hoy?',
           'moodTracker.question2': '¿Qué tan estresado te has sentido hoy?',
           'moodTracker.question3': '¿Cómo describirías tu nivel de ansiedad?',
           'moodTracker.completed': '¡Seguimiento de Estado de Ánimo Completo!',
           'moodTracker.thankYou': 'Gracias por compartir tus sentimientos con nosotros.',
  },
  
  fr: {
    // Navigation
    'nav.home': 'Accueil',
    'nav.blockkit': 'BlockKit',
    'nav.moodTracker': 'Suivi de l\'Humeur',
    'nav.activity': 'Activité',
    'nav.settings': 'Paramètres',
    
    // Dashboard
    'dashboard.greeting': 'Salut, Alex',
    'dashboard.weeklyStreaks': 'Séries Hebdomadaires',
    'dashboard.moodShifter': 'Changeur d\'Humeur',
    'dashboard.moodShifterDesc': 'Exercice rapide pour remonter le moral.',
    'dashboard.startExercise': 'Commencer l\'Exercice',
    'dashboard.screenTime': 'Temps d\'Écran',
    'dashboard.screenTimeUnit': '/ jour',
    'dashboard.viewDetails': 'Voir les Détails',
    'dashboard.newReport': 'Nouveau Rapport Disponible',
    'dashboard.reportSubtitle': 'Votre résumé hebdomadaire est prêt.',
    
    // Settings
    'settings.title': 'Paramètres',
    'settings.personalization': 'Personnalisation',
    'settings.appearance': 'Apparence',
    'settings.language': 'Langue',
    'settings.audioMedia': 'Audio et Médias',
    'settings.allowBackgroundAudio': 'Autoriser l\'Audio en Arrière-plan',
    'settings.allowBackgroundAudioDesc': 'Continuer à lire l\'audio quand l\'app est en arrière-plan',
    'settings.focusProductivity': 'Focus et Productivité',
    'settings.focusMode': 'Mode Focus',
    'settings.focusModeDesc': 'Couper les notifications pendant les sessions de focus',
    'settings.blockSocialApps': 'Bloquer les Apps Sociales',
    'settings.blockSocialAppsDesc': 'Désactiver temporairement l\'accès aux réseaux sociaux',
    'settings.wellnessHealth': 'Bien-être et Santé',
    'settings.dailyMindfulness': 'Rappels Quotidiens de Pleine Conscience',
    'settings.dailyMindfulnessDesc': 'Recevoir des rappels doux pour la réflexion et la méditation',
    'settings.healthIntegration': 'Intégration avec l\'App Santé',
    'settings.healthIntegrationDesc': 'Synchroniser les données avec l\'app santé de votre appareil',
    'settings.dataManagement': 'Gestion des Données',
    'settings.resetWellbeing': 'Réinitialiser les Données de Bien-être',
    'settings.resetWellbeingDesc': 'Supprimer définitivement tous les journaux d\'humeur et données de progression',
    'settings.reset': 'Réinitialiser',
    'settings.notifications': 'Notifications',
    'settings.notificationSettings': 'Paramètres de Notifications',
    'settings.notificationSettingsDesc': 'Gérer les notifications push et alertes',
    'settings.supportLegal': 'Support et Légal',
    'settings.helpSupport': 'Aide et Support',
    'settings.helpSupportDesc': 'Obtenir de l\'aide et contacter le support',
    'settings.termsOfService': 'Conditions d\'Utilisation',
    'settings.termsOfServiceDesc': 'Lire nos termes et conditions',
    
    // Appearance Settings
    'appearance.title': 'Apparence',
    'appearance.sectionTitle': 'APPARENCE',
    'appearance.light': 'Clair',
    'appearance.lightDesc': 'Toujours utiliser le mode clair',
    'appearance.dark': 'Sombre',
    'appearance.darkDesc': 'Toujours utiliser le mode sombre',
    'appearance.system': 'Système',
    'appearance.systemDesc': 'Suivre les paramètres du système',
    'appearance.info': 'Choisissez comment MindEase Lite apparaît. Le système basculera automatiquement entre clair et sombre selon les paramètres de votre appareil.',
    
    // Language Settings
    'language.title': 'Langue',
    'language.sectionTitle': 'LANGUE',
    'language.info': 'Choisissez votre langue préférée pour MindEase Lite. L\'app s\'affichera dans la langue sélectionnée.',
    
    // Activity
    'activity.title': 'Réalisations d\'Activité',
    'activity.thisMonth': 'Ce Mois',
    'activity.thisWeek': 'Cette Semaine',
    'activity.daysOfActivity': 'Jours d\'Activité',
    'activity.totalMinutes': 'Minutes Totales',
    'activity.averageMinutes': 'Minutes Moyennes',
    'activity.monthlyGoal': 'Progrès de l\'Objectif Mensuel',
    'activity.weeklyStreak': 'Série Hebdomadaire',
    'activity.achievements': 'Réalisations',
    'activity.firstGoalMet': 'Premier Objectif Atteint',
    'activity.achieved': 'Atteint',
    'activity.locked': 'Verrouillé',
    'activity.thousandMins': '1000 Mins',
    'activity.fiveDayStreak': 'Série de 5 Jours',
    
    // BlockKit
    'blockkit.title': 'blocliit',
    'blockkit.normal': 'Normal',
    'blockkit.fifteenMinutes': '15 Minutes',
    'blockkit.thirtyMinutes': '30 Minutes',
    'blockkit.twoHours': '2 Heures',
    'blockkit.fiveHours': '5 Heures',
    'blockkit.hour': 'Heure',
    'blockkit.threeHours': '3 h',
    'blockkit.startTimer': 'Démarrer le Minuteur',
    'blockkit.savePreset': 'Enregistrer le Pré-réglage',
    
           // Mood Tracker
           'moodTracker.title': '❤️ Suivi de l\'Humeur',
           'moodTracker.comingSoon': 'Bientôt Disponible !',
           'moodTracker.description': 'Suivez votre humeur quotidienne et votre bien-être émotionnel',
           'moodTracker.question1': 'Comment évaluez-vous votre humeur générale aujourd\'hui ?',
           'moodTracker.question2': 'À quel point vous êtes-vous senti stressé aujourd\'hui ?',
           'moodTracker.question3': 'Comment décririez-vous votre niveau d\'anxiété ?',
           'moodTracker.completed': 'Suivi de l\'Humeur Terminé !',
           'moodTracker.thankYou': 'Merci de partager vos sentiments avec nous.',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: React.ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    const currentTranslations = translations[language] || translations.en;
    return currentTranslations[key as keyof typeof currentTranslations] || key;
  };

  const value: LanguageContextType = {
    language,
    setLanguage,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

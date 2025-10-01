import React, { useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { Video } from 'expo-av';
import { useRouter } from 'expo-router';

export default function IntroVideoScreen() {
  const videoRef = useRef(null);
  const router = useRouter();

  const handleVideoEnd = () => {
    router.replace('/'); // Navigate to index.tsx after video
  };

  return (
    <View style={styles.container}>
      <Video
        ref={videoRef}
        source={require('../assets/video/intro.mp4')}
        style={styles.video}
        resizeMode="cover"
        shouldPlay
        isLooping={false}
        onPlaybackStatusUpdate={status => {
          if (status.didJustFinish) handleVideoEnd();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' },
  video: { width: '100%', height: '100%' },
});

import { Video, ResizeMode } from 'expo-av';
import { useRouter } from 'expo-router';
import React, { useRef } from 'react';
import { StyleSheet, View } from 'react-native';

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
  resizeMode={ResizeMode.COVER}
        shouldPlay={true}
        isLooping={false}
        onPlaybackStatusUpdate={status => {
          if ('didJustFinish' in status && status.didJustFinish) {
            handleVideoEnd();
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' },
  video: { width: '100%', height: '100%' },
});

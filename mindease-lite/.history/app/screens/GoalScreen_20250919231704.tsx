
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function GoalScreen() {
	return (
		<View style={styles.container}>
			<Text style={styles.title}>Welcome</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' },
	title: { fontSize: 32, fontWeight: 'bold' },
});
import React, { useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet, Alert } from 'react-native';

export default function GoalScreen() {
	const [goal, setGoal] = useState<string>('');
	const [usage, setUsage] = useState<number>(0);

	const checkGoal = () => {
		if (usage <= parseInt(goal)) {
			Alert.alert("Congratulations!", "You achieved your screen-time goal today! ⭐");
		} else {
			Alert.alert("Keep going!", "Try to reduce your screen time tomorrow.");
		}
	};

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Set Your Daily Screen-Time Goal (minutes)</Text>
			<TextInput
				style={styles.input}
				keyboardType="numeric"
				value={goal}
				onChangeText={setGoal}
			/>
			<Text style={styles.title}>Your Screen Usage (minutes)</Text>
			<TextInput
				style={styles.input}
				keyboardType="numeric"
				value={usage.toString()}
				onChangeText={text => setUsage(Number(text))}
			/>
			<Button title="Check Goal" onPress={checkGoal} />
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
	title: { fontSize: 18, marginVertical: 10 },
	input: { borderWidth: 1, padding: 8, width: '80%', marginBottom: 10, borderRadius: 5 },
});

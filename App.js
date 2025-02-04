import React, { useState, useEffect } from 'react';
import { StatusBar, StyleSheet, Text, View } from 'react-native';
import { Audio } from 'expo-av';
import { Gyroscope } from 'expo-sensors';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
    },
    shakeText: {
        fontSize: 60,
        fontWeight: 'bold',
        color: 'white',
    },
    coordsText: {
        fontSize: 20,
        color: 'white',
    },
});

export default function App() {
    const [mySound, setMySound] = useState(null);
    const [{ x, y, z }, setData] = useState({ x: 0, y: 0, z: 0 });
    const [isShaking, setIsShaking] = useState(false);

    useEffect(() => {
        async function playSound() {
            const { sound } = await Audio.Sound.createAsync(
                require('./217761__reitanna__break.wav')
            );
            setMySound(sound);
        }

        playSound();
        Gyroscope.setUpdateInterval(100); // Update every 100ms

        const subscription = Gyroscope.addListener((data) => {
            setData(data);
            const { x, y, z } = data;
            const magnitude = Math.sqrt(x * x + y * y + z * z);

            if (magnitude > 1.5) {
                if (!isShaking) {
                    setIsShaking(true);
                    playSound();
                    setTimeout(() => setIsShaking(false), 500);
                }
            }
        });

        return () => {
            subscription.remove();
            if (mySound) {
                mySound.unloadAsync();
            }
        };
    }, []);

    const playSound = async () => {
        if (mySound) {
            await mySound.replayAsync();
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar hidden />
            <Text style={styles.coordsText}>
                x: {x.toFixed(2)}, y: {y.toFixed(2)}, z: {z.toFixed(2)}
            </Text>
            {isShaking && <Text style={styles.shakeText}>SHAKE</Text>}
        </View>
    );
}


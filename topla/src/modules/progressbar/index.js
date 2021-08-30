import React from 'react';
import { View } from "react-native";

const ProgressBar = ({ value = 0, height = 20, innerColor = "#d4d4d4", barColor = "#07b807", borderRadius = 28 } = {}) => {
    return (
        <View style={{ height: height, width: "100%", borderRadius: borderRadius, overflow: "hidden" }}>
            <View style={{ width: "100%", backgroundColor: innerColor }}>
                <View style={{ width: `${value}%`, height: "100%", backgroundColor: barColor }} />
            </View>
        </View>
    );
}

export default ProgressBar;
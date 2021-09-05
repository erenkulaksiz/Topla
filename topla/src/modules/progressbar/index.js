import React from "react";
import { View } from "react-native";
import PropTypes from "prop-types";

const ProgressBar = props => {
    return (
        <View style={{ height: props.height, width: "100%", borderRadius: props.borderRadius, overflow: "hidden" }}>
            <View style={{ width: "100%", backgroundColor: props.innerColor }}>
                <View style={{ width: `${props.value}%`, height: "100%", backgroundColor: props.barColor }} />
            </View>
        </View>
    );
}

ProgressBar.propTypes = {
    value: PropTypes.number,
    height: PropTypes.number,
    innerColor: PropTypes.string,
    barColor: PropTypes.string,
    borderRadius: PropTypes.number,
}
ProgressBar.defaultProps = {
    value: 0,
    height: 20,
    innerColor: "#d4d4d4",
    barColor: "#07b807",
    borderRadius: 28,
}

export default ProgressBar;
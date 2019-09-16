import React, { Component } from 'react';
import { DrawerLayoutAndroid, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ScreenOrientation } from 'expo';

//Lock landscape and ignore promise
ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE).catch(() => {});

//Define styles (DRY)
const styles = StyleSheet.create({
    button: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 2.5,
        borderWidth: 1,
        borderColor: 'white',
    },
    text: {
        fontSize: 60,
        color: 'white',
        textAlign: 'center',
    },
    redText: {
        color: 'red',
    },
    blueText: {
        color: 'blue',
    },
    bigText: {
        fontSize: 100,
    },
});

// Reduce code duplication (DRY)
class CounterButton extends Component {
    render() {
        return (
            // Touchable opacity allows better theming than button
            <TouchableOpacity style={styles.button} onPress={(e) => this.props.onPressCallback(this.props.index, e)}>
                <Text style={[styles.text, styles.bigText, this.props.red ? styles.redText : styles.blueText]}>
                    {/*Curly braces to evaluate the expression*/}
                    {this.props.label}
                </Text>
            </TouchableOpacity>
        );
    }
}

// Reduce code duplication (DRY)
class TotalBox extends Component {
    render() {
        {/*Remap difference from -22 - 22 to 0 - 44*/}
        return (
            <View style={{flex: 1, flexDirection: 'column',
                backgroundColor: this.props.state.colors[22 + this.props.state.counts[this.props.index + 1] -
                    this.props.state.counts[this.props.index]]}}>
                {/*red > blue*/}
                {this.props.state.counts[this.props.index] > this.props.state.counts[this.props.index + 1] &&
                <Text style={ styles.text}>{this.props.state.counts[this.props.index] - this.props.state.counts[this.props.index + 1]}</Text>
                }
                {/*red < blue*/}
                {this.props.state.counts[this.props.index + 1] > this.props.state.counts[this.props.index] &&
                <Text style={ styles.text}>{this.props.state.counts[this.props.index + 1] - this.props.state.counts[this.props.index]}</Text>
                }
                {/*red == blue*/}
                {this.props.state.counts[this.props.index] === this.props.state.counts[this.props.index + 1] &&
                <Text style={styles.text}>0</Text>
                }
                <View style={{flex: 1, flexDirection: 'row', alignItems: 'center',
                    justifyContent: 'space-between'}}>
                    <Text style={ styles.text}>{this.props.state.counts[this.props.index]}</Text>
                    <Text style={ styles.text}>{this.props.state.counts[this.props.index + 1]}</Text>
                </View>
            </View>
        );
    }
}

// Reduce code duplication (DRY)
class ScoreRow extends Component {
    render() {
        return (
            <View style={{flex: 1, flexDirection: 'row', backgroundColor: this.props.backgroundColor}}>
                <CounterButton onPressCallback={this.props.increment} index={this.props.index * 2} red={true}
                               label={"+R"}/>
                <CounterButton onPressCallback={this.props.decrement} index={this.props.index * 2} red={true}
                               label={"-R"}/>
                <TotalBox index={this.props.index * 2} state={this.props.state}/>
                <CounterButton onPressCallback={this.props.decrement} index={this.props.index * 2 + 1} red={false}
                               label={"-B"}/>
                <CounterButton onPressCallback={this.props.increment} index={this.props.index * 2 + 1} red={false}
                               label={"+B"}/>
            </View>
        );
    }
}

export default class VexTowerHelper extends Component {
    constructor(props) {
        super(props);
        this.state = {counts: [0, 0, 0, 0, 0, 0], // L to R, T to B
            colors: ['#FF0000', '#FF0000', '#FF0000', '#FF0000', '#FF0000', '#FF0000', '#FF0000', '#FF0000',
                '#FF0000', '#FF0000', '#FF0000', '#FF0000', '#FF0000', '#FF1212', '#FF2525', '#FF3838',
                '#FF4B4B', '#FF5E5E', '#FF7171', '#FF8484', '#FF9797', '#FFAAAA', '#000000', '#AAAAFF',
                '#9797FF', '#8484FF', '#7171FF', '#5E5EFF', '#4B4BFF', '#3838FF', '#2525FF', '#1212FF',
                '#0000FF', '#0000FF', '#0000FF', '#0000FF', '#0000FF', '#0000FF', '#0000FF', '#0000FF',
                '#0000FF', '#0000FF', '#0000FF', '#0000FF', '#0000FF']}; // Colours used for total boxes
            // First 13 and last 13 colours duplicates to reduce logic needed (KISS)
    }
    increment = i => {
        this.setState(state => {
            const counts = state.counts.map((item, j) => {
                if (j === i) { // Modify correct index
                    // Limit total to 22 cubes
                    if (j % 2 === 1 && state.counts[j - 1] + item < 22) {
                        return item + 1;
                    } else if (j % 2 === 0 && state.counts[j + 1] + item < 22) {
                        return item + 1;
                    } else {
                        return item;
                    }
                } else {
                    return item;
                }
            });

            return {
                counts,
            };
        });
    };
    decrement = i => {
        this.setState(state => {
            const counts = state.counts.map((item, j) => {
                if (j === i && item > 0) { // Modify correct index and prevent negative cubes
                    return item - 1;
                } else {
                    return item;
                }
            });

            return {
                counts,
            };
        });
    };
    reset = () => {
        this.setState(() => (
            {counts: [0, 0, 0, 0, 0, 0]} // Clear all totals
        ));
        this.refs['drawer'].closeDrawer(); // Hide on click
    };

    render() {
        let navigationView = (
            <TouchableOpacity style={styles.button} onPress={(e) => this.reset(e)}>
                <Text style={[styles.text, {color: 'black',}]}>Reset</Text>
            </TouchableOpacity>
        );
        return (
            <DrawerLayoutAndroid ref='drawer' drawerWidth={200} renderNavigationView={() => navigationView}>
                <View style={{flex: 1, padding: 2}}>
                    <StatusBar hidden={true}/>
                    {/* Increment and decrement funcs need to be passed as props*/}
                    <ScoreRow backgroundColor={"limegreen"} index={0} state={this.state}
                              increment={this.increment} decrement={this.decrement}/>
                    <ScoreRow backgroundColor={"orange"} index={1} state={this.state}
                              increment={this.increment} decrement={this.decrement}/>
                    <ScoreRow backgroundColor={"mediumpurple"} index={2} state={this.state}
                              increment={this.increment} decrement={this.decrement}/>
                </View>
            </DrawerLayoutAndroid>
        );
    }
};

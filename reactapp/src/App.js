import React, { Component } from 'react';
import DiceDisplay from "./DiceDisplay";
import "./App.scss"

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div class="component-app">
                <div class="component-app__table">
                    <div class="component-app__title">Dice Rolls</div>
                    <DiceDisplay></DiceDisplay>
                </div>
            </div>
        );
    }
}
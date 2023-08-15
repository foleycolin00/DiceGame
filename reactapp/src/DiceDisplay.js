import React, { Component } from 'react';
import "./DiceDisplay.scss"
import { Bar, Tooltip, XAxis, YAxis, ComposedChart, ResponsiveContainer } from 'recharts';

export default class DiceDisplay extends Component {
    constructor(props) {
        super(props);
        //Set the default for the state
        this.state = {
            rollData: {},
            elapsedMilliseconds: 0,
            formData: {
                numberOfRolls: 100,
                face1: {
                    faces: 6,
                    favored: 6,
                    favoredFactor: 1
                },
                face2: {
                    faces: 6,
                    favored: 6,
                    favoredFactor: 1
                }
            }
        };
        this.handleInputChange = this.handleInputChange.bind(this); //bind this for state changes
        this.generateDiceRoll = this.generateDiceRoll.bind(this); //binds this for the onclick events
    }

    //Handle the changes to the input
    handleInputChange(event) {
        //Get the name and value from the event
        const target = event.target;
        const value = parseInt(target.value);
        const name = target.name;

        //The current state
        var currentFormState = { ...this.state.formData }

        //Switch on the name
        //Possible there is a better way to do this I dont know of
        switch (name) {
            case "numberOfRolls":
                currentFormState.numberOfRolls = value;
                break;
            case "face1.faces":
                if (value < currentFormState.face1.favored)
                    currentFormState.face1.favored = value;
                currentFormState.face1.faces = value;
                break;
            case "face1.favored":
                if (value <= currentFormState.face1.faces)
                    currentFormState.face1.favored = value;
                break;
            case "face1.favoredFactor":
                currentFormState.face1.favoredFactor = value;
                break;
            case "face2.faces":
                if (value < currentFormState.face2.favored)
                    currentFormState.face2.favored = value;
                currentFormState.face2.faces = value;
                break;
            case "face2.favored":
                if (value <= currentFormState.face1.faces)
                    currentFormState.face2.favored = value;
                break;
            case "face2.favoredFactor":
                currentFormState.face2.favoredFactor = value;
                break;
            default:
                break;
        }

        //Sets the form data using the partial state
        this.setState({
            "formData": currentFormState
        });
    }

    render() {
        return (
            <div class="display">
                <ResponsiveContainer width="90%" height="20%">
                    <ComposedChart data={this.state.rollData} margin={{
                        left: 40,
                        top: 20
                    }}>
                        <Bar dataKey="percent" fill="black" />
                        <XAxis label={{ value: 'Side of Dice', stroke: "white", position: "bottom" }} dataKey="side" stroke="white" />
                        <YAxis label={{ value: '% of Rolls', angle: -90, position: 'insideLeft', stroke: "white" }} stroke="white" />
                        <Tooltip />
                    </ComposedChart>
                </ResponsiveContainer>

                <div class="display__form">
                    <div class="display__form-time">
                        <label>Elapsed Time(ms):</label>
                        {this.state.elapsedMilliseconds}
                    </div>
                    <div class="display__form-row">
                        <div class="display__form-column">
                            <label># Rolls:</label>
                            <input type="number" value={this.state?.formData.numberOfRolls} name="numberOfRolls" onChange={this.handleInputChange} />
                        </div>
                    </div>
                    <div class="display__form-row">
                        <div class="display__form-column">
                            <label># Faces:</label>
                            <input type="number" value={this.state?.formData.face1.faces} name="face1.faces" onChange={this.handleInputChange} />
                        </div>
                        <div class="display__form-column">
                            <label>Face Favored:</label>
                            <input type="number" value={this.state?.formData.face1.favored} name="face1.favored" onChange={this.handleInputChange} />
                        </div>
                        <div class="display__form-column">
                            <label>Favored Factor:</label>
                            <input type="number" value={this.state?.formData.face1.favoredFactor} name="face1.favoredFactor" onChange={this.handleInputChange} />
                        </div>
                    </div>
                    <div class="display__form-row">
                        <div class="display__form-column">
                            <label># Faces:</label>
                            <input type="number" value={this.state?.formData.face2.faces} name="face2.faces" onChange={this.handleInputChange} />
                        </div>
                        <div class="display__form-column">
                            <label>Face Favored:</label>
                            <input type="number" value={this.state?.formData.face2.favored} name="face2.favored" onChange={this.handleInputChange} />
                        </div>
                        <div class="display__form-column">
                            <label>Favored Factor:</label>
                            <input type="number" value={this.state?.formData.face2.favoredFactor} name="face2.favoredFactor" onChange={this.handleInputChange} />
                        </div>
                    </div>
                    <div class="display__form-row">
                        <button class="display__form-submit" onClick={this.generateDiceRoll}>ROLL</button>
                    </div>
                </div>
            </div>
        );
    }

    async generateDiceRoll() {
        //build the request
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                dice: [
                    {
                        faces: this.state.formData.face1.faces,
                        favored: this.state.formData.face1.favored,
                        favoredFactor: this.state.formData.face1.favoredFactor
                    },
                    {
                        faces: this.state.formData.face2.faces,
                        favored: this.state.formData.face2.favored,
                        favoredFactor: this.state.formData.face2.favoredFactor
                    },
                ],
                numberOfRolls: this.state.formData.numberOfRolls
            })
        };
        const response = await fetch(
            'rolldice',
            requestOptions
        );
        const data = await response.json();
        var rollData = [];
        Object.keys(data.rolls).forEach(key => {
            console.log(key, data.rolls[key]);
            rollData.push({ side: key, percent: data.rolls[key] });
        });
        //set the state from the returned data
        this.setState({ formData: this.state.formData, rollData: rollData, elapsedMilliseconds: data.elapsedMilliseconds });
    }
}
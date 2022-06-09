import React, { Component } from 'react';
import Card from './components/Card/Card';

const DEFAULT_CLASSNAME = "expert-network-questions";

const data = [{
    title: "Tribyl partner",
    text: "Have you bought, evaluated, or used product(s) in this market category in the last 12-18 months? ",
}, {
    title: "John Doe",
    text: "Have you bought, evaluated, or used product(s) in this market category in the last 12-18 months? ",
}]

class Question extends Component {
    render() {
        return (
            <div className={`${DEFAULT_CLASSNAME}`}>
                <Card data={data[0]} />
                <Card data={data[1]} />
            </div>
        );
    }
}

export default Question;
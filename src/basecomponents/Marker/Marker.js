import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import './styles/Marker.style.scss';

export class Marker extends PureComponent {
    markerClass = (name) => {
        switch (name) {
            case 'Economic Drivers':
                return 'economic-drivers';
            case 'Use Cases':
                return 'use-cases';
            case 'Pain Points':
                return 'pain-points';
            case 'Personas':
                return 'personas';
            case 'Value Proposition':
                return 'value-proposition';
            case 'Objections':
                return 'objections';
            case 'Content':
                return 'content';
            case 'Competition':
                return 'competition';
            case 'Partners':
                return 'partners';
            case 'Activities':
                return 'activities';
            default:
                return name;
        }
    }
    render() {
        return (
            <span className={`react-marker ${this.markerClass(this.props.name)}`} title={this.props.markerTip} />
        );
    }
}

Marker.propTypes = { name: PropTypes.string };

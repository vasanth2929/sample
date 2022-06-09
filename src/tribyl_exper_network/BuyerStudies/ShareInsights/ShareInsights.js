import React, { Component } from 'react';
import './ShareInsights.style.scss';
import Card from '../components/Card/Card';

const DEFAULT_CLASSNAME = "expert-network-share-insight";


class ShareInsights extends Component {
    render() {
        return (
            <div className={`${DEFAULT_CLASSNAME}`}>
                <Card />
            </div>
        );
    }
}

export default ShareInsights;

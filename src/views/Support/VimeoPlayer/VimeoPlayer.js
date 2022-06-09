import React from 'react';
import Player from '@vimeo/player';


export class VimeoPlayer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            volume: 0,
        };
    }

    componentDidMount() {
        const { url, width } = this.props;
        const newplayer = new Player(`player_${this.props.id}`, { url, width });
        newplayer.setVolume(70);
    }

    render() {
        const { id } = this.props;
        return (
            <div id={`player_${id}`} />
        );
    }
}

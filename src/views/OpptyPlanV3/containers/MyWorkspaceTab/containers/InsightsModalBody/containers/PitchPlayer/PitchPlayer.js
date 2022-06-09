import React from 'react';
import './styles/PitchPlayer.style.scss';

export class PitchPlayer extends React.PureComponent {
    render() {
        const {
            onLoadStart,
            onCanPlay,
            pitchVideo,
        } = this.props;
        const vidStyle = {
            position: 'relative',
            display: 'inline',
            height: '384px',
            width: '398px',
            bottom: '43px',
            outline: 'none'
        };
        return (
            <section className="pitch-player">
                <div style={{ width: 'auto', textAlign: 'center' }} className="video-container">
                    <video // eslint-disable-line
                        controls
                        // height="400"
                        style={vidStyle}
                        onLoadStart={onLoadStart}
                        onCanPlay={onCanPlay}>
                        <source src={pitchVideo} type="video/mp4" />
                        <track />
                    </video>
                </div>
            </section>
        );
    }
}

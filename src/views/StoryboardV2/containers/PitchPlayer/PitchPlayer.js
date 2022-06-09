import React from 'react';
import './styles/PitchPlayer.style.scss';

export class PitchPlayer extends React.PureComponent {
    render() {
        const {
            onLoadStart,
            onCanPlay,
            pitchVideo,
            updateVideo,
            deleteVideo
        } = this.props;
        return (
            <section className="pitch-player">
                <div style={{ width: 'auto', textAlign: 'center', minHeight: '400px' }} className="video-container">
                    <video // eslint-disable-line
                        controls
                        height="400"
                        onLoadStart={onLoadStart}
                        onCanPlay={onCanPlay}>
                        <source src={pitchVideo} type="video/mp4" />
                        <track />
                    </video>
                </div>
                <div className="row">
                    <div className="col-6">
                        {updateVideo && <button className="update-video btn" onClick={updateVideo}>Replace</button>}
                    </div>
                    <div className="col-6 text-right">
                        {deleteVideo && <button className="delete-video btn" onClick={deleteVideo}>Delete</button>}
                    </div>
                </div>
            </section>
        );
    }
}

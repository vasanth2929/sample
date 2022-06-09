/* eslint-disable jsx-a11y/media-has-caption */
import React from 'react';
import './TutorialsAdministration.scss';
import { ErrorBoundary } from '../../components/ErrorBoundary/ErrorBoundary';
import { MainPanel } from '../../basecomponents/MainPanel/MainPanel';
import { Icons } from '../../constants/general';
import { getAllMediaFiles } from '../../util/promises/tutorials-promise';

export default class TutorialsAdministration extends React.Component {
    state = {}
    componentDidMount() {
        getAllMediaFiles()
            .then((response) => {
                const videos = response.data || [];
                const selectedVideo = videos[0];
                this.setState({ videos, selectedVideo });
            });
    }
    render() {
        const { videos = [], selectedVideo } = this.state;
        return (
            <ErrorBoundary>
                <section className="outreach-properties-view">
                    <MainPanel
                        viewName="Tribyl Tutorials Administration"
                        icons={[Icons.MAINMENU]}
                        viewHeader={
                            <div className="container">
                                <div className="title-label row">
                                    <div className="col-8">
                                        <p>Tutorials Administration</p>
                                    </div>
                                </div>
                            </div>
                        }>
                        <div className="container tutorials-wrapper">
                            <div className="videos-list-wrapper">
                                <h2>Videos</h2>
                                <ul>
                                    <li className="add-industry-option">
                                        <div className="add-industry-option-button" role="button" onClick={() => this.addVideo({})}>
                                            <i className="material-icons">add_circle</i>
                                            <div className="text-display">Add Video File</div>
                                        </div>
                                    </li>
                                    {
                                        videos
                                            .map(video => (
                                                <li key={video.id} className={`${video.id === selectedVideo.id ? 'selected-video' : ''}`} onClick={() => this.setState({ selectedVideo: video })}>{video.name}</li>
                                            ))
                                    }
                                </ul>
                            </div>
                            <div className="video-details-wrapper">
                                <div className="video-preview">
                                    <h2>Preview</h2>
                                    {selectedVideo &&
                                        <div
                                            id="pitch-video-preview"
                                            className="preview-wrapper">
                                            <video
                                                controls
                                                width="600"
                                                height="300"
                                                style={{ display: 'block' }}
                                                onLoadStart={(event) => { event.target.style.display = 'none'; }}
                                                onCanPlay={(event) => { event.target.style.display = 'inline'; }}>
                                                <source src={`tribyl/api/video?location=${selectedVideo.location}`} type="video/mp4" />
                                                {/* <source src="https://www.radiantmediaplayer.com/media/bbb-360p.mp4" type="video/mp4" /> */}
                                                <track />
                                            </video>
                                        </div>}
                                </div>
                                <div className="video-details">
                                    <h2>Video Options</h2>
                                </div>
                            </div>
                        </div>
                    </MainPanel>
                </section>
            </ErrorBoundary>
        );
    }
}

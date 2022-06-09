/* eslint-disable jsx-a11y/media-has-caption */
import React from 'react';
import MediaCapturer from 'react-multimedia-capture';
import './PitchRecorder.scss';

export class PitchRecorder extends React.PureComponent {
    constructor(props) {
        super(props);
        const { pitchVideo } = this.props;
        this.state = {
            granted: false,
            rejectedReason: '',
            recording: false,
            paused: false,
            streamMessage: !!pitchVideo && 'Click Start to start Recording!',
            previewMode: !!pitchVideo,
            videoBlob: null,
            uploading: false,
            status: pitchVideo ? 'Practice Mode' : 'Idle'
        };
    }

    componentDidUpdate(prevProps) {
        const { title, pitchVideo } = this.props;
        if (title !== prevProps.title) {
            this.setState({
                granted: false,
                rejectedReason: '',
                recording: false,
                paused: false,
                streamMessage: !!pitchVideo && 'Click Start to start Recording!',
                previewMode: !!pitchVideo,
                videoBlob: null,
                uploading: false,
                status: pitchVideo ? 'Practice Mode' : 'Idle'
            });
        }
    }

    setStreamToVideo = (stream) => {
        const video = document.getElementById('pitch-video-stream');
        if (window.URL) {
            video.srcObject = stream;
        } else {
            video.src = stream;
        }
    }

    releaseStreamFromVideo = () => {
        document.getElementById('pitch-video-stream').src = '';
    }

    handleGranted = () => {
        this.setState({ granted: true });
    }

    handleDenied = (error) => {
        this.setState({ rejectedReason: error.name });
    }

    handleStart = (stream) => {
        this.setState({ recording: true, previewMode: false, status: 'Recording' }, () => this.setStreamToVideo(stream));
    }

    handleStop = (blob) => {
        this.releaseStreamFromVideo();
        this.setState({
            recording: false,
            previewMode: true,
            videoBlob: blob,
            // streamMessage: 'Click Start to start Recording!',
            streamMessage: null,
            status: 'Preview Mode'
        }, () => {
            const video = document.getElementById('pitch-video-preview');
            if (window.URL) {
                video.src = window.URL.createObjectURL(blob);
            } else {
                video.src = blob;
            }
        });
    }

    handlePause = () => {
        this.releaseStreamFromVideo();
        this.setState({ paused: true, streamMessage: 'Recording Paused! Click Resume to continue.', status: 'Paused' });
    }

    handleResume = (stream) => {
        this.setState({ paused: false, streamMessage: null, status: 'Recording' }, () => this.setStreamToVideo(stream));
    }

    handleError = (err) => {
        console.log(err); // eslint-disable-line
    }

    recordAgain = () => {
        this.setState({ previewMode: false, status: 'Idle' });
    }

    handleUpload = (blob) => {
        this.setState({ uploading: true }, () => this.props.upload(blob));
    }

    close = () => {
        const { close } = this.props;
        if (close) close();
    }

    render() {
        const { title, watchOnly, pitchVideo, deleteVideo, statusLabel } = this.props;
        const { status, paused, previewMode } = this.state;

        return (
            <div className="pitch-video-recorder">
                {/* {this.state.previewMode === false ? ( */}
                <MediaCapturer
                    constraints={{ audio: !watchOnly, video: !watchOnly }}
                    timeSlice={10}
                    onGranted={this.handleGranted}
                    onDenied={this.handleDenied}
                    onStart={this.handleStart}
                    onStop={this.handleStop}
                    onPause={this.handlePause}
                    onResume={this.handleResume}
                    onError={this.handleError}
                    render={({
                        start,
                        stop,
                        pause,
                        resume
                    }) => (
                            <div className="recorder-render-section">
                                {/* {rejectedReason && <p>Rejected Reason: {rejectedReason}</p>}
                                    {paused && <p>Paused: {paused.toString()}</p>}
                                    <p>Prefer recording your video of not more than 2 minutes.</p> */}
                                <div className="pitch-recorder-header-wrapper" id="pitch-recorder-header-wrapper">
                                    <h2>{title}</h2>
                                    <i className="material-icons" role="button" onClick={this.close}>close</i>
                                </div>
                                <div className="video-wrapper">
                                    {status === 'Idle' || status === 'Paused' || previewMode || pitchVideo
                                        ? (
                                            <div className="stream-message">
                                                <p>{(status === 'Idle' || previewMode) && <i className="material-icons">videocam</i>}</p>
                                                <p>{status === 'Paused' && <i className="material-icons">pause</i>}</p>
                                            </div>
                                        ) : !previewMode && <video id="pitch-video-stream" autoPlay width="400" height="300" muted />}
                                </div>
                                {
                                    previewMode ? (
                                        <div className="pitch-recorder-footer">
                                            <div className="pitch-recorder-status">{statusLabel || status}</div>
                                            <div className="pitch-recorder-actions">
                                                {!pitchVideo && <button className="upload" onClick={() => this.handleUpload(this.state.videoBlob)}>Upload <i className="material-icons">cloud_upload</i></button>}
                                                {!pitchVideo && <button className="redo" onClick={start}>Redo<i className="material-icons">replay</i></button>}
                                                {pitchVideo && deleteVideo && <button className="delete" onClick={deleteVideo}>Delete<i className="material-icons">delete</i></button>}
                                            </div>
                                        </div>
                                    ) : (
                                            <div className="pitch-recorder-footer">
                                                <div className="pitch-recorder-status">{statusLabel || status}</div>
                                                <div className="pitch-recorder-actions">
                                                    <button className={`${status !== 'Idle' ? 'disabled' : ''}`} onClick={start}><i className="material-icons record">fiber_manual_record</i></button>
                                                    {paused
                                                        ? <button className={`${status !== 'Paused' ? 'disabled' : ''}`} onClick={resume}><i className="material-icons play">play_arrow</i></button>
                                                        : <button className={`${status !== 'Recording' ? 'disabled' : ''}`} onClick={pause}><i className="material-icons pause">pause</i></button>}
                                                    <button className={`${status !== 'Recording' ? 'disabled' : ''}`} onClick={stop}><i className="material-icons stop">stop</i></button>
                                                </div>
                                            </div>
                                        )
                                }
                            </div>
                        )
                    } />
                {previewMode && <div className="preview-wrapper"><video id="pitch-video-preview" width="400" height="300" controls /></div>}
                {
                    pitchVideo && previewMode &&
                    <div 
                        id="pitch-video-preview"
                        className="preview-wrapper">
                        <video
                            controls
                            width="400"
                            height="300"
                            onLoadStart={(event) => { event.target.style.display = 'none'; }}
                            onCanPlay={(event) => { event.target.style.display = 'inline'; }}>
                            <source src={pitchVideo} type="video/mp4" />
                            <track />
                        </video>
                    </div>
                }
            </div>
        );
    }
}

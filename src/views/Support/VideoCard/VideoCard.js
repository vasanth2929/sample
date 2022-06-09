/* eslint-disable jsx-a11y/media-has-caption */
import React from 'react';
import './styles/VideoCard.style.scss';
import { VimeoPlayer } from '../VimeoPlayer/VimeoPlayer';


export function VideoCard(props) {
    const {
        author,
        dateAdded,
        id
    } = props;
    return (
        <div className="video-card-wrapper">
            <div className="card" style={{ width: "552px" }}>
                <div className="card-header">
                    <p className="card-text">{props.content}</p>
                </div>
                {/* <video width="550" poster={props.poster} height="250" controls>
                    <source src={props.url} type="video/mp4" />
                            Your browser does not support the video tag.
                </video> */}
                <VimeoPlayer width={550} url={props.url} id={id} />
                <div className="card-footer bg-transparent d-flex justify-content-between">
                    <small>Author: {author}</small>
                    <small>Date Added: {dateAdded}</small>
                </div>
            </div>
        </div>

    );
}


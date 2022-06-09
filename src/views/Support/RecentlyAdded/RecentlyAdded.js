import React from 'react';

import { VideoCard } from '../VideoCard/VideoCard';
import './styles/RecentlyAdded.style.scss';

export function RecentlyAdded(props) {
    const { videos } = props;

    return (
        <div className="recenly-added-wrapper">
            <div className="row d-flex">
                {videos && videos.map(video => (
                    <React.Fragment>
                        <div className="video-card">
                            <VideoCard
                                url={video.location}
                                poster="../../assets/citibank.png"
                                content={video.name}
                                author="Crystal Nikosey"
                                dateAdded="08/31/20"
                                id={video.id}
                            />
                        </div>
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
}

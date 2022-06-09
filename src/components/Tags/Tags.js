import React from 'react';
import './Tags.scss';

export class Tags extends React.Component {
    render() {
        const { tags } = this.props;
        return (
            <div className="tags-wrapper">
                {
                    tags &&
                    tags.map((tag, index) => {
                        return (
                            <div key={`tags-${index}`} className="tag">
                                <div className="tag-text">{tag}</div>
                            </div>
                        );
                    })
                }
            </div>
        );
    }
}

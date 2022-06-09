/* eslint-disable function-paren-newline */
/* eslint-disable radix */
/* eslint-disable no-plusplus */
import React from 'react';
import './Rating.scss';

export class Rating extends React.Component {
    ratingRef = React.createRef();
    constructor(props) {
        super(props);
        const { rating } = this.props;
        this.state = {
            rating,
            hoverRating: null,
            originalRating: rating
        };
    }

    componentDidUpdate() {
        const { rating } = this.props;
        if (rating !== this.state.rating) {
            this.setState({ rating, originalRating: rating });
        }
    }

    componentDidMount() {
        this.ratingRef.current.addEventListener('mouseover', this.handleMouseOver);
        this.ratingRef.current.addEventListener('mouseout', this.handleMouseOut);
    }

    componentWillUnmount() {
        this.ratingRef.current.removeEventListener('mouseover', this.handleMouseOver);
        this.ratingRef.current.removeEventListener('mouseout', this.handleMouseOut);
    }

    handleMouseOver = (e) => {
        if (this.ratingRef.current &&
            e.target.id !== 'ratingWrapper' &&
            this.ratingRef.current.contains(e.target)) {
            const rating = parseInt(e.target.dataset.value);
            this.setState({ hoverRating: rating });
        }
    }

    handleMouseOut = (e) => {
        // const { originalRating } = this.state;
        if (this.ratingRef.current &&
            e.target.id !== 'ratingWrapper' &&
            this.ratingRef.current.contains(e.target)) {
            this.setState({ hoverRating: null });
        }
    }

    handleRatingUpdate = (e) => {
        const { handleRatingUpdate } = this.props;
        const { originalRating } = this.state;
        const rating = parseInt(e.target.dataset.value);
        if (handleRatingUpdate) {
            if (rating !== originalRating) {
                handleRatingUpdate(rating);
            } else { // rating === originalRating
                handleRatingUpdate(0);
            }
        };
    }

    render() {
        const { rating, hoverRating } = this.state;
        return (
            <div
                ref={this.ratingRef}
                className="rating-wrapper"
                id="ratingWrapper">
                {
                    (() => {
                        const stars = [];
                        for (let i = 0; i < 5; i++) {
                            if (i < (hoverRating || rating)) {
                                stars.push(
                                    <i
                                        data-value={i + 1}
                                        role="button"
                                        key={i + 1}
                                        className="material-icons rating-star star"
                                        onClick={this.handleRatingUpdate}>
                                        star
                                    </i>
                                );
                            } else {
                                stars.push(
                                    <i
                                        data-value={i + 1}
                                        role="button"
                                        key={i + 1}
                                        className="material-icons rating-star star_border"
                                        onClick={this.handleRatingUpdate}>
                                        star_border
                                    </i>
                                );
                            }
                        }
                        return stars;
                    })()
                }
            </div>
        );
    }
}

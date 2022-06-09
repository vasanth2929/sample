import React from 'react';
import PropTypes from 'prop-types';

import './styles/HeadingPanel.style.scss';

export class HeadingPanel extends React.PureComponent {
    render() {
        const { header, children } = this.props;
        return (
            <section className="heading-panel">
                <div className="head-section">
                    {header}
                </div>
                <div className="body-section">
                    {children}
                </div>
            </section>
        );
    }
}

HeadingPanel.propTypes = {
    header: PropTypes.string,
    children: PropTypes.element,
};

HeadingPanel.defaultProps = { header: 'Heading', };

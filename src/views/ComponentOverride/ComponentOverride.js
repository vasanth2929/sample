import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const ComponentOverride = (props) => {
  useEffect(() => {
    console.log(props.user);
  }, []);

  return (
    <div className="loader">
      {/* <h1>This is a Custom Callback component</h1> */}
    </div>
  );
};

ComponentOverride.propTypes = {};

const mapStateToProps = (state) => ({
  user: state.oidc.user,
});

export default connect()(ComponentOverride);

import React from 'react';
import { connect } from 'react-redux';
import { CallbackComponent } from 'redux-oidc';
import { Loader } from '../../basecomponents/Loader/Loader';
import userManager from '../../util/userManager';

class CallbackPage extends React.Component {
  render() {
    // just redirect to '/' in both cases
    return (
      <CallbackComponent
        userManager={userManager}
        successCallback={() => this.props.history.push('/')}
        errorCallback={(error) => {
          this.props.history.push('/');
          console.error(error);
        }}
      >
        <Loader />
      </CallbackComponent>
    );
  }
}

export default connect()(CallbackPage);

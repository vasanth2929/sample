import React from 'react';
import { Redirect } from 'react-router-dom';
import { getCookie } from '../../util/cookieUtils';

export default class RedirectUri extends React.PureComponent {
  render() {
    const searchParam = new URLSearchParams(this.props.location.search);
    const redirectParam = searchParam.get('url');
    const userToken = getCookie('jwt');
    if (userToken === null) {
      return <Redirect to={`/?redirectUrl=${redirectParam}`} />;
    } else if (userToken) {
      return <Redirect to={redirectParam} />;
    }
    return (
      <section className="container-fluid">
        <p>
          <strong>Redirecting...</strong>
        </p>
      </section>
    );
  }
}

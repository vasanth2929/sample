import React from 'react';
import { ThemeProvider } from '@material-ui/core';
import { Router } from 'react-router-dom';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './util/store';
import App from './App';
import { theme } from './styles/theme/theme';
import { OidcProvider } from 'redux-oidc';
import userManager from './util/userManager';
import history from './util/history';

ReactDOM.render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <Router history={history}>
        <OidcProvider store={store} userManager={userManager}>
          <App />
        </OidcProvider>
      </Router>
    </ThemeProvider>
  </Provider>,
  document.getElementById('root')
);

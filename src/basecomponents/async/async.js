import * as React from 'react';
import { connect } from 'react-redux';
import { isEmpty } from '../../util/utils';
import {
  executePromiseAction,
  unsetReload,
  setError,
  setLoading,
} from '../../action/loadingActions';

class AsyncImpl extends React.PureComponent {
  componentWillMount() {
    this.executePromise(this.props.promise);
    this.parseProps();
  }
  componentWillReceiveProps(nextProps) {
    this.parseProps(nextProps);
    if (nextProps.reload) {
      this.unsetReload(nextProps.identifier);
      this.executePromise(nextProps.promise);
    }
  }

  refresh = (promise = this.props.promise) => {
    this.executePromise(promise);
  };

  unsetReload = (identifier) => {
    unsetReload(identifier);
  };

  Loader;
  Error;
  Content;
  resp;

  /** Initializes the Loader, Error and Content JSX. */
  parseProps = ({ content, error, loader } = this.props) => {
    this.Content = content;
    this.Error = error;
    this.Loader = loader;
  };

  responseHandler = (resp) => {
    this.resp = resp;
  };

  /** Executes the promise in the format required by redux promise middleware. */
  executePromise = (promiseFunction) => {
    const { identifier, handlePromiseResponse } = this.props;
    const promise =
      promiseFunction instanceof Function ? promiseFunction() : promiseFunction;
    setLoading(identifier);
    promise
      .then((response) => {
        this.responseHandler(response.data);
        executePromiseAction(promise, identifier);
        if (handlePromiseResponse) handlePromiseResponse(response.data);
      })
      .catch((error) => {
        console.log('Error'); // eslint-disable-line
        console.log(error); // eslint-disable-line
        setError(identifier);
        this.responseHandler(error);
      });
  };

  renderData = (data) => {
    // TODO sometimes this is called before the promise is executed. Figure out why that is happening
    if (data instanceof Function) {
      return data(this.resp);
    }
    return React.Children.only(data);
  };

  /** Renders JSX according to the loading state in the store. */
  render() {
    const {
      props: { loadingState },
      Loader,
      Error,
      Content,
      renderData,
    } = this;

    const { isLoading, hasError } = loadingState;
    try {
      if ((isEmpty(loadingState) || isLoading) && Loader) {
        return renderData(Loader);
      }

      if (!isLoading && !hasError) {
        return renderData(Content);
      }

      if (hasError && Error) {
        console.log('Error'); // eslint-disable-line
        console.log(Error); // eslint-disable-line
        return renderData(Error);
      }
    } catch (e) {
      throw e;
    }
    return null;
  }
}

export function mapStateToProps(state, { identifier, initialState }) {
  return {
    loadingState: state.loading.get(identifier) || initialState || {},
    reload: state.loading.get('$reload', []).includes(identifier),
  };
}

export const Async = connect(mapStateToProps, null, null, { withRef: true })(
  AsyncImpl
);

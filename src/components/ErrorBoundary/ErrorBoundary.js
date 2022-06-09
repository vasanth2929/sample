import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      errors: '',
      stack: ''
    };
  }

  componentDidCatch(error, info) {
    // Display fallback UI
    this.setState({
      hasError: true,
      errors: error,
      stack: info
    });
  }

  render() {
    if (this.state.hasError) {
      const style = {
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
        height: '100%'
      };
      // You can render any custom fallback UI
      return (
        <div style={style}>
          <h3>Oops, something went wrong <i className="material-icons">build</i></h3>
        </div>);
    }
    return this.props.children;
  }
}

import React from 'react';

export default (observables, triggers) => Component => {
  return class extends React.Component {
    componentDidMount() {
      this.subscriptions = observables.map(observable =>
        observable.subscribe(
          newState => this.setState({ ...newState }),
        ),
      );
    }

    componentWillUnmount() {
      this.subscriptions.forEach(subscription =>
        subscription.unsubscribe(),
      );
    }

    render() {
      return (
        <Component {...this.props} {...this.state} {...triggers} />
      );
    }
  };
};

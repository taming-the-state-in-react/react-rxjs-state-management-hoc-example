import React from 'react';

export default (observables, actions, initialState) => Component => {
  return class extends React.Component {
    componentDidMount() {
      this.subscriptions = observables.map(observable =>
        observable.subscribe(
          newState =>
            console.log(newState) || this.setState({ ...newState }),
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
        <Component {...this.props} {...this.state} {...actions} />
      );
    }
  };
};

import React from 'react';

export default (observables, actions, initialState) => Component => {
  return class extends React.Component {
    constructor(props) {
      super(props);

      this.state = { ...initialState };
    }

    componentDidMount() {
      this.subscriptions = observables.map(observable =>
        observable.subscribe(newState =>
          this.setState({ ...newState }),
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

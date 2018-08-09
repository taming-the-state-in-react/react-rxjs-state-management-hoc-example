import React from 'react';

export default function connect(state, actions) {
  return function(Component) {
    return class extends React.Component {
      subscription;

      componentWillMount() {
        this.subscription = state.subscribe(this.setState.bind(this));
      }

      componentWillUnmount() {
        this.subscription.unsubscribe();
      }

      render() {
        return (
          <Component
            {...this.props}
            {...this.state}
            actions={actions}
          />
        );
      }
    };
  };
}

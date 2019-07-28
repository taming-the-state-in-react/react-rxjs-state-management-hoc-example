import React, { Component } from 'react';
import { skip, first, shareReplay } from 'rxjs/operators';

export default (observable, triggers) => InnerComponent => {
  class Decorated extends Component {
    constructor(props) {
      super(props);
      this.sharedObservable = observable.pipe(shareReplay(1));

      const initializationSubscription = this.sharedObservable
        .pipe(first())
        .subscribe(initialState => {
          this.state = initialState;
        });
      initializationSubscription.unsubscribe();
    }

    componentDidMount() {
      this.subscription = this.sharedObservable
        .pipe(skip(1))
        .subscribe(newState => {
          this.setState(newState);
        });
    }

    componentWillUnmount() {
      this.subscription.unsubscribe();
    }

    render() {
      return (
        <InnerComponent {...this.props} {...this.state} {...triggers}/>
      );
    }
  }

  Decorated.displayName = `withObservableStream(${InnerComponent.displayName ||
    InnerComponent.name})`;

  return Decorated;
};

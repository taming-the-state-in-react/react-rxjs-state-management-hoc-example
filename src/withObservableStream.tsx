import React, { Component } from 'react';
import { Observable, Subscription } from 'rxjs';
import { skip, first, shareReplay } from 'rxjs/operators';

export default <S, C extends object = {}>(
  observable: Observable<S>,
  triggers: C,
) => <P2, SS2>(InnerComponent: React.ComponentType<P2 & C>) => {
  class Decorated extends Component<P2 & C, S | undefined, SS2> {
    static displayName: string;

    private subscription?: Subscription;
    private sharedObservable: Observable<S>;

    constructor(props: Readonly<P2 & C>) {
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
      this.subscription!.unsubscribe();
    }

    render() {
      return (
        <InnerComponent
          {...this.props}
          {...this.state}
          {...triggers}
        />
      );
    }
  }

  Decorated.displayName = `withObservableStream(${(InnerComponent as any)
    .displayName || InnerComponent.name})`;

  return Decorated;
};

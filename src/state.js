import { BehaviorSubject } from 'rxjs/index';
// import { switchMap } from 'rxjs/operators';

export const CURRENCIES = {
  USD: 'USD',
  EUR: 'EUR',
};

export const selectedCurrency$ = new BehaviorSubject({
  currency: CURRENCIES['USD'],
});

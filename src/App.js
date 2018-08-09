import React from 'react';

import { selectedCurrency$, CURRENCIES } from './state';
import connect from './connect';

const TradingPairs = ({ currency, actions }) => (
  <div>
    <h1>Trading Pair</h1>
    <p>{currency}</p>

    <div>
      {Object.values(CURRENCIES).map(currency => (
        <button
          key={currency}
          onClick={() => actions.onSelectCurrency({ currency })}
          type="button"
        >
          {currency}
        </button>
      ))}
    </div>
  </div>
);

const TradingPairsConnected = connect(
  selectedCurrency$,
  {
    onSelectCurrency: selectedCurrency$.next.bind(selectedCurrency$),
  },
)(TradingPairs);

const App = () => <TradingPairsConnected />;

export default App;

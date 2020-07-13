import React from 'react';
import axios from 'axios';
import { BehaviorSubject, combineLatest } from 'rxjs';
import {
  map,
  filter,
  startWith,
  debounceTime,
  distinctUntilChanged,
  switchMap,
  catchError,
} from 'rxjs/operators';

import withObservableStream from './withObservableStream';

const SUBJECT = {
  POPULARITY: 'search',
  DATE: 'search_by_date',
};

const App = ({
  query,
  subject,
  stories,
  onChangeQuery,
  onSelectSubject,
}) => (
  <div>
    <h1>React with RxJS</h1>

    <input
      type="text"
      value={query}
      onChange={event => onChangeQuery(event.target.value)}
    />

    <div>
      {Object.values(SUBJECT).map(subject => (
        <button
          key={subject}
          onClick={() => onSelectSubject(subject)}
          type="button"
        >
          {subject}
        </button>
      ))}
    </div>

    <p>
      Fetching from:{' '}
      {`http://hn.algolia.com/api/v1/${subject}?query=${query}`}
    </p>

    <ul>
      {stories.map(story => (
        <li key={story.objectID}>
          <a href={story.url || story.story_url}>
            {story.title || story.story_title}
          </a>
        </li>
      ))}
    </ul>
  </div>
);

const query$ = new BehaviorSubject('react');
const subject$ = new BehaviorSubject(SUBJECT.POPULARITY);

const queryForFetch$ = query$.pipe(
  debounceTime(1000),
  distinctUntilChanged(),
  filter(Boolean),
);

const fetch$ = combineLatest(subject$, queryForFetch$).pipe(
  switchMap(
    // discard previous requests. Response order not granted.
    ([subject, query]) =>
      axios(`http://hn.algolia.com/api/v1/${subject}?query=${query}`),
  ),
  map(result => result.data.hits),
  startWith([]),
  catchError(() => []),
);

const state$ = combineLatest(
  subject$,
  query$,
  fetch$,
  (subject, query, stories) => ({
    subject,
    query,
    stories,
  }),
);

export default withObservableStream(state$, {
  onSelectSubject: subject => subject$.next(subject),
  onChangeQuery: value => query$.next(value),
})(App);

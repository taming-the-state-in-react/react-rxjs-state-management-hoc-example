import React from 'react';
import axios from 'axios';
import { BehaviorSubject, combineLatest, timer } from 'rxjs';
import { flatMap, map, debounce, filter } from 'rxjs/operators';

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
  debounce(() => timer(1000)),
  filter(query => query !== ''),
);

const fetch$ = combineLatest(subject$, queryForFetch$).pipe(
  flatMap(([subject, query]) =>
    axios(`http://hn.algolia.com/api/v1/${subject}?query=${query}`),
  ),
  map(result => result.data.hits),
);

export default withObservableStream(
  combineLatest(
    subject$,
    query$,
    fetch$,
    (subject, query, stories) => ({
      subject,
      query,
      stories,
    }),
  ),
  {
    onSelectSubject: subject => subject$.next(subject),
    onChangeQuery: value => query$.next(value),
  },
  {
    query: 'react',
    subject: SUBJECT.POPULARITY,
    stories: [],
  },
)(App);

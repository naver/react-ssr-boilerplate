/*
react-ssr-boilerplate
Copyright 2021-present NAVER Corp.
MIT license
 */

import 'core-js';
import React from 'react';
import { hydrate } from 'react-dom';
import { loadableReady } from '@loadable/component';
import App from './App.tsx';
import config from '../server/config';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

loadableReady(() => {
  const client = new ApolloClient({
    cache: new InMemoryCache().restore(
      window?.reactssr?.sample?.__APOLLO_STATE__,
    ),
    uri: `${config.apiUrl}/graphql`,
  });

  const { title } = window?.reactssr?.sample?.bridge;

  const root = document.getElementById('app');

  hydrate(
    <ApolloProvider client={client}>
      <App title={title} />
    </ApolloProvider>,
    root,
  );
});

/*
react-ssr-boilerplate
Copyright 2021-present NAVER Corp.
MIT license
 */

import path from 'path';
import express from 'express';
import React from 'react';
import fetch from 'isomorphic-unfetch';
import { constants } from 'http2';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from '@apollo/client';
import { renderToStringWithData } from '@apollo/react-ssr';
import { ChunkExtractor } from '@loadable/server';
import { getFullHtml, getExtraScript } from './html';
import config from './config/index';

const development = process.env.NODE_ENV === 'development';

const app = express();
const relativePublicPath = '../../public';
const serverAssetPath = '/dist/node';
const clientAssetPath = '/dist/web';

app.use(express.static(path.join(__dirname, relativePublicPath)));

if (development) {
  /* eslint-disable global-require, import/no-extraneous-dependencies */
  const { default: webpackConfig } = require('../../webpack.config.babel');
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpack = require('webpack');
  /* eslint-enable global-require, import/no-extraneous-dependencies */

  const compiler = webpack(webpackConfig);

  app.use(
    webpackDevMiddleware(compiler, {
      publicPath: clientAssetPath,
      writeToDisk(filePath) {
        return /dist\/node\//.test(filePath) || /loadable-stats/.test(filePath);
      },
    }),
  );
}

const nodeStats = path.resolve(
  __dirname,
  `${relativePublicPath}${serverAssetPath}/loadable-stats.json`,
);

const webStats = path.resolve(
  __dirname,
  `${relativePublicPath}${clientAssetPath}/loadable-stats.json`,
);

app.get('/monitor/l7check', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.statusCode = constants.HTTP_STATUS_OK;
  res.end(JSON.stringify({ status: 'Ready' }));
});

function asyncWrapper(callback) {
  return (req, res, next) => {
    callback(req, res, next).catch(next);
  };
}

app.get(
  '*',
  asyncWrapper(async (req, res) => {
    const client = new ApolloClient({
      link: createHttpLink({
        ssr: true,
        uri: `${config.apiUrl}/graphql`,
        fetch,
        headers: {
          cookie: req.header('Cookie'),
        },
      }),
      cache: new InMemoryCache(),
    });

    const nodeExtractor = new ChunkExtractor({ statsFile: nodeStats });
    const { default: App } = nodeExtractor.requireEntrypoint();

    const webExtractor = new ChunkExtractor({ statsFile: webStats });

    const title = req.query.title;
    const bridge = { title };

    const app = (
      <ApolloProvider client={client}>
        <App title={title} />
      </ApolloProvider>
    );

    const jsx = webExtractor.collectChunks(app);

    const html = await renderToStringWithData(jsx);
    const apolloCache = client.extract();

    const extraScript = getExtraScript(apolloCache, bridge);

    const fullHtml = getFullHtml({ html, webExtractor, extraScript });

    res.set('content-type', 'text/html');
    res.send(fullHtml);
  }),
);

// eslint-disable-next-line no-console
app.listen(3000, () => console.log('Server started http://localhost:3000'));

/*
react-ssr-boilerplate
Copyright 2021-present NAVER Corp.
MIT license
 */

import { ChunkExtractor } from '@loadable/server';
import { NormalizedCacheObject } from '@apollo/client';

const getExtraScript = (apolloCache: NormalizedCacheObject, bridge: object) => `
  <script>
  typeof window.reactssr === 'undefined' && (window.reactssr = {});
  reactssr.sample = reactssr.sample || {};
  reactssr.sample.__APOLLO_STATE__ = ${JSON.stringify(apolloCache).replace(
    /</g,
    '\\u003c',
  )};
  reactssr.sample.bridge = ${JSON.stringify(bridge).replace(/</g, '\\u003c')};
  </script>
`;

interface IParam {
  html: string;
  webExtractor: ChunkExtractor;
  extraScript?: string;
}

const getFullHtml = ({
  html,
  webExtractor,
  extraScript,
}: IParam) => `<!DOCTYPE html>
  <html>
    <head>
    ${extraScript ? extraScript : ''}
    ${webExtractor.getLinkTags()}
    ${webExtractor.getStyleTags()}
    </head>
    <body>
      <div id="main">${html}</div>
      ${webExtractor.getScriptTags()}
    </body>
  </html>`;

export { getExtraScript, getFullHtml };

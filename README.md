# react-ssr-boilerplate

React SSR boilerplate with Loadable Components

## Features

- React SSR
- [Loadable Components](https://loadable-components.com/)
- Typescript
- GraphQL with [Apollo Client](https://www.apollographql.com/docs/react)
- [Yarn workspace](https://classic.yarnpkg.com/en/docs/workspaces/)
- Sprite images with [webpack-spritesmith](https://www.npmjs.com/package/webpack-spritesmith)
- Scss
- ESLint

## Quickstart

```
yarn install
yarn workspace @react-ssr-boilerplate/sample dev
```

### List page

> http://localhost:3000/list

OR

> http://localhost:3000/list?title=Naver

### Health Check

> http://localhost:3000/monitor/l7check

## Passing query parameters

1. Pass query parameters to client side as window object

> packages/sample/src/server/main.js

```js
const bridge = { title };

//skip...

const extraScript = getExtraScript(apolloCache, bridge);
```

> packages/sample/src/server/html.ts

```ts
const getExtraScript = (apolloCache: NormalizedCacheObject, bridge: object) => `
  <script>
  //skip...
  reactssr.sample.bridge = ${JSON.stringify(bridge).replace(/</g, '\\u003c')};
  </script>
`;
```

2. Same as server side, pass assigned window object to App component parameter

> packages/sample/src/client/main-web.js

```js
const { title } = window?.reactssr?.sample?.bridge;

const root = document.getElementById('app');

hydrate(
  <ApolloProvider client={client}>
    <App title={title} />
  </ApolloProvider>,
  root,
);
```

# License

```
MIT License

Copyright (c) 2021-present NAVER Corp.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```

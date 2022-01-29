/*
react-ssr-boilerplate
Copyright 2021-present NAVER Corp.
MIT license
 */
function isWebTarget(caller) {
  return Boolean(caller && caller.target === 'web');
}

function isWebpack(caller) {
  return Boolean(caller && caller.name === 'babel-loader');
}

module.exports = api => {
  const web = api.caller(isWebTarget);
  const webpack = api.caller(isWebpack);

  const config = {
    presets: [
      '@babel/preset-typescript',
      '@babel/preset-react',
      [
        '@babel/preset-env',
        {
          useBuiltIns: web ? 'entry' : undefined,
          corejs: web ? 'core-js@3' : false,
          targets: !web ? { node: 'current' } : undefined,
          modules: webpack ? false : 'commonjs',
        },
      ],
    ],
    plugins: [
      '@babel/plugin-syntax-dynamic-import',
      '@babel/plugin-transform-modules-commonjs',
      '@loadable/babel-plugin',
      '@babel/plugin-proposal-class-properties',
      [
        '@babel/plugin-transform-runtime',
        {
          corejs: 3,
        }
      ],
    ],
  };

  return config;
};

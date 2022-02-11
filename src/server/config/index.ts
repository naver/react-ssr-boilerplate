/*
react-ssr-boilerplate
Copyright 2021-present NAVER Corp.
MIT license
 */

import development from './development';
import test from './test';
import stage from './stage';
import production from './production';

export interface IConfig {
  apiUrl: string;
}

const configMap = new Map<string, IConfig>([
  ['development', development],
  ['test', test],
  ['stage', stage],
  ['production', production],
]);

const config = configMap.get(process.env.NODE_ENV || 'development');

export default config;

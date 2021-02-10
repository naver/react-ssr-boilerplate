/*
react-ssr-boilerplate
Copyright 2021-present NAVER Corp.
MIT license
 */

import React from 'react';
import loadable from '@loadable/component';

const List = loadable(() => import('./component/list'));

interface IProp {
  title: string;
}

const App = ({ title }: IProp) => <List title={title} />;

export default App;

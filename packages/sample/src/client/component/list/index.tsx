/*
react-ssr-boilerplate
Copyright 2021-present NAVER Corp.
MIT license
 */

import React from 'react';
import { useQuery } from '@apollo/client';
import Loading from '@react-ssr-boilerplate/common/src/component/Loading';
import Error from '@react-ssr-boilerplate/common/src/component/Error';
import { LAUNCHES_PAST, ILaunchesPastResult } from '../../query/spaceX';
import Item from './Item';

interface IProp {
  title: string;
}

function List(props: IProp) {
  const { title } = props;

  const { loading, error, data } = useQuery<ILaunchesPastResult>(
    LAUNCHES_PAST,
    {
      variables: {
        limit: 10,
      },
    },
  );

  if (loading) return <Loading />;

  if (error) {
    return <Error error={error} />;
  }

  if (!data) return null;

  const { launchesPast } = data;

  return (
    <body>
      <h1>Hello {title || 'SpaceX'}</h1>
      <table>
        <thead>
          <tr>
            <th>mission name</th>
            <th>launch date</th>
            <th>launch site</th>
          </tr>
        </thead>
        <tbody>
          {launchesPast.map(item => (
            <Item key={item.id} item={item} />
          ))}
        </tbody>
      </table>
    </body>
  );
}

export default List;

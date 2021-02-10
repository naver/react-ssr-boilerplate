/*
react-ssr-boilerplate
Copyright 2021-present NAVER Corp.
MIT license
 */

import React, { Fragment } from 'react';
import dayjs from 'dayjs';
import { ILaunchesPast } from '../../query/spaceX';
import './list.scss';

interface IProp {
  item: ILaunchesPast;
}

const Item = ({ item }: IProp) => {
  const {
    mission_name,
    launch_date_local,
    launch_site: { site_name_long },
  } = item;

  return (
    <Fragment>
      <tr>
        <td>{mission_name}</td>
        <td>{dayjs(launch_date_local).format('YYYY.MM.DD.')}</td>
        <td>{site_name_long}</td>
      </tr>
    </Fragment>
  );
};

export default Item;

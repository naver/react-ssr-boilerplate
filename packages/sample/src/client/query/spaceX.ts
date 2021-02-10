/*
react-ssr-boilerplate
Copyright 2021-present NAVER Corp.
MIT license
 */

import { gql } from '@apollo/client';

const LAUNCHES_PAST = gql`
  query launchesPast($limit: Int) {
    launchesPast(limit: $limit) {
      id
      mission_name
      launch_date_local
      launch_site {
        site_name_long
      }
    }
  }
`;

export interface ILaunchesPastResult {
  launchesPast: [ILaunchesPast];
}

export interface ILaunchesPast {
  id: string;
  mission_name: string;
  launch_date_local: string;
  launch_site: {
    site_name_long: string;
  };
}

export { LAUNCHES_PAST };

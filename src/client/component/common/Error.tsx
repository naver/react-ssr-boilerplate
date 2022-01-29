/*
react-ssr-boilerplate
Copyright 2021-present NAVER Corp.
MIT license
 */
import React from 'react';

interface IProp {
  error: any;
  message?: string;
}

const Error = ({ error, message = 'error!' }: IProp) => {
  // you can use other logger
  console.log(JSON.stringify(error));

  return (
    <div className={'error'}>
      <div className={'inner'}>
        <p className={'text'}>{message}</p>
      </div>
    </div>
  );
};
export default Error;

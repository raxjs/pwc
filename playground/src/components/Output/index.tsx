import { useState, createElement, useEffect } from 'react';
import store from '@/store';
import { evalCode } from '@/tools/evalCode';

export default () => {
  const [code] = store.useModel('code');
  useEffect(() => {
    evalCode(code.value, `test-component-${code.componentIndex}`);
  }, [code]);
  return (
    <div>
      {
        createElement(`test-component-${code.componentIndex}`)
      }
    </div>
  );
};

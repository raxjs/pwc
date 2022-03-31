import { createElement, useEffect } from 'react';
import store from '@/store';
import { evalCode } from '@/tools/evalCode';

export default () => {
  const [code] = store.useModel('code');
  useEffect(() => {
    evalCode(code.value);
  }, []);
  return (
    <div>
      {
        createElement('test-component')
      }
    </div>
  );
};

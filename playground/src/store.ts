import { createStore } from 'ice';
import code from './models/code';

const store = createStore(
  {
    code,
  },
  {
    // options
  },
);

export default store;

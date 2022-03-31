import type { IAppConfig } from 'ice';
import { runApp } from 'ice';

const appConfig: IAppConfig = {
  app: {
    rootId: 'ice-container',
  },
};

runApp(appConfig);

import type { IRouterConfig } from 'ice';
import { lazy } from 'ice';

const Home = lazy(async () => import('@/pages/Home'));

const routerConfig: IRouterConfig[] = [
  {
    path: '/',
    component: Home,
  },
];

export default routerConfig;

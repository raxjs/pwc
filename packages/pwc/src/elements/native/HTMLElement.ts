import overrideElementDefine from '../overrideElementDefine';
import reactiveElementFactory from '../reactiveElementFactory';

overrideElementDefine(reactiveElementFactory(HTMLElement));

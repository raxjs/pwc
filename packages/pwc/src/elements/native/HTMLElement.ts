import overrideElementDefine from '../overrideElementDefine';
import mixinElement from '../mixinElement';
import BaseElement from '../BaseElement';

overrideElementDefine(mixinElement(HTMLElement, BaseElement));

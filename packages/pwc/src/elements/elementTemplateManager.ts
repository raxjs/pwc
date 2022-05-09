import { TemplateFlag } from '../constants';
import type { Fn } from '../type';
import { isFalsy } from '../utils';

interface ManagerActions {
  falsyAction: Fn;
  pwcElementTemplateAction: Fn;
  arrayAction?: Fn;
  textAction: Fn;
}

export function elementTemplateManager(elementTemplate, {
  falsyAction,
  pwcElementTemplateAction,
  arrayAction,
  textAction,
}: ManagerActions) {
  if (isFalsy(elementTemplate)) {
    falsyAction();
  } else if (elementTemplate[TemplateFlag]) {
    pwcElementTemplateAction();
  } else if (arrayAction) {
    arrayAction();
  } else {
    textAction();
  }
}

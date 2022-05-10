import type { Fn } from '../type';
import { isFalsy, isTemplate } from '../utils';

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
  } else if (isTemplate(elementTemplate)) {
    pwcElementTemplateAction();
  } else if (arrayAction) {
    arrayAction();
  } else {
    textAction();
  }
}

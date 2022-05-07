import { TemplateData, TemplateFlag, TemplateString } from '../constants';
import { ElementTemplate, PWCElementTemplate } from '../type';
import { isFalsy } from '../utils';

export function getTemplateInfo(elementTemplate: ElementTemplate): PWCElementTemplate {
  let templateString;
  let templateData = [];

  // Return empty string, while elementTemplate is falsy
  if (isFalsy(elementTemplate)) {
    templateString = '';
  } else if (elementTemplate[TemplateFlag]) {
    templateString = elementTemplate[TemplateString];
    templateData = elementTemplate[TemplateData];
  } else {
    templateString = elementTemplate;
  }

  // TODO: xss
  return {
    templateString,
    templateData,
    template: true,
  };
}

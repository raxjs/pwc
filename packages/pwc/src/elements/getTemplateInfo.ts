import { TemplateData, TemplateFlag, TemplateString } from '../constants';
import { ElementTemplate, PWCElementTemplate } from '../type';

export function getTemplateInfo(elementTemplate: ElementTemplate): PWCElementTemplate {
  let templateString;
  let templateData = [];
  if (elementTemplate[TemplateFlag]) {
    templateString = elementTemplate[TemplateString];
    templateData = elementTemplate[TemplateData];
  } else {
    templateString = elementTemplate;
  }

  // TODO: xss
  return {
    templateString,
    templateData,
  };
}

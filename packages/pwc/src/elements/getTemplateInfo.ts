import { TemplateData, TemplateString } from '../constants';
import { ElementTemplate, PWCElementTemplate } from '../type';

export function getTemplateInfo(elementTemplate: ElementTemplate): PWCElementTemplate {
  let templateString;
  let templateData = [];
  if (typeof elementTemplate === 'string') {
    templateString = elementTemplate;
  } else {
    templateString = elementTemplate[TemplateString];
    templateData = elementTemplate[TemplateData];
  }
  return {
    templateString,
    templateData,
  };
}

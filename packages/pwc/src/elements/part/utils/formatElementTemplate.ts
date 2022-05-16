import { TemplateData, TemplateString, TEXT_COMMENT_DATA } from '../../../constants';
import { ElementTemplate, PWCElementTemplate } from '../../../type';
import { elementTemplateManager } from './elementTemplateManager';

export function formatElementTemplate(elementTemplate: ElementTemplate): PWCElementTemplate {
  let templateString;
  let templateData = [];

  elementTemplateManager(elementTemplate, {
    falsyAction() {
      // Return empty string, while elementTemplate is falsy
      templateString = '';
    },
    pwcElementTemplateAction() {
      templateString = elementTemplate[TemplateString];
      templateData = elementTemplate[TemplateData];
    },
    textAction() {
      templateString = elementTemplate;
    },
    arrayAction() {
      templateString = `<!--${TEXT_COMMENT_DATA}-->`;
      templateData = [elementTemplate];
    },
  });

  // TODO: xss
  return {
    templateString,
    templateData,
    template: true,
  };
}

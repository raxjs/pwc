import { TemplateData, TemplateString } from '../constants';
import { ElementTemplate, PWCElementTemplate } from '../type';
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
  });

  // TODO: xss
  return {
    templateString,
    templateData,
    template: true,
  };
}

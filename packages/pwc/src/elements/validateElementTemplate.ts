import { throwError } from '../error';
import { ElementTemplate } from '../type';

export function validateElementTemplate(elementTemplate: ElementTemplate) {
  if (typeof elementTemplate === 'string') return;
  console.log(elementTemplate);

  if (elementTemplate.template !== true) {
    throwError('Invalid template, it should return type field.');
  }
}

import { TemplateDataItemType } from '../../../type';
import { isArray, isTemplate } from '../../../utils';

export enum TextCommentDataType {
  'Array',
  'Template',
  'Text',
}

export function toTextCommentDataType(value: TemplateDataItemType) {
  if (isArray(value)) {
    return TextCommentDataType.Array;
  }
  if (isTemplate(value)) {
    return TextCommentDataType.Template;
  }
  return TextCommentDataType.Text;
}
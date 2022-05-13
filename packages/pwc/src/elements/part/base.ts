import { PWCElement, TemplateDataItemType } from '../../type';

export class BasePart {
  commentNode: Comment;
  rootElement: PWCElement;

  constructor(commentNode: Comment, rootElement: PWCElement, initialValue: TemplateDataItemType) {
    this.commentNode = commentNode;
    this.rootElement = rootElement;
  }

  // Initial values
  init(...args: any[]) {}

  // Remove node
  remove() {}

  // Render node
  render(value: TemplateDataItemType) {}

  // Trigger update
  commitValue([prev, current]: [TemplateDataItemType, TemplateDataItemType]) {}
}

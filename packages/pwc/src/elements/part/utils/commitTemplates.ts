import { Attributes, PWCElement, PWCElementTemplate, TemplateDataItemType } from '../../../type';
import { AttributesPart, BasePart, DynamicNode, formatElementTemplate, TemplatePart, TextCommentDataType, TextPart, toTextCommentDataType } from '..';

function remove(node: DynamicNode) {
  if (node.part) {
    node.part.remove();
  } else {
    for (let item of node.children) {
      remove(item);
    }
  }
}

export function renderTextCommentTemplate(
  commentNode: Comment,
  rootElement: PWCElement,
  value: TemplateDataItemType,
): DynamicNode {
  const node: DynamicNode = {
    commentNode,
  };
  const dataType = toTextCommentDataType(value);
  switch (dataType) {
    case TextCommentDataType.Array: {
      const children: DynamicNode[] = [];
      (value as any[]).forEach(item => {
        children.push(renderTextCommentTemplate(commentNode, rootElement, item));
      });
      node.children = children;
      break;
    }
    case TextCommentDataType.Template: {
      node.part = new TemplatePart(commentNode, rootElement, value as PWCElementTemplate);
      break;
    }
    default: {
      node.part = new TextPart(commentNode, rootElement, value as string);
      break;
    }
  }
  return node;
}

export function commitTemplates(
  [prev, current]: [PWCElementTemplate, PWCElementTemplate],
  dynamicNode: DynamicNode,
  rootElement: PWCElement,
) {
  const {
    templateString: prevTemplateString,
    templateData: prevTemplateData,
  } = prev;
  const {
    templateString,
    templateData,
  } = current;
  // If template strings is constant with prev ones,
  // it should just update node values and attributes
  if (prevTemplateString === templateString && dynamicNode.children) {
    for (let index = 0; index < templateData.length; index++) {
      const node = dynamicNode.children[index];
      const prevData = prevTemplateData[index];
      const data = templateData[index];

      // Create new part
      if (!node) {
        dynamicNode.children[index] = renderTextCommentTemplate(dynamicNode.commentNode, rootElement, data);
        continue;
      }

      // AttributesPart updated
      if (node.part instanceof AttributesPart) {
        node.part.commitValue([prevData as Attributes, data as Attributes]);
        continue;
      }

      const prevDataType = toTextCommentDataType(prevData);
      const dataType = toTextCommentDataType(data);

      // If data type is different, it should re render parts
      if (prevDataType !== dataType) {
        remove(node);
        dynamicNode.children[index] = renderTextCommentTemplate(node.commentNode, rootElement, data);
        continue;
      }

      if (node.children) {
        let cIndex = 0;
        for (; cIndex < (data as any[]).length; cIndex++) {
          if (node.children[cIndex]) {
            commitTemplates(
              [
                formatElementTemplate(prevData[cIndex]),
                formatElementTemplate(data[cIndex]),
              ], node.children[cIndex], rootElement);
          } else {
            node.children.push(renderTextCommentTemplate(node.commentNode, rootElement, data[cIndex]));
          }
        }
        for (; cIndex < node.children.length; cIndex++) {
          remove(node.children[cIndex]);
        }
        continue;
      }

      if (node.part instanceof BasePart) {
        node.part.commitValue([prevData, data]);
      }
    }
    return;
  }
  // If template strings changed, it should rerender
  remove(dynamicNode);
  const { part, children } = renderTextCommentTemplate(dynamicNode.commentNode, rootElement, current);

  // Passing valus
  dynamicNode.part = part;
  dynamicNode.children = children;
}

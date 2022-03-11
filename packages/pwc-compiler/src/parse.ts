import * as parse5 from 'parse5';

export interface SFCBlock {
  type: string;
  content: string;
  attrs: Record<string, string | true>;
  lang?: string;
  src?: string;
  loc: SourceLocation;
}

export interface SFCTemplateBlock extends SFCBlock {
  type: 'template';
  ast: ElementNode;
}

export interface SFCScriptBlock extends SFCBlock {
  type: 'script';
}

export interface SFCStyleBlock extends SFCBlock {
  type: 'style';
  scoped?: boolean;
}

export interface SFCDescriptor {
  filename: string;
  source: string;
  template: SFCTemplateBlock | null;
  script: SFCScriptBlock | null;
  styles: SFCStyleBlock | null;
}

export interface SFCParseOptions {
  filename?: string;
  sourceMap?: boolean;
  ignoreEmpty?: boolean;
}

export interface SFCParseResult {
  descriptor: SFCDescriptor;
  errors: SyntaxError[];
}

export interface Node {
  type: string;
  sourceCodeLocation: SourceLocation;
}

export interface SourceLocation {
  startLine: number;
  startCol: number;
  startOffset: number;
  endLine: number;
  endCol: number;
  endOffset: number;
  source: string;
}

export interface Position {
  offset: number; // from start of file
  line: number;
  column: number;
}

export interface ElementNode extends Node {
  type: string;
  ns: number;
  tagName: string;
  isSelfClosing: boolean;
  attrs: AttributeNode[];
  childNodes: ElementNode[];
}

export interface AttributeNode {
  name: string;
  value: string;
}

function createBlock(
  node: ElementNode,
  source: string,
): SFCBlock {
  const type = node.tagName;
  const { startLine, startCol, startOffset, endLine, endCol, endOffset } = node.sourceCodeLocation;
  let content = '';
  if (node.childNodes.length) {
    const start = node.childNodes[0].sourceCodeLocation.startOffset;
    const end = node.childNodes[node.childNodes.length - 1].sourceCodeLocation.endOffset;
    content = source.slice(start, end);
  } else {
    // TODO:
  }
  const loc = {
    source: content,
    startLine,
    startCol,
    startOffset,
    endLine,
    endCol,
    endOffset,
  };
  const attrs: Record<string, string | true> = {};
  const block: SFCBlock = {
    type,
    content,
    loc,
    attrs,
  };
  node.attrs.forEach((p) => {
    attrs[p.name] = p.value ? p.value || true : true;
    if (p.name === 'lang') {
      block.lang = p.value && p.value;
    } else if (type === 'style') {
      if (p.name === 'scoped') {
        (block as SFCStyleBlock).scoped = true;
      }
    }
  });
  return block;
}

export function parse(source: string, {
  filename = 'anonymous.pwc',
  sourceMap = true,
}: SFCParseOptions): SFCParseResult {
  // TODO: cache
  const descriptor: SFCDescriptor = {
    filename,
    source,
    template: null,
    script: null,
    styles: null,
  };

  let dom;
  try {
    dom = parse5.parseFragment(source, { sourceCodeLocationInfo: true });
  } catch (e) {
    throw new Error();
  }

  for (const node of dom.childNodes) {
    if (node.nodeName === 'script') {
      const scriptBlock = createBlock(node, source) as SFCScriptBlock;
      descriptor.script = scriptBlock;
    }
    if (node.nodeName === 'style') {
      const styleBlock = createBlock(node, source) as SFCStyleBlock;
      descriptor.styles = styleBlock;
    }
    if (node.nodeName === 'template') {
      node.childNodes = node.content.childNodes;
      const templateBlock = createBlock(node, source) as SFCTemplateBlock;
      templateBlock.ast = node;
      descriptor.template = templateBlock;
    }
  }
  return {
    descriptor,
    errors: [],
  };
}

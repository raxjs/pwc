import * as parse5 from 'parse5';
import * as babelParser from '@babel/parser';
import type { File } from '@babel/types';
import type { RawSourceMap } from 'source-map';
import { SourceMapGenerator } from 'source-map';
import { validateScript, validateTemplate } from './validate';

export interface SFCBlock {
  type: string;
  content: string;
  attrs: Record<string, string | true>;
  map?: RawSourceMap;
  lang?: string;
  loc: SourceLocation;
}

export interface SFCTemplateBlock extends SFCBlock {
  type: 'template';
  ast: ElementNode;
}

export interface SFCScriptBlock extends SFCBlock {
  type: 'script';
  ast: File;
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
  style: SFCStyleBlock | null;
}

export interface SFCParseOptions {
  filename?: string;
  sourceRoot?: string;
  sourceMap?: boolean;
}

export interface SFCParseResult {
  descriptor: SFCDescriptor;
  errors: SyntaxError[];
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

export interface AttributeNode {
  name: string;
  value: string;
}

export interface ElementNode {
  nodeName: string;
  value?: string;
  data?: string;
  attrs?: AttributeNode[];
  childNodes?: ElementNode[];
  parentNode?: ElementNode;
  sourceCodeLocation?: SourceLocation;
}

function createBlock(
  node: ElementNode,
  source: string,
): SFCBlock {
  const type = node.nodeName;
  let { startLine, startCol, startOffset, endLine, endCol, endOffset } = node.sourceCodeLocation;
  let content = '';

  if (node.childNodes.length) {
    const startNodeLocation = node.childNodes[0].sourceCodeLocation;
    const endNodeLocation = node.childNodes[node.childNodes.length - 1].sourceCodeLocation;
    content = source.slice(startNodeLocation.startOffset, endNodeLocation.endOffset);

    startLine = startNodeLocation.startLine;
    startCol = startNodeLocation.startCol;
    startOffset = startNodeLocation.startOffset;
    endLine = endNodeLocation.endLine;
    endCol = endNodeLocation.endCol;
    endOffset = endNodeLocation.endOffset;
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
  node.attrs.forEach((attr) => {
    attrs[attr.name] = attr.value ? attr.value || true : true;
    if (attr.name === 'lang') {
      block.lang = attr.value && attr.value;
    } else if (type === 'style') {
      if (attr.name === 'scoped') {
        (block as SFCStyleBlock).scoped = true;
      }
    }
  });
  return block;
}

const splitRE = /\r?\n/g;
const emptyRE = /^(?:\/\/)?\s*$/;

function generateSourceMap(
  filename: string,
  source: string,
  generated: string,
  sourceRoot: string,
) {
  const map = new SourceMapGenerator({
    file: filename.replace(/\\/g, '/'),
    sourceRoot: sourceRoot.replace(/\\/g, '/'),
  });
  map.setSourceContent(filename, source);
  generated.split(splitRE).forEach((line, index) => {
    if (!emptyRE.test(line)) {
      const originalLine = index + 1;
      const generatedLine = index + 1;
      for (let index = 0; index < line.length; index++) {
        if (!/\s/.test(line[index])) {
          map.addMapping({
            source: filename,
            original: {
              line: originalLine,
              column: index,
            },
            generated: {
              line: generatedLine,
              column: index,
            },
          });
        }
      }
    }
  });
  return JSON.parse(map.toString());
}

function isEmptyString(str: string): boolean {
  return str.replace(/(^\s*)|(\s*$)/g, '').length === 0;
}

export function parse(source: string, {
  filename = 'anonymous.pwc',
  sourceRoot = '',
  sourceMap = true,
}: SFCParseOptions = {}): SFCParseResult {
  const descriptor: SFCDescriptor = {
    filename,
    source,
    template: null,
    script: null,
    style: null,
  };

  let dom;
  try {
    dom = parse5.parseFragment(source, { sourceCodeLocationInfo: true });
  } catch (err) {
    throw new Error(`[@pwc/compiler] compile error: ${err}`);
  }

  let errors = [];

  // Check phase 1: sfc
  const scriptNodeAmount = dom.childNodes.filter(node => node.nodeName === 'script').length;
  if (scriptNodeAmount === 0) {
    errors.push(new Error('[@pwc/compiler] PWC must contain one <script> tag.'));
  }

  for (const node of dom.childNodes) {
    if (node.nodeName === 'template') {
      // TODO: Check phase 2: template
      if (!descriptor.template) {
        node.childNodes = node.content.childNodes;
        const templateBlock = createBlock(node, source) as SFCTemplateBlock;
        templateBlock.ast = node;

        errors = errors.concat(validateTemplate(node));
        descriptor.template = templateBlock;
      } else {
        errors.push(new Error('[@pwc/compiler] PWC mustn\'t contain more than one <template> tag.'));
      }
    }
    if (node.nodeName === 'script') {
      // TODO:Check phase 3: script
      if (!descriptor.script) {
        const scriptBlock = createBlock(node, source) as SFCScriptBlock;
        if (!isEmptyString(scriptBlock.content)) {
          const ast = babelParser.parse(scriptBlock.content, {
            sourceType: 'module',
            plugins: [
              ['decorators', { decoratorsBeforeExport: true }],
              'decoratorAutoAccessors',
            ],
          });
          errors = errors.concat(validateScript(ast));

          scriptBlock.ast = ast;
          descriptor.script = scriptBlock;
        }
      } else {
        errors.push(new Error('[@pwc/compiler] PWC mustn\'t contain more than only one <script> tag.'));
      }
    }
    if (node.nodeName === 'style') {
      // TODO:Check phase 4: style
      if (!descriptor.style) {
        const styleBlock = createBlock(node, source) as SFCStyleBlock;
        if (!isEmptyString(styleBlock.content)) {
          descriptor.style = styleBlock;
        }
      } else {
        errors.push(new Error('[@pwc/compiler] PWC mustn\'t contain more than one <style> tag.'));
      }
    }

    if (sourceMap) {
      // TODO:
      const genMap = (block: SFCBlock | null) => {
        if (block) {
          block.map = generateSourceMap(
            filename,
            source,
            block.content,
            sourceRoot,
          );
        }
      };
      genMap(descriptor.template);
      genMap(descriptor.script);
      genMap(descriptor.style);
    }
  }
  return {
    descriptor,
    errors,
  };
}

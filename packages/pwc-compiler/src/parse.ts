import * as parse5 from 'parse5';
import babelParser from '@babel/parser';
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
      for (let i = 0; i < line.length; i++) {
        if (!/\s/.test(line[i])) {
          map.addMapping({
            source: filename,
            original: {
              line: originalLine,
              column: i,
            },
            generated: {
              line: generatedLine,
              column: i,
            },
          });
        }
      }
    }
  });
  return JSON.parse(map.toString());
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
  } catch (e) {
    throw new Error(`[@pwc/compiler] compile error: ${e}`);
  }

  // Check phase 1: sfc
  const scriptNodeAmount = dom.childNodes.filter(node => node.nodeName === 'script').length;
  const templateNodeAmount = dom.childNodes.filter(node => node.nodeName === 'template').length;
  const styleNodeAmount = dom.childNodes.filter(node => node.nodeName === 'style').length;

  if (scriptNodeAmount > 1) {
    throw new Error('[@pwc/compiler] PWC mustn\'t contain more than one <script> tag.');
  }

  if (templateNodeAmount > 1) {
    throw new Error('[@pwc/compiler] PWC mustn\'t contain more than one <template> tag.');
  }

  if (styleNodeAmount > 1) {
    throw new Error('[@pwc/compiler] PWC mustn\'t contain more than one <style> tag.');
  }

  let errors = [];
  for (const node of dom.childNodes) {
    if (node.nodeName === 'template') {
      // TODO: Check phase 2: template
      node.childNodes = node.content.childNodes;
      const templateBlock = createBlock(node, source) as SFCTemplateBlock;
      templateBlock.ast = node;

      errors = errors.concat(validateTemplate(node));
      descriptor.template = templateBlock;
    }
    if (node.nodeName === 'script') {
      // TODO:Check phase 3: script
      const scriptBlock = createBlock(node, source) as SFCScriptBlock;
      const ast = babelParser.parse(scriptBlock.content, {
        sourceType: 'module',
        plugins: [
          ['decorators', { decoratorsBeforeExport: true }],
          'decoratorAutoAccessors'
        ],
      });
      errors = errors.concat(validateScript(ast));

      scriptBlock.ast = ast;
      descriptor.script = scriptBlock;
    }
    if (node.nodeName === 'style') {
      // TODO:Check phase 4: style
      const styleBlock = createBlock(node, source) as SFCStyleBlock;
      descriptor.style = styleBlock;
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

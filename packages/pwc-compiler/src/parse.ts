import { type Token, parseFragment } from 'parse5';
import * as babelParser from '@babel/parser';
import type { File } from '@babel/types';
import type { RawSourceMap } from 'source-map';
import { SourceMapGenerator } from 'source-map';
import { validateScript, validateTemplate } from './validate';
import { type CompilerError, createCompilerError, ErrorCodes } from './errors';

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

export interface Position {
  line: number;
  column: number;
  offset?: number;
}

export interface Location {
  start: Position;
  end: Position;
}

export interface SourceLocation extends Location {
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
  content?: ElementNode;
  childNodes?: ElementNode[];
  parentNode?: ElementNode;
  loc?: SourceLocation;
}

function createSourceLocation(originalSource: string, locationInfo: Location): SourceLocation {
  const { start, end } = locationInfo;
  const source = originalSource.slice(start.offset, end.offset);
  return { start, end, source };
}

function createBlock(
  node: ElementNode,
  source: string,
): SFCBlock {
  const type = node.nodeName;
  let { start, end } = node.loc;
  let content = '';

  if (node.childNodes.length) {
    const { start } = node.childNodes[0].loc;
    const { end } = node.childNodes[node.childNodes.length - 1].loc;
    content = source.slice(start.offset, end.offset);
  }
  const loc = {
    source: content,
    start,
    end,
  };
  const attrs: Record<string, string | true> = {};
  const block: SFCBlock = {
    type,
    content,
    loc,
    attrs,
  };
  node.attrs?.forEach((attr) => {
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

function transformSourceCodeLocation(root: any): void {
  setNodeSourceCodeLocation(root, root.sourceCodeLocation);
  if (root.childNodes?.length) {
    root.childNodes.forEach(node => transformSourceCodeLocation(node));
  }
  if (root.content) {
    transformSourceCodeLocation(root.content);
  }
}

function setNodeSourceCodeLocation(node: any, location: Token.ElementLocation | null): void {
  if (location) {
    const { startLine, startCol, startOffset, endLine, endCol, endOffset } = location;
    node.loc = {
      start: {
        line: startLine,
        column: startCol,
        offset: startOffset,
      },
      end: {
        line: endLine,
        column: endCol,
        offset: endOffset,
      },
    };
  }
}

export function parse(source: string, {
  filename = 'anonymous.pwc',
  sourceRoot = '',
  sourceMap = true,
}: SFCParseOptions = {}): SFCParseResult {
  let errors: (CompilerError | SyntaxError)[] = [];

  const descriptor: SFCDescriptor = {
    filename,
    source,
    template: null,
    script: null,
    style: null,
  };

  const dom = parseFragment(source,
    {
      sourceCodeLocationInfo: true,
      onParseError: (parseError) => {
        const { code, startLine, startCol, startOffset, endLine, endCol, endOffset } = parseError;
        const err = createCompilerError(code, {
          start: { line: startLine, column: startCol, offset: startOffset },
          end: { line: endLine, column: endCol, offset: endOffset },
          source,
        });
        errors.push(err);
      }
    });
  transformSourceCodeLocation(dom);

  // Check phase 1: sfc
  const scriptNodeAmount = dom.childNodes.filter(node => node.nodeName === 'script').length;
  if (scriptNodeAmount === 0) {
    const err = createCompilerError(ErrorCodes.MISSING_SCRIPT_TAG, {
      start: { line: 1, column: 1, offset: 0 },
      end: { line: 1, column: 1, offset: 0 },
      source,
    });
    errors.push(err);
  }

  for (let index = 0, length = dom.childNodes.length; index < length; index++) {
    const node = dom.childNodes[index] as ElementNode;
    if (node.nodeName === 'template') {
      // TODO: Check phase 2: template
      if (descriptor.template) {
        const loc = createSourceLocation(source, node.loc);
        const err = createCompilerError(ErrorCodes.DUPLICATE_TEMPLATE_TAG, loc);
        errors.push(err);
      } else {
        // Template node contains a content property which is the parentNode of the template node's childNodes
        node.childNodes = node.content.childNodes;
        const templateBlock = createBlock(node, source) as SFCTemplateBlock;
        templateBlock.ast = node;

        errors = errors.concat(validateTemplate(node));
        descriptor.template = templateBlock;
      }
    }
    if (node.nodeName === 'script') {
      // TODO:Check phase 3: script
      if (descriptor.script) {
        const loc = createSourceLocation(source, node.loc);
        const err = createCompilerError(ErrorCodes.DUPLICATE_SCRIPT_TAG, loc);
        errors.push(err);
      } else {
        const scriptBlock = createBlock(node, source) as SFCScriptBlock;
        if (!isEmptyString(scriptBlock.content)) {
          const ast = babelParser.parse(scriptBlock.content, {
            sourceType: 'module',
            sourceFilename: filename,
            startLine: node.loc.start.line,
            plugins: [
              ['decorators', { decoratorsBeforeExport: true }],
              'decoratorAutoAccessors',
            ],
          });
          errors = errors.concat(validateScript(ast, scriptBlock.content));

          scriptBlock.ast = ast;
          descriptor.script = scriptBlock;
        }
      }
    }
    if (node.nodeName === 'style') {
      // TODO:Check phase 4: style
      if (descriptor.style) {
        const loc = createSourceLocation(source, node.loc);
        const err = createCompilerError(ErrorCodes.DUPLICATE_STYLE_TAG, loc);
        errors.push(err);
      } else {
        const styleBlock = createBlock(node, source) as SFCStyleBlock;
        if (!isEmptyString(styleBlock.content)) {
          descriptor.style = styleBlock;
        }
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

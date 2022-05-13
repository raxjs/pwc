import { parse } from '../esm';

describe('compiler:parse', () => {
  describe('source map', () => {
    // TODO:
  });

  test('should parse correct range for root level self closing tag', () => {
    const content = `\n  <div/>\n`
    const { descriptor } = parse(`<template>${content}</template>`);
    expect(descriptor.template).toBeTruthy()
    expect(descriptor.template!.content).toBe(content)
    expect(descriptor.template!.loc).toMatchObject({
      startCol: 11,
      startLine: 1,
      startOffset: 10,
      endCol: 1,
      endLine: 3,
      endOffset: 10 + content.length,
      source: content
    })
  });

  test('should parse correct range for blocks with no content (self closing)', () => {
    const { descriptor } = parse(`<template/>`);
    expect(descriptor.template).toBeTruthy();
    expect(descriptor.template!.content).toBeFalsy();
    expect(descriptor.template!.loc).toMatchObject({
      startCol: 1,
      startLine: 1,
      startOffset: 0,
      endCol: 12,
      endLine: 1,
      endOffset: 11,
      source: ''
    });
  });

  test('should parse correct range for blocks with no content (explicit)', () => {
    const { descriptor } = parse(`<template></template>`);
    expect(descriptor.template).toBeTruthy();
    expect(descriptor.template!.content).toBeFalsy();
    expect(descriptor.template!.loc).toMatchObject({
      startLine: 1,
      startCol: 1,
      startOffset: 0,
      endLine: 1,
      endCol: 22,
      endOffset: 21,
      source: ''
    });
  });

  test('should ignore other nodes with no content', () => {
    expect(parse(`<script/>`).descriptor.script).toBe(null);
    expect(parse(`<script> \n\t  </script>`).descriptor.script).toBe(null);
    expect(parse(`<style/>`).descriptor.style).toBe(null);
    expect(parse(`<style> \n\t </style>`).descriptor.style).toBe(null);
  });

  describe('should conatain specific node numbers', () => {
    function assertWarning(errors: Error[], msg: string) {
      expect(errors.some(e => e.message === msg)).toBe(true);
    }
    test('should only allow single template node', () => {
      assertWarning(
        parse(`<template><div/></template><template><div/></template>`).errors,
        `[@pwc/compiler] PWC mustn\'t contain more than one <template> tag.`
      )
    });

    test('should only allow single script node', () => {
      assertWarning(
        parse(`<script>console.log(1)</script><script>console.log(1)</script>`)
          .errors,
        `[@pwc/compiler] PWC mustn\'t contain more than only one <script> tag.`
      );
      assertWarning(
        parse(`<template></template><style></style>`)
          .errors,
        `[@pwc/compiler] PWC must contain one <script> tag.`
      );
    });

    test('should only allow single style node', () => {
      assertWarning(
        parse(`<style>.red { color: red; }</style><style>.green { color: green; }</style>`)
          .errors,
        `[@pwc/compiler] PWC mustn\'t contain more than one <style> tag.`
      )
    });
  });
});

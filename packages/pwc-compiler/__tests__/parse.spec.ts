import { parse } from '../src';

describe('compiler:sfc', () => {
  describe('source map', () => {
    // TODO:
  });

  test('should parse correct range for root level self closing tag', () => {
    const content = `\n  <div/>\n`
    const { descriptor } = parse(`<template>${content}</template>`)
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

});

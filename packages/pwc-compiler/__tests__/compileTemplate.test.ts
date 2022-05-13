import { compileTemplateAST, parse } from '../esm';

describe('compileTemplate', () => {
  it('compile a simple template', () => {
    const { descriptor } = parse('<template><p>{{text}}</p></template>');
    const { templateString, templateData } = compileTemplateAST(descriptor.template.ast);

    expect(templateString).toBe('<p><!--?pwc_t--></p>');
    expect(templateData ).toEqual(['text']);
  });

  it('compile a simple template with class property', () => {
    const { descriptor } = parse('<template><p>{{this.text}}</p></template>');
    const { templateString, templateData } = compileTemplateAST(descriptor.template.ast);

    expect(templateString).toBe('<p><!--?pwc_t--></p>');
    expect(templateData ).toEqual(['this.text']);
  });

  it('compile a simple template with class private property', () => {
    const { descriptor } = parse('<template><p>{{this.#text}}</p></template>');
    const { templateString, templateData } = compileTemplateAST(descriptor.template.ast);

    expect(templateString).toBe('<p><!--?pwc_t--></p>');
    expect(templateData ).toEqual(['this.#text']);
  });

  it('compile a template with a event', () => {
    const { descriptor } = parse('<template><p @click="{{handleClick}}">{{text}}</p></template>');
    const { templateString, templateData } = compileTemplateAST(descriptor.template.ast);

    expect(templateString).toBe('<!--?pwc_p--><p><!--?pwc_t--></p>');
    expect(templateData ).toEqual([
      [
        {
          name: 'onclick',
          handler: 'handleClick',
          capture: false,
        }
      ],
      'text'
    ]);
  });

  it('compile a template with a class method', () => {
    const { descriptor } = parse('<template><p @click="{{this.handleClick}}">{{text}}</p></template>');
    const { templateString, templateData } = compileTemplateAST(descriptor.template.ast);

    expect(templateString).toBe('<!--?pwc_p--><p><!--?pwc_t--></p>');
    expect(templateData ).toEqual([
      [
        {
          name: 'onclick',
          handler: 'this.handleClick',
          capture: false,
        }
      ],
      'text'
    ]);
  });

  it('compile a template with a capture event', () => {
    const { descriptor } = parse('<template><p @click.capture="{{handleClick}}">{{text}}</p></template>');
    const { templateString, templateData } = compileTemplateAST(descriptor.template.ast);

    expect(templateString).toBe('<!--?pwc_p--><p><!--?pwc_t--></p>');
    expect(templateData ).toEqual([
      [
        {
          name: 'onclick',
          handler: 'handleClick',
          capture: true,
        }
      ],
      'text'
    ]);
  });

  it('compile a template with an attribute start with on', () => {
    const { descriptor } = parse('<template><custom-component onevent="{{handleEvent}}">{{text}}</custom-component></template>');
    const { templateString, templateData } = compileTemplateAST(descriptor.template.ast);

    expect(templateString).toBe('<!--?pwc_p--><custom-component><!--?pwc_t--></custom-component>');
    expect(templateData ).toEqual([
      [
        {
          name: 'onevent',
          value: 'handleEvent'
        }
      ],
      'text'
    ]);
  });


  it('compile a template with attributes', () => {
    const { descriptor } = parse('<template><p class="{{className}}">{{text}}</p></template>');
    const { templateString, templateData } = compileTemplateAST(descriptor.template.ast);

    expect(templateString).toBe('<!--?pwc_p--><p><!--?pwc_t--></p>');
    expect(templateData ).toEqual([
      [
        {
          name: 'class',
          value: 'className',
        }
      ],
      'text'
    ]);
  });

  it('compile a template with attributes binded with class property', () => {
    const { descriptor } = parse('<template><p class="{{this.className}}" style="{{this.#style}}">{{text}}</p></template>');
    const { templateString, templateData } = compileTemplateAST(descriptor.template.ast);

    expect(templateString).toBe('<!--?pwc_p--><p><!--?pwc_t--></p>');
    expect(templateData ).toEqual([
      [
        {
          name: 'class',
          value: 'this.className',
        },
        {
          name: 'style',
          value: 'this.#style',
        }
      ],
      'text'
    ]);
  });

  it('compile a template with child element', () => {
    const { descriptor } = parse('<template><div class="{{this.className}}" style="{{this.#style}}"><div>{{this.#text}}</div></div></template>');
    const { templateString, templateData } = compileTemplateAST(descriptor.template.ast);

    expect(templateString).toBe('<!--?pwc_p--><div><div><!--?pwc_t--></div></div>');
    expect(templateData ).toEqual([
      [
        {
          name: 'class',
          value: 'this.className',
        },
        {
          name: 'style',
          value: 'this.#style',
        }
      ],
      'this.#text',
    ]);
  });

  it('compile a template with javascript expressions in text interpolation', () => {
    const { descriptor } = parse('<template><div>{{ count++ }}</div></template>');
    const { templateString, templateData } = compileTemplateAST(descriptor.template.ast);

    expect(templateString).toBe('<div><!--?pwc_t--></div>');
    expect(templateData ).toEqual([
      'count++',
    ]);
  });

  it('compile a template with javascript expressions in attribute bindings', () => {
    const { descriptor } = parse('<template><child-component bind="{{ count++ }}" ></child-component></template>');
    const { templateString, templateData } = compileTemplateAST(descriptor.template.ast);

    expect(templateString).toBe('<!--?pwc_p--><child-component></child-component>');
    expect(templateData ).toEqual([
      [
        {
          name: 'bind',
          value: 'count++',
        }
      ],
    ]);
  });

  it('compile a template with javascript expressions in event bindings', () => {
    const { descriptor } = parse('<template><div @click="{{ count++ }}"></div></template>');
    const { templateString, templateData } = compileTemplateAST(descriptor.template.ast);

    expect(templateString).toBe('<!--?pwc_p--><div></div>');
    expect(templateData ).toEqual([
      [
        {
          name: 'onclick',
          handler: '() => (count++)',
          capture: false
        }
      ],
    ]);
  });

  it('compile a template with calling methods in event bindings', () => {
    const { descriptor } = parse(`<template><div @click="{{ say('hello') }}"></div></template>`);
    const { templateString, templateData } = compileTemplateAST(descriptor.template.ast);

    expect(templateString).toBe('<!--?pwc_p--><div></div>');
    expect(templateData ).toEqual([
      [
        {
          name: 'onclick',
          handler: `() => (say('hello'))`,
          capture: false
        }
      ],
    ]);
  });

  it('compile a template with inline arrow function in event bindings', () => {
    const { descriptor } = parse(`<template><div @click="{{ (event) => warn('', event) }}"></div></template>`);
    const { templateString, templateData } = compileTemplateAST(descriptor.template.ast);

    expect(templateString).toBe('<!--?pwc_p--><div></div>');
    expect(templateData ).toEqual([
      [
        {
          name: 'onclick',
          handler: `(event) => warn('', event)`,
          capture: false
        }
      ],
    ]);
  });
});

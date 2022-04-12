import { compileTemplateAST, parse } from '../src';

describe('compileTemplate', () => {
  it('compile a simple template', () => {
    const { descriptor } = parse('<template><p>{{text}}</p></template>');
    const { templateString, values} = compileTemplateAST(descriptor.template.ast);

    expect(templateString).toBe('<p><!--?pwc_t--></p>');
    expect(values).toEqual(['text']);
  });

  it('compile a simple template with class property', () => {
    const { descriptor } = parse('<template><p>{{this.text}}</p></template>');
    const { templateString, values} = compileTemplateAST(descriptor.template.ast);

    expect(templateString).toBe('<p><!--?pwc_t--></p>');
    expect(values).toEqual(['this.text']);
  });

  it('compile a simple template with class private property', () => {
    const { descriptor } = parse('<template><p>{{this.#text}}</p></template>');
    const { templateString, values} = compileTemplateAST(descriptor.template.ast);

    expect(templateString).toBe('<p><!--?pwc_t--></p>');
    expect(values).toEqual(['this.#text']);
  });

  it('compile a template with a event', () => {
    const { descriptor } = parse('<template><p @click="{{handleClick}}">{{text}}</p></template>');
    const { templateString, values} = compileTemplateAST(descriptor.template.ast);

    expect(templateString).toBe('<!--?pwc_p--><p><!--?pwc_t--></p>');
    expect(values).toEqual([
      [
        {
          name: 'onclick',
          value: 'handleClick',
          capture: false,
        }
      ],
      'text'
    ]);
  });

  it('compile a template with a class method', () => {
    const { descriptor } = parse('<template><p @click="{{this.handleClick}}">{{text}}</p></template>');
    const { templateString, values} = compileTemplateAST(descriptor.template.ast);

    expect(templateString).toBe('<!--?pwc_p--><p><!--?pwc_t--></p>');
    expect(values).toEqual([
      [
        {
          name: 'onclick',
          value: 'this.handleClick',
          capture: false,
        }
      ],
      'text'
    ]);
  });

  it('compile a template with a capture event', () => {
    const { descriptor } = parse('<template><p @click.capture="{{handleClick}}">{{text}}</p></template>');
    const { templateString, values} = compileTemplateAST(descriptor.template.ast);

    expect(templateString).toBe('<!--?pwc_p--><p><!--?pwc_t--></p>');
    expect(values).toEqual([
      [
        {
          name: 'onclick',
          value: 'handleClick',
          capture: true,
        }
      ],
      'text'
    ]);
  });

  it('compile a template with attributes', () => {
    const { descriptor } = parse('<template><p class="{{className}}">{{text}}</p></template>');
    const { templateString, values} = compileTemplateAST(descriptor.template.ast);

    expect(templateString).toBe('<!--?pwc_p--><p><!--?pwc_t--></p>');
    expect(values).toEqual([
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
    const { templateString, values} = compileTemplateAST(descriptor.template.ast);

    expect(templateString).toBe('<!--?pwc_p--><p><!--?pwc_t--></p>');
    expect(values).toEqual([
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
    const { templateString, values} = compileTemplateAST(descriptor.template.ast);

    expect(templateString).toBe('<!--?pwc_p--><div><div><!--?pwc_t--></div></div>');
    expect(values).toEqual([
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
});

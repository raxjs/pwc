import { compileTemplateAST, parse } from '../src';

describe('compileTemplate', () => {
  it('compile a simple template ', () => {
    const { descriptor } = parse('<template><p>{{text}}</p></template>');
    const { templateString, values} = compileTemplateAST(descriptor.template.ast);
    
    expect(templateString).toBe('<p><!--?pwc_t--></p>');
    expect(values).toEqual(['text']);
  });

  it('compile a template with a event', () => {
    const { descriptor } = parse('<template><p @click={{handleClick}}>{{text}}</p></template>');
    const { templateString, values} = compileTemplateAST(descriptor.template.ast);
    
    expect(templateString).toBe('<!--?pwc_p--><p><!--?pwc_t--></p>');
    expect(values).toEqual([
      {
        onclick: {
          capture: false,
          handler: 'handleClick'
        }
      },
      'text'
    ]);
  });

  it('compile a template with a capture event', () => {
    const { descriptor } = parse('<template><p @click.capture={{handleClick}}>{{text}}</p></template>');
    const { templateString, values} = compileTemplateAST(descriptor.template.ast);
    
    expect(templateString).toBe('<!--?pwc_p--><p><!--?pwc_t--></p>');
    expect(values).toEqual([
      {
        onclick: {
          capture: true,
          handler: 'handleClick'
        }
      },
      'text'
    ]);
  });

  it('compile a template with attributes', () => {
    const { descriptor } = parse('<template><p class={{className}}>{{text}}</p></template>');
    const { templateString, values} = compileTemplateAST(descriptor.template.ast);
    
    expect(templateString).toBe('<!--?pwc_p--><p><!--?pwc_t--></p>');
    expect(values).toEqual([
      {
        class: 'className'
      },
      'text'
    ]);
  });
});

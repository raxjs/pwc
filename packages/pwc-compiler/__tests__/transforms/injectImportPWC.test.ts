import { parse, compileScript } from '../../esm';
import { basicComponent, useCustomElementComponent, useReactiveComponent, useReactiveWithAutoAddReactiveComponent } from './components';

describe('injectImportPWC', () => {
  test('It should inject pwc', () => {
    const { descriptor } = parse(basicComponent);
    const result = compileScript(descriptor);

    expect(result.content).toContain(`import { customElement as __customElement, reactive as __reactive } from \"pwc\";`);
  });

  test('It should not inject import customElement from pwc when imported customElement manually', () => {
    const { descriptor } = parse(useCustomElementComponent);
    const result = compileScript(descriptor);

    expect(result.content).toContain(`import { customElement } from 'pwc';`);
  });

  test('It should not inject import reactive from pwc when there is no reactive variable in template', () => {
    const { descriptor } = parse(useReactiveComponent);
    const result = compileScript(descriptor);

    expect(result.content).toContain(`import { reactive, customElement as __customElement } from 'pwc';`);
  });


  test('It should inject import reactive from pwc even if there is reactive imported manually', () => {
    const { descriptor } = parse(useReactiveWithAutoAddReactiveComponent);
    const result = compileScript(descriptor);

    expect(result.content).toContain(`import { reactive, customElement as __customElement, reactive as __reactive } from 'pwc';`);
  });
});

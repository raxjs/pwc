import qs from 'querystring';

export interface ScriptBlockQuery {
  filename: string;
  pwc: true;
  type: 'script';
}

export interface TemplateBlockQuery {
  filename: string;
  pwc: true;
  type: 'template';
}

export interface StyleBlockQuery {
  filename: string;
  pwc: true;
  type: 'style';
  scoped?: boolean;
}

export interface NonPwcQuery {
  filename: string;
  pwc: false;
}

export type Query =
  | NonPwcQuery
  | ScriptBlockQuery
  | TemplateBlockQuery
  | StyleBlockQuery;

export function parsePwcPartRequest(id: string): Query {
  const [filename, query] = id.split('?', 2);

  if (!query) {
    return {
      pwc: false,
      filename,
    };
  }

  const raw = qs.parse(query);

  if ('pwc' in raw) {
    return {
      ...raw,
      filename,
      pwc: true,
      scoped: 'scoped' in raw,
    } as any;
  }

  return { pwc: false, filename };
}

import { PWC_EXT } from '../utils/constants.js';

// If user write .pwc extension, then in transform mode .pwc should be removed
// Otherwise it can't be handled because .pwc file will be transformed into .js file
export default function ({ types: t }) {
  return {
    visitor: {
      ImportDeclaration(path) {
        const sourcePath = path.get('source');
        const { node } = sourcePath;
        if (t.isStringLiteral(node) && node.value.endsWith(PWC_EXT)) {
          const lastDot = node.value.lastIndexOf('.');
          const sourceWithoutExt = node.value.slice(0, lastDot);
          sourcePath.replaceWith(t.stringLiteral(sourceWithoutExt));
        }
      },
    },
  };
}

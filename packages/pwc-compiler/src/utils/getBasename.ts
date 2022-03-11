export function getBasename(filepath: string, sep = '/'): string {
  const idx = filepath.lastIndexOf(sep);
  if (idx < 0) {
    return filepath;
  }
  return filepath.substring(idx + 1);
}

export function getBasenameWithoutExt(filepath: string): string {
  const basename = getBasename(filepath);
  const ide = basename.lastIndexOf('.');
  if (ide < 0) {
    return basename;
  }
  return basename.substring(0, ide);
}

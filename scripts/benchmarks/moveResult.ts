import { copySync } from 'fs-extra';

function main() {
  copySync('table.html', 'table_last.html');
  copySync('dist/table.html', 'table.html');
}

main();

module.exports = {
  coverageDirectory: './coverage/',
  collectCoverage: true,
  collectCoverageFrom: ['packages/*/lib/*.{js,jsx}'],
  coveragePathIgnorePatterns: ['<rootDir>/node_modules/'],
  transform: {
    '^.+\\.(t|j)sx?$': '@swc/jest',
  },
  roots: ['<rootDir>/packages'],
  testPathIgnorePatterns: ['/node_modules/', '/lib/', '/es/', '/dist/'],
  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
};

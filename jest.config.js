module.exports = {
  coverageDirectory: './coverage/',
  collectCoverage: true,
  collectCoverageFrom: ['packages/*/lib/*.{js,jsx}'],
  coveragePathIgnorePatterns: ['<rootDir>/node_modules/'],
  roots: ['<rootDir>/packages'],
  testPathIgnorePatterns: ['/node_modules/', '/lib/', '/es/', '/dist/', '.d.ts'],
  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
  testEnvironment: 'jsdom',
  transform: {
    '\\.(js|ts|jsx|tsx)$': 'babel-jest',
  },
};

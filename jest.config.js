module.exports = {
  coverageDirectory: './coverage/',
  collectCoverage: true,
  collectCoverageFrom: ['packages/*/src/**/*.{js,ts}'],
  coveragePathIgnorePatterns: ['<rootDir>/node_modules/'],
  roots: ['<rootDir>/packages'],
  testPathIgnorePatterns: ['/node_modules/', '/cjs/', '/esm/', '/es2017/', '/dist/', '.d.ts'],
  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
  testEnvironment: 'jsdom',
  transform: {
    '\\.(js|ts|jsx|tsx)$': 'babel-jest',
  },
};

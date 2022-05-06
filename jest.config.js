module.exports = {
  coverageDirectory: './coverage/',
  collectCoverage: true,
  collectCoverageFrom: ['packages/pwc/src/**/*.{js,ts}', 'packages/pwc-compiler/src/**/*.{js,ts}', '!packages/**/*.d.ts', '!packages/**/type.ts', '!packages/*/src/index.{js,ts}'],
  coveragePathIgnorePatterns: ['<rootDir>/node_modules/'],
  roots: ['<rootDir>/packages'],
  testPathIgnorePatterns: ['/node_modules/', '/cjs/', '/esm/', '/es2017/', '/dist/', '.d.ts'],
  testMatch: ['**/__tests__/**/*.(spec|test).[jt]s?(x)'],
  testEnvironment: 'jsdom',
  transform: {
    '\\.(js|ts|jsx|tsx)$': 'babel-jest',
  },
  globals: {
    __DEV__: !process.env.PRODUCTION,
  },
  extensionsToTreatAsEsm: ['.ts']
};

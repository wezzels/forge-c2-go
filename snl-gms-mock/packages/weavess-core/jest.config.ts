import type { Config } from 'jest';

const config: Config = {
  cacheDirectory: '<rootDir>/.cache/jest',
  // Prettier version 3 is not supported! (https://jestjs.io/docs/configuration/#prettierpath-string)
  prettierPath: require.resolve('prettier-2'),
  testEnvironmentOptions: {
    url: 'http://localhost/'
  },
  globalSetup: '<rootDir>/jest.global-setup.ts',
  setupFiles: ['jest-canvas-mock', '<rootDir>/jest.setup.ts'],
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        isolatedModules: true,
        diagnostics: false,
        tsconfig: '<rootDir>/tsconfig-test.json'
      }
    ]
  },
  modulePathIgnorePatterns: ['<rootDir>/lib/', '<rootDir>/dist/'],
  testRegex: '/__tests__/.*\\.test\\.(ts|tsx)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  moduleNameMapper: {
    '.*\\.(css|less|style|scss|sass)$': '<rootDir>/__mocks__/style-mock.ts',
    '.*\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga|wasm|md)$':
      '<rootDir>/__mocks__/file-mock.ts',
    'react-markdown': '<rootDir>/__mocks__/file-mock.ts'
  },
  testEnvironment: 'jsdom',
  collectCoverage: true,
  coverageReporters: ['lcov', 'html', 'text-summary']
};

export default config;

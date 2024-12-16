// jest.config.ts

export default {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/__tests__/**/*.test.ts'],
    coverageDirectory: 'coverage',
    collectCoverage: true,
  };
  
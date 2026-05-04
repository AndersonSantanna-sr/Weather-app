module.exports = {
  projects: [
    {
      displayName: 'unit',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/shared/**/__tests__/**/*.test.ts'],
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/$1',
      },
      transform: {
        '^.+\\.tsx?$': ['babel-jest', { presets: ['babel-preset-expo', '@babel/preset-typescript'] }],
      },
      collectCoverageFrom: [
        'shared/utils/**/*.ts',
        'shared/store/**/*.ts',
        '!**/__tests__/**',
        '!**/*.d.ts',
      ],
    },
    {
      displayName: 'e2e',
      preset: 'jest-expo',
      testMatch: ['<rootDir>/features/**/__tests__/**/*.test.ts'],
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/$1',
      },
      transformIgnorePatterns: [
        'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)',
      ],
      testPathIgnorePatterns: ['/node_modules/', '/android/', '/ios/', 'useForecast.test.ts'],
    },
    {
      displayName: 'hooks',
      testEnvironment: 'jsdom',
      testMatch: ['<rootDir>/features/**/__tests__/**/useForecast.test.ts'],
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/$1',
        '^react-native$': 'react-native-web',
      },
      transform: {
        '^.+\\.tsx?$': ['babel-jest', { presets: ['babel-preset-expo', '@babel/preset-typescript'] }],
      },
      transformIgnorePatterns: [
        'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|@tanstack)',
      ],
      setupFilesAfterEnv: ['<rootDir>/jest.setup.e2e.js'],
    },
  ],
};

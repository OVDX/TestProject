
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
  dir: './',
})

const config = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  // -------------------------
}

export default createJestConfig(config)
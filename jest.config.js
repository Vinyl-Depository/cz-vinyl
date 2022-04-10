const customJestConfig = {
	collectCoverageFrom: ['src/**/*.ts', '!src/**/*.d.ts'],
	coveragePathIgnorePatterns: ['<rootDir>/src/models', '<rootDir>/src/index.ts'],
	coverageThreshold: {
		global: {
			branches: 84.7,
			functions: 84.7,
			lines: 84.7,
			statements: 84.7,
		},
	},
	moduleNameMapper: {
		'^@/utils/(.*)$': '<rootDir>/src/utils/$1',
		'^@/models/(.*)$': '<rootDir>/src/models/$1',
	},
	transform: {
		'^.+\\.ts$': 'ts-jest',
	},
	moduleDirectories: ['node_modules', '<rootDir>/'],
};

module.exports = customJestConfig;

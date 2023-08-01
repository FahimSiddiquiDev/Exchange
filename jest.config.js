module.exports = {
    roots: ["<rootDir>/test/unit", "<rootDir>/src"],
    coveragePathIgnorePatterns: ["<rootDir>/src/index.ts", "<rootDir>/src/controller/interfaces"],
    transform: {
        "^.+\\.tsx?$": [
            "ts-jest",
            {
                isolatedModules: true
            }
        ]
    },
    coverageReporters: ["html", "lcov", "text-summary", "text"],
    collectCoverage: true,
    collectCoverageFrom: ["<rootDir>/src/**/*.ts"],
    coverageDirectory: "<rootDir>/test-reports",
    coverageThreshold: {
        global: {
            lines: 85,
            functions: 85,
            statements: 85,
            branches: 85
        }
    }
};

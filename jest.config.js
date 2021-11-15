/**
 * DO NOT EDIT FIRST!
 *
 * Restart jest first! Often it's a caching issue.
 */

/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  /**
   * Configuration for getting `ts-jest` running
   * https://github.com/kulshekhar/ts-jest
   */
  preset: "ts-jest",
  testEnvironment: "node",
  /**
   * Map paths from `tsconfig.json` in Jest
   */
  moduleNameMapper: {
    "^~/(.*)$": "<rootDir>/$1",
  },
}

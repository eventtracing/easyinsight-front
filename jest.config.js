module.exports = {
  preset: "@vue/cli-plugin-unit-jest/presets/typescript-and-babel",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "vue"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  testMatch: ["**/views/**/__tests__/**/unit/EventTracker.spec.ts"],
  transformIgnorePatterns: [
    "/node_modules/(?!(ant-design-vue|@babel|@vue|@ant-design|lodash-es)/)",
  ],
  watchPathIgnorePatterns: ["<rootDir>/node_modules/"],
  setupFiles: ["<rootDir>/src/components/register-test.ts"],
  snapshotSerializers: ["<rootDir>/node_modules/jest-serializer-vue"],
};

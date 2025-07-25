/** @type {import("ts-jest").JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["./src"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
};
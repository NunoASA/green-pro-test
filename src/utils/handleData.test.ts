import fs from "fs";
import path from "path";
import { loadJson, validateHouseData } from "./handleData";

jest.mock("fs");
const mockedFs = fs as jest.Mocked<typeof fs>;
const jsonPath = "json-path.json";

const exitSpy = jest
  .spyOn(process, "exit")
  .mockImplementation((code) => {
    throw new Error(`exit with code ${code}`);
  });

const consoleSpy = jest
  .spyOn(console, "error")
  .mockImplementation((message) => message);

describe("loadJson", () => {
  test("should load valid JSON file", () => {
    mockedFs.readFileSync.mockReturnValueOnce(`{"name":"test"}`);

    const result = loadJson(jsonPath);

    expect(result).toEqual({ name: "test" });
    expect(mockedFs.readFileSync).toHaveBeenCalledWith(
      path.resolve(jsonPath),
      "utf-8"
    );
  });

  test("should exit process on invalid JSON file", () => {
    mockedFs.readFileSync.mockReturnValueOnce("invalid-json");

    expect(() => loadJson(jsonPath)).toThrow(`exit with code 1`);
    expect(consoleSpy.mock.calls[0][0]).toBe(`Error reading file: ${jsonPath}`);
    expect(exitSpy).toHaveBeenCalledWith(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});

describe("validateHouseData", () => {
  const validHouse = {
    submissionId: "e21a3149-b88c-40e9-86fd-c94a6b93cb78",
    designRegion: "W Pennines (Ringway)",
    floorArea: 92,
    age: "1991 - 1995",
    heatingFactor: 88,
    insulationFactor: 1.1
  };

  test("should return true for valid house data", () => {
    expect(validateHouseData(validHouse)).toBe(true);
  });

  test("should return false if some data is missing", () => {
    const house = { ...validHouse, submissionId: undefined };
    expect(validateHouseData(house as any)).toBe(false);
  });
});
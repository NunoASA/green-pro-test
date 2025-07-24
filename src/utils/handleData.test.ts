import fs from "fs";
import path from "path";

import { loadJson, validateHouseData, processOutput } from "./handleData";

jest.mock("fs");
const mockedFs = fs as jest.Mocked<typeof fs>;
const jsonPath = "json-path.json";

const validHouse = {
    submissionId: "e21a3149-b88c-40e9-86fd-c94a6b93cb78",
    designRegion: "W Pennines (Ringway)",
    floorArea: 92,
    age: "1991 - 1995",
    heatingFactor: 88,
    insulationFactor: 1.1
  };

const exitSpy = jest
  .spyOn(process, "exit")
  .mockImplementation((code) => {
    throw new Error(`exit with code ${code}`);
  });

const consoleErrorSpy = jest
  .spyOn(console, "error")
  .mockImplementation((message) => message);

const consoleLogSpy = jest
  .spyOn(console, "log")
  .mockImplementation((message) => message);

jest.mock("./calculations", () => ({
  calculateTotalCosts: jest.fn(() => "1234.12"),
}));

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
    expect(consoleErrorSpy.mock.calls[0][0]).toBe(`Error reading file: ${jsonPath}`);
    expect(exitSpy).toHaveBeenCalledWith(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});

describe("validateHouseData", () => {
  test("should return true for valid house data", () => {
    expect(validateHouseData(validHouse)).toBe(true);
  });

  test("should return false if some data is missing", () => {
    const house = { ...validHouse, submissionId: undefined };
    expect(validateHouseData(house as any)).toBe(false);
  });
});

describe("processOutput", () => {
  const mockHeatLoss = {
    value: 1234,
    unit: "kWh",
  };

  const mockPowerHeatLoss = {
    value: 12.3,
    unit: "kW",
  };

  const mockPump = {
    label: "123kW Pump",
    outputCapacity: 123,
    costs: [
      { label: "Pump System", cost: 1234 },
      { label: "Installation", cost: 4321 },
    ],
  };

  test("should log full output", () => {
    processOutput({
      house: validHouse,
      heatLoss: mockHeatLoss,
      powerHeatLoss: mockPowerHeatLoss,
      pump: mockPump,
    });

    expect(consoleLogSpy).toHaveBeenCalledWith("Submission ID: e21a3149-b88c-40e9-86fd-c94a6b93cb78");
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining("Estimated Heat Loss"));
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining("Design Region"));
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining("Power Heat Loss"));
    expect(consoleLogSpy).toHaveBeenCalledWith("Recommended Heat Pump: 123kW Pump");
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining("Cost Breakdown:"));
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining("£1234.00"));
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining("£4321.00"));
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining("Total Cost, including VAT = £1234.12"));
  });

  test("should log error warning if provided", () => {
    processOutput({
      house: validHouse,
      heatLoss: mockHeatLoss,
      error: "Could not find design region",
    });

    expect(consoleLogSpy).toHaveBeenCalledWith("Warning: Could not find design region");
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
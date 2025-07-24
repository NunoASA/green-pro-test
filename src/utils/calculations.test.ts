import { calculateHeatLoss, calculatePowerHeatLoss } from "./calculations";

describe("calculateHeatLoss", () => {
  test("should calculate heat loss with valid inputs", () => {
    const result = calculateHeatLoss({
      floorArea: 123.123,
      heatingFactor: 12.3,
      insulationFactor: 0.123,
    });

    expect(result).toEqual({
      value: 186.27,
      unit: "kWh",
    });
  });
});

describe("calculatePowerHeatLoss", () => {
  test("should calculate power heat loss", () => {
    const result = calculatePowerHeatLoss(123, 312);

    expect(result).toEqual({
      value: 0.39,
      unit: "kW",
    });
  });
});
import { calculateHeatLoss, calculatePowerHeatLoss, calculateTotalCosts } from "./calculations";

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

describe("calculateTotalCosts", () => {
  const mockPump = {
    label: "pump-label",
    costs: [
      { label: "item-a", cost: 1000 },
      { label: "item-b", cost: 500 },
      { label: "item-c", cost: 250 },
    ],
  };

  it("should calculate total", () => {
    const result = calculateTotalCosts(mockPump);
    expect(result).toBe("1837.50");
  });

  it("should calculate total with other VAT", () => {
    const result = calculateTotalCosts(mockPump, 0.2);
    expect(result).toBe("2100.00");
  });
});
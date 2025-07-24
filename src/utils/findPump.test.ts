import { findPump } from "./findPump";

jest.mock("./handleData", () => ({
  loadJson: jest.fn().mockReturnValue([
    { id: 1, outputCapacity: 5 },
    { id: 2, outputCapacity: 10 },
    { id: 3, outputCapacity: 15 },
  ]),
}));

describe("findPump", () => {
  test("should return the first pump greater than powerHeatLoss", () => {
    const result = findPump(9);
    expect(result).toEqual({ id: 2, outputCapacity: 10 });
  });

  test("should returns error if no pump matches", () => {
    const result = findPump(20);
    expect(result).toEqual({ error: "Could not find a pump" });
  });

  test("should returns pump with capacity equal to powerHeatLoss", () => {
    const result = findPump(10);
    expect(result).toEqual({ id: 3, outputCapacity: 15 });
  });

  afterEach(() => {
    jest.clearAllMocks();
  })
});
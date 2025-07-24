import https from "https";

import { getWeather } from "./weatherAPI";

jest.mock("https");
const mockGet = https.get as jest.Mock;
const oldEnv = process.env;

const consoleSpy = jest
  .spyOn(console, "error")
  .mockImplementation((message) => message);

const createMockResponse = (statusCode: number, body: string) => ({
  statusCode,
  on: (event: string, handler: Function) => {
    if (event === "data" && body) handler(body);
    if (event === "end") handler();
  },
  resume: jest.fn(),
})

describe("getWeather", () => {
  beforeEach(() => {
    process.env = { ...oldEnv, API_URL: "https://api-url.com", X_API_KEY: "X_API_KEY" };
  });

  test("should request the weather data with success", async () => {
    const location = "W Scotland (Abbotsinch)"
    const data = {
      location: {
        location,
        degreeDays: "2494",
        groundTemp: "9.1",
        postcode: "PA3",
        lat: "55.862882",
        lng: "-4.427052"
      }
    }
    const mockRes = createMockResponse(200, JSON.stringify(data));

    mockGet.mockImplementation((_, __, callback) => {
      callback(mockRes);
      return { on: jest.fn() };
    });

    const result = await getWeather(location);
    expect(mockGet.mock.calls[0][0]).toBe(`https://api-url.com/weather?location=${encodeURIComponent(location)}`);
    expect(mockGet.mock.calls[0][1]).toStrictEqual({"headers": {"x-api-key": "X_API_KEY"}});
    expect(result).toEqual(data);
  });

  test("should resolve with error object on 404", async () => {
    const invalidLocation = "unknown-place"

    const mockRes = createMockResponse(404, "");

    mockGet.mockImplementation((_, __, callback) => {
      callback(mockRes);
      return { on: jest.fn() };
    });

    const result = await getWeather(invalidLocation);
    expect(mockGet.mock.calls[0][0]).toBe(`https://api-url.com/weather?location=${encodeURIComponent(invalidLocation)}`);
    expect(result).toEqual({ error: "Could not find design region" });
  });

  test("should reject on network error", async () => {
    const location = "W Scotland (Abbotsinch)"

    mockGet.mockImplementation(() => {
      return {
        on: (event: string, handler: (err: Error) => void) => {
          if (event === "error") {
            handler(new Error("Network failure"));
          }
        }
      };
    });

    await expect(getWeather(location)).rejects.toBeUndefined();
    expect(consoleSpy).toHaveBeenCalledWith("Request failed:", "Network failure");
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    process.env = oldEnv;
  });
});

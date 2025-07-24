import https from "https";
import "dotenv/config";

export const getWeather = (location: string): Promise<any> => {
  const encodedLocations = encodeURIComponent(location);
  const url = `${process.env.API_URL}/weather?location=${encodedLocations}`;

  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        "x-api-key": process.env.X_API_KEY,
      },
    }, (res) => {
      let result = "";

      if (res.statusCode === 404) {
        res.resume();
        return resolve({ error: "Could not find design region" });
      }

      res.on("data", (chunk) => {
        result += chunk;
      });

      res.on("end", () => {
        try {
          resolve(JSON.parse(result));
        } catch (err) {
          reject(err);
        }
      });
    }).on("error", (err) => {
      console.error("Request failed:", err.message);
      reject();
    });
  });
}
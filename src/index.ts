
import { loadJson, validateHouseData, processOutput } from "./utils/handleData";
import { calculateHeatLoss, calculatePowerHeatLoss } from "./utils/calculations";
import { getWeather } from "./utils/weatherAPI";
import { findPump } from "./utils/findPump";

(async function run () {
  const housesData = loadJson(process.argv[2] || "./data/houses.json");

  for (const house of housesData) {
    console.log("\n----------------------------------------------------------------------------------")

    if (!validateHouseData(house)) {
        console.error(`The data for submission ${house?.submissionId}, is invalid`);
        continue;
    }

    const heatLoss = calculateHeatLoss(house);

    const data = await getWeather(house.designRegion);

    if (data?.error) {
        processOutput({ house, heatLoss, error: data.error })
        continue;
    }

    const powerHeatLoss = calculatePowerHeatLoss(heatLoss.value, data.location.degreeDays);

    const pump = findPump(powerHeatLoss.value);
    
    if (pump?.error) {
        processOutput({ house, heatLoss, powerHeatLoss, error: pump.error })
        continue;
    }

    processOutput({ house, heatLoss, powerHeatLoss, pump })
  }
})()
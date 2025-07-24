
import { loadJson, validateHouseData } from "./utils/handleData";
import { calculateHeatLoss, calculatePowerHeatLoss } from "./utils/calculations";
import { getWeather } from "./utils/weatherAPI";
import { findPump } from "./utils/findPump";

(async function run () {
  const housesData = loadJson(process.argv[2] || "./data/houses.json");

  for (const house of housesData) {
    console.log("--------------------------------------------------")


    if (!validateHouseData(house)) {
        console.error(`The data for submission ${house?.submissionId}, is invalid`);
        continue;
    }

    const heatLoss = calculateHeatLoss(house);

    const data = await getWeather(house.designRegion);

    if (data?.error) {
        console.log(`Estimated Heat Loss: ${heatLoss.value} ${heatLoss.unit}`)
        console.log(`Warning: ${data.error}`)
        continue;
    }

    const powerHeatLoss = calculatePowerHeatLoss(heatLoss.value, data.location.degreeDays);

    console.log({ heatLoss, powerHeatLoss })

    const pump = findPump(powerHeatLoss.value);
    
    if (pump?.error) {
        console.log(`Warning: ${pump.error}`)
        continue;
    }

    console.log(pump.label)

    //find pump
        //if not found "warning", return

        //if found, calculate costs


    //output data

  }
})()
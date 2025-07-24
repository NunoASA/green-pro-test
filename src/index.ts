
import { loadJson, validateHouseData } from "./utils/handleData";
import { calculateHeatLoss, calculatePowerHeatLoss } from "./utils/calculations";

const pumpsData = loadJson("./data/heat-pumps.json");

(async function run () {
  const housesData = loadJson(process.argv[2] || "./data/houses.json");

  for (const house of housesData) {

    if (!validateHouseData(house)) {
        console.error(`The data for submission ${house?.submissionId}, is invalid`);
        continue;
    }

    const heatLoss = calculateHeatLoss(house);
    console.log(heatLoss)

    //calculate heatloss --- floorArea (m^2) * heatingFactor * insulationFactor = heat loss (kWh)

    //fetch weather data and get "degreeDays"
        //if 404 "warning", return

        //if error, handle and return

    //calculate powerHeatLoss  --- heat loss (kWh) / heating degree days = Power heat loss (kW)

    //find pump
        //if not found "warning", return

        //if found, calculate costs


    //output data

  }
})()
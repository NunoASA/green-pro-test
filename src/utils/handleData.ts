import fs from "fs";
import path from "path";

import { calculateTotalCosts } from "./calculations";

type HouseData = {
  submissionId: string;
  designRegion: string;
  floorArea: number;
  age: string;
  heatingFactor: number;
  insulationFactor: number;
};

export const loadJson = (filePath: string): any => {
  try {
    const fullPath = path.resolve(filePath);
    const fileContents = fs.readFileSync(fullPath, "utf-8");

    return JSON.parse(fileContents);

  } catch (err: any) {
    console.error(`Error reading file: ${filePath}`, err.message);
    process.exit(1);
  }
}

export const validateHouseData = (house: HouseData)  => {
  const {
    submissionId,
    designRegion,
    floorArea,
    age,
    heatingFactor,
    insulationFactor,
  } = house;

   return (
    typeof submissionId === "string" &&
    typeof designRegion === "string" &&
    typeof floorArea === "number" &&
    typeof age === "string" &&
    typeof heatingFactor === "number" &&
    typeof insulationFactor === "number"
   )
};

export const processOutput = (
  { house, heatLoss, powerHeatLoss, pump, error }:
  {
    house: HouseData,
    heatLoss: { value: number, unit: string },
    powerHeatLoss?: { value: number, unit: string },
    pump?: any,
    error?: string
  }) => {
  if (house) {
    console.log(`Submission ID: ${house.submissionId}`)
    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - ")
  }

  if (heatLoss) {
    console.log(`Estimated Heat Loss: ${heatLoss.value} ${heatLoss.unit}`)
    console.log(`Design Region: ${house.designRegion}`)
  }

  if (powerHeatLoss) {
    console.log(`Power Heat Loss: ${powerHeatLoss.value} ${powerHeatLoss.unit}`)

    if (pump) {
      console.log(`Recommended Heat Pump: ${pump.label}`);
      console.log("Cost Breakdown:");
      pump.costs.forEach((item: { label: string, cost: number }) => console.log(`   £${item.cost.toFixed(2)} - ${item.label}, `));
      console.log(`Total Cost, including VAT = £${calculateTotalCosts(pump)}`);
    }
  }

  if (error) {
    console.log(`Warning: ${error}`)
  }
};
import fs from "fs";
import path from "path";

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
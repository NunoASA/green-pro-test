import { loadJson } from "./handleData";

const pumpsData = loadJson("./data/heat-pumps.json");

export const findPump = (powerHeatLoss: number) => (
  pumpsData.sort((a: any, b: any) => a.outputCapacity - b.outputCapacity)
    .find((pump: any) => pump.outputCapacity > powerHeatLoss)
  || { error: "Could not find a pump" }
)
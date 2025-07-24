type HeatLossInput = {
  floorArea: number;
  heatingFactor: number;
  insulationFactor: number;
};

// floorArea (m^2) * heatingFactor * insulationFactor = heat loss (kWh)
export const calculateHeatLoss = ({
  floorArea,
  heatingFactor,
  insulationFactor
}: HeatLossInput): { value: number, unit: string } => ({
  value: Number((floorArea * heatingFactor * insulationFactor).toFixed(2)),
  unit: "kWh"
});

// heat loss (kWh) / heating degree days = Power heat loss (kW)
export const calculatePowerHeatLoss = (heatLoss: number, degreeDays: number): { value: number, unit: string } => ({
  value: Number((heatLoss / degreeDays).toFixed(2)),
  unit: "kW"
});
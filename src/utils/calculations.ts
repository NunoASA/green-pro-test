type HeatLossInput = {
  floorArea: number;
  heatingFactor: number;
  insulationFactor: number;
};

const VAT = 0.05;

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

export const calculateTotalCosts = (pump: any, vat = VAT) => {
  const subtotal = pump.costs.reduce((total: number, { cost }: { cost: number }) => total + cost, 0);

  return (subtotal * (1 + vat)).toFixed(2);
};
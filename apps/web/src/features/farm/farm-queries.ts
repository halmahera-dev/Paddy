import "server-only";

// Sample data. Replace with Neon farm records and stored NASA area conditions.
export type Crop = "rice" | "maize" | "soybean" | "fallow";
export type DatePrecision = "exact" | "week" | "month" | "unknown";
export type AlertStatus = "new" | "acknowledged" | "recovered";

export type CropRecord = {
  crop: Crop;
  plantedFrom: string | null;
  plantedTo: string | null;
  precision: DatePrecision;
};

export type WeeklyWater = {
  week: string;
  rainMm: number;
  demandMm: [number, number] | null;
};

export type FarmAlert = {
  id: string;
  title: string;
  status: AlertStatus;
  observed: string;
  scale: string;
  action: string;
};

export type PlanSeason = {
  season: string;
  crop: Crop;
  demandMm: number;
  rainToDemandPercent: number | null;
};

export type Farm = {
  id: string;
  name: string;
  subdistrict: string;
  province: string;
  asOf: string;
  field: string;
  soil: string;
  cropRecord: CropRecord;
  conditions: {
    rain30dMm: number;
    normalRain30dMm: number;
    rainObserved: string;
    rootZoneMoisture: number | null;
    normalRootZoneMoisture: number;
    moistureObserved: string;
    maxTemperatureC: number;
    normalMaxTemperatureC: number;
    temperatureObserved: string;
  };
  season: string;
  weeklyWater: WeeklyWater[];
  alerts: FarmAlert[];
  plan: { seasons: PlanSeason[]; baselineDemandMm: number } | null;
};

const farms: Farm[] = [
  {
    id: "c20f4506-bc06-4b0b-9e8d-b22945dadbb6",
    name: "Sawah Pak Budi",
    subdistrict: "Indramayu",
    province: "West Java",
    asOf: "2026-10-02",
    field: "FTW predicted outline (2025), not a legal boundary",
    soil: "Clay (liat)",
    cropRecord: {
      crop: "rice",
      plantedFrom: "2026-08-15",
      plantedTo: "2026-08-21",
      precision: "week",
    },
    conditions: {
      rain30dMm: 19,
      normalRain30dMm: 42,
      rainObserved: "1 Oct",
      rootZoneMoisture: 0.22,
      normalRootZoneMoisture: 0.29,
      moistureObserved: "29 Sep",
      maxTemperatureC: 33.4,
      normalMaxTemperatureC: 32.2,
      temperatureObserved: "30 Sep",
    },
    season: "Dry season 2",
    weeklyWater: [
      { week: "1 Jul", rainMm: 12, demandMm: null },
      { week: "8 Jul", rainMm: 6, demandMm: null },
      { week: "15 Jul", rainMm: 0, demandMm: null },
      { week: "22 Jul", rainMm: 4, demandMm: null },
      { week: "29 Jul", rainMm: 0, demandMm: null },
      { week: "5 Aug", rainMm: 2, demandMm: null },
      { week: "12 Aug", rainMm: 8, demandMm: [5, 20] },
      { week: "19 Aug", rainMm: 15, demandMm: [25, 32] },
      { week: "26 Aug", rainMm: 62, demandMm: [30, 34] },
      { week: "2 Sep", rainMm: 12, demandMm: [32, 36] },
      { week: "9 Sep", rainMm: 6, demandMm: [34, 38] },
      { week: "16 Sep", rainMm: 1, demandMm: [36, 41] },
      { week: "23 Sep", rainMm: 0, demandMm: [38, 44] },
      { week: "30 Sep", rainMm: 0, demandMm: [40, 46] },
    ],
    alerts: [
      {
        id: "dry-2026-09-12",
        title: "Dry conditions",
        status: "new",
        observed: "12 Sep – 1 Oct",
        scale: "Area · 10 km rain, 9 km moisture",
        action: "Check the field",
      },
      {
        id: "heavy-rain-2026-08-27",
        title: "Heavy recent rain",
        status: "recovered",
        observed: "27–29 Aug",
        scale: "Area · 10 km",
        action: "Check the field",
      },
      {
        id: "low-moisture-2026-08-02",
        title: "Low root-zone moisture",
        status: "recovered",
        observed: "2–10 Aug",
        scale: "Area · 9 km",
        action: "Review the next planting",
      },
    ],
    plan: {
      seasons: [
        { season: "Wet season", crop: "rice", demandMm: 1000, rainToDemandPercent: 100 },
        { season: "Dry season 1", crop: "rice", demandMm: 900, rainToDemandPercent: 71 },
        { season: "Dry season 2", crop: "soybean", demandMm: 400, rainToDemandPercent: 34 },
      ],
      baselineDemandMm: 2900,
    },
  },
  {
    id: "5b0dc87b-e6a5-4e9f-b7b3-ef154d775fe3",
    name: "Kebun Bandung",
    subdistrict: "Bandung",
    province: "West Java",
    asOf: "2026-10-02",
    field: "Map point · illustrative shape",
    soil: "Unknown",
    cropRecord: {
      crop: "maize",
      plantedFrom: "2026-08-01",
      plantedTo: "2026-08-31",
      precision: "month",
    },
    conditions: {
      rain30dMm: 64,
      normalRain30dMm: 58,
      rainObserved: "1 Oct",
      rootZoneMoisture: null,
      normalRootZoneMoisture: 0.27,
      moistureObserved: "21 Sep",
      maxTemperatureC: 31.1,
      normalMaxTemperatureC: 31.4,
      temperatureObserved: "30 Sep",
    },
    season: "Dry season 2",
    weeklyWater: [
      { week: "1 Jul", rainMm: 20, demandMm: null },
      { week: "8 Jul", rainMm: 14, demandMm: null },
      { week: "15 Jul", rainMm: 9, demandMm: null },
      { week: "22 Jul", rainMm: 11, demandMm: null },
      { week: "29 Jul", rainMm: 5, demandMm: [3, 15] },
      { week: "5 Aug", rainMm: 8, demandMm: [3, 18] },
      { week: "12 Aug", rainMm: 12, demandMm: [5, 22] },
      { week: "19 Aug", rainMm: 7, demandMm: [8, 26] },
      { week: "26 Aug", rainMm: 18, demandMm: [10, 30] },
      { week: "2 Sep", rainMm: 15, demandMm: [14, 33] },
      { week: "9 Sep", rainMm: 10, demandMm: [18, 35] },
      { week: "16 Sep", rainMm: 22, demandMm: [22, 37] },
      { week: "23 Sep", rainMm: 14, demandMm: [26, 38] },
      { week: "30 Sep", rainMm: 18, demandMm: [30, 38] },
    ],
    alerts: [],
    plan: null,
  },
];

export async function getFarms() {
  return farms.map(function toOption(farm) {
    return { id: farm.id, name: farm.name };
  });
}

export async function getFarm(farmId: string | undefined) {
  return farms.find((farm) => farm.id === farmId) ?? farms[0];
}

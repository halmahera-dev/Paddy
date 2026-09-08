export type WarehouseZoneId = "storage" | "testing";
export type WarehouseStatus = "Normal" | "Attention" | "Offline";
export type WarehouseSafetyStatus = "Safe" | "Monitor" | "Alert";
export type WarehouseAssetKind =
  | "rack"
  | "forklift"
  | "drums"
  | "bench"
  | "vessel"
  | "samples"
  | "isolation";

export type WarehouseZone = {
  id: WarehouseZoneId;
  label: string;
  color: string;
  description: string;
  position: [number, number, number];
  size: [number, number, number];
  metrics: readonly string[];
  status: WarehouseStatus;
  safetyStatus: WarehouseSafetyStatus;
};

export type WarehouseAsset = {
  id: string;
  name: string;
  kind: WarehouseAssetKind;
  zoneId: WarehouseZoneId;
  position: [number, number, number];
  status: WarehouseStatus;
  safetyStatus: WarehouseSafetyStatus;
  metrics: readonly string[];
};

export type WarehouseLabel = {
  id: string;
  text: string;
  position: [number, number, number];
  zoneId: WarehouseZoneId;
  scale?: number;
  tone?: "default" | "safety";
};

export type CameraPreset = {
  id: string;
  label: string;
  position: [number, number, number];
  target: [number, number, number];
};

export const warehouseZones: readonly WarehouseZone[] = [
  {
    id: "storage",
    label: "Storage",
    color: "#b9773e",
    description: "Materials, parts, and controlled inventory",
    position: [-2.4, 0.2, 0],
    size: [7.2, 0.4, 8],
    metrics: ["72% capacity", "18 assets", "18 C ambient"],
    status: "Normal",
    safetyStatus: "Monitor",
  },
  {
    id: "testing",
    label: "Testing/research",
    color: "#2f7d82",
    description: "Sample intake and material testing",
    position: [3.6, 0.2, 0],
    size: [4.8, 0.4, 8],
    metrics: ["3 active benches", "24 C ambient", "24 assets"],
    status: "Attention",
    safetyStatus: "Safe",
  },
] as const;

export const warehouseAssets: readonly WarehouseAsset[] = [
  {
    id: "storage-racks",
    name: "Pallet rack aisles",
    kind: "rack",
    zoneId: "storage",
    position: [-3.9, 0.38, -1.55],
    status: "Normal",
    safetyStatus: "Safe",
    metrics: ["12 rack bays", "72% capacity", "Last inspected today"],
  },
  {
    id: "loading-forklift",
    name: "Loading bay forklift",
    kind: "forklift",
    zoneId: "storage",
    position: [-2.65, 0.42, 2.55],
    status: "Normal",
    safetyStatus: "Safe",
    metrics: ["Available", "Battery 86%", "Inspection current"],
  },
  {
    id: "hazardous-drums",
    name: "Hazardous materials",
    kind: "drums",
    zoneId: "storage",
    position: [0.05, 0.42, 2.55],
    status: "Attention",
    safetyStatus: "Monitor",
    metrics: ["6 containers", "Segregated storage", "Review due in 2 days"],
  },
  {
    id: "testing-benches",
    name: "Testing benches",
    kind: "bench",
    zoneId: "testing",
    position: [3.55, 0.42, -1.7],
    status: "Normal",
    safetyStatus: "Safe",
    metrics: ["3 active benches", "6 instruments", "24 C ambient"],
  },
  {
    id: "test-vessel",
    name: "Pressure test vessel",
    kind: "vessel",
    zoneId: "testing",
    position: [3.55, 0.42, 1.75],
    status: "Attention",
    safetyStatus: "Alert",
    metrics: ["Inspection pending", "41 bar test pressure", "Restricted"],
  },
  {
    id: "sample-intake",
    name: "Sample intake",
    kind: "samples",
    zoneId: "testing",
    position: [5.25, 0.42, 0.05],
    status: "Normal",
    safetyStatus: "Safe",
    metrics: ["24 samples today", "Chain of custody active", "Available"],
  },
  {
    id: "test-isolation",
    name: "Equipment isolation area",
    kind: "isolation",
    zoneId: "testing",
    position: [5.15, 0.42, 2.7],
    status: "Offline",
    safetyStatus: "Alert",
    metrics: ["Reserved", "No active test", "Access restricted"],
  },
] as const;

export const warehouseLabels: readonly WarehouseLabel[] = [
  {
    id: "receiving-label",
    text: "Receiving / dispatch",
    position: [-3.55, 3.1, 3.85],
    zoneId: "storage",
    scale: 0.45,
  },
  {
    id: "hazard-label",
    text: "HAZMAT",
    position: [0.05, 1.55, 2.55],
    zoneId: "storage",
    scale: 0.45,
    tone: "safety",
  },
  {
    id: "sample-label",
    text: "Sample intake",
    position: [5.25, 1.8, 0.05],
    zoneId: "testing",
    scale: 0.45,
  },
  {
    id: "isolation-label",
    text: "RESTRICTED",
    position: [5.15, 1.45, 2.7],
    zoneId: "testing",
    scale: 0.4,
    tone: "safety",
  },
] as const;

export const cameraPresets: readonly CameraPreset[] = [
  { id: "overview", label: "Overview", position: [14, 11, 14], target: [0, 1.5, 0] },
  { id: "storage", label: "Storage", position: [-10, 7, 10], target: [-2.4, 1.4, 0] },
  { id: "testing", label: "Testing/research", position: [10, 6, 8], target: [3.6, 1.4, 0] },
  { id: "loading", label: "Loading bay", position: [-8, 5, 13], target: [-2.5, 1.3, 2.8] },
  { id: "plan", label: "Top-down plan", position: [0, 18, 0.1], target: [0, 0, 0] },
] as const;

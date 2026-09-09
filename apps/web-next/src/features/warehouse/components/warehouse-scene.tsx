"use client";

import { OrbitControls, Text } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { type ReactNode, type RefObject, useEffect, useRef, useState } from "react";
import { Vector3 } from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

import {
  type CameraPreset,
  cameraPresets,
  type WarehouseAsset,
  type WarehouseLabel,
  type WarehouseSafetyStatus,
  type WarehouseStatus,
  type WarehouseZone,
  warehouseAssets,
  warehouseLabels,
  warehouseZones,
} from "../warehouse-data";

type HoverTarget = {
  id: string;
  name: string;
  description?: string;
  status: WarehouseStatus;
  safetyStatus: WarehouseSafetyStatus;
  metrics: readonly string[];
};

type WarehouseEntity = WarehouseZone | WarehouseAsset;

type LayerId = "structure" | "equipment" | "safety" | "labels";

type LayerState = Record<LayerId, boolean>;

const initialLayers: LayerState = {
  structure: true,
  equipment: true,
  safety: true,
  labels: true,
};

const statusStyles: Record<WarehouseStatus, { dot: string; text: string }> = {
  Normal: { dot: "bg-emerald-400", text: "text-emerald-300" },
  Attention: { dot: "bg-amber-300", text: "text-amber-200" },
  Offline: { dot: "bg-rose-400", text: "text-rose-300" },
};

const safetyStatusStyles: Record<WarehouseSafetyStatus, { dot: string; text: string }> = {
  Safe: { dot: "bg-emerald-300", text: "text-emerald-200" },
  Monitor: { dot: "bg-amber-300", text: "text-amber-200" },
  Alert: { dot: "bg-rose-300", text: "text-rose-200" },
};

const statusColors: Record<WarehouseStatus, string> = {
  Normal: "#5ed69a",
  Attention: "#f0c352",
  Offline: "#ed6e65",
};

const safetyStatusColors: Record<WarehouseSafetyStatus, string> = {
  Safe: "#63d7aa",
  Monitor: "#f0c352",
  Alert: "#ed6e65",
};

const layerLabels: readonly { id: LayerId; label: string }[] = [
  { id: "structure", label: "Shell" },
  { id: "equipment", label: "Equipment" },
  { id: "safety", label: "Safety" },
  { id: "labels", label: "Labels" },
];

function toHoverTarget(entity: WarehouseEntity): HoverTarget {
  if ("label" in entity) {
    return {
      id: entity.id,
      name: entity.label,
      description: entity.description,
      status: entity.status,
      safetyStatus: entity.safetyStatus,
      metrics: entity.metrics,
    };
  }

  return {
    id: entity.id,
    name: entity.name,
    status: entity.status,
    safetyStatus: entity.safetyStatus,
    metrics: entity.metrics,
  };
}

function Box({
  color,
  position,
  size,
  roughness = 0.82,
}: {
  color: string;
  position: [number, number, number];
  size: [number, number, number];
  roughness?: number;
}) {
  return (
    <mesh castShadow receiveShadow position={position}>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} flatShading roughness={roughness} />
    </mesh>
  );
}

function StatusMarker({
  position,
  safetyStatus,
  status,
}: {
  position: [number, number, number];
  safetyStatus: WarehouseSafetyStatus;
  status: WarehouseStatus;
}) {
  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[0.1, 12, 8]} />
        <meshBasicMaterial color={statusColors[status]} />
      </mesh>
      <mesh position={[0, -0.18, 0]}>
        <sphereGeometry args={[0.065, 12, 8]} />
        <meshBasicMaterial color={safetyStatusColors[safetyStatus]} />
      </mesh>
    </group>
  );
}

function Zone({
  zone,
  active,
  onSelect,
  onHover,
  showLabels,
}: {
  zone: WarehouseZone;
  active: boolean;
  onHover: (target: HoverTarget | null) => void;
  onSelect: (target: HoverTarget) => void;
  showLabels: boolean;
}) {
  const [width, height] = zone.size;
  const target = toHoverTarget(zone);

  return (
    <group>
      <mesh
        position={zone.position}
        onClick={(event) => {
          event.stopPropagation();
          onSelect(target);
        }}
        onPointerEnter={(event) => {
          event.stopPropagation();
          onHover(target);
        }}
        onPointerLeave={() => onHover(null)}
      >
        <boxGeometry args={zone.size} />
        <meshStandardMaterial
          color={active ? "#e1a65d" : zone.color}
          emissive={active ? "#77420f" : "#000000"}
          emissiveIntensity={active ? 0.28 : 0}
          flatShading
          roughness={0.8}
        />
      </mesh>
      <StatusMarker
        position={[
          zone.position[0] + width / 2 - 0.35,
          zone.position[1] + height / 2 + 3.6,
          zone.position[2],
        ]}
        safetyStatus={zone.safetyStatus}
        status={zone.status}
      />
      {showLabels && (
        <Text
          position={[zone.position[0], zone.position[1] + height / 2 + 3.6, zone.position[2]]}
          anchorX="center"
          anchorY="middle"
          color="#f3f7f6"
          fontSize={Math.min(width * 0.16, 0.72)}
          maxWidth={width - 0.6}
          outlineColor="#10191b"
          outlineWidth={0.045}
        >
          {zone.label}
        </Text>
      )}
    </group>
  );
}

function WarehouseShell({
  showStructure,
  showLabels,
}: {
  showStructure: boolean;
  showLabels: boolean;
}) {
  if (!showStructure) {
    return null;
  }

  return (
    <group>
      <Box color="#344448" position={[-6.15, 1.8, 0]} size={[0.25, 3.6, 8.5]} />
      <Box color="#344448" position={[6.15, 1.8, 0]} size={[0.25, 3.6, 8.5]} />
      <Box color="#344448" position={[0, 1.8, -4.15]} size={[12.5, 3.6, 0.25]} />

      <Box color="#344448" position={[-4.55, 1.8, 4.15]} size={[2.9, 3.6, 0.25]} />
      <Box color="#344448" position={[-0.1, 1.8, 4.15]} size={[3.6, 3.6, 0.25]} />
      <Box color="#344448" position={[5.15, 1.8, 4.15]} size={[1.6, 3.6, 0.25]} />

      <ForkliftAisle showLabels={showLabels} />
      <ReceivingBay />

      <DoorFrame center={[-2.65, 0, 4.12]} width={2.2} label={showLabels ? "Loading" : undefined} />
      <DoorFrame
        center={[3.75, 0, 4.12]}
        width={1.6}
        label={showLabels ? "Personnel" : undefined}
      />
    </group>
  );
}

function ForkliftAisle({ showLabels }: { showLabels: boolean }) {
  return (
    <group>
      <Box color="#243537" position={[-2.65, 0.44, 0.25]} size={[1.45, 0.05, 4.8]} />
      <Box color="#e2b447" position={[-3.3, 0.48, 0.25]} size={[0.06, 0.03, 4.8]} />
      <Box color="#e2b447" position={[-2, 0.48, 0.25]} size={[0.06, 0.03, 4.8]} />
      {showLabels && (
        <Text
          position={[-2.65, 0.52, 0.25]}
          rotation={[-Math.PI / 2, 0, 0]}
          anchorX="center"
          anchorY="middle"
          color="#d9b348"
          fontSize={0.22}
          outlineColor="#182326"
          outlineWidth={0.02}
        >
          FORKLIFT AISLE
        </Text>
      )}
    </group>
  );
}

function ReceivingBay() {
  return (
    <group>
      <Box color="#4e6261" position={[-2.65, 0.62, 3.9]} size={[2.2, 0.45, 0.22]} />
      <Box color="#27393b" position={[-2.65, 0.46, 3.2]} size={[2.2, 0.05, 1.15]} />
      <Box color="#e2b447" position={[-3.68, 0.5, 3.2]} size={[0.06, 0.03, 1.15]} />
      <Box color="#e2b447" position={[-1.62, 0.5, 3.2]} size={[0.06, 0.03, 1.15]} />
      <Box color="#d7a64a" position={[-3.2, 0.52, 3.2]} size={[0.4, 0.06, 0.5]} />
      <Box color="#c18340" position={[-2.65, 0.52, 3.2]} size={[0.4, 0.06, 0.5]} />
    </group>
  );
}

function DoorFrame({
  center,
  label,
  width,
}: {
  center: [number, number, number];
  label?: string;
  width: number;
}) {
  const [x, y, z] = center;

  return (
    <group>
      <Box color="#d4984b" position={[x - width / 2, y + 1.65, z]} size={[0.12, 3.3, 0.12]} />
      <Box color="#d4984b" position={[x + width / 2, y + 1.65, z]} size={[0.12, 3.3, 0.12]} />
      <Box color="#d4984b" position={[x, y + 3.25, z]} size={[width + 0.24, 0.12, 0.12]} />
      <Box
        color="#596967"
        position={[x + width / 2 + 0.28, y + 1.55, z - 0.06]}
        size={[0.52, 3.1, 0.08]}
      />
      {label && (
        <Text
          position={[x, y + 3.55, z]}
          anchorX="center"
          anchorY="middle"
          color="#e8b66c"
          fontSize={0.3}
          outlineColor="#182326"
          outlineWidth={0.025}
        >
          {label}
        </Text>
      )}
    </group>
  );
}

function PalletRack() {
  const shelves = [0.65, 1.55, 2.45];
  const bays = [-1.15, 0, 1.15];

  return (
    <group>
      {[-1.4, 1.4].map((x) => (
        <Box
          key={`upright-${x}`}
          color="#6d7e7d"
          position={[x, 1.65, 0]}
          size={[0.12, 3.2, 1.05]}
        />
      ))}
      {shelves.map((y) => (
        <Box key={`shelf-${y}`} color="#718482" position={[0, y, 0]} size={[2.9, 0.12, 1.15]} />
      ))}
      {bays.map((x, index) => (
        <group key={`pallet-${x}`} position={[x, 0.75 + (index % 2) * 0.9, 0]}>
          <Box color="#a56a37" position={[0, 0, 0]} size={[0.82, 0.16, 0.85]} />
          <Box color="#c38a4c" position={[0, 0.17, 0]} size={[0.68, 0.18, 0.68]} />
        </group>
      ))}
    </group>
  );
}

function Forklift() {
  return (
    <group>
      <Box color="#d69a3d" position={[0, 0.35, 0]} size={[1.35, 0.42, 0.72]} />
      <Box color="#e7b45a" position={[-0.3, 0.72, 0]} size={[0.58, 0.42, 0.62]} />
      <Box color="#8e5e25" position={[0.55, 1.05, 0]} size={[0.12, 1.25, 0.58]} />
      <Box color="#d69a3d" position={[0.82, 0.38, 0]} size={[0.8, 0.08, 0.6]} />
      {[-0.45, 0.45].map((x) => (
        <mesh key={x} rotation={[0, 0, Math.PI / 2]} position={[x, 0.18, 0.42]} castShadow>
          <cylinderGeometry args={[0.2, 0.2, 0.16, 12]} />
          <meshStandardMaterial color="#1d292b" roughness={0.92} />
        </mesh>
      ))}
    </group>
  );
}

function DrumCluster() {
  return (
    <group>
      {[
        [-0.42, 0, -0.35],
        [0.42, 0, -0.35],
        [-0.42, 0, 0.4],
        [0.42, 0, 0.4],
        [0, 0, 0],
        [0, 0, 0.8],
      ].map(([x, y, z], index) => (
        <group key={`${x}-${y}-${z}`} position={[x, y, z]}>
          <mesh position={[0, 0.45, 0]} castShadow>
            <cylinderGeometry args={[0.32, 0.32, 0.82, 12]} />
            <meshStandardMaterial
              color={index % 2 === 0 ? "#d4a23c" : "#b84f3d"}
              roughness={0.75}
            />
          </mesh>
          <Box color="#252f31" position={[0, 0.87, 0]} size={[0.42, 0.06, 0.42]} />
        </group>
      ))}
    </group>
  );
}

function TestingBench() {
  return (
    <group>
      {[-0.8, 0, 0.8].map((x, index) => (
        <group key={x} position={[x, 0, 0]}>
          <Box color="#9da9a3" position={[0, 0.83, 0]} size={[0.65, 0.16, 0.85]} />
          <Box color="#566a69" position={[-0.2, 0.42, 0]} size={[0.1, 0.75, 0.68]} />
          <Box color="#566a69" position={[0.2, 0.42, 0]} size={[0.1, 0.75, 0.68]} />
          <Box
            color={index === 1 ? "#c87d38" : "#557e82"}
            position={[0, 1.15, 0]}
            size={[0.3, 0.35, 0.32]}
          />
          <Box color="#b5c8c3" position={[0, 1.4, 0]} size={[0.22, 0.05, 0.18]} />
        </group>
      ))}
    </group>
  );
}

function TestVessel() {
  return (
    <group>
      <Box color="#657c7d" position={[0, 0.18, 0]} size={[1.3, 0.18, 1.1]} />
      <mesh position={[0, 1.35, 0]} castShadow>
        <cylinderGeometry args={[0.55, 0.65, 2.2, 12]} />
        <meshStandardMaterial color="#a3b6ad" flatShading roughness={0.55} />
      </mesh>
      <mesh position={[0, 2.48, 0]} castShadow>
        <cylinderGeometry args={[0.58, 0.58, 0.08, 12]} />
        <meshStandardMaterial color="#44595b" roughness={0.65} />
      </mesh>
      <Box color="#e1a648" position={[0.58, 1.65, 0]} size={[0.1, 0.8, 0.1]} />
    </group>
  );
}

function SampleIntake() {
  return (
    <group>
      <Box color="#9da9a3" position={[0, 0.72, 0]} size={[1.25, 0.16, 0.8]} />
      {[-0.38, 0, 0.38].map((x, index) => (
        <mesh key={x} position={[x, 1.05, 0]} castShadow>
          <cylinderGeometry args={[0.1, 0.13, 0.45, 10]} />
          <meshStandardMaterial color={index === 1 ? "#d69a3d" : "#7aa3a0"} roughness={0.65} />
        </mesh>
      ))}
    </group>
  );
}

function IsolationArea() {
  return (
    <group>
      <Box color="#8e3d37" position={[0, 0.08, -1]} size={[2.05, 0.08, 0.08]} />
      <Box color="#8e3d37" position={[0, 0.08, 1]} size={[2.05, 0.08, 0.08]} />
      <Box color="#8e3d37" position={[-1, 0.08, 0]} size={[0.08, 0.08, 2.05]} />
      <Box color="#8e3d37" position={[1, 0.08, 0]} size={[0.08, 0.08, 2.05]} />
      {[
        [-1, 0, -1],
        [1, 0, -1],
        [-1, 0, 1],
        [1, 0, 1],
      ].map(([x, , z]) => (
        <Box key={`${x}-${z}`} color="#d5a345" position={[x, 0.65, z]} size={[0.12, 1.3, 0.12]} />
      ))}
    </group>
  );
}

function SafetyFeatures({ showLabels }: { showLabels: boolean }) {
  return (
    <group>
      <Box color="#e0ad42" position={[-5.35, 0.48, 3.38]} size={[0.45, 0.08, 0.45]} />
      <mesh position={[-5.35, 0.92, 3.38]} castShadow>
        <cylinderGeometry args={[0.14, 0.16, 0.75, 10]} />
        <meshStandardMaterial color="#bb4939" roughness={0.7} />
      </mesh>
      <Box color="#3c9b78" position={[5.62, 0.58, 3.2]} size={[0.7, 0.12, 0.7]} />
      <Box color="#3c9b78" position={[5.62, 1.18, 3.2]} size={[0.12, 1.2, 0.12]} />
      <Box color="#3c9b78" position={[5.28, 1.45, 3.2]} size={[0.75, 0.12, 0.12]} />
      <group position={[0.05, 0.47, 2.55]}>
        {[-0.78, -0.26, 0.26, 0.78].map((x, index) => (
          <Box
            key={x}
            color={index % 2 === 0 ? "#f0c352" : "#1f2b2e"}
            position={[x, 0, 0]}
            size={[0.42, 0.04, 0.78]}
          />
        ))}
      </group>
      {showLabels && (
        <Text
          position={[-5.35, 1.75, 3.38]}
          anchorX="center"
          anchorY="middle"
          color="#f1c85e"
          fontSize={0.3}
          outlineColor="#182326"
          outlineWidth={0.025}
        >
          FIRE
        </Text>
      )}
    </group>
  );
}

function AssetVisual({ asset }: { asset: WarehouseAsset }) {
  switch (asset.kind) {
    case "rack":
      return <PalletRack />;
    case "forklift":
      return <Forklift />;
    case "drums":
      return <DrumCluster />;
    case "bench":
      return <TestingBench />;
    case "vessel":
      return <TestVessel />;
    case "samples":
      return <SampleIntake />;
    case "isolation":
      return <IsolationArea />;
  }
}

function InteractiveAsset({
  asset,
  active,
  children,
  onSelect,
  onHover,
}: {
  asset: WarehouseAsset;
  active: boolean;
  children: ReactNode;
  onHover: (target: HoverTarget | null) => void;
  onSelect: (target: HoverTarget) => void;
}) {
  const target = toHoverTarget(asset);

  return (
    <group
      position={asset.position}
      onClick={(event) => {
        event.stopPropagation();
        onSelect(target);
      }}
      onPointerEnter={(event) => {
        event.stopPropagation();
        onHover(target);
      }}
      onPointerLeave={() => onHover(null)}
      scale={active ? 1.035 : 1}
    >
      {children}
      <StatusMarker position={[0, 3, 0]} safetyStatus={asset.safetyStatus} status={asset.status} />
    </group>
  );
}

function WarehouseLabels({ labels }: { labels: readonly WarehouseLabel[] }) {
  return (
    <group>
      {labels.map((label) => (
        <Text
          key={label.id}
          position={label.position}
          anchorX="center"
          anchorY="middle"
          color={label.tone === "safety" ? "#f0bd4f" : "#b9c9c6"}
          fontSize={label.scale ?? 0.45}
          outlineColor="#10191b"
          outlineWidth={0.025}
        >
          {label.text}
        </Text>
      ))}
    </group>
  );
}

function WarehouseModel({
  activeId,
  layers,
  onClear,
  onSelect,
  onHover,
}: {
  activeId: string | null;
  layers: LayerState;
  onHover: (target: HoverTarget | null) => void;
  onClear: () => void;
  onSelect: (target: HoverTarget) => void;
}) {
  return (
    <>
      <ambientLight intensity={1.35} />
      <directionalLight
        castShadow
        position={[7, 10, 8]}
        intensity={2.2}
        shadow-mapSize={[1024, 1024]}
      />
      <hemisphereLight args={["#cad8d5", "#1d2a2d", 0.55]} />

      {warehouseZones.map((zone) => (
        <Zone
          key={zone.id}
          zone={zone}
          active={activeId === zone.id}
          onHover={onHover}
          onSelect={onSelect}
          showLabels={layers.labels}
        />
      ))}

      <WarehouseShell showStructure={layers.structure} showLabels={layers.labels} />

      {layers.equipment &&
        warehouseAssets.map((asset) => (
          <InteractiveAsset
            key={asset.id}
            asset={asset}
            active={activeId === asset.id}
            onHover={onHover}
            onSelect={onSelect}
          >
            <AssetVisual asset={asset} />
          </InteractiveAsset>
        ))}

      {layers.safety && <SafetyFeatures showLabels={layers.labels} />}
      {layers.labels && <WarehouseLabels labels={warehouseLabels} />}

      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.06, 0]}
        onClick={(event) => {
          event.stopPropagation();
          onClear();
        }}
        receiveShadow
      >
        <planeGeometry args={[17, 13]} />
        <meshStandardMaterial color="#172326" roughness={1} />
      </mesh>
    </>
  );
}

function CameraRig({
  controlsRef,
  presetId,
}: {
  controlsRef: RefObject<OrbitControlsImpl | null>;
  presetId: string;
}) {
  const { camera } = useThree();
  const controls = useThree((state) => state.controls) as OrbitControlsImpl | null;
  const destination = useRef(new Vector3());
  const focus = useRef(new Vector3());
  const transitioning = useRef(false);
  const mounted = useRef(false);

  useEffect(() => {
    const preset = cameraPresets.find((candidate) => candidate.id === presetId) ?? cameraPresets[0];
    destination.current.set(...preset.position);
    focus.current.set(...preset.target);

    const snap = () => {
      camera.position.copy(destination.current);
      controlsRef.current?.target.copy(focus.current);
      controlsRef.current?.update();
      transitioning.current = false;
    };

    if (!mounted.current) {
      mounted.current = true;
      snap();
      return;
    }

    // §14 reduced motion: jump to the preset instead of flying the camera.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      snap();
      return;
    }

    transitioning.current = true;
  }, [camera, controlsRef, presetId]);

  // §3 interruptibility: grabbing OrbitControls cancels the fly-to instead of fighting it.
  useEffect(() => {
    if (!controls) {
      return;
    }
    const cancel = () => {
      transitioning.current = false;
    };
    controls.addEventListener("start", cancel);
    return () => controls.removeEventListener("start", cancel);
  }, [controls]);

  useFrame((_, delta) => {
    if (!transitioning.current) {
      return;
    }

    const damping = 1 - 0.001 ** Math.min(delta, 0.1);
    camera.position.lerp(destination.current, damping);
    controlsRef.current?.target.lerp(focus.current, damping);
    controlsRef.current?.update();

    if (camera.position.distanceTo(destination.current) < 0.04) {
      camera.position.copy(destination.current);
      controlsRef.current?.target.copy(focus.current);
      controlsRef.current?.update();
      transitioning.current = false;
    }
  });

  return null;
}

function StatusDot({ status }: { status: WarehouseStatus }) {
  return <span aria-hidden="true" className={`size-2 rounded-full ${statusStyles[status].dot}`} />;
}

function Legend() {
  return (
    <div className="grid gap-2 text-muted-foreground text-xs">
      <div className="space-y-1">
        <p>Ops</p>
        <div className="flex items-center gap-4">
          {Object.keys(statusStyles).map((status) => (
            <span className="flex items-center gap-1" key={status}>
              <StatusDot status={status as WarehouseStatus} />
              {status}
            </span>
          ))}
        </div>
      </div>
      <div className="space-y-1">
        <p>Safety</p>
        <div className="flex items-center gap-4">
          {Object.keys(safetyStatusStyles).map((status) => (
            <span className="flex items-center gap-1" key={status}>
              <span
                aria-hidden="true"
                className={`size-2 rounded-full ${safetyStatusStyles[status as WarehouseSafetyStatus].dot}`}
              />
              {status}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function SceneOverlay({
  activeTarget,
  layers,
  onLayerToggle,
  onPresetChange,
  presetId,
}: {
  activeTarget: HoverTarget | null;
  layers: LayerState;
  onLayerToggle: (layer: LayerId) => void;
  onPresetChange: (preset: CameraPreset) => void;
  presetId: string;
}) {
  return (
    <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-4 sm:p-6">
      <div className="flex justify-end">
        <section className="pointer-events-auto w-full max-w-[17rem] rounded-xl border border-white/10 border-t-white/20 bg-[#101b1de8] p-3 text-white shadow-2xl backdrop-blur-md">
          <div className="border-white/10 pt-2">
            <p className="mb-2 text-sm">Layers</p>

            <div className="grid grid-cols-2 gap-1.5">
              {layerLabels.map((layer) => (
                <button
                  aria-pressed={layers[layer.id]}
                  className={`rounded-md border px-2 py-1.5 text-left text-[11px] transition duration-100 active:scale-[0.97] ${
                    layers[layer.id]
                      ? "border-cyan-200/25 bg-cyan-200/10 text-cyan-50"
                      : "border-white/10 bg-white/[0.03] text-slate-400"
                  }`}
                  key={layer.id}
                  onClick={() => onLayerToggle(layer.id)}
                  type="button"
                >
                  {layer.label}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-2 border-white/10 pt-3">
            <p className="mb-2 text-sm">Camera</p>

            <div className="flex flex-wrap gap-1.5">
              {cameraPresets.map((preset) => (
                <button
                  className={`rounded-md px-2 py-1.5 text-[10px] transition duration-100 active:scale-[0.97] ${
                    preset.id === presetId
                      ? "bg-white text-slate-900"
                      : "bg-white/10 text-slate-300 hover:bg-white/15"
                  }`}
                  key={preset.id}
                  onClick={() => onPresetChange(preset)}
                  type="button"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-2 pt-3">
            <Legend />
          </div>
        </section>
      </div>

      {activeTarget && (
        <section
          aria-live="polite"
          className="motion-safe:fade-in motion-safe:zoom-in-95 motion-safe:slide-in-from-bottom-1 pointer-events-none max-w-xs rounded-xl border border-white/10 border-t-white/20 bg-[#101b1de8] p-3 text-white shadow-2xl backdrop-blur-md motion-safe:animate-in motion-safe:duration-200"
          key={activeTarget.id}
          role="tooltip"
        >
          <div className="flex items-center gap-2">
            <StatusDot status={activeTarget.status} />
            <p className="font-medium text-sm">{activeTarget.name}</p>
            <span
              className={`ml-auto font-mono text-[9px] uppercase tracking-[0.16em] ${statusStyles[activeTarget.status].text}`}
            >
              {activeTarget.status}
            </span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 font-mono text-[9px] text-slate-300/70 uppercase tracking-[0.14em]">
            <span
              aria-hidden="true"
              className={`size-2 rounded-full ${safetyStatusStyles[activeTarget.safetyStatus].dot}`}
            />
            Safety: {activeTarget.safetyStatus}
          </div>
          {activeTarget.description && (
            <p className="mt-1 text-slate-300 text-xs">{activeTarget.description}</p>
          )}
          <div className="mt-2 grid gap-1 font-mono text-[10px] text-slate-300/75">
            {activeTarget.metrics.map((metric) => (
              <span key={metric}>{metric}</span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default function WarehouseScene() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [layers, setLayers] = useState<LayerState>(initialLayers);
  const [preset, setPreset] = useState(cameraPresets[0]);
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const activeId = hoveredId ?? selectedId;

  const activeEntity =
    warehouseZones.find((zone) => zone.id === activeId) ??
    warehouseAssets.find((asset) => asset.id === activeId);
  const targetDetails = activeEntity ? toHoverTarget(activeEntity) : null;

  return (
    <div className="relative h-full min-h-0 w-full overflow-hidden bg-[#0d1719]">
      <Canvas
        shadows
        camera={{ fov: 38, near: 0.1, far: 100, position: [14, 11, 14] }}
        gl={{ antialias: true }}
        onPointerMissed={() => {
          setHoveredId(null);
          setSelectedId(null);
        }}
      >
        <color attach="background" args={["#0d1719"]} />
        <WarehouseModel
          activeId={activeId}
          layers={layers}
          onClear={() => {
            setHoveredId(null);
            setSelectedId(null);
          }}
          onHover={(target) => setHoveredId(target?.id ?? null)}
          onSelect={(target) => setSelectedId(target.id)}
        />
        <OrbitControls enablePan enableZoom makeDefault ref={controlsRef} target={[0, 1.5, 0]} />
        <CameraRig controlsRef={controlsRef} presetId={preset.id} />
      </Canvas>
      <SceneOverlay
        activeTarget={targetDetails}
        layers={layers}
        onLayerToggle={(layer) => {
          setLayers((current) => ({ ...current, [layer]: !current[layer] }));
          setHoveredId(null);
          setSelectedId(null);
        }}
        onPresetChange={setPreset}
        presetId={preset.id}
      />
    </div>
  );
}

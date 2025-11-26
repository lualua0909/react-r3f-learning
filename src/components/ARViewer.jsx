import React, { Suspense, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { XR, ARButton, createXRStore, useXR } from "@react-three/xr";
import { Float, Stage } from "@react-three/drei";

// Component để hiển thị model trong AR
function ARModel({
  currentColor,
  selectedComponent,
  treeObjects,
  selectedTree
}) {
  const { isPresenting } = useXR();

  return (
    <Suspense fallback={null}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <Stage
        preset="upfront"
        environment="sunset"
        intensity={0.6}
        adjustCamera={!isPresenting}
        shadows={false}
      >
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <group position={[0, 0, -1]}>
            {React.createElement(selectedComponent, {
              currentColor,
              position: [0, 0, 0]
            })}
          </group>

          {treeObjects[selectedTree] &&
            React.createElement(treeObjects[selectedTree], {
              currentColor,
              position: [-2, 0, 0],
              scale: [0.1, 0.1, 0.1]
            })}
        </Float>
      </Stage>
    </Suspense>
  );
}

export default function ARViewer({
  currentColor,
  selectedComponent,
  treeObjects,
  selectedTree
}) {
  const xrStore = useMemo(() => createXRStore(), []);

  return (
    <div className="relative w-full h-full">
      <ARButton
        store={xrStore}
        sessionInit={{
          requiredFeatures: ["hit-test"],
          optionalFeatures: ["dom-overlay"],
          domOverlay: { root: document.body }
        }}
        className="ar-button"
        style={{
          position: "absolute",
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          padding: "12px 24px",
          backgroundColor: "rgba(147, 51, 234, 0.9)",
          color: "white",
          border: "2px solid rgba(255, 255, 255, 0.3)",
          borderRadius: "12px",
          fontSize: "16px",
          fontWeight: "600",
          cursor: "pointer",
          backdropFilter: "blur(10px)",
          zIndex: 1000,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
          transition: "all 0.3s ease"
        }}
        onHover={(e) => {
          e.target.style.backgroundColor = "rgba(147, 51, 234, 1)";
        }}
        onLeave={(e) => {
          e.target.style.backgroundColor = "rgba(147, 51, 234, 0.9)";
        }}
      >
        🚀 Xem trong AR
      </ARButton>
      <Canvas
        camera={{ position: [0, 0, 0], near: 0.1, far: 20 }}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: "high-performance"
        }}
      >
        <XR store={xrStore}>
          <ARModel
            currentColor={currentColor}
            selectedComponent={selectedComponent}
            treeObjects={treeObjects}
            selectedTree={selectedTree}
          />
        </XR>
      </Canvas>
    </div>
  );
}

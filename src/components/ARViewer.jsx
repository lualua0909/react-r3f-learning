import React, { Suspense, useEffect, useMemo, useState } from "react";
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
  const [isARSupported, setIsARSupported] = useState(true);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || typeof navigator === "undefined") return;

    const ua = navigator.userAgent || navigator.vendor || window.opera;
    const isiOS =
      /iPad|iPhone|iPod/.test(ua) ||
      (ua.includes("Mac") && "ontouchend" in window);

    setIsIOS(isiOS);

    // Kiểm tra hỗ trợ WebXR AR
    if (!("xr" in navigator)) {
      setIsARSupported(false);
      return;
    }

    navigator.xr
      .isSessionSupported("immersive-ar")
      .then((supported) => {
        setIsARSupported(supported);
      })
      .catch(() => {
        setIsARSupported(false);
      });
  }, []);

  const xrStore = useMemo(() => createXRStore(), []);

  return (
    <div className="relative w-full h-full">
      {isARSupported ? (
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
      ) : (
        <>
          <div
            style={{
              position: "absolute",
              bottom: isIOS ? "72px" : "20px",
              left: "50%",
              transform: "translateX(-50%)",
              padding: "10px 16px",
              backgroundColor: "rgba(15, 23, 42, 0.85)",
              color: "white",
              borderRadius: "12px",
              fontSize: "14px",
              maxWidth: "90%",
              textAlign: "center",
              zIndex: 1000,
              backdropFilter: "blur(10px)"
            }}
          >
            {isIOS
              ? "Safari trên iPhone chưa hỗ trợ WebXR. Bạn vẫn có thể xoay/zoom mô hình 3D, hoặc dùng Quick Look AR bên dưới."
              : "Thiết bị/trình duyệt hiện không hỗ trợ chế độ AR. Bạn vẫn có thể xem mô hình 3D bên dưới."}
          </div>

          {isIOS && (
            <a
              href="/Mushroom.usdz"
              rel="ar"
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
                textDecoration: "none",
                display: "inline-block",
                backdropFilter: "blur(10px)",
                zIndex: 1001,
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
                transition: "all 0.3s ease"
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "rgba(147, 51, 234, 1)";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "rgba(147, 51, 234, 0.9)";
              }}
            >
              🍄 Xem trong AR (Quick Look)
            </a>
          )}
        </>
      )}
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

import React, { useRef, useMemo } from "react";
import { useGLTF } from "@react-three/drei";

export default function Car3({
  position = [-5, 1, 10],
  currentColor = "#ff6b6b"
}) {
  const car2Ref = useRef();
  const { scene } = useGLTF("/Rover.glb");

  const coloredScene = useMemo(() => {
    const clonedScene = scene.clone();
    clonedScene.traverse((child) => {
      if (child.isMesh && child.material.name === "BodySG") {
        child.material = child.material.clone();
        child.material.color.set(currentColor);
      }
    });
    return clonedScene;
  }, [scene, currentColor]);

  return (
    <group
      ref={car2Ref}
      scale={[10, 10, 10]}
      position={[-1, 20, 0]}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "auto";
      }}
    >
      <primitive object={coloredScene} />
    </group>
  );
}

// Preload the model
useGLTF.preload("/Rover.glb");

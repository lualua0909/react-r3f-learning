import React, { useRef, useMemo } from "react";
import { useGLTF } from "@react-three/drei";

export default function Car2({
  position = [0, 0, 0],
  currentColor = "#ff6b6b"
}) {
  const car2Ref = useRef();
  const { scene } = useGLTF("/Car2.glb");

  const coloredScene = useMemo(() => {
    const clonedScene = scene.clone();
    clonedScene.traverse((child) => {
      if (
        child.isMesh &&
        child.material.name ===
          "_Lamborghini_AventadorLamborghini_Aventador_BodySG"
      ) {
        child.material = child.material.clone();
        child.material.color.set(currentColor);
      }
    });
    return clonedScene;
  }, [scene, currentColor]);

  return (
    <group
      ref={car2Ref}
      scale={[0.5, 0.5, 0.5]}
      position={position}
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
useGLTF.preload("/Car2.glb");

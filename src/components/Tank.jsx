import React, { useEffect, useRef } from "react";
import { Float, useAnimations, useGLTF } from "@react-three/drei";

export default function Tank({ position = [0, 0, 0], scrollProgress = 0 }) {
  const tankRef = useRef();
  const { scene, animations } = useGLTF("/tank.gltf");

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [scene]);

  // Kết nối animations với ref
  const { actions, names, mixer } = useAnimations(animations, tankRef);

  useEffect(() => {
    // Play tất cả animation trong model
    names.forEach((name) => {
      actions[name]?.play();
    });

    // Cleanup khi unmount
    return () => mixer.stopAllAction();
  }, [actions, names, mixer]);

  return (
    <Float>
      <group ref={tankRef} position={position} scale={[0.5, 0.5, 0.5]}>
        <primitive object={scene} />
      </group>
    </Float>
  );
}

// Preload the model
useGLTF.preload("/tank.gltf");

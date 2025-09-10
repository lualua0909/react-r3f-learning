import React, { useEffect, useRef } from "react";
import { useAnimations, useGLTF } from "@react-three/drei";

export default function Spaceship({ position = [0, 0, 0], scrollProgress = 0 }) {
  const spaceshipRef = useRef();
  const { scene, animations } = useGLTF("/Spaceship.glb");

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [scene]);

  // Kết nối animations với ref
  const { actions, names, mixer } = useAnimations(animations, spaceshipRef);

  useEffect(() => {
    // Play tất cả animation trong model
    names.forEach((name) => {
      actions[name]?.play();
    });

    // Cleanup khi unmount
    return () => mixer.stopAllAction();
  }, [actions, names, mixer]);

  console.log(actions);
  return (
    <group ref={spaceshipRef} position={position} scale={[0.2, 0.2, 0.2]}>
      <primitive object={scene} />
    </group>
  );
}

// Preload the model
useGLTF.preload("/Spaceship.glb");

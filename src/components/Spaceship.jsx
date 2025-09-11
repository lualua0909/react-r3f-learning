import React, { useEffect, useMemo, useRef, useState } from "react";
import { useAnimations, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Float } from "@react-three/drei";

export default function Spaceship({ position = [0, 1, 0] }) {
  const spaceshipRef = useRef();
  const { scene, animations } = useGLTF("/Spaceship.glb");
  const [targetY, setTargetY] = useState(1);
  const [newY, setNewY] = useState(3);

  // Use refs for performance optimization - no re-renders
  const currentY = useRef(position[1]);
  // Lấy tất cả Mesh con và “chuyển” chúng thành JSX <mesh>
  const meshes = useMemo(() => {
    const out = [];
    scene.traverse((child) => {
      if (child.isMesh) {
        // Đảm bảo geometry đã có bounding info (tùy model)
        child.geometry.computeBoundingBox?.();
        child.geometry.computeBoundingSphere?.();

        out.push({
          key: child.uuid,
          geometry: child.geometry,
          material: child.material.clone(),
          position: child.position.clone(),
          rotation: child.rotation.clone(),
          scale: child.scale.clone(),
          castShadow: true,
          receiveShadow: true,
          name: child.name
        });
      }
    });
    return out;
  }, [scene]);

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

  // Smooth movement animation using lerp - optimized with refs
  useFrame(() => {
    if (spaceshipRef.current) {
      const newYValue = THREE.MathUtils.lerp(currentY.current, targetY, 0.1);
      currentY.current = newYValue;
      spaceshipRef.current.position.y = newYValue;
    }
  });

  const handleClick = (e) => {
    e.stopPropagation();
    setTargetY(targetY + newY);
    setNewY(-newY);
  };

  return (
    <Float>
      <group
        ref={spaceshipRef}
        position={[position[0], currentY.current, position[2]]}
        scale={[0.2, 0.2, 0.2]}
        onClick={handleClick}
      >
        {meshes.map((m) => (
          <mesh
            key={m.key}
            geometry={m.geometry}
            material={m.material.clone()}
            position={m.position}
            rotation={m.rotation}
            scale={m.scale}
            castShadow={m.castShadow}
            receiveShadow={m.receiveShadow}
          />
        ))}
      </group>
    </Float>
  );
}

// Preload the model
useGLTF.preload("/Spaceship.glb");

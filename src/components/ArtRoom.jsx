import { RigidBody } from "@react-three/rapier";
import React, { useRef } from "react";

export default function ArtRoom() {
  const roomRef = useRef();

  return (
    <group ref={roomRef}>
      {/* Room Floor - White/Cream */}
      <RigidBody type="fixed" name="ground">
        <mesh
          position={[0, 0, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          receiveShadow
        >
          <planeGeometry args={[20, 20]} />
          <meshLambertMaterial color="#f5f5f0" />
        </mesh>
      </RigidBody>
      {/* Room Walls */}
      {/* Back Wall */}
      <mesh position={[0, 2, -10]} receiveShadow>
        <planeGeometry args={[20, 8]} />
        <meshLambertMaterial color="#fafafa" />
      </mesh>

      {/* Left Wall */}
      <mesh position={[-10, 2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[20, 8]} />
        <meshLambertMaterial color="#f8f8f8" />
      </mesh>

      {/* Right Wall */}
      <mesh position={[10, 2, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[20, 8]} />
        <meshLambertMaterial color="#f8f8f8" />
      </mesh>

      {/* Ceiling */}
      <mesh position={[0, 6, 0]} rotation={[Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshLambertMaterial color="#ffffff" />
      </mesh>

      {/* Ambient lighting for soft illumination */}
      <ambientLight intensity={1} />
    </group>
  );
}

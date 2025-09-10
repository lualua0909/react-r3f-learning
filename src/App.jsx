import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  OrbitControls,
  useHelper,
  useTexture
} from "@react-three/drei";
import { useControls } from "leva";
import { DirectionalLightHelper } from "three";
import Tank from "./components/Tank";
import ArtRoom from "./components/ArtRoom";
import Chair from "./components/Chair";
import Spaceship from "./components/Spaceship";
import Astronaut from "./components/Astronaut";

function App() {
  const astronautRef = useRef();
  const pts = [
    [-7, 0, -7],
    [ 7, 0, -7],
    [ 7, 0,  7],
    [-7, 0,  7],
  ];

  return (
    <div className="min-h-screen">
      {/* Background Canvas */}
      <div className="flex gap-2 justify-center items-center absolute top-4 left-4 z-10 bg-black/20 backdrop-blur-sm rounded-lg p-3 border border-white/20">
        <button 
          onClick={() => astronautRef.current?.play("CharacterArmature|Run")}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
        >
          Play Move
        </button>
        <button 
          onClick={() => astronautRef.current?.stopAll()}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors"
        >
          Stop All
        </button>
      </div>
      <div className="fixed inset-0 z-0">
        <Canvas camera={{ position: [2, 2, 2] }} shadows>
          <ArtRoom />
          <Tank />
          <Chair position={[3, 0, 3]} />
          <Spaceship position={[-3, 1, 3]} />
          <AnimatedBox />
          <Astronaut ref={astronautRef} position={[0, 0, 0]} />
          <PathDebug points={pts} />
          <axesHelper args={[5]} />
          {/* <gridHelper args={[10, 10]} /> */}
          <Environment preset="apartment" />
          <OrbitControls
            enablePan={false}
            maxPolarAngle={Math.PI / 2}
            minAzimuthAngle={-Math.PI / 2}
            maxAzimuthAngle={Math.PI / 2}
            minDistance={3}
            maxDistance={10}
          />
        </Canvas>
      </div>
    </div>
  );
}

export default App;

const AnimatedBox = () => {
  const lightRef = useRef();
  const [wireframe, setWirerame] = useState(false);
  // Gắn helper vào light
  useHelper(lightRef, DirectionalLightHelper, 1, "hotpink");

  // Tạo UI điều khiển bằng leva
  const { intensity, x, y, z } = useControls("Directional Light", {
    intensity: { value: 1, min: 0, max: 5, step: 0.1 },
    x: { value: 5, min: -10, max: 10 },
    y: { value: 5, min: -10, max: 10 },
    z: { value: 5, min: -10, max: 10 }
  });

  const { speed } = useControls({
    speed: {
      value: 0.01,
      min: 0,
      max: 10,
      step: 0.01
    },
    size: {
      value: 10,
      min: 0,
      max: 10,
      step: 0.1
    }
  });

  const boxRef = useRef();

  useFrame(() => {
    if (boxRef.current) {
      boxRef.current.rotation.x += speed;
      boxRef.current.rotation.y += speed;
    }
  });

  const texture = useTexture("./src/assets/tt.jpg");
  return (
    <mesh
      ref={boxRef}
      castShadow
      position={[2, 1, 1]}
      onClick={() => setWirerame(!wireframe)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial wireframe={wireframe} map={texture} />
      <directionalLight
        ref={lightRef}
        position={[5, 5, 5]}
        intensity={intensity}
        castShadow
      />
    </mesh>
  );
};

function PathDebug({ points }) {
  // Vẽ vài điểm để đảm bảo path đúng tỉ lệ / vị trí
  return points.map(([x, y, z], i) => (
    <mesh key={i} position={[x, y + 0.1, z]}>
      <sphereGeometry args={[0.2, 16, 16]} />
      <meshBasicMaterial color={i === 0 ? "lime" : "hotpink"} />
    </mesh>
  ));
}

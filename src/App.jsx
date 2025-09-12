import React, { useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  OrbitControls,
  Stage,
  useHelper,
  useKeyboardControls,
  useTexture
} from "@react-three/drei";
import { useControls } from "leva";
import { DirectionalLightHelper, Vector3 } from "three";
import Tank from "./components/Tank";
import ArtRoom from "./components/ArtRoom";
import Chair from "./components/Chair";
import Spaceship from "./components/Spaceship";
import Astronaut from "./components/Astronaut";
import { BallCollider, Physics, RigidBody } from "@react-three/rapier";
import { KeyboardControls } from "@react-three/drei";
import Car1 from "./components/Car1";
import ProductPage from "./ProductPage";

export const Controls = {
  forward: "forward",
  back: "back",
  left: "left",
  right: "right",
  jump: "jump"
};

function App() {
  const astronautRef = useRef();
  const pts = [
    [-7, 0, -7],
    [7, 0, -7],
    [7, 0, 7],
    [-7, 0, 7]
  ];

  const map = useMemo(
    () => [
      { name: Controls.forward, keys: ["ArrowUp", "KeyW"] },
      { name: Controls.back, keys: ["ArrowDown", "KeyS"] },
      { name: Controls.left, keys: ["ArrowLeft", "KeyA"] },
      { name: Controls.right, keys: ["ArrowRight", "KeyD"] },
      { name: Controls.jump, keys: ["Space"] }
    ],
    []
  );

  return (
    <div className="min-h-screen">
      {/* Background Canvas */}
      <div className="flex gap-2 justify-center items-center absolute inset-0 z-10 bg-gray-100 backdrop-blur-sm rounded-lg p-3 border border-white/20">
        <ProductPage />
      </div>
      {/* <div className="fixed inset-0 z-0">
        <Canvas camera={{ position: [2, 2, 2] }} shadows>
          <KeyboardControls map={map}>
            <Stage intensity={0.4} preset={"upfront"} environment={"studio"}>
              <Car1 />
            </Stage>
            <OrbitControls
              enablePan={false}
              maxPolarAngle={Math.PI / 2}
              minAzimuthAngle={-Math.PI / 2}
              maxAzimuthAngle={Math.PI / 2}
              minDistance={3}
              maxDistance={10}
            />
            <Physics debug gravity={[0, -50, 0]}>
              <RigidBody colliders="cuboid">
                <Tank />
              </RigidBody>
              <Chair position={[3, 0, 3]} />

              <ArtRoom />
              <Spaceship position={[-3, 1, 3]} />
              <AnimatedBox />

              <Astronaut ref={astronautRef} position={[0, 0, 0]} />
              <PathDebug points={pts} />
              <axesHelper args={[5]} />
              <Environment preset="apartment" />
            </Physics>
          </KeyboardControls>
        </Canvas>
      </div> */}
    </div>
  );
}

export default App;

const MOVEMENT_SPEED = 5;
const JUMP_FORCE = 8;

const AnimatedBox = () => {
  const [wireframe, setWirerame] = useState(false);

  const [, get] = useKeyboardControls();
  const rb = useRef();
  const inTheAir = useRef(false);
  const vel = new Vector3();

  useFrame(() => {
    vel.x = 0;
    vel.y = 0;
    vel.z = 0;
    const curVel = rb.current.linvel();
    if (get()[Controls.forward]) {
      vel.z -= MOVEMENT_SPEED;
    }
    if (get()[Controls.back]) {
      vel.z += MOVEMENT_SPEED;
    }
    if (get()[Controls.left]) {
      vel.x -= MOVEMENT_SPEED;
    }
    if (get()[Controls.right]) {
      vel.x += MOVEMENT_SPEED;
    }
    if (get()[Controls.jump] && !inTheAir.current) {
      vel.y += JUMP_FORCE;
      inTheAir.current = true;
    } else {
      vel.y = curVel.y;
    }
    rb.current.setLinvel(vel, true);

    if (curVel.y <= 0 && vel.y > 0) {
      inTheAir.current = false;
    }
  });

  const texture = useTexture("./src/assets/tt.jpg");

  return (
    <RigidBody
      ref={rb}
      name="box"
      lockRotations
      onCollisionEnter={({ other }) => {
        if (other.rigidBodyObject.name === "ground") {
          inTheAir.current = false;
        }
      }}
    >
      <mesh
        castShadow
        position={[2, 1, 1]}
        onClick={() => setWirerame(!wireframe)}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial wireframe={wireframe} map={texture} />
      </mesh>
    </RigidBody>
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

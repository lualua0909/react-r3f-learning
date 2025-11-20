import React, { useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  OrbitControls,
  Stage,
  useHelper,
  useKeyboardControls,
  useTexture,
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
import NewsPage from "./NewsPage";
import { motion, AnimatePresence } from "framer-motion";

export const Controls = {
  forward: "forward",
  back: "back",
  left: "left",
  right: "right",
  jump: "jump",
};

function App() {
  const [currentPage, setCurrentPage] = useState("products");
  const astronautRef = useRef();
  const pts = [
    [-7, 0, -7],
    [7, 0, -7],
    [7, 0, 7],
    [-7, 0, 7],
  ];

  const map = useMemo(
    () => [
      { name: Controls.forward, keys: ["ArrowUp", "KeyW"] },
      { name: Controls.back, keys: ["ArrowDown", "KeyS"] },
      { name: Controls.left, keys: ["ArrowLeft", "KeyA"] },
      { name: Controls.right, keys: ["ArrowRight", "KeyD"] },
      { name: Controls.jump, keys: ["Space"] },
    ],
    []
  );

  return (
    <div className="relative">
      {/* Navigation Bar */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-0 left-0 right-0 z-50 glass-panel backdrop-blur-xl bg-white/20 border-b border-white/30 shadow-lg"
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.h1
              whileHover={{ scale: 1.05 }}
              className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent cursor-pointer"
              onClick={() => setCurrentPage("products")}
            >
              NFT Collection
            </motion.h1>
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentPage("products")}
                className={`px-6 py-2 rounded-xl font-semibold transition-all duration-300 ${
                  currentPage === "products"
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                    : "bg-white/10 text-gray-700 hover:bg-white/20 backdrop-blur-sm border border-white/30"
                }`}
              >
                Sản Phẩm
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentPage("news")}
                className={`px-6 py-2 rounded-xl font-semibold transition-all duration-300 ${
                  currentPage === "news"
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                    : "bg-white/10 text-gray-700 hover:bg-white/20 backdrop-blur-sm border border-white/30"
                }`}
              >
                Tin Tức
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Page Content */}
      <div className="pt-20">
        <AnimatePresence mode="wait">
          {currentPage === "products" ? (
            <motion.div
              key="products"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <ProductPage />
            </motion.div>
          ) : (
            <motion.div
              key="news"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <NewsPage />
            </motion.div>
          )}
        </AnimatePresence>
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

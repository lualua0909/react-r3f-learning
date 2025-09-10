import React, {
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
  useMemo
} from "react";
import { useAnimations, useGLTF } from "@react-three/drei";
import useYukaPatrol from "../hooks/usePatrol";

export default forwardRef(function Astronaut({ position = [0, 0, 0] }, ref) {
  const astronautRef = useRef();
  const { scene, animations } = useGLTF("/Astronaut.glb");
  // Kết nối animations với ref
  const { actions, names, mixer } = useAnimations(animations, astronautRef);

  // Lộ ra API ra bên ngoài
  useImperativeHandle(
    ref,
    () => ({
      play: (name = names[0]) => actions[name]?.reset().fadeIn(0.2).play(),
      stop: (name = names[0]) => actions[name]?.fadeOut(0.2).stop(),
      stopAll: () => mixer.stopAllAction()
    }),
    [actions, names, mixer]
  );

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [scene]);

  useEffect(() => () => mixer.stopAllAction(), [mixer]);

  const pathPoints = useMemo(() => {
    const [ox, oy, oz] = position;
    const pts = [
      [-7, 0, -7],
      [7, 0, -7],
      [7, 0, 7],
      [-7, 0, 7]
    ];
    return pts.map(([x, y, z]) => [x + ox, y + oy, z + oz]);
  }, [position]);

  // Gọi hook điều khiển tuần tra Yuka (Room 20x20)
  useYukaPatrol({
    objectRef: astronautRef,
    maxSpeed: 3,
    // pathPoints có thể tuỳ chỉnh: truyền props vào Character nếu muốn
    pathPoints,
    loop: true,
    enabled: true,
    onInit: ({ vehicle }) => {
      // Ví dụ tinh chỉnh hướng ban đầu
      vehicle.rotation.fromEuler(0, Math.PI * 0.5, 0);
      console.log("Astronaut patrol initialized with vehicle:", vehicle);
    }
  });

  console.log(actions);

  return (
    <group ref={astronautRef}  scale={[0.5, 0.5, 0.5]}>
      <primitive object={scene} />
    </group>
  );
});

// Preload the model
useGLTF.preload("/Astronaut.glb");

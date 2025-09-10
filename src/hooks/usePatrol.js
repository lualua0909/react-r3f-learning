// hooks/useYukaPatrol.js
import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as YUKA from "yuka";

/**
 * useYukaPatrol
 * @param objectRef
 * @param maxSpeed
 * @param pathPoints
 * @param loop
 * @param enabled
 * @param onInit
 * @param followRadius  // Độ bám đường (mặc định 1.5 để dễ thấy)
 */
export default function useYukaPatrol({
  objectRef,
  maxSpeed = 2,
  pathPoints = [
    [-10, 0, -10],
    [10, 0, -10],
    [10, 0, 10],
    [-10, 0, 10]
  ],
  loop = true,
  enabled = true,
  followRadius = 1.5,
  onInit
} = {}) {
  const entityManagerRef = useRef(null);
  const vehicleRef = useRef(null);
  const clockRef = useRef(new YUKA.Time());

  // Debug clock
  console.log("Clock created:", clockRef.current);
  const initedRef = useRef(false);

  const path = useMemo(() => {
    const p = new YUKA.Path();

    // Validate pathPoints before creating path
    if (!pathPoints || pathPoints.length === 0) {
      console.error("pathPoints is empty or undefined:", pathPoints);
      return p;
    }

    pathPoints.forEach((point, index) => {
      if (!point || point.length !== 3) {
        console.error(`Invalid point at index ${index}:`, point);
        return;
      }
      const [x, y, z] = point;
      if (
        typeof x !== "number" ||
        typeof y !== "number" ||
        typeof z !== "number"
      ) {
        console.error(`Invalid point values at index ${index}:`, point);
        return;
      }
      const vectorPoint = new YUKA.Vector3(x, y, z);
      p.add(vectorPoint);
      console.log(`Added point ${index} to path:`, vectorPoint);
    });

    if (p.length === 0) {
      console.error("Path has no valid points!");
      return p;
    }

    p.loop = loop;
    console.log("Path created with points:", pathPoints);
    console.log("Path current point:", p.current());
    console.log("Path length:", p.length);
    console.log("Path is closed:", p.closed);

    return p;
  }, [pathPoints, loop]);

  useEffect(() => {
    if (!objectRef?.current) return;

    // Cho phép re-init khi deps đổi (không chặn vĩnh viễn)
    if (initedRef.current) {
      // cleanup trước khi init lại
      entityManagerRef.current?.clear();
      entityManagerRef.current = null;
      vehicleRef.current = null;
      initedRef.current = false;
    }
    initedRef.current = true;

    const entityManager = new YUKA.EntityManager();
    const vehicle = new YUKA.Vehicle();

    vehicle.maxSpeed = maxSpeed;
    vehicle.updateOrientation = true; // đảm bảo xoay theo vận tốc

    // Debug vehicle properties
    console.log("Vehicle maxSpeed set to:", vehicle.maxSpeed);
    console.log("Vehicle updateOrientation:", vehicle.updateOrientation);
    console.log("Vehicle mass:", vehicle.mass);
    console.log("Vehicle maxForce:", vehicle.maxForce);

    // Đồng bộ Yuka -> Three
    vehicle.setRenderComponent(objectRef.current, (entity, obj3d) => {
      obj3d.position.copy(entity.position);
      obj3d.quaternion.copy(entity.rotation);
      obj3d.updateMatrixWorld(); // Cần thiết để cập nhật ma trận
    });

    // Behaviors - only create if path is valid
    if (path.length === 0) {
      console.error("Cannot create behaviors - path is empty!");
      return;
    }

    const follow = new YUKA.FollowPathBehavior(path, followRadius);
    const onPath = new YUKA.OnPathBehavior(path);

    // Debug behaviors before adding
    console.log("Follow behavior path:", follow.path);
    console.log("Follow behavior radius:", follow.radius);
    console.log("OnPath behavior path:", onPath.path);
    console.log("Follow behavior weight:", follow.weight);
    console.log("OnPath behavior weight:", onPath.weight);

    // Try adding behaviors one by one
    console.log("Adding follow behavior...");
    vehicle.steering.add(follow);
    console.log(
      "Follow behavior added. Current behaviors count:",
      vehicle.steering.behaviors.length
    );

    console.log("Adding onPath behavior...");
    vehicle.steering.add(onPath);
    console.log(
      "OnPath behavior added. Current behaviors count:",
      vehicle.steering.behaviors.length
    );

    // Debug after adding
    console.log("Behaviors added to vehicle");
    console.log(
      "Vehicle steering behaviors count:",
      vehicle.steering.behaviors.length
    );
    console.log("Vehicle steering behaviors:", vehicle.steering.behaviors);

    // Test behaviors manually - only if path is valid
    if (path.length > 0) {
      console.log("Testing behaviors manually...");
      try {
        const testForce = follow.calculate(vehicle);
        console.log("Follow behavior force:", testForce);
        const testForce2 = onPath.calculate(vehicle);
        console.log("OnPath behavior force:", testForce2);
      } catch (error) {
        console.error("Error testing behaviors:", error);
      }
    } else {
      console.log("Skipping behavior test - path is empty");
    }

    console.log("Vehicle created with maxSpeed:", vehicle.maxSpeed);
    console.log("Vehicle position:", vehicle.position);
    console.log("Follow behavior added with radius:", followRadius);
    console.log(
      "Vehicle steering behaviors count:",
      vehicle.steering.behaviors.length
    );
    console.log(
      "Behaviors:",
      vehicle.steering.behaviors.map((b) => b.constructor.name)
    );

    // Vị trí bắt đầu - sử dụng điểm đầu tiên của path
    if (path.length > 0) {
      const firstPoint = path.current();
      if (firstPoint) {
        vehicle.position.copy(firstPoint);
        console.log("Vehicle starting position set to:", vehicle.position);
      } else {
        vehicle.position.set(0, 0, 0);
        console.log("Vehicle starting position set to default (0,0,0)");
      }
    } else {
      vehicle.position.set(0, 0, 0);
      console.log("Vehicle starting position set to default (0,0,0) - no path");
    }

    // Initialize velocity to zero
    vehicle.velocity.set(0, 0, 0);
    console.log("Vehicle velocity initialized to:", vehicle.velocity);

    // Debug vehicle state after position setting
    console.log("Vehicle position after setting:", vehicle.position);
    console.log("Vehicle velocity after setting:", vehicle.velocity);
    console.log("Vehicle rotation after setting:", vehicle.rotation);

    // Try adding vehicle to entity manager
    console.log("Adding vehicle to entity manager...");
    entityManager.add(vehicle);
    console.log("Vehicle added to entity manager");

    // Debug entity manager
    console.log(
      "Entity manager entities count:",
      entityManager.entities.length
    );
    console.log("Entity manager entities:", entityManager.entities);

    entityManagerRef.current = entityManager;
    vehicleRef.current = vehicle;

    onInit?.({ vehicle, entityManager, path });

    // Debug final state
    console.log(
      "Final vehicle state - Position:",
      vehicle.position,
      "Velocity:",
      vehicle.velocity
    );
    console.log(
      "Final entity manager state - Entities:",
      entityManager.entities.length
    );

    // Test vehicle update manually - only if path is valid
    if (path.length > 0) {
      console.log("Testing vehicle update manually...");
      try {
        const testDelta = 0.016; // 60fps
        entityManager.update(testDelta);
        console.log(
          "After manual update - Position:",
          vehicle.position,
          "Velocity:",
          vehicle.velocity
        );
      } catch (error) {
        console.error("Error in manual update:", error);
      }
    } else {
      console.log("Skipping manual update test - path is empty");
    }

    return () => {
      entityManager.clear();
      entityManagerRef.current = null;
      vehicleRef.current = null;
      initedRef.current = false; // <-- rất quan trọng
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [objectRef, maxSpeed, followRadius, path, enabled]);

  useFrame(() => {
    const em = entityManagerRef.current;
    const v = vehicleRef.current;
    if (!em || !v) return;

    v.maxSpeed = enabled ? Math.max(0.01, maxSpeed) : 0;

    const delta = clockRef.current.getDelta();

    // Debug: Log every frame for first few seconds
    const now = performance.now() / 1000;
    if (now < 5) {
      console.log(
        "Frame update - Delta:",
        delta,
        "MaxSpeed:",
        v.maxSpeed,
        "Position:",
        v.position,
        "Velocity:",
        v.velocity
      );
      console.log("Steering behaviors:", v.steering.behaviors.length);
      console.log("Entity manager entities:", em.entities.length);
    }

    // Try using a fixed delta for testing
    try {
      const testDelta = 0.016; // 60fps
      em.update(testDelta);
    } catch (error) {
      console.error("Error in entity manager update:", error);
      return;
    }

    // Check if position changed after update
    if (now < 5) {
      console.log(
        "After update - Position:",
        v.position,
        "Velocity:",
        v.velocity
      );
    }

    // Debug: Log position every 2 seconds after initial period
    if (now > 5 && Math.floor(now) % 2 === 0) {
      console.log(
        "Vehicle position:",
        v.position,
        "Velocity:",
        v.velocity,
        "Speed:",
        v.velocity.length()
      );
    }
  });

  return {
    vehicle: vehicleRef.current,
    entityManager: entityManagerRef.current,
    path
  };
}

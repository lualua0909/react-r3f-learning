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

  const initedRef = useRef(false);

  const path = useMemo(() => {
    const p = new YUKA.Path();

    // Validate pathPoints before creating path
    if (!pathPoints || pathPoints.length === 0) {
      return p;
    }

    pathPoints.forEach((point, index) => {
      if (!point || point.length !== 3) {
        return;
      }
      const [x, y, z] = point;
      if (
        typeof x !== "number" ||
        typeof y !== "number" ||
        typeof z !== "number"
      ) {
        return;
      }
      const vectorPoint = new YUKA.Vector3(x, y, z);
      p.add(vectorPoint);
    });

    if (p.length === 0) {
      return p;
    }

    p.loop = loop;

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

    // Đồng bộ Yuka -> Three
    vehicle.setRenderComponent(objectRef.current, (entity, obj3d) => {
      obj3d.position.copy(entity.position);
      obj3d.quaternion.copy(entity.rotation);
      obj3d.updateMatrixWorld(); // Cần thiết để cập nhật ma trận
    });

    // Behaviors - only create if path is valid
    if (path.length === 0) {
      return;
    }

    const follow = new YUKA.FollowPathBehavior(path, followRadius);
    const onPath = new YUKA.OnPathBehavior(path);

    // Try adding behaviors one by one
    vehicle.steering.add(follow);
    vehicle.steering.add(onPath);

    // Vị trí bắt đầu - sử dụng điểm đầu tiên của path
    if (path.length > 0) {
      const firstPoint = path.current();
      if (firstPoint) {
        vehicle.position.copy(firstPoint);
      } else {
        vehicle.position.set(0, 0, 0);
      }
    } else {
      vehicle.position.set(0, 0, 0);
    }

    // Initialize velocity to zero
    vehicle.velocity.set(0, 0, 0);

    // Try adding vehicle to entity manager
    entityManager.add(vehicle);

    entityManagerRef.current = entityManager;
    vehicleRef.current = vehicle;

    onInit?.({ vehicle, entityManager, path });

    // Test vehicle update manually - only if path is valid
    if (path.length > 0) {
      try {
        const testDelta = 0.016; // 60fps
        entityManager.update(testDelta);
      } catch (error) {}
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

    // Try using a fixed delta for testing
    try {
      const testDelta = 0.016; // 60fps
      em.update(testDelta);
    } catch (error) {
      return;
    }
  });

  return {
    vehicle: vehicleRef.current,
    entityManager: entityManagerRef.current,
    path
  };
}

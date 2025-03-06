import { useSpring } from "@react-spring/three";
import { Clone, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Group } from "three";
import { a } from "@react-spring/three";

export type ChestStatus = "closed" | "shaking" | "open";

function Chest(props: { chestStatus: ChestStatus }) {
  const { chestStatus } = props;
  const { nodes } = useGLTF("/chest.glb");
  const chestRef = useRef<Group | null>(null);
  const shakerRef = useRef<Group | null>(null);
  const lidProxy = useRef<Group | null>(null);
  const { spring: openSpring } = useSpring({
    spring: chestStatus === "open" ? 1 : 0,
    config: {
      mass: 25,
      tension: 400,
      friction: 50,
      precision: 0.0001,
      clamp: true,
    },
  });
  const { spring: shakeSpring } = useSpring({
    spring: chestStatus === "shaking" ? 1 : 0,
    config: {
      mass: 25,
      tension: 400,
      friction: 50,
      precision: 0.0001,
      clamp: true,
    },
  });
  const rotation = openSpring.to([0, 1], [0, Math.PI * 0.65]);
  const shaking = shakeSpring.to([0, 1], [0, Math.PI * 0.65]);
  useFrame(({ clock }) => {
    if (!chestRef.current) {
      return;
    }
    const now = clock.getElapsedTime();

    chestRef.current.rotation.y = Math.sin(now) * 0.1;
    chestRef.current.rotation.z = Math.sin(now * 2) * 0.1;
    chestRef.current.children[0].rotation.x =
      lidProxy.current!.rotation.x * 0.2 +
      Math.PI +
      Math.sin(clock.elapsedTime * 30) * shakerRef.current!.rotation.z * 0.01;
    chestRef.current.children[0].rotation.z =
      Math.PI +
      Math.cos(clock.elapsedTime * 30) * shakerRef.current!.rotation.z * 0.01;
    chestRef.current.children[0].rotation.y =
      Math.cos(clock.elapsedTime * 15) * shakerRef.current!.rotation.z * 0.01;
    chestRef.current.children[0].children[2].rotation.x =
      lidProxy.current!.rotation.x;
  });

  return (
    <group rotation={[0.5, 0, 0]}>
      <a.object3D ref={lidProxy} rotation-x={rotation}></a.object3D>
      <a.object3D ref={shakerRef} rotation-z={shaking}></a.object3D>
      <a.object3D ref={chestRef}>
        <Clone
          scale={[4, 4, 4]}
          position={[0, -1.75, 0]}
          object={nodes["chest-bottom"]}
        />
      </a.object3D>
    </group>
  );
}

useGLTF.preload("/pickaxe-iron.glb");

export default Chest;

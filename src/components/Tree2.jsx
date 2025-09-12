import { useGLTF } from "@react-three/drei";

function Tree2(props) {
  const { scene } = useGLTF(
    "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/tree-beech/model.gltf"
  );
  return <primitive object={scene} {...props} />;
}

export default Tree2;

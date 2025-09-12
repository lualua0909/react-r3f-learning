import { useGLTF } from "@react-three/drei";

function Home1(props) {
  const { scene } = useGLTF(
    "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/house-4/model.gltf"
  );
  return <primitive object={scene} {...props} />;
}

export default Home1;

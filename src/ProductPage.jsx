import React, { Suspense, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { Stage } from "@react-three/drei";
import { OrbitControls } from "@react-three/drei";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import Car4 from "./components/Car4";
import Car5 from "./components/Car5";
import Tree1 from "./components/Tree1";
// import Tree2 from "./components/Tree2";
import Car3 from "./components/Car3";
import Car1 from "./components/Car2";

export default function ProductPage() {
  const [selectedImage, setSelectedImage] = useState(0);
  const [currentColor, setCurrentColor] = useState("#8B5CF6");
  const [selectedTree, setSelectedTree] = useState(0);
  const [selectedComponent, setSelectedComponent] = useState(() => Car1);
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  const treeObjects = [null, Tree1, null];

  const productImages = [
    {
      component: Car1,
      image: "src/assets/car1.png",
      alt: "Product Image 1",
      price: 120000,
      carName: "Xe Cảnh Sát",
      carDescription:
        "Chiếc xe cảnh sát mạnh mẽ với thiết kế hầm hố, đèn tín hiệu nổi bật và khả năng di chuyển linh hoạt. Hoàn hảo cho những ai yêu thích tốc độ và phong cách quyền lực."
    },
    {
      component: Car3,
      image: "src/assets/car2.png",
      alt: "Product Image 2",
      price: 223456,
      carName: "Xe Thể Thao",
      carDescription:
        "Mẫu xe thể thao sang trọng với đường nét khí động học, động cơ mạnh mẽ và khả năng tăng tốc vượt trội. Mang lại trải nghiệm lái đầy phấn khích và cá tính."
    },
    {
      component: Car4,
      image: "src/assets/car3.png",
      alt: "Product Image 3",
      price: 123678,
      carName: "Xe Tesla",
      carDescription:
        "Xe điện thông minh với công nghệ tiên tiến, thân thiện môi trường và khả năng vận hành êm ái. Lựa chọn hoàn hảo cho tương lai xanh và hiện đại."
    },
    {
      component: Car5,
      image: "src/assets/car4.png",
      alt: "Product Image 4",
      price: 123490,
      carName: "Tàu Vũ Trụ",
      carDescription:
        "Phương tiện viễn tưởng mang phong cách tương lai, thiết kế ấn tượng và cảm giác như đang bước vào thế giới không gian. Dành cho những ai đam mê khám phá vũ trụ."
    }
  ];

  const colors = [
    "#FFD700", // LimYellow
    "#3B82F6", // Blue
    "#EC4899", // Pink
    "#06B6D4", // Cyan
    "#10B981", // Emerald
    "#F59E0B" // Amber
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          style={{ y: backgroundY }}
          className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"
        ></motion.div>
        <motion.div 
          style={{ y: useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]) }}
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"
        ></motion.div>
        <motion.div 
          style={{ y: useTransform(scrollYProgress, [0, 1], ["0%", "20%"]) }}
          className="absolute top-40 left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"
        ></motion.div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 xl:grid-cols-2 items-start gap-8">
          {/* 3D Product Viewer */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="order-2 xl:order-1"
          >
            {/* Main 3D Viewer */}
            <div className="relative">
              <div className="glass-panel rounded-3xl p-6 backdrop-blur-xl bg-white/20 border border-white/30 shadow-2xl">
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={selectedImage}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.5 }}
                    className="h-[80vh] flex items-center justify-center"
                  >
                  <Canvas>
                    <Suspense fallback={null}>
                      <Stage
                        preset="upfront"
                        environment="sunset"
                        intensity={0.6}
                        adjustCamera
                        shadows={false}
                      >
                        <Float
                          speed={2}
                          rotationIntensity={0.5}
                          floatIntensity={0.5}
                        >
                          <group position={[0, 0, 0]}>
                            {React.createElement(selectedComponent, {
                              currentColor,
                              position: [0, 0, 0]
                            })}
                          </group>

                          {treeObjects[selectedTree] &&
                            React.createElement(treeObjects[selectedTree], {
                              currentColor,
                              position: [-2, 0, 0],
                              scale: [0.1, 0.1, 0.1]
                            })}
                        </Float>
                      </Stage>

                      <OrbitControls
                        enablePan={false}
                        enableZoom={false}
                        maxPolarAngle={Math.PI / 2}
                        minAzimuthAngle={-Math.PI / 2}
                        maxAzimuthAngle={Math.PI / 2}
                      />
                    </Suspense>
                  </Canvas>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* Product Information */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="order-1 xl:order-2 space-y-8"
          >
            {/* Brand & Badge */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex items-center justify-between"
            >
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="glass-panel rounded-full px-6 py-3 backdrop-blur-xl bg-white/20 border border-white/30 shadow-lg"
              >
                <span className="text-purple-700 text-sm font-semibold uppercase tracking-wider">
                  Bộ Sưu Tập
                </span>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-3 glass-panel rounded-full px-4 py-2 backdrop-blur-xl bg-white/20 border border-white/30 shadow-lg"
              >
                <motion.div 
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-2 h-2 bg-green-400 rounded-full"
                ></motion.div>
                <span className="text-green-700 text-sm font-medium">
                  Có Sẵn
                </span>
              </motion.div>
            </motion.div>

            {/* Title */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              whileHover={{ y: -5 }}
              className="glass-panel rounded-3xl p-8 backdrop-blur-xl bg-white/20 border border-white/30 shadow-2xl"
            >
              <AnimatePresence mode="wait">
                <motion.div 
                  key={selectedImage}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <h1 className="text-5xl font-bold text-gray-800 leading-tight">
                    <motion.span 
                      initial={{ backgroundPosition: "0% 50%" }}
                      animate={{ backgroundPosition: "100% 50%" }}
                      transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
                      className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent"
                      style={{ backgroundSize: "200% 200%" }}
                    >
                      {productImages[selectedImage].carName}
                    </motion.span>{" "}
                    <span className="text-gray-700">Cao Cấp</span>
                  </h1>
                  <p className="text-xl text-gray-600 leading-relaxed">
                    {productImages[selectedImage].carDescription}
                  </p>
                </motion.div>
              </AnimatePresence>
              <motion.span 
                key={`price-${selectedImage}`}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
              >
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD"
                }).format(productImages[selectedImage].price)}
              </motion.span>
            </motion.div>

            {/* Customization Options */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="glass-panel rounded-3xl p-8 backdrop-blur-xl bg-white/20 border border-white/30 shadow-2xl"
            >
              <div className="space-y-8">
                {/* Color Selection */}
                <div className="space-y-6">
                  <motion.h3 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.9 }}
                    className="text-xl font-semibold text-gray-800"
                  >
                    Chọn Màu Sắc
                  </motion.h3>
                  <motion.div 
                    initial="hidden"
                    animate="visible"
                    variants={{
                      visible: {
                        transition: {
                          staggerChildren: 0.05
                        }
                      }
                    }}
                    className="flex flex-wrap gap-4"
                  >
                    {colors.map((color, index) => (
                      <motion.button
                        key={index}
                        variants={{
                          hidden: { opacity: 0, scale: 0 },
                          visible: { opacity: 1, scale: 1 }
                        }}
                        whileHover={{ scale: 1.15, rotate: 5 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setCurrentColor(color)}
                        className={`relative w-14 h-14 rounded-2xl border-3 transition-all duration-300 btn-glass ${
                          currentColor === color
                            ? "border-white shadow-xl ring-4 ring-white/30"
                            : "border-white/50 hover:border-white/70"
                        }`}
                      >
                        <motion.div
                          animate={currentColor === color ? { scale: [1, 1.1, 1] } : {}}
                          transition={{ duration: 0.3 }}
                          className="w-full h-full rounded-xl"
                          style={{ backgroundColor: color }}
                        />
                        <AnimatePresence>
                          {currentColor === color && (
                            <motion.div 
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0, opacity: 0 }}
                              transition={{ type: "spring", stiffness: 500, damping: 25 }}
                              className="absolute inset-0 flex items-center justify-center"
                            >
                              <div className="w-7 h-7 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
                                <svg
                                  className="w-4 h-4 text-gray-800"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.button>
                    ))}
                  </motion.div>
                </div>

                {/* Tree Selection */}
                <div className="space-y-6">
                  <motion.h3 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 1.0 }}
                    className="text-xl font-semibold text-gray-800"
                  >Cây</motion.h3>
                  <motion.div 
                    initial="hidden"
                    animate="visible"
                    variants={{
                      visible: {
                        transition: {
                          staggerChildren: 0.1
                        }
                      }
                    }}
                    className="flex flex-wrap gap-4"
                  >
                    {treeObjects.map((tree, index) =>
                      tree ? (
                        <motion.button
                          key={index}
                          variants={{
                            hidden: { opacity: 0, y: 20 },
                            visible: { opacity: 1, y: 0 }
                          }}
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSelectedTree(index)}
                          className={`relative px-6 py-3 rounded-2xl border-2 transition-all duration-300 backdrop-blur-sm btn-glass ${
                            selectedTree === index
                              ? "border-purple-500/50 bg-purple-500/20 text-purple-800 shadow-lg"
                              : "border-white/50 bg-white/10 text-gray-700 hover:border-white/70 hover:bg-white/20"
                          }`}
                        >
                          <span className="font-medium">Cây {index}</span>
                        </motion.button>
                      ) : (
                        <motion.button
                          key={index}
                          variants={{
                            hidden: { opacity: 0, y: 20 },
                            visible: { opacity: 1, y: 0 }
                          }}
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSelectedTree(index)}
                          className={`relative px-6 py-3 rounded-2xl border-2 transition-all duration-300 backdrop-blur-sm border-white/50 bg-white/10 text-gray-700 hover:border-white/70 hover:bg-white/20 btn-glass ${
                            selectedTree === index
                              ? "border-purple-500/50 bg-purple-500/20 text-purple-800 shadow-lg"
                              : ""
                          }`}
                        >
                          <span className="font-medium">Bỏ Chọn Cây</span>
                        </motion.button>
                      )
                    )}
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Thumbnail Gallery */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="glass-panel rounded-3xl p-6 backdrop-blur-xl bg-white/20 border border-white/30 shadow-2xl"
            >
              <motion.div 
                initial="hidden"
                animate="visible"
                variants={{
                  visible: {
                    transition: {
                      staggerChildren: 0.08
                    }
                  }
                }}
                className="grid grid-cols-4 gap-4"
              >
                {productImages.map((thumb, index) => (
                  <motion.button
                    key={index}
                    variants={{
                      hidden: { opacity: 0, scale: 0.8 },
                      visible: { opacity: 1, scale: 1 }
                    }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setSelectedImage(index);
                      setSelectedComponent(() => thumb.component);
                    }}
                    className={`aspect-square rounded-2xl overflow-hidden border-2 transition-all duration-300 backdrop-blur-sm btn-glass ${
                      selectedImage === index
                        ? "border-purple-500/50 ring-4 ring-purple-500/20 shadow-xl bg-purple-500/10"
                        : "border-white/50 hover:border-white/70 bg-white/10"
                    }`}
                  >
                    <img
                      src={thumb.image || "/placeholder.svg"}
                      alt={`Product view ${index + 1}`}
                      width={100}
                      height={100}
                      className="w-full h-full object-contain bg-white/20"
                    />
                  </motion.button>
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

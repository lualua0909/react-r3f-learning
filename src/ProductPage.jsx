import React, { Suspense, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { Stage } from "@react-three/drei";
import { OrbitControls } from "@react-three/drei";
import Car4 from "./components/Car4";
import Car5 from "./components/Car5";
import Tree1 from "./components/Tree1";
import Tree2 from "./components/Tree2";
import Car3 from "./components/Car3";
import Car1 from "./components/Car1";
import Home1 from "./components/Home1";

export default function ProductPage() {
  const [quantity, setQuantity] = useState(0);
  const [selectedImage, setSelectedImage] = useState(0);
  const [currentColor, setCurrentColor] = useState("#8B5CF6");
  const [selectedTree, setSelectedTree] = useState(0);
  const [selectedComponent, setSelectedComponent] = useState(() => Car1);

  const treeObjects = [Tree1, Tree2];

  const productImages = [
    {
      component: Car1,
      image: "src/assets/car1.png",
      alt: "Product Image 1",
      price: 120000
    },
    {
      component: Car3,
      image: "src/assets/car2.png",
      alt: "Product Image 2",
      price: 223456
    },
    ,
    {
      component: Car4,
      image: "src/assets/car3.png",
      alt: "Product Image 2",
      price: 123678
    },
    {
      component: Car5,
      image: "src/assets/car4.png",
      alt: "Product Image 2",
      price: 123490
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
    <div>
      <div className="flex items-center justify-center">
        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 xl:grid-cols-2 items-start">
            {/* 3D Product Viewer */}
            <div className="">
              {/* Main 3D Viewer */}
              <div className="relative">
                <div className="rounded-3xl w-full">
                  <div className="h-screen flex items-center justify-center">
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
                            <group position={[0, 0, 0]} scale={[0.1, 0.1, 0.1]}>
                              {React.createElement(selectedComponent, {
                                currentColor,
                                position: [0, 0, 0],
                                scale: [10, 10, 10]
                              })}
                            </group>
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
                  </div>
                </div>
              </div>
            </div>

            {/* Product Information */}
            <div className="space-y-8">
              {/* Brand & Badge */}
              <div className="flex items-center justify-between">
                <div className="bg-gray-100 rounded-full px-4 py-2">
                  <span className="text-purple-600 text-sm font-semibold uppercase tracking-wider">
                    Bộ Sưu Tập
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-600 text-sm font-medium">
                    Có Sẵn
                  </span>
                </div>
              </div>

              {/* Title */}
              <div className="space-y-4">
                <h1 className="text-5xl font-bold text-gray-900 leading-tight">
                  <span className="text-purple-600">Xe Thể Thao</span> Cao Cấp
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Trải nghiệm đỉnh cao của kỹ thuật ô tô với bộ sưu tập xe thể
                  thao cao cấp của chúng tôi. Với thiết kế tiên tiến và hiệu
                  suất vượt trội không thể so sánh.
                </p>
              </div>

              {/* Price */}
              <div className="space-y-2">
                <div className="flex items-baseline space-x-4">
                  <span className="text-4xl font-bold text-gray-900">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD"
                    }).format(productImages[selectedImage].price)}
                  </span>
                </div>
              </div>

              {/* Customization Options */}
              <div className="space-y-6">
                {/* Color Selection */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Chọn Màu Sắc
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {colors.map((color, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentColor(color)}
                        className={`relative w-12 h-12 rounded-2xl border-3 transition-all duration-300 transform hover:scale-110 ${
                          currentColor === color
                            ? "border-gray-400 shadow-lg ring-4 ring-gray-400/20"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                      >
                        <div
                          className="w-full h-full rounded-xl"
                          style={{ backgroundColor: color }}
                        />
                        {currentColor === color && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                              <svg
                                className="w-4 h-4 text-gray-900"
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
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tree Selection */}
                <div className="space-y-8">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Môi Trường
                  </h3>
                  <div className="flex space-x-4">
                    {treeObjects.map((tree, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedTree(index)}
                        className={`relative px-6 py-3 rounded-2xl border-2 transition-all duration-300 ${
                          selectedTree === index
                            ? "border-purple-500 bg-purple-500/20 text-white"
                            : "border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-900"
                        }`}
                      >
                        <span className="font-medium">
                          Môi Trường {index + 1}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Add to Cart Section */}
              <div className="space-y-6 pt-6 border-t border-gray-200">
                <button
                  className="w-full btn-primary text-lg py-4 rounded-2xl flex items-center justify-center space-x-3 transform hover:scale-105 transition-all duration-300"
                  disabled={quantity === 0}
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"
                    />
                  </svg>
                  <span>Thêm Vào Giỏ Hàng</span>
                </button>
              </div>
              {/* Thumbnail Gallery */}
              <div className="grid grid-cols-4 gap-4 mt-10">
                {productImages.map((thumb, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedImage(index);
                      setSelectedComponent(() => thumb.component);
                    }}
                    className={`aspect-square rounded-2xl overflow-hidden border-2 transition-all duration-300 transform hover:scale-105 ${
                      selectedImage === index
                        ? "border-purple-500 ring-4 ring-purple-500/20 shadow-lg"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <img
                      src={thumb.image || "/placeholder.svg"}
                      alt={`Product view ${index + 1}`}
                      width={100}
                      height={100}
                      className="w-full h-full object-contain bg-gray-200"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

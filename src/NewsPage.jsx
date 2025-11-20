import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import supabase from "./utils/supabase";
import {
  fetchNewsFromEdgeFunction,
  searchNewsFromEdgeFunction,
  getNewsStatsFromEdgeFunction
} from "./utils/edgeFunctions";

export default function NewsPage() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [useEdgeFunction, setUseEdgeFunction] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState(null);

  const categories = [
    { id: "all", name: "Tất Cả" },
    { id: "ai", name: "AI & Machine Learning" },
    { id: "web", name: "Web Development" },
    { id: "mobile", name: "Mobile" },
    { id: "blockchain", name: "Blockchain" },
    { id: "cloud", name: "Cloud Computing" }
  ];

  useEffect(() => {
    fetchNews();
  }, [selectedCategory, useEdgeFunction]);

  useEffect(() => {
    if (useEdgeFunction) {
      fetchStats();
    }
  }, [useEdgeFunction]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      setError(null);

      if (useEdgeFunction) {
        // Sử dụng Edge Function để lấy dữ liệu
        const { data, error: edgeError } = await fetchNewsFromEdgeFunction(
          selectedCategory
        );

        if (edgeError) {
          throw edgeError;
        }

        setNews(data?.news || data || []);
      } else {
        // Sử dụng direct query (cách cũ)
        let query = supabase
          .from("tech_news")
          .select("*")
          .order("created_at", { ascending: false });

        if (selectedCategory !== "all") {
          query = query.eq("category", selectedCategory);
        }

        const { data, error: fetchError } = await query;

        if (fetchError) {
          throw fetchError;
        }

        setNews(data || []);
      }
    } catch (err) {
      console.error("Error fetching news:", err);
      setError(
        useEdgeFunction
          ? "Không thể tải tin tức từ Edge Function. Vui lòng thử lại sau."
          : "Không thể tải tin tức. Vui lòng thử lại sau."
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const { data, error: statsError } = await getNewsStatsFromEdgeFunction();
      if (!statsError && data) {
        setStats(data);
      }
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchNews();
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: searchError } = await searchNewsFromEdgeFunction(
        searchQuery
      );

      if (searchError) {
        throw searchError;
      }

      setNews(data?.results || data || []);
    } catch (err) {
      console.error("Error searching news:", err);
      setError("Không thể tìm kiếm tin tức. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric"
    }).format(date);
  };

  if (loading && news.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-gray-600 text-lg">Đang tải tin tức...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50"
    >
      {/* Header */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="backdrop-blur-xl bg-white/90 border-b border-gray-200 shadow-lg sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <motion.h1
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent"
            >
              Tin Tức Công Nghệ
            </motion.h1>
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center space-x-4"
            >
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-gray-900 font-semibold">
                {news.length} bài viết
              </span>
              {stats && useEdgeFunction && (
                <span className="text-sm text-gray-600">
                  • Tổng: {stats.total} • Theo danh mục: {stats.byCategory}
                </span>
              )}
            </motion.div>
          </div>
        </div>
      </motion.header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Edge Function Toggle & Search */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="mb-6 flex flex-wrap items-center justify-between gap-4"
        >
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={useEdgeFunction}
                onChange={(e) => setUseEdgeFunction(e.target.checked)}
                className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500 focus:ring-2"
              />
              <span className="text-sm font-medium text-gray-700">
                Sử dụng Edge Function
              </span>
            </label>
            {useEdgeFunction && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full"
              >
                Edge Function Active
              </motion.span>
            )}
          </div>

          {/* Search Bar */}
          {useEdgeFunction && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-2"
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Tìm kiếm tin tức..."
                className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSearch}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                Tìm
              </motion.button>
            </motion.div>
          )}
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-2xl border-2 transition-all duration-300 font-semibold ${
                  selectedCategory === category.id
                    ? "border-purple-500 bg-purple-500 text-white shadow-lg"
                    : "border-gray-300 bg-white/90 text-gray-900 hover:border-purple-400 hover:bg-purple-50"
                }`}
              >
                <span className="font-medium">{category.name}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8"
          >
            <p className="text-red-800 font-semibold">{error}</p>
          </motion.div>
        )}

        {/* News Grid */}
        {news.length === 0 && !loading ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div className="bg-white border border-gray-200 rounded-3xl p-12 max-w-md mx-auto shadow-xl">
              <svg
                className="w-24 h-24 mx-auto mb-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                />
              </svg>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Chưa có tin tức
              </h3>
              <p className="text-gray-700">
                Hiện tại chưa có bài viết nào trong danh mục này.
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="wait">
              {news.map((article, index) => (
                <motion.article
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  onClick={() => setSelectedArticle(article)}
                  className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-xl cursor-pointer group hover:shadow-2xl transition-shadow"
                >
                  {/* Image */}
                  {article.image_url && (
                    <div className="relative h-48 overflow-hidden">
                      <motion.img
                        src={article.image_url}
                        alt={article.title}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.3 }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-purple-500/80 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
                          {article.category}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-6 bg-white">
                    <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-purple-600 transition-colors">
                      {article.title}
                    </h2>
                    <p className="text-gray-700 text-sm mb-4 line-clamp-3 leading-relaxed">
                      {article.summary || article.content?.substring(0, 150)}
                    </p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600 font-medium">
                        {formatDate(article.created_at)}
                      </span>
                      <motion.span
                        whileHover={{ x: 5 }}
                        className="text-purple-600 font-semibold flex items-center"
                      >
                        Đọc thêm
                        <svg
                          className="w-4 h-4 ml-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </motion.span>
                    </div>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Article Modal */}
      <AnimatePresence>
        {selectedArticle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedArticle(null)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white border border-gray-200 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative modal-scrollbar"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedArticle(null)}
                className="absolute top-6 right-6 w-10 h-10 rounded-full bg-gray-100 border border-gray-300 flex items-center justify-center hover:bg-gray-200 transition-colors z-10 shadow-md"
              >
                <svg
                  className="w-6 h-6 text-gray-800"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              {/* Article Content */}
              {selectedArticle.image_url && (
                <div className="relative h-64 overflow-hidden rounded-t-3xl">
                  <img
                    src={selectedArticle.image_url}
                    alt={selectedArticle.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
              )}

              <div className="p-8 bg-white">
                <div className="flex items-center space-x-3 mb-6">
                  <span className="px-4 py-2 bg-purple-100 text-purple-800 text-sm font-semibold rounded-full border border-purple-200">
                    {selectedArticle.category}
                  </span>
                  <span className="text-gray-600 text-sm font-medium">
                    {formatDate(selectedArticle.created_at)}
                  </span>
                </div>

                <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
                  {selectedArticle.title}
                </h1>

                {selectedArticle.summary && (
                  <p className="text-xl text-gray-700 mb-8 leading-relaxed font-medium border-l-4 border-purple-500 pl-4">
                    {selectedArticle.summary}
                  </p>
                )}

                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-900 leading-relaxed whitespace-pre-line text-base">
                    {selectedArticle.content}
                  </p>
                </div>

                {selectedArticle.source_url && (
                  <motion.a
                    href={selectedArticle.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center mt-8 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all"
                  >
                    Đọc bài gốc
                    <svg
                      className="w-5 h-5 ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </motion.a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

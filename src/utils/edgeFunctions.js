import supabase from "./supabase";

/**
 * Edge Functions Service
 *
 * Edge Functions là các serverless functions chạy trên edge network của Supabase.
 * Chúng cho phép bạn chạy custom logic phía server mà không cần quản lý server.
 *
 * Ưu điểm:
 * - Chạy gần người dùng (edge network) → latency thấp
 * - Serverless → không cần quản lý infrastructure
 * - Có thể xử lý logic phức tạp, gọi API bên ngoài, xử lý dữ liệu
 * - Bảo mật tốt hơn (API keys không expose ra client)
 */

/**
 * Gọi Edge Function để lấy tin tức với xử lý phía server
 *
 * @param {string} category - Danh mục tin tức (optional)
 * @returns {Promise<{data: any, error: any}>}
 */
export const fetchNewsFromEdgeFunction = async (category = "all") => {
  try {
    const { data, error } = await supabase.functions.invoke("fetch-tech-news", {
      body: {
        category: category,
        limit: 50
      }
    });

    if (error) {
      console.error("Edge Function Error:", error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (err) {
    console.error("Failed to invoke Edge Function:", err);
    return { data: null, error: err };
  }
};

/**
 * Gọi Edge Function để tìm kiếm tin tức
 *
 * @param {string} searchQuery - Từ khóa tìm kiếm
 * @returns {Promise<{data: any, error: any}>}
 */
export const searchNewsFromEdgeFunction = async (searchQuery) => {
  try {
    const { data, error } = await supabase.functions.invoke(
      "search-tech-news",
      {
        body: {
          query: searchQuery,
          limit: 20
        }
      }
    );

    if (error) {
      console.error("Edge Function Error:", error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (err) {
    console.error("Failed to invoke Edge Function:", err);
    return { data: null, error: err };
  }
};

/**
 * Gọi Edge Function để lấy thống kê tin tức
 *
 * @returns {Promise<{data: any, error: any}>}
 */
export const getNewsStatsFromEdgeFunction = async () => {
  try {
    const { data, error } = await supabase.functions.invoke("get-news-stats", {
      body: {}
    });

    if (error) {
      console.error("Edge Function Error:", error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (err) {
    console.error("Failed to invoke Edge Function:", err);
    return { data: null, error: err };
  }
};

/**
 * Gọi Edge Function để xử lý và format dữ liệu tin tức
 *
 * @param {Array} newsIds - Mảng ID của các bài viết
 * @returns {Promise<{data: any, error: any}>}
 */
export const processNewsDataFromEdgeFunction = async (newsIds) => {
  try {
    const { data, error } = await supabase.functions.invoke("process-news", {
      body: {
        news_ids: newsIds
      }
    });

    if (error) {
      console.error("Edge Function Error:", error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (err) {
    console.error("Failed to invoke Edge Function:", err);
    return { data: null, error: err };
  }
};

/**
 * Ví dụ: Gọi một Edge Function đơn giản
 *
 * @param {string} name - Tên để chào
 * @returns {Promise<{data: any, error: any}>}
 */
export const callHelloWorldFunction = async (name = "World") => {
  try {
    const { data, error } = await supabase.functions.invoke("hello-world", {
      body: {
        name: name
      }
    });

    if (error) {
      console.error("Edge Function Error:", error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (err) {
    console.error("Failed to invoke Edge Function:", err);
    return { data: null, error: err };
  }
};

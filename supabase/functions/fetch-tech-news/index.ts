import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type"
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Tạo Supabase client với service role key (có quyền cao hơn)
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Parse request body
    const { category = "all", limit = 50 } = await req.json();

    // Xây dựng query
    let query = supabaseClient
      .from("tech_news")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (category !== "all") {
      query = query.eq("category", category);
    }

    // Thực thi query
    const { data, error } = await query;

    if (error) {
      throw error;
    }

    // Xử lý dữ liệu thêm (ví dụ: format, enrich data)
    const processedData =
      data?.map((article) => ({
        ...article,
        // Thêm metadata
        readTime: Math.ceil((article.content?.length || 0) / 200), // ước tính thời gian đọc
        formattedDate: new Date(article.created_at).toLocaleDateString("vi-VN")
      })) || [];

    // Trả về response
    return new Response(
      JSON.stringify({
        news: processedData,
        count: processedData.length,
        category: category
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400
    });
  }
});

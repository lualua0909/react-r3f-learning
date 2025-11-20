# Hướng Dẫn Setup Supabase Edge Functions

## Tổng Quan về Edge Functions

**Edge Functions** là các serverless functions chạy trên edge network của Supabase. Chúng cho phép bạn:

- ✅ Chạy custom logic phía server mà không cần quản lý infrastructure
- ✅ Xử lý dữ liệu phức tạp trước khi trả về client
- ✅ Gọi API bên ngoài một cách an toàn (API keys không expose)
- ✅ Chạy gần người dùng (edge network) → latency thấp
- ✅ Xử lý authentication và authorization phức tạp

## 1. Cài Đặt Supabase CLI

**⚠️ Lưu ý:** Supabase CLI không hỗ trợ cài đặt global qua npm. Sử dụng một trong các cách sau:

### Cách 1: Homebrew (macOS/Linux - Khuyến nghị)

```bash
brew install supabase/tap/supabase
```

### Cách 2: Scoop (Windows)

```bash
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

### Cách 3: NPM (Local trong project)

```bash
# Cài đặt như dev dependency
npm install supabase --save-dev

# Sau đó chạy bằng npx
npx supabase login
npx supabase link --project-ref your-project-ref
```

### Cách 4: Download Binary trực tiếp

Tải từ [Supabase CLI Releases](https://github.com/supabase/cli/releases) và thêm vào PATH.

### Cách 5: Cài đặt qua Script (macOS/Linux)

```bash
curl -fsSL https://supabase.com/install.sh | sh
```

Sau khi cài đặt, kiểm tra version:

```bash
supabase --version
```

## 2. Login vào Supabase

```bash
supabase login
```

## 3. Link Project

```bash
# Di chuyển vào thư mục project
cd /path/to/your/project

# Link với Supabase project
supabase link --project-ref your-project-ref
```

Bạn có thể tìm `project-ref` trong Supabase Dashboard → Settings → General → Reference ID.

## 4. Tạo Edge Function

```bash
# Tạo function mới
supabase functions new fetch-tech-news
```

Lệnh này sẽ tạo thư mục `supabase/functions/fetch-tech-news/` với file `index.ts`.

## 5. Code Edge Function: fetch-tech-news

Tạo file `supabase/functions/fetch-tech-news/index.ts`:

```typescript
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
```

## 6. Code Edge Function: search-tech-news

Tạo file `supabase/functions/search-tech-news/index.ts`:

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type"
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
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

    const { query: searchQuery, limit = 20 } = await req.json();

    if (!searchQuery || searchQuery.trim() === "") {
      return new Response(
        JSON.stringify({ error: "Search query is required" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400
        }
      );
    }

    // Tìm kiếm trong title, summary, và content
    const { data, error } = await supabaseClient
      .from("tech_news")
      .select("*")
      .or(
        `title.ilike.%${searchQuery}%,summary.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`
      )
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      throw error;
    }

    return new Response(
      JSON.stringify({
        results: data || [],
        count: data?.length || 0,
        query: searchQuery
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
```

## 7. Code Edge Function: get-news-stats

Tạo file `supabase/functions/get-news-stats/index.ts`:

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type"
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
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

    // Lấy tổng số bài viết
    const { count: totalCount } = await supabaseClient
      .from("tech_news")
      .select("*", { count: "exact", head: true });

    // Lấy số lượng theo category
    const { data: categoryData } = await supabaseClient
      .from("tech_news")
      .select("category");

    const byCategory =
      categoryData?.reduce((acc, item) => {
        acc[item.category] = (acc[item.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

    return new Response(
      JSON.stringify({
        total: totalCount || 0,
        byCategory: Object.keys(byCategory).length,
        categoryBreakdown: byCategory
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
```

## 8. Code Edge Function: hello-world (Example)

Tạo file `supabase/functions/hello-world/index.ts`:

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type"
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { name = "World" } = await req.json();

    return new Response(
      JSON.stringify({
        message: `Hello, ${name}!`,
        timestamp: new Date().toISOString()
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
```

## 9. Deploy Edge Functions

```bash
# Deploy tất cả functions
supabase functions deploy

# Hoặc deploy function cụ thể
supabase functions deploy fetch-tech-news
supabase functions deploy search-tech-news
supabase functions deploy get-news-stats
supabase functions deploy hello-world
```

## 10. Test Edge Functions Locally

```bash
# Start local development
supabase start

# Serve functions locally
supabase functions serve fetch-tech-news --no-verify-jwt
```

## 11. Cấu Hình Environment Variables

Trong Supabase Dashboard → Edge Functions → Settings, thêm các biến môi trường:

- `SUPABASE_URL`: URL của project (tự động có sẵn)
- `SUPABASE_SERVICE_ROLE_KEY`: Service role key (tự động có sẵn)

## 12. Gọi Edge Function từ Client

Đã được tích hợp trong `src/utils/edgeFunctions.js` và `src/NewsPage.jsx`:

```javascript
import { fetchNewsFromEdgeFunction } from "./utils/edgeFunctions";

const { data, error } = await fetchNewsFromEdgeFunction("ai");
```

## Cấu Trúc Thư Mục

```
your-project/
├── supabase/
│   └── functions/
│       ├── fetch-tech-news/
│       │   └── index.ts
│       ├── search-tech-news/
│       │   └── index.ts
│       ├── get-news-stats/
│       │   └── index.ts
│       └── hello-world/
│           └── index.ts
└── src/
    └── utils/
        └── edgeFunctions.js
```

## Lợi Ích của Edge Functions

1. **Bảo Mật**: API keys và sensitive logic không expose ra client
2. **Performance**: Chạy gần người dùng, latency thấp
3. **Scalability**: Tự động scale theo traffic
4. **Flexibility**: Có thể gọi API bên ngoài, xử lý dữ liệu phức tạp
5. **Cost Effective**: Chỉ trả tiền khi function được gọi

## Troubleshooting

### Lỗi CORS

Đảm bảo đã thêm `corsHeaders` vào response.

### Lỗi Authentication

Kiểm tra `SUPABASE_SERVICE_ROLE_KEY` đã được set đúng chưa.

### Function không deploy được

Kiểm tra bạn đã login và link project chưa:

```bash
supabase login
supabase link --project-ref your-project-ref
```

### Lỗi "Installing Supabase CLI as a global module is not supported"

Nếu bạn gặp lỗi này khi cài đặt qua npm, hãy sử dụng một trong các cách sau:

1. **Homebrew (macOS):**

   ```bash
   brew install supabase/tap/supabase
   ```

2. **Cài local trong project:**

   ```bash
   npm install supabase --save-dev
   npx supabase login
   npx supabase link --project-ref your-project-ref
   ```

3. **Download binary trực tiếp:**
   - Truy cập: https://github.com/supabase/cli/releases
   - Tải file phù hợp với hệ điều hành
   - Thêm vào PATH

## Tài Liệu Tham Khảo

- [Supabase Edge Functions Docs](https://supabase.com/docs/guides/functions)
- [Deno Runtime](https://deno.land/manual)
- [Supabase JS Client](https://supabase.com/docs/reference/javascript/introduction)

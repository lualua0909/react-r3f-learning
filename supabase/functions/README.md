# Supabase Edge Functions

## Quick Start

1. **Cài đặt Supabase CLI:**

   **macOS (Khuyến nghị):**

   ```bash
   brew install supabase/tap/supabase
   ```

   **Hoặc cài local trong project:**

   ```bash
   npm install supabase --save-dev
   # Sau đó dùng: npx supabase ...
   ```

   ⚠️ **Lưu ý:** Không thể cài global qua `npm install -g supabase`

   Xem thêm các cách cài đặt khác trong `EDGE_FUNCTIONS_SETUP.md`

2. **Login và Link Project:**

   ```bash
   supabase login
   supabase link --project-ref your-project-ref
   ```

3. **Deploy Functions:**

   ```bash
   supabase functions deploy fetch-tech-news
   supabase functions deploy hello-world
   ```

4. **Test Locally:**
   ```bash
   supabase functions serve fetch-tech-news --no-verify-jwt
   ```

## Available Functions

- `fetch-tech-news`: Lấy danh sách tin tức với xử lý phía server
- `hello-world`: Function mẫu đơn giản
- `search-tech-news`: Tìm kiếm tin tức (xem EDGE_FUNCTIONS_SETUP.md)
- `get-news-stats`: Lấy thống kê tin tức (xem EDGE_FUNCTIONS_SETUP.md)

## Xem chi tiết trong file `EDGE_FUNCTIONS_SETUP.md`

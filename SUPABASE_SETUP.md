# Hướng Dẫn Thiết Lập Supabase cho Trang Tin Tức

## 1. Tạo Bảng trong Supabase

Truy cập Supabase Dashboard và chạy SQL sau trong SQL Editor:

```sql
-- Tạo bảng tech_news
CREATE TABLE IF NOT EXISTS tech_news (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  summary TEXT,
  content TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('ai', 'web', 'mobile', 'blockchain', 'cloud')),
  image_url TEXT,
  source_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tạo index cho category để tìm kiếm nhanh hơn
CREATE INDEX IF NOT EXISTS idx_tech_news_category ON tech_news(category);
CREATE INDEX IF NOT EXISTS idx_tech_news_created_at ON tech_news(created_at DESC);

-- Tạo function để tự động cập nhật updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Tạo trigger để tự động cập nhật updated_at
CREATE TRIGGER update_tech_news_updated_at
    BEFORE UPDATE ON tech_news
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Cấp quyền cho anon user (public access)
ALTER TABLE tech_news ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" ON tech_news
    FOR SELECT
    USING (true);
```

## 2. Thêm Dữ Liệu Mẫu (Optional)

```sql
-- Thêm một số bài viết mẫu
INSERT INTO tech_news (title, summary, content, category, image_url, source_url) VALUES
(
  'AI và Machine Learning: Tương Lai của Công Nghệ',
  'Khám phá những xu hướng mới nhất trong lĩnh vực AI và Machine Learning, từ ChatGPT đến các mô hình ngôn ngữ lớn.',
  'Trong những năm gần đây, AI và Machine Learning đã trở thành những công nghệ quan trọng nhất trong ngành công nghệ. Từ ChatGPT đến các mô hình ngôn ngữ lớn như GPT-4, chúng ta đang chứng kiến sự phát triển vượt bậc trong khả năng xử lý ngôn ngữ tự nhiên và trí tuệ nhân tạo.

Các ứng dụng của AI ngày càng đa dạng, từ việc tự động hóa các quy trình kinh doanh đến việc tạo ra các sản phẩm sáng tạo. Machine Learning đang giúp các doanh nghiệp đưa ra quyết định tốt hơn dựa trên dữ liệu lớn.

Tương lai của AI hứa hẹn sẽ mang lại nhiều đột phá hơn nữa, với khả năng xử lý ngôn ngữ tự nhiên ngày càng tự nhiên và chính xác.',
  'ai',
  'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800',
  'https://example.com/ai-article'
),
(
  'Web Development 2024: Những Xu Hướng Mới',
  'Tìm hiểu về các framework và công nghệ web mới nhất trong năm 2024, từ React 19 đến Next.js 14.',
  'Web development đang phát triển với tốc độ chóng mặt. React 19 đã được phát hành với nhiều tính năng mới, Next.js 14 mang lại hiệu suất tốt hơn với Server Components, và các framework mới như SvelteKit đang ngày càng phổ biến.

Các xu hướng chính trong năm 2024 bao gồm:
- Server Components và Server Actions
- Edge Computing và Edge Functions
- WebAssembly cho hiệu suất cao
- Progressive Web Apps (PWA)
- Micro-frontends architecture

Các nhà phát triển web cần cập nhật kiến thức liên tục để theo kịp với những thay đổi này.',
  'web',
  'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800',
  'https://example.com/web-dev-article'
),
(
  'Mobile App Development: Flutter vs React Native',
  'So sánh chi tiết giữa Flutter và React Native để giúp bạn chọn framework phù hợp cho dự án tiếp theo.',
  'Flutter và React Native là hai framework phổ biến nhất cho phát triển ứng dụng di động đa nền tảng. Mỗi framework có những ưu và nhược điểm riêng.

Flutter sử dụng Dart và cung cấp hiệu suất gần như native với một codebase duy nhất. Nó có UI components đẹp mắt và hot reload nhanh chóng.

React Native sử dụng JavaScript/TypeScript và cho phép chia sẻ code với web applications. Nó có ecosystem lớn và nhiều thư viện hỗ trợ.

Việc chọn framework phụ thuộc vào nhiều yếu tố như team expertise, project requirements, và long-term maintenance.',
  'mobile',
  'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800',
  'https://example.com/mobile-dev-article'
),
(
  'Blockchain và Web3: Tương Lai của Internet',
  'Khám phá cách blockchain và Web3 đang thay đổi cách chúng ta tương tác với internet và dữ liệu.',
  'Blockchain technology đang cách mạng hóa nhiều ngành công nghiệp, từ tài chính đến nghệ thuật số. Web3, được xây dựng trên blockchain, hứa hẹn một internet phi tập trung nơi người dùng có quyền kiểm soát dữ liệu của mình.

Các ứng dụng chính của blockchain bao gồm:
- Cryptocurrencies và DeFi
- NFTs và digital ownership
- Smart contracts
- Decentralized applications (dApps)
- Supply chain management

Mặc dù còn nhiều thách thức về scalability và energy consumption, blockchain vẫn là một công nghệ đầy hứa hẹn cho tương lai.',
  'blockchain',
  'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800',
  'https://example.com/blockchain-article'
),
(
  'Cloud Computing: AWS, Azure, và GCP So Sánh',
  'Tổng quan về ba nhà cung cấp cloud hàng đầu và cách chọn dịch vụ phù hợp với nhu cầu của bạn.',
  'Cloud computing đã trở thành nền tảng của hầu hết các ứng dụng hiện đại. AWS, Azure, và Google Cloud Platform (GCP) là ba nhà cung cấp cloud lớn nhất hiện nay.

AWS (Amazon Web Services) là nhà cung cấp lớn nhất với nhiều dịch vụ nhất. Nó phù hợp cho các doanh nghiệp lớn và có ecosystem rộng lớn.

Microsoft Azure tích hợp tốt với các sản phẩm Microsoft và phù hợp cho các doanh nghiệp đã sử dụng Microsoft stack.

Google Cloud Platform nổi bật với AI/ML services và data analytics. Nó có pricing competitive và hiệu suất tốt.

Việc chọn cloud provider phụ thuộc vào nhiều yếu tố như pricing, services needed, và existing infrastructure.',
  'cloud',
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800',
  'https://example.com/cloud-article'
);
```

## 3. Cấu Hình Environment Variables

Đảm bảo bạn đã thêm các biến môi trường vào file `.env`:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 4. Cấu Trúc Bảng

| Cột        | Kiểu      | Mô Tả                                                  |
| ---------- | --------- | ------------------------------------------------------ |
| id         | UUID      | Primary key, tự động tạo                               |
| title      | TEXT      | Tiêu đề bài viết (bắt buộc)                            |
| summary    | TEXT      | Tóm tắt ngắn gọn (tùy chọn)                            |
| content    | TEXT      | Nội dung đầy đủ (bắt buộc)                             |
| category   | TEXT      | Danh mục: 'ai', 'web', 'mobile', 'blockchain', 'cloud' |
| image_url  | TEXT      | URL hình ảnh (tùy chọn)                                |
| source_url | TEXT      | Link bài viết gốc (tùy chọn)                           |
| created_at | TIMESTAMP | Thời gian tạo, tự động                                 |
| updated_at | TIMESTAMP | Thời gian cập nhật, tự động                            |

## 5. Lưu Ý

- Bảng sử dụng Row Level Security (RLS) với policy cho phép public read access
- Các category được giới hạn bằng CHECK constraint
- Index được tạo để tối ưu hiệu suất truy vấn
- Trigger tự động cập nhật `updated_at` khi có thay đổi

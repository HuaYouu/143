# Roadmap Tu Sửa LoveChronicle

Ghi chú này dùng để giữ lại các ý tưởng cho những lần mình cùng sửa trang 143. Mục tiêu không chỉ là một landing page đẹp, mà là một nơi hai người có thể quay lại, cùng chờ, cùng mở khóa kỷ niệm mới.

## Đã Duyệt

- Đã triển khai: First viewport gọn lại, mở trang là thấy ảnh hai người, mốc kế tiếp, nút `Mở khoảnh khắc`.
- Đã triển khai: Mini countdown dock, thanh nhỏ dính dưới màn hình để mở nhanh focus mode khi đang scroll.
- Đã triển khai: Hộp thư mở khóa, mỗi mốc có thư riêng, tới ngày mới mở được.
- Đã triển khai: Chế độ đêm, từ khoảng 21:00 trước mốc trang đổi mood dịu hơn để cùng chờ `00:00`.
- Đã triển khai: Nút bật nhạc, không autoplay, chỉ phát khi người xem chủ động bấm.
- Đã triển khai: Tối ưu mượt, dọn cảnh báo `index.css`, bỏ Tailwind CDN, lazy-load phần nặng và tách chunk.

## Ưu Tiên 1: Khoảnh Khắc Chờ Mốc Kỷ Niệm

### First Viewport

- Hero nên gọn hơn và tập trung vào khoảnh khắc đang chờ.
- Timer tổng `đã yêu nhau được bao lâu` có thể hạ xuống dưới hoặc thu nhỏ.
- CTA chính là `Mở khoảnh khắc`.

### Mini Countdown Dock

- Luôn có một dock nhỏ ở dưới màn hình khi scroll.
- Hiện mốc kế tiếp, ví dụ `Còn 5 ngày tới 500 ngày`.
- Bấm vào dock để mở Focus Mode.

### Focus Mode / Đêm Chờ Mốc

- Là trải nghiệm ưu tiên nhất: một màn hình toàn trang để hai người cùng chờ mốc kỷ niệm.
- Mở từ trang chính, không tự bật ép người xem.
- Khi còn dưới 24 giờ đến mốc, copy chuyển sang không khí `đêm chờ mốc`.
- Khi đúng ngày mốc, chuyển sang trạng thái chúc mừng.
- Animation phải cực kỳ mượt: ưu tiên `transform` và `opacity`, hạn chế hiệu ứng gây layout shift, có hỗ trợ `prefers-reduced-motion`.

### Next Milestone

- Tự động tính mốc kế tiếp từ ngày bắt đầu `14/03/2025`.
- Hiện câu như: `Còn 6 ngày nữa là chúng mình tròn 500 ngày.`
- Mốc gần nhất được highlight trong danh sách cột mốc.

### Chế Độ Đêm Chờ Mốc

- Khi còn dưới 24 giờ đến mốc tiếp theo, timer đổi thành trạng thái đặc biệt.
- Gợi ý nội dung: `Tối nay mình cùng đợi 500 ngày nha.`
- Khi còn 10 giây cuối, countdown lớn hơn và có hiệu ứng nhẹ để tạo cảm giác nghi thức.

### Midnight Moment

- Khi đồng hồ chuyển qua `00:00` đúng ngày kỷ niệm, trang mở một khoảnh khắc đặc biệt.
- Gợi ý hiệu ứng: heart burst, pháo hoa nhẹ, shimmer, hoặc nền đổi màu trong vài giây.
- Gợi ý nội dung: `Mình đã tới mốc 500 ngày rồi.`
- Có thể mở một lá thư nhỏ, ảnh bí mật, hoặc lời nhắn riêng cho mốc đó.

### Milestones Sống Hơn

- Chia trạng thái mốc thành: `Đã đi qua`, `Đang chờ`, `Còn xa một chút`.
- Mốc đang chờ có countdown riêng.
- Mỗi mốc có thể có lời nhắn riêng thay vì chỉ có mô tả cố định.

## Ưu Tiên 2: Nội Dung Riêng Của Hai Người

### Thư Kỷ Niệm Theo Mốc

- Mỗi mốc có một đoạn thư ngắn.
- Chỉ hiện thư khi đến ngày hoặc sau khi qua mốc.
- Có thể làm nút `Mở thư` để tăng cảm giác bất ngờ.
- Nếu chưa tới ngày, hiện phong bì khóa với countdown nhỏ.

### Lời Hứa / Điều Ước

- Thêm khu vực lưu những điều muốn làm cùng nhau.
- Mỗi điều có trạng thái: `Muốn làm`, `Đã làm`, `Muốn làm lại`.
- Nên để nội dung nhẹ, riêng tư, không giống todo app quá.

### Playlist / Bài Hát Của Hai Người

- Thêm một section nhỏ cho bài hát gắn với từng giai đoạn.
- Có thể dùng link Spotify/YouTube nếu muốn, hoặc chỉ hiện tên bài và lyric ngắn tự viết lại.
- Trong Focus Mode có nút `Bật nhạc`, không autoplay.

## Ưu Tiên 3: Ảnh Và Timeline

### Ảnh Đại Diện Cho Cột Mốc

- Cho mỗi mốc có một ảnh đại diện.
- Khi đến mốc mới, ảnh đó nổi bật trên hero hoặc milestone card.

### Timeline Có Câu Chuyện

- Hiện thêm caption cho ảnh, không chỉ ngày.
- Tách timeline theo tháng hoặc theo chặng đường.
- Nếu Google Script trả được metadata, có thể thêm `title`, `caption`, `place`.

### Chế Độ Xem Ảnh Đẹp Hơn

- Bấm ảnh để mở lightbox.
- Có nút lùi/tiến.
- Trên mobile vuốt ngang để xem ảnh.

## Ưu Tiên 4: Trải Nghiệm Và Cảm Xúc

### Trạng Thái Theo Thời Điểm Trong Ngày

- Sáng, chiều, tối có câu chào và màu sắc nhẹ khác nhau.
- Đêm trước mốc kỷ niệm có không khí riêng.
- Từ khoảng 21:00 trước mốc, ưu tiên nền tối ấm, ít màu hơn, countdown nổi bật hơn.

### Easter Egg Riêng

- Footer hiện tại đã có ấn 5 lần để mở Theme Switcher.
- Có thể thêm mã bí mật theo ngày kỷ niệm, ví dụ bấm trái tim 14 lần.

### Câu Nói Ngẫu Nhiên

- Mỗi lần vào trang hiện một câu nhỏ.
- Nên là câu tự viết, đúng giọng hai người, không quá "ngôn tình".

## Ưu Tiên 5: Kỹ Thuật Và Deploy

### Dọn Cảnh Báo Build

- `index.html` đang link `index.css` nhưng file này không tồn tại.
- Build hiện vẫn thành công, nhưng nên xóa link này hoặc tạo file CSS thật.

### Đưa Tailwind Vào Build

- Hiện đang dùng Tailwind CDN trong `index.html`.
- Cloudflare Pages chạy được, nhưng nên chuyển sang Tailwind/PostCSS trong Vite để production gọn và ổn định hơn.

### Tối Ưu Bundle

- Build đang cảnh báo chunk lớn do Lottie và animation.
- Có thể lazy-load những phần nặng như Lottie, Theme Switcher, hoặc Photo Timeline.

### Config Cloudflare

- Nếu deploy bằng Cloudflare Pages, nên ghi lại build command: `npm run build`.
- Output directory: `dist`.
- Nếu cần header/cache riêng, thêm `_headers` trong `public`.

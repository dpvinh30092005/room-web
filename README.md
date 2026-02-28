# Room Web — Interactive 3D Room

Một demo nhỏ dùng Three.js để hiển thị phòng 3D và cho phép tương tác với các đồ vật.

## Nội dung
- `index.html` — entry page (tải `main.js`).
- `main.js` — tạo scene Three.js, gán màu cho từng mesh, hover và click để đổi màu/ xoay.
- `style.css` — kiểu cho canvas.
- `models/base.glb` — mô hình 3D (bản mẫu).

## Yêu cầu
- Trình duyệt hiện đại (ES modules, WebGL).
- (Tùy chọn) Python 3 để chạy server tĩnh nhanh.

## Chạy local
1. Mở terminal ở thư mục dự án:

```powershell
cd d:/Project/room-web
python -m http.server 8000
```
2. Mở trình duyệt: `http://localhost:8000`

---

# Họ và tên: PHAM QUOC TUAN | MSSV: 23735301 | URL: https://github.com/quoctuan242005/23735301_TH2.git | Stamp: #617755 | Số cuối: 1 | VARIANT: { watermarkAtTop: false, authField: 'phone', tabOrder: 'shopFirst', hapticOnAdd: 'selection', shipFormula: 'B', detailPresentation: 'card' }

## BÀI KIỂM TRA THỰC HÀNH 2 (BKT2) - DỰ ÁN KTXGO

- **Môn học:** Lập trình cho thiết bị di động
- **Sinh viên:** PHAM QUOC TUAN
- **MSSV:** 23735301
- **Số cuối MSSV:** 1
- **Mã Stamp:** #617755
- **Công thức tính Stamp:** `examStamp()` băm chuỗi `TH2|23735301|PHAM QUOC TUAN`
- **Phòng giao demo:** P.401 (`ROOM_LABEL`)
- **Phí ship nền:** 9.000 đ (`BASE_SHIP_FEE`)
- **Độ trễ Debounce:** 400 ms (`DEBOUNCE_MS`)
- **Stale Time React Query:** 11.000 ms (`STALE_TIME_MS`)

---

## 1. Cấu hình biến thể (VARIANT)

| Tiêu chí | Cấu hình cho số cuối 1 |
| :--- | :--- |
| **Dòng tên / Watermark** | Dưới màn hình (`watermarkAtTop: false`) |
| **Ô Đăng nhập (Auth)** | Số điện thoại (`authField: 'phone'`) |
| **Thứ tự Tab** | Cửa hàng trước (`tabOrder: 'shopFirst'`) |
| **Haptic thêm giỏ** | Selection feedback (`hapticOnAdd: 'selection'`) |
| **Công thức Phí ship** | Công thức B: `BASE_SHIP_FEE + Math.round(km * 1500) + 2000` |
| **Detail Presentation** | Card (`detailPresentation: 'card'`) |

---

## 2. Cấu trúc thư mục dự án

```
KTXGo_23735301/
├── README.md
├── App.tsx
├── package.json
├── babel.config.js
├── tsconfig.json
└── src/
    ├── constants/
    │   ├── student.ts
    │   └── theme.ts
    ├── hooks/
    │   ├── useCampusLocation.ts
    │   └── useDebouncedValue.ts
    ├── services/
    │   ├── apiClient.ts
    │   └── productApi.ts
    ├── stores/
    │   ├── authStore.ts
    │   └── cartStore.ts
    ├── navigation/
    │   ├── AuthStack.tsx
    │   ├── MainTabs.tsx
    │   ├── RootNavigator.tsx
    │   └── ShopStack.tsx
    ├── components/
    │   ├── ProductCard.tsx
    │   └── Watermark.tsx
    └── screens/
        ├── CartScreen.tsx
        ├── DetailScreen.tsx
        ├── HomeScreen.tsx
        ├── LoginScreen.tsx
        └── MeScreen.tsx
```

---

## 3. Các chức năng đã hoàn thành

### Câu 1: Kiến trúc điều hướng + định danh cá nhân (3 điểm)
- [x] Khởi tạo React Native CLI + TypeScript, cấu hình path aliases (`@screens`, `@components`, `@constants`, `@services`, `@stores`, `@hooks`, `@navigation`).
- [x] Định danh đầy đủ trong `student.ts`, `examStamp()`, mã stamp hiển thị trên mọi màn hình.
- [x] Luồng điều hướng `RootNavigator` chuyển đổi mượt mà giữa `AuthStack` và `MainTabs` dựa theo trạng thái đăng nhập trong Zustand.
- [x] Tab Bar hiển thị số lượng giỏ hàng (`tabBarBadge`) tự động cập nhật và ẩn khi giỏ hàng trống.
- [x] Safe area handling chuẩn xác cho mọi thiết bị.

### Câu 2: Home lưới 2 cột + React Query (3 điểm)
- [x] Hiển thị danh sách món bằng `@shopify/flash-list` với `numColumns={2}`, `estimatedItemSize={240}` và `keyExtractor` có MSSV.
- [x] Tách component `ProductCard` riêng biệt, giao diện card đẹp mắt và tối ưu.
- [x] Thanh tìm kiếm tích hợp hook `useDebouncedValue` độ trễ `DEBOUNCE_MS = 400ms`.
- [x] Quản lý Server State với `@tanstack/react-query` và Axios instance (`apiClient.ts`) đính kèm header `X-Student-Id: 23735301`.
- [x] Xử lý đầy đủ 3 trạng thái: Đang tải (Loading), Đã có dữ liệu, và Báo lỗi có kèm MSSV kèm nút Thử lại (`refetch`).
- [x] Tính năng Pull-to-Refresh kéo để làm mới danh sách.

### Câu 3: Giỏ hàng Persist + Location / Haptic / Permissions (4 điểm)
- [x] Quản lý Client State giỏ hàng bằng `zustand` kết hợp `persist` middleware với `AsyncStorage`, lưu với key `ktxgo-cart-23735301`.
- [x] Các thao tác giỏ hàng: Thêm món, Tăng/Giảm số lượng, Xóa món, Xóa toàn bộ giỏ hàng, tính tổng tiền hàng và tổng thanh toán.
- [x] Hiệu ứng rung phản hồi xúc giác `react-native-haptic-feedback` khi bấm thêm món vào giỏ.
- [x] Màn hình Chi tiết món hiển thị thông tin, nút thêm vào giỏ có Alert ngắn kèm MSSV.
- [x] Màn hình Cá nhân (`MeScreen`) quản lý thông tin sinh viên, mã Stamp, Token phiên đăng nhập rút gọn, và nút Đăng xuất.
- [x] Hook `useCampusLocation` xử lý runtime permissions 3 nhánh: `granted`, `denied`, `blocked` (mở Cài đặt hệ thống bằng `Linking.openSettings()`).
- [x] Tính khoảng cách GPS bằng công thức Haversine và tính phí ship theo Công thức B phản ánh trực tiếp sang tab Giỏ hàng.

---

## 4. Hướng dẫn chạy ứng dụng

```bash
# 1. Cài đặt dependencies
npm install

# 2. Chạy Metro Bundler
npm start

# 3. Chạy trên thiết bị Android
npm run android
```

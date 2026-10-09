# Họ và tên: PHAM QUOC TUAN | MSSV: 23735301 | URL: https://github.com/quoctuan242005-oss/23735301_TH2.git | Stamp: #617755 | Số cuối: 1 | VARIANT: { watermarkAtTop: false, authField: 'phone', tabOrder: 'shopFirst', hapticOnAdd: 'selection', shipFormula: 'B', detailPresentation: 'card' }

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

## 3. Hướng dẫn chạy ứng dụng

```bash
# 1. Cài đặt dependencies
npm install

# 2. Chạy Metro Bundler
npm start

# 3. Chạy trên thiết bị Android
npm run android
```

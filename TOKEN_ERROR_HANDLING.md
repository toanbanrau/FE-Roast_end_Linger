# Hệ thống Xử lý Token Lỗi và Hết hạn

## Tổng quan

Hệ thống này tự động kiểm tra và xử lý các trường hợp token lỗi hoặc hết hạn, đồng thời xóa toàn bộ dữ liệu local của cart và user.

## Các tính năng chính

### 1. Kiểm tra Token Tự động

- **Khi khởi động ứng dụng**: Tự động kiểm tra token có hợp lệ không
- **Khi gọi API**: Tự động xử lý lỗi 401/403 và các lỗi liên quan đến token

### 2. Xóa Dữ liệu Local Tự động

Khi token lỗi hoặc hết hạn, hệ thống sẽ tự động xóa:

- Token trong localStorage
- Dữ liệu user store
- Dữ liệu cart store
- Các dữ liệu persist khác

### 3. Thông báo cho người dùng

- Hiển thị toast notification khi token hết hạn
- Yêu cầu người dùng đăng nhập lại

## Cách sử dụng

### 1. Import và sử dụng trong component

```typescript
import { useTokenCheck } from "../hooks/useTokenCheck";

function MyComponent() {
  // Kiểm tra token khi component mount
  useTokenCheck();

  return <div>My Component</div>;
}
```

### 2. Sử dụng trong store

```typescript
import { handleTokenError } from "../utils/tokenUtils";

// Trong catch block của API call
try {
  const data = await apiCall();
} catch (error) {
  if (handleTokenError(error)) {
    // Token đã được xử lý, có thể redirect hoặc xử lý khác
    return;
  }
  // Xử lý các lỗi khác
}
```

### 3. Kiểm tra token thủ công

```typescript
import { isTokenValid, clearLocalDataOnTokenError } from "../utils/tokenUtils";

const token = localStorage.getItem("token");
if (token && !isTokenValid(token)) {
  clearLocalDataOnTokenError();
}
```

## Các function chính

### `isTokenValid(token: string): boolean`

Kiểm tra token có hợp lệ không bằng cách decode JWT và kiểm tra thời gian hết hạn.

### `clearLocalDataOnTokenError(): void`

Xóa toàn bộ dữ liệu local khi token lỗi.

### `handleTokenError(error: any): boolean`

Kiểm tra và xử lý lỗi token, trả về `true` nếu là lỗi token.

### `checkTokenOnAppStart(): void`

Kiểm tra token khi khởi động ứng dụng.

## Cấu hình Axios Interceptor

Hệ thống đã được cấu hình để tự động xử lý token lỗi cho cả `clientAxios` và `adminAxios`:

```typescript
// Tự động xử lý token lỗi cho mọi API call
clientAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    handleTokenError(error);
    return Promise.reject(error);
  }
);
```

## Lưu ý

1. **Tự động redirect**: Khi token lỗi, hệ thống sẽ tự động redirect về trang login
2. **Toast notification**: Hiển thị thông báo "Phiên đăng nhập đã hết hạn" cho người dùng
3. **Xóa dữ liệu an toàn**: Đảm bảo xóa toàn bộ dữ liệu local một cách an toàn
4. **Logging**: Ghi log khi xóa dữ liệu để debug

## Ví dụ sử dụng trong thực tế

```typescript
// Trong user store
getProfile: async () => {
  try {
    const user = await getProfile();
    set({ user, isAuthenticated: true });
  } catch (error) {
    // Tự động xử lý token lỗi
    if (handleTokenError(error)) {
      set({ user: null, isAuthenticated: false });
      return;
    }
    // Xử lý các lỗi khác
  }
};
```

Hệ thống này đảm bảo ứng dụng luôn xử lý token lỗi một cách nhất quán và an toàn.

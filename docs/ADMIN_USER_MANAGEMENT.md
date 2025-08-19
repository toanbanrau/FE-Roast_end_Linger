# Admin User Management - Hướng dẫn sử dụng

## Tổng quan

Tính năng quản lý người dùng cho phép admin thực hiện các thao tác CRUD (Create, Read, Update, Delete) với người dùng trong hệ thống.

## Tính năng đã triển khai

### 1. **Danh sách người dùng** (`/admin/user`)
- ✅ Hiển thị danh sách tất cả người dùng
- ✅ Tìm kiếm theo email
- ✅ Lọc theo vai trò (admin, staff, user)
- ✅ Lọc theo trạng thái (active, inactive)
- ✅ Phân trang với thông tin chi tiết
- ✅ Xóa người dùng với xác nhận

### 2. **Thêm người dùng mới** (`/admin/user/add`)
- ✅ Form validation đầy đủ
- ✅ Các trường bắt buộc: tên, email, mật khẩu, vai trò, trạng thái
- ✅ Validation email và mật khẩu (tối thiểu 8 ký tự)
- ✅ Toast notification khi thành công/thất bại

### 3. **Chỉnh sửa người dùng** (`/admin/user/edit/:id`)
- ✅ Load thông tin người dùng hiện tại
- ✅ Cho phép cập nhật mật khẩu (tùy chọn)
- ✅ Validation tương tự như thêm mới
- ✅ Cập nhật cache sau khi thành công

### 4. **Xem chi tiết người dùng** (`/admin/user/:id`)
- ✅ Hiển thị đầy đủ thông tin người dùng
- ✅ Nút chỉnh sửa và quay lại
- ✅ Hiển thị trạng thái và vai trò với màu sắc

## API Endpoints được sử dụng

```typescript
// Lấy danh sách người dùng với filters
GET /api/admin/users?role=admin&email=test&status=active&page=1

// Tạo người dùng mới
POST /api/admin/users
{
  "name": "Nguyễn Văn A",
  "email": "user@example.com", 
  "password": "12345678",
  "role": "staff",
  "status": "active"
}

// Lấy chi tiết người dùng
GET /api/admin/users/{id}

// Cập nhật người dùng
PUT /api/admin/users/{id}
{
  "name": "Nguyễn Văn A Updated",
  "email": "user@example.com",
  "password": "newpassword", // optional
  "role": "staff", 
  "status": "inactive"
}

// Xóa người dùng
DELETE /api/admin/users/{id}
```

## Cấu trúc file

```
src/
├── services/
│   └── adminUserService.ts          # API calls cho user management
├── pages/admins/user/
│   ├── ListUser.tsx                 # Danh sách người dùng
│   ├── UserForm.tsx                 # Form thêm/sửa người dùng
│   └── UserDetail.tsx               # Chi tiết người dùng
└── interfaces/
    └── user.ts                      # TypeScript interfaces
```

## Validation Rules

### Thêm người dùng mới:
- **Tên**: Bắt buộc, tối thiểu 2 ký tự
- **Email**: Bắt buộc, định dạng email hợp lệ, duy nhất
- **Mật khẩu**: Bắt buộc, tối thiểu 8 ký tự
- **Vai trò**: Bắt buộc (admin, staff, user)
- **Trạng thái**: Bắt buộc (active, inactive)

### Chỉnh sửa người dùng:
- **Mật khẩu**: Tùy chọn, nếu để trống sẽ không thay đổi
- Các trường khác tương tự như thêm mới

## Permissions

- Chỉ admin mới có quyền truy cập các trang quản lý người dùng
- Yêu cầu Bearer token trong header Authorization

## UI/UX Features

- ✅ Loading states cho tất cả operations
- ✅ Error handling với toast notifications
- ✅ Responsive design với Ant Design
- ✅ Confirmation dialog khi xóa
- ✅ Search và filter real-time
- ✅ Pagination với thông tin chi tiết

## Cách sử dụng

1. **Truy cập danh sách**: Vào `/admin/user`
2. **Tìm kiếm**: Nhập email vào ô search và nhấn Enter
3. **Lọc**: Chọn vai trò hoặc trạng thái từ dropdown
4. **Thêm mới**: Click nút "Thêm người dùng"
5. **Chỉnh sửa**: Click "Sửa" ở hàng tương ứng
6. **Xem chi tiết**: Click "Xem" ở hàng tương ứng
7. **Xóa**: Click "Xóa" và xác nhận

## Notes

- Mật khẩu được hash tự động ở backend
- Email phải là duy nhất trong hệ thống
- Có thể mở rộng thêm các trường như avatar, địa chỉ, v.v.
- Cache được quản lý tự động bằng React Query

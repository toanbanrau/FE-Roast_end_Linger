# 📝 Hướng Dẫn Đánh Giá Sản Phẩm

> Hướng dẫn chi tiết cách sử dụng hệ thống đánh giá sản phẩm

## 🎯 Tổng Quan

Hệ thống đánh giá cho phép khách hàng:
- ✅ Đánh giá **từng lần mua** riêng biệt (không giới hạn 1 review/sản phẩm)
- ✅ Xem tất cả sản phẩm đã mua từ đơn hàng hoàn thành
- ✅ Biết được sản phẩm nào đã review, chưa review
- ✅ Chỉnh sửa review trong vòng 7 ngày
- ✅ Upload ảnh kèm theo review

---

## 📋 1. Lấy Danh Sách Sản Phẩm Có Thể Đánh Giá

### **GET** `/api/reviews/reviewable-products`

> Lấy TẤT CẢ sản phẩm từ đơn hàng đã hoàn thành (bao gồm đã review và chưa review)

### Headers
```json
{
    "Authorization": "Bearer {token}",
    "Accept": "application/json"
}
```

### Response Thành Công (200)
```json
{
    "success": true,
    "message": "Lấy danh sách sản phẩm có thể đánh giá thành công.",
    "data": [
        {
            "order_item_id": 123,
            "order_number": "ORD-20240101-001",
            "order_id": 15,
            "product": {
                "id": 1,
                "name": "Cà Phê Arabica Premium",
                "slug": "ca-phe-arabica-premium",
                "image": {
                    "url": "http://127.0.0.1:8000/storage/products/coffee.jpg",
                    "alt_text": "Cà phê Arabica"
                },
                "category": {
                    "id": 1,
                    "name": "Cà phê rang xay"
                }
            },
            "variant": {
                "id": 1,
                "name": "250g",
                "sku": "ARAB-250G"
            },
            "quantity": 2,
            "unit_price": 150000,
            "formatted_unit_price": "150,000 VND",
            "purchased_at": "2024-01-01T10:00:00.000Z",
            "days_since_purchase": 15,
            "has_reviewed": false,
            "review": null,
            "can_review": true
        },
        {
            "order_item_id": 124,
            "order_number": "ORD-20240105-002",
            "order_id": 16,
            "product": {
                "id": 1,
                "name": "Cà Phê Arabica Premium",
                "slug": "ca-phe-arabica-premium",
                "image": {
                    "url": "http://127.0.0.1:8000/storage/products/coffee.jpg",
                    "alt_text": "Cà phê Arabica"
                },
                "category": {
                    "id": 1,
                    "name": "Cà phê rang xay"
                }
            },
            "variant": null,
            "quantity": 1,
            "unit_price": 120000,
            "formatted_unit_price": "120,000 VND",
            "purchased_at": "2024-01-05T14:30:00.000Z",
            "days_since_purchase": 11,
            "has_reviewed": true,
            "review": {
                "id": 15,
                "rating": 5,
                "title": "Cà phê tuyệt vời!",
                "comment": "Rất thơm và ngon, sẽ mua lại",
                "reviewed_at": "2024-01-07T09:30:00.000Z",
                "can_edit": true
            },
            "can_review": true
        }
    ]
}
```

### Giải Thích Các Trường

#### 🆕 Trường Mới:
- **`has_reviewed`**: `true/false` - Đã đánh giá order item này chưa
- **`review`**: Object chứa thông tin review (nếu đã review) hoặc `null`

#### 📝 Trường Review (khi `has_reviewed: true`):
- **`id`**: ID của review (dùng để update/delete)
- **`rating`**: Số sao (1-5)
- **`title`**: Tiêu đề review
- **`comment`**: Nội dung review
- **`reviewed_at`**: Thời gian đánh giá
- **`can_edit`**: Có thể chỉnh sửa không (trong vòng 7 ngày)

#### 📦 Trường Khác:
- **`order_item_id`**: **QUAN TRỌNG** - Dùng ID này khi tạo review
- **`order_number`**: Số đơn hàng để hiển thị
- **`product`**: Thông tin sản phẩm
- **`variant`**: Thông tin variant (null nếu không có)
- **`quantity`**: Số lượng đã mua
- **`unit_price`**: Giá tại thời điểm mua
- **`purchased_at`**: Ngày mua
- **`days_since_purchase`**: Số ngày từ khi mua

### ✅ API Này Trả Về:
- Tất cả order items từ đơn hàng đã hoàn thành
- Cả sản phẩm đã review và chưa review
- Nhiều lần mua cùng sản phẩm thành các items riêng biệt
- Thông tin chi tiết về review hiện có

### ❌ API Này KHÔNG Trả Về:
- Đơn hàng chưa hoàn thành (status ≠ 'Completed')
- Đơn hàng của user khác
- Sản phẩm đã bị xóa

---

## 📝 2. Tạo Đánh Giá Mới

### **POST** `/api/products/{productId}/reviews`

> Tạo đánh giá mới cho một order item cụ thể

### Headers
```json
{
    "Authorization": "Bearer {token}",
    "Content-Type": "multipart/form-data"
}
```

### Request Body (FormData)
```javascript
const formData = new FormData();
formData.append("rating", "5");                    // Bắt buộc: 1-5 sao
formData.append("title", "Cà phê tuyệt vời!");     // Tùy chọn: Tiêu đề
formData.append("comment", "Rất thơm và ngon");    // Tùy chọn: Nội dung
formData.append("order_item_id", "123");           // Bắt buộc: ID từ API reviewable-products
formData.append("images[]", imageFile1);           // Tùy chọn: Ảnh review
formData.append("images[]", imageFile2);           // Tùy chọn: Tối đa 5 ảnh
```

### Validation Rules
- **`rating`**: Bắt buộc, số nguyên 1-5
- **`title`**: Tùy chọn, tối đa 200 ký tự
- **`comment`**: Tùy chọn, tối đa 1000 ký tự
- **`order_item_id`**: Bắt buộc, phải tồn tại trong database
- **`images`**: Tùy chọn, tối đa 5 ảnh, mỗi ảnh tối đa 2MB, định dạng: jpeg, png, jpg, gif

### Response Thành Công (201)
```json
{
    "success": true,
    "message": "Review created successfully",
    "data": {
        "id": 25,
        "rating": 5,
        "title": "Cà phê tuyệt vời!",
        "comment": "Rất thơm và ngon",
        "images": [
            "reviews/review_1640995200_abc123.jpg",
            "reviews/review_1640995201_def456.jpg"
        ],
        "is_verified_purchase": true,
        "reviewed_at": "2024-01-10T10:30:00.000Z",
        "user": {
            "id": 1,
            "name": "Nguyễn Văn A"
        }
    }
}
```

### Response Lỗi (400)
```json
{
    "success": false,
    "message": "You have already reviewed this purchase. Please use the update review function instead."
}
```

---

## 🔄 3. Cập Nhật Đánh Giá

### **PUT** `/api/products/{productId}/reviews/{reviewId}`

> Cập nhật đánh giá đã tồn tại (chỉ trong vòng 7 ngày)

### Headers & Request Body
Giống như tạo đánh giá mới

### Response Lỗi (403)
```json
{
    "success": false,
    "message": "Review can only be edited within 7 days of creation"
}
```

---

## 🗑️ 4. Xóa Đánh Giá

### **DELETE** `/api/products/{productId}/reviews/{reviewId}`

> Xóa đánh giá của chính mình

### Headers
```json
{
    "Authorization": "Bearer {token}"
}
```

### Response Thành Công (200)
```json
{
    "success": true,
    "message": "Review deleted successfully"
}
```

---

## 👍 5. Đánh Dấu Hữu Ích

### **POST** `/api/products/{productId}/reviews/{reviewId}/helpful`

> Đánh dấu review của người khác là hữu ích hoặc không hữu ích

### Headers
```json
{
    "Authorization": "Bearer {token}",
    "Content-Type": "application/json"
}
```

### Request Body
```json
{
    "is_helpful": true  // true = hữu ích, false = không hữu ích
}
```

### Response Thành Công (200)
```json
{
    "message": "Marked as helpful",
    "helpful_count": 15,
    "not_helpful_count": 2,
    "user_vote": true
}
```

---

## 💡 6. Ví Dụ Tích Hợp Frontend

### JavaScript Example

```javascript
class ReviewSystem {
    constructor(baseURL, token) {
        this.baseURL = baseURL;
        this.token = token;
    }

    // Lấy danh sách sản phẩm có thể đánh giá
    async getReviewableProducts() {
        const response = await fetch(`${this.baseURL}/api/reviews/reviewable-products`, {
            headers: {
                'Authorization': `Bearer ${this.token}`,
                'Accept': 'application/json'
            }
        });
        return await response.json();
    }

    // Tạo review mới
    async createReview(productId, orderItemId, reviewData, imageFiles = []) {
        const formData = new FormData();

        // Thêm dữ liệu bắt buộc
        formData.append('rating', reviewData.rating.toString());
        formData.append('order_item_id', orderItemId.toString());

        // Thêm dữ liệu tùy chọn
        if (reviewData.title) formData.append('title', reviewData.title);
        if (reviewData.comment) formData.append('comment', reviewData.comment);

        // Thêm ảnh
        imageFiles.forEach(file => {
            formData.append('images[]', file);
        });

        const response = await fetch(`${this.baseURL}/api/products/${productId}/reviews`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.token}`
                // Không set Content-Type cho FormData
            },
            body: formData
        });

        return await response.json();
    }

    // Cập nhật review
    async updateReview(productId, reviewId, reviewData, imageFiles = []) {
        const formData = new FormData();
        formData.append('_method', 'PUT'); // Laravel method spoofing

        formData.append('rating', reviewData.rating.toString());
        if (reviewData.title) formData.append('title', reviewData.title);
        if (reviewData.comment) formData.append('comment', reviewData.comment);

        imageFiles.forEach(file => {
            formData.append('images[]', file);
        });

        const response = await fetch(`${this.baseURL}/api/products/${productId}/reviews/${reviewId}`, {
            method: 'POST', // Sử dụng POST với _method=PUT
            headers: {
                'Authorization': `Bearer ${this.token}`
            },
            body: formData
        });

        return await response.json();
    }

    // Xóa review
    async deleteReview(productId, reviewId) {
        const response = await fetch(`${this.baseURL}/api/products/${productId}/reviews/${reviewId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${this.token}`,
                'Accept': 'application/json'
            }
        });

        return await response.json();
    }

    // Đánh dấu hữu ích
    async markHelpful(productId, reviewId, isHelpful) {
        const response = await fetch(`${this.baseURL}/api/products/${productId}/reviews/${reviewId}/helpful`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ is_helpful: isHelpful })
        });

        return await response.json();
    }
}
```

### Sử Dụng

```javascript
const reviewSystem = new ReviewSystem('http://127.0.0.1:8000', 'your-token-here');

// 1. Lấy danh sách sản phẩm có thể đánh giá
async function loadReviewableProducts() {
    try {
        const result = await reviewSystem.getReviewableProducts();

        if (result.success) {
            result.data.forEach(item => {
                console.log(`Sản phẩm: ${item.product.name}`);
                console.log(`Đơn hàng: ${item.order_number}`);
                console.log(`Đã review: ${item.has_reviewed ? 'Có' : 'Chưa'}`);

                if (item.has_reviewed) {
                    console.log(`Rating hiện tại: ${item.review.rating}/5`);
                    console.log(`Có thể sửa: ${item.review.can_edit ? 'Có' : 'Không'}`);
                }
                console.log('---');
            });
        }
    } catch (error) {
        console.error('Lỗi:', error);
    }
}

// 2. Tạo review mới
async function createNewReview() {
    const productId = 1;
    const orderItemId = 123; // Lấy từ API reviewable-products

    const reviewData = {
        rating: 5,
        title: 'Cà phê tuyệt vời!',
        comment: 'Rất thơm và ngon, sẽ mua lại'
    };

    // Lấy file ảnh từ input
    const imageInput = document.getElementById('review-images');
    const imageFiles = Array.from(imageInput.files);

    try {
        const result = await reviewSystem.createReview(productId, orderItemId, reviewData, imageFiles);

        if (result.success) {
            alert('Đánh giá thành công!');
            loadReviewableProducts(); // Reload danh sách
        } else {
            alert(`Lỗi: ${result.message}`);
        }
    } catch (error) {
        console.error('Lỗi:', error);
    }
}

// 3. Cập nhật review
async function updateExistingReview() {
    const productId = 1;
    const reviewId = 15; // Lấy từ item.review.id

    const updatedData = {
        rating: 4,
        title: 'Cà phê khá ngon',
        comment: 'Sau khi thử lại, thấy vẫn ngon nhưng không xuất sắc lắm'
    };

    try {
        const result = await reviewSystem.updateReview(productId, reviewId, updatedData);

        if (result.success) {
            alert('Cập nhật thành công!');
        } else {
            alert(`Lỗi: ${result.message}`);
        }
    } catch (error) {
        console.error('Lỗi:', error);
    }
}

// Khởi chạy
loadReviewableProducts();
```

---

## ⚠️ 7. Xử Lý Lỗi Thường Gặp

### Lỗi Authentication (401)
```json
{
    "message": "Unauthenticated."
}
```
**Giải pháp**: Kiểm tra token, đăng nhập lại

### Lỗi Validation (422)
```json
{
    "message": "The given data was invalid.",
    "errors": {
        "rating": ["Vui lòng chọn số sao đánh giá."],
        "order_item_id": ["Order item không tồn tại."]
    }
}
```
**Giải pháp**: Kiểm tra dữ liệu đầu vào

### Lỗi Đã Review (400)
```json
{
    "success": false,
    "message": "You have already reviewed this purchase. Please use the update review function instead."
}
```
**Giải pháp**: Sử dụng API update thay vì create

### Lỗi Không Thể Sửa (403)
```json
{
    "success": false,
    "message": "Review can only be edited within 7 days of creation"
}
```
**Giải pháp**: Review chỉ có thể sửa trong vòng 7 ngày

---

## 🎯 8. Lưu Ý Quan Trọng

### ✅ Điều Cần Nhớ:
1. **Mỗi lần mua có thể đánh giá riêng** - Không giới hạn 1 review/sản phẩm
2. **Sử dụng `order_item_id`** từ API `reviewable-products` khi tạo review
3. **Review chỉ sửa được trong 7 ngày** sau khi tạo
4. **Chỉ đánh giá được sản phẩm đã mua** từ đơn hàng hoàn thành
5. **Upload tối đa 5 ảnh**, mỗi ảnh tối đa 2MB

### 🔄 Quy Trình Đề Xuất:
1. Gọi API `reviewable-products` để lấy danh sách
2. Hiển thị sản phẩm với trạng thái review
3. Cho phép tạo review mới hoặc sửa review cũ
4. Sử dụng `order_item_id` khi gửi request
5. Xử lý response và cập nhật UI

### 🎨 Gợi Ý UI:
- Hiển thị badge "Đã đánh giá" cho sản phẩm đã review
- Hiển thị số sao hiện tại và nút "Sửa đánh giá"
- Hiển thị "Đánh giá ngay" cho sản phẩm chưa review
- Hiển thị thời gian còn lại để sửa review (7 ngày)

---

**🎉 Chúc bạn tích hợp thành công!**

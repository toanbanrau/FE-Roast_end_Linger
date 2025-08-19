# Hướng Dẫn Edit Sản Phẩm (Product Update API)

## Tổng Quan

API này cho phép cập nhật thông tin sản phẩm bao gồm cả việc quản lý ảnh một cách linh hoạt.

**Endpoint:** `PUT /api/admin/products/{id}`

**Content-Type:** `multipart/form-data` (khi có upload ảnh) hoặc `application/json`

## 1. Cập Nhật Thông Tin Cơ Bản

### Request Body (JSON)

```json
{
    "product_name": "Cà phê Arabica Premium",
    "description": "Mô tả chi tiết sản phẩm...",
    "short_description": "Mô tả ngắn",
    "base_price": 250000,
    "category_id": 1,
    "brand_id": 2,
    "origin_id": 3,
    "slug": "ca-phe-arabica-premium",
    "coffee_type": "arabica",
    "roast_level": "medium",
    "flavor_profile": "Hương vị đậm đà, ngọt nhẹ",
    "strength_score": 7.5,
    "meta_title": "SEO Title",
    "meta_description": "SEO Description",
    "stock_quantity": 100,
    "has_variants": false,
    "status": "active",
    "is_featured": true
}
```

### Validation Rules

-   `product_name`: required, string, max:255
-   `description`: nullable, string
-   `base_price`: required, numeric, min:0
-   `category_id`: required, exists:categories,id
-   `stock_quantity`: required, integer, min:0
-   `status`: required, in:active,inactive,draft
-   `strength_score`: nullable, numeric, between:1,10

## 2. Quản Lý Ảnh Sản Phẩm

### Cấu Trúc Images Data

```json
{
  "images": {
    "delete": [1, 2, 3],           // Xóa ảnh theo ID
    "update": [...],               // Cập nhật thông tin ảnh
    "new": [...]                   // Thêm ảnh mới
  }
}
```

### 2.1 Xóa Ảnh (`delete`)

```json
{
    "images": {
        "delete": [1, 2, 3] // Array các ID ảnh cần xóa
    }
}
```

**Lưu ý:**

-   Sẽ xóa cả file vật lý và record trong database
-   Nếu xóa ảnh chính, hệ thống sẽ tự động chọn ảnh khác làm ảnh chính

### 2.2 Cập Nhật Thông Tin Ảnh (`update`)

```json
{
    "images": {
        "update": [
            {
                "id": 4,
                "alt_text": "Ảnh sản phẩm mới",
                "sort_order": 1,
                "is_primary": true
            },
            {
                "id": 5,
                "alt_text": "Ảnh phụ",
                "sort_order": 2,
                "is_primary": false
            }
        ]
    }
}
```

**Validation:**

-   `id`: required, exists:product_images,id
-   `alt_text`: nullable, string, max:200
-   `sort_order`: nullable, integer, min:1
-   `is_primary`: nullable, boolean

### 2.3 Thêm Ảnh Mới (`new`)

#### Với Form Data (multipart/form-data)

```javascript
const formData = new FormData();
formData.append("product_name", "Tên sản phẩm");
formData.append("base_price", "250000");

// Thêm ảnh mới
formData.append("images[new][0][image_file]", fileInput1.files[0]);
formData.append("images[new][0][alt_text]", "Ảnh chính");
formData.append("images[new][0][sort_order]", "1");
formData.append("images[new][0][is_primary]", "true");

formData.append("images[new][1][image_file]", fileInput2.files[0]);
formData.append("images[new][1][alt_text]", "Ảnh phụ");
formData.append("images[new][1][sort_order]", "2");
formData.append("images[new][1][is_primary]", "false");
```

#### Validation cho ảnh mới:

-   `image_file`: required, image, mimes:jpeg,png,jpg,webp, max:2048KB
-   `alt_text`: nullable, string, max:200
-   `sort_order`: nullable, integer, min:1
-   `is_primary`: nullable, boolean
-   Tối đa 10 ảnh mới mỗi lần

## 3. Ví Dụ Thực Tế - GỬI TẤT CẢ TRONG 1 API

### 3.1 Cập Nhật Đầy Đủ (Form Data) - KHUYẾN NGHỊ

```javascript
// Tạo FormData để gửi tất cả thông tin trong 1 request
const formData = new FormData();

// 1. THÔNG TIN SẢN PHẨM CƠ BẢN
formData.append("product_name", "Cà phê Arabica Premium Updated");
formData.append("description", "Mô tả chi tiết đã cập nhật...");
formData.append("short_description", "Mô tả ngắn mới");
formData.append("base_price", "280000");
formData.append("category_id", "1");
formData.append("brand_id", "2");
formData.append("origin_id", "3");
formData.append("coffee_type", "arabica");
formData.append("roast_level", "dark");
formData.append("flavor_profile", "Hương vị mạnh mẽ, đậm đà");
formData.append("strength_score", "8.5");
formData.append("stock_quantity", "75");
formData.append("status", "active");
formData.append("is_featured", "true");

// 2. XÓA ẢNH CŨ
formData.append("images[delete][0]", "1"); // Xóa ảnh ID 1
formData.append("images[delete][1]", "2"); // Xóa ảnh ID 2

// 3. CẬP NHẬT THÔNG TIN ẢNH HIỆN TẠI
formData.append("images[update][0][id]", "3");
formData.append("images[update][0][alt_text]", "Ảnh chính đã cập nhật");
formData.append("images[update][0][sort_order]", "1");
formData.append("images[update][0][is_primary]", "true");

formData.append("images[update][1][id]", "4");
formData.append("images[update][1][alt_text]", "Ảnh phụ đã cập nhật");
formData.append("images[update][1][sort_order]", "2");
formData.append("images[update][1][is_primary]", "false");

// 4. THÊM ẢNH MỚI
formData.append("images[new][0][image_file]", newImageFile1);
formData.append("images[new][0][alt_text]", "Ảnh mới số 1");
formData.append("images[new][0][sort_order]", "3");
formData.append("images[new][0][is_primary]", "false");

formData.append("images[new][1][image_file]", newImageFile2);
formData.append("images[new][1][alt_text]", "Ảnh mới số 2");
formData.append("images[new][1][sort_order]", "4");
formData.append("images[new][1][is_primary]", "false");

// 5. GỬI REQUEST
fetch("/api/admin/products/1", {
    method: "PUT",
    headers: {
        Authorization: "Bearer " + token,
        // KHÔNG set Content-Type, để browser tự động set multipart/form-data
    },
    body: formData,
})
    .then((response) => response.json())
    .then((data) => {
        console.log("Success:", data);
    })
    .catch((error) => {
        console.error("Error:", error);
    });
```

### 3.2 Với jQuery/AJAX

```javascript
$("#productForm").on("submit", function (e) {
    e.preventDefault();

    const formData = new FormData();

    // Thông tin cơ bản
    formData.append("product_name", $("#product_name").val());
    formData.append("base_price", $("#base_price").val());
    formData.append("stock_quantity", $("#stock_quantity").val());

    // Xóa ảnh (từ checkbox hoặc array)
    $(".delete-image:checked").each(function (index) {
        formData.append(`images[delete][${index}]`, $(this).val());
    });

    // Cập nhật ảnh hiện tại
    $(".update-image").each(function (index) {
        const imageId = $(this).data("image-id");
        formData.append(`images[update][${index}][id]`, imageId);
        formData.append(
            `images[update][${index}][alt_text]`,
            $(this).find(".alt-text").val()
        );
        formData.append(
            `images[update][${index}][sort_order]`,
            $(this).find(".sort-order").val()
        );
        formData.append(
            `images[update][${index}][is_primary]`,
            $(this).find(".is-primary").is(":checked")
        );
    });

    // Thêm ảnh mới
    $(".new-image-file").each(function (index) {
        if (this.files[0]) {
            formData.append(`images[new][${index}][image_file]`, this.files[0]);
            formData.append(
                `images[new][${index}][alt_text]`,
                $(this).siblings(".new-alt-text").val()
            );
            formData.append(`images[new][${index}][sort_order]`, index + 1);
        }
    });

    $.ajax({
        url: `/api/admin/products/${productId}`,
        method: "PUT",
        data: formData,
        processData: false,
        contentType: false,
        headers: {
            Authorization: "Bearer " + token,
        },
        success: function (response) {
            alert("Cập nhật thành công!");
            location.reload();
        },
        error: function (xhr) {
            console.error("Error:", xhr.responseJSON);
            alert("Có lỗi xảy ra!");
        },
    });
});
```

### 3.3 Cập Nhật Chỉ Thông Tin (JSON) - Không có ảnh

```bash
curl -X PUT "http://localhost:8000/api/admin/products/1" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "product_name": "Cà phê Robusta Đặc Biệt",
    "base_price": 180000,
    "stock_quantity": 50,
    "is_featured": false,
    "images": {
      "delete": [1, 2],
      "update": [
        {
          "id": 3,
          "alt_text": "Ảnh chính mới",
          "is_primary": true,
          "sort_order": 1
        }
      ]
    }
  }'
```

### 3.4 HTML Form Example - Gửi Tất Cả Trong 1 Form

```html
<form id="editProductForm" enctype="multipart/form-data">
    <!-- THÔNG TIN CƠ BẢN -->
    <div class="basic-info">
        <input
            type="text"
            name="product_name"
            placeholder="Tên sản phẩm"
            required
        />
        <textarea name="description" placeholder="Mô tả chi tiết"></textarea>
        <input
            type="number"
            name="base_price"
            placeholder="Giá cơ bản"
            required
        />
        <select name="category_id" required>
            <option value="1">Cà phê rang xay</option>
            <option value="2">Cà phê hạt</option>
        </select>
        <input
            type="number"
            name="stock_quantity"
            placeholder="Số lượng tồn kho"
        />
        <select name="status">
            <option value="active">Hoạt động</option>
            <option value="inactive">Không hoạt động</option>
        </select>
    </div>

    <!-- QUẢN LÝ ẢNH HIỆN TẠI -->
    <div class="current-images">
        <h3>Ảnh hiện tại</h3>
        <div class="image-item" data-image-id="3">
            <img src="/storage/products/1/image3.jpg" alt="Current image" />
            <input type="checkbox" name="images[delete][]" value="3" /> Xóa ảnh
            này
            <input
                type="text"
                name="images[update][0][alt_text]"
                placeholder="Alt text"
                value="Ảnh cũ"
            />
            <input type="hidden" name="images[update][0][id]" value="3" />
            <input
                type="number"
                name="images[update][0][sort_order]"
                value="1"
            />
            <input
                type="checkbox"
                name="images[update][0][is_primary]"
                value="1"
            />
            Ảnh chính
        </div>

        <div class="image-item" data-image-id="4">
            <img src="/storage/products/1/image4.jpg" alt="Current image" />
            <input type="checkbox" name="images[delete][]" value="4" /> Xóa ảnh
            này
            <input
                type="text"
                name="images[update][1][alt_text]"
                placeholder="Alt text"
                value="Ảnh phụ"
            />
            <input type="hidden" name="images[update][1][id]" value="4" />
            <input
                type="number"
                name="images[update][1][sort_order]"
                value="2"
            />
            <input
                type="checkbox"
                name="images[update][1][is_primary]"
                value="1"
            />
            Ảnh chính
        </div>
    </div>

    <!-- THÊM ẢNH MỚI -->
    <div class="new-images">
        <h3>Thêm ảnh mới</h3>
        <div class="new-image-item">
            <input
                type="file"
                name="images[new][0][image_file]"
                accept="image/*"
            />
            <input
                type="text"
                name="images[new][0][alt_text]"
                placeholder="Alt text cho ảnh mới"
            />
            <input
                type="number"
                name="images[new][0][sort_order]"
                placeholder="Thứ tự"
                value="3"
            />
            <input
                type="checkbox"
                name="images[new][0][is_primary]"
                value="1"
            />
            Ảnh chính
        </div>

        <div class="new-image-item">
            <input
                type="file"
                name="images[new][1][image_file]"
                accept="image/*"
            />
            <input
                type="text"
                name="images[new][1][alt_text]"
                placeholder="Alt text cho ảnh mới"
            />
            <input
                type="number"
                name="images[new][1][sort_order]"
                placeholder="Thứ tự"
                value="4"
            />
            <input
                type="checkbox"
                name="images[new][1][is_primary]"
                value="1"
            />
            Ảnh chính
        </div>
    </div>

    <button type="submit">Cập Nhật Sản Phẩm</button>
</form>

<script>
    document
        .getElementById("editProductForm")
        .addEventListener("submit", function (e) {
            e.preventDefault();

            const formData = new FormData(this);

            fetch("/api/admin/products/1", {
                method: "PUT",
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                },
                body: formData,
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.success) {
                        alert("Cập nhật thành công!");
                        window.location.reload();
                    } else {
                        alert("Có lỗi: " + data.message);
                    }
                })
                .catch((error) => {
                    console.error("Error:", error);
                    alert("Có lỗi xảy ra!");
                });
        });
</script>
```

## 4. Response Format

### Success Response (200)

```json
{
    "success": true,
    "message": "Product updated successfully",
    "data": {
        "id": 1,
        "product_name": "Cà phê Premium Updated",
        "base_price": "300000.00",
        "display_price": "300,000₫",
        "slug": "ca-phe-premium-updated",
        "status": "active",
        "images": [
            {
                "id": 3,
                "image_url": "http://localhost:8000/storage/products/1/image.jpg",
                "alt_text": "Ảnh chính mới",
                "sort_order": 1,
                "is_primary": true
            }
        ],
        "primary_image": {
            "id": 3,
            "image_url": "http://localhost:8000/storage/products/1/image.jpg",
            "alt_text": "Ảnh chính mới"
        },
        "category": {
            "id": 1,
            "category_name": "Cà phê rang xay"
        }
    }
}
```

## 5. Lưu Ý Quan Trọng

### 5.1 Quản Lý Ảnh Chính

-   Hệ thống tự động đảm bảo luôn có 1 ảnh chính
-   Nếu không có ảnh nào được đánh dấu `is_primary=true`, ảnh đầu tiên sẽ được chọn
-   Nếu có nhiều ảnh `is_primary=true`, chỉ ảnh đầu tiên được giữ lại

### 5.2 Thứ Tự Xử Lý

1. **Xóa ảnh** (`delete`) - Xóa file và record
2. **Cập nhật ảnh** (`update`) - Chỉ cập nhật thông tin
3. **Thêm ảnh mới** (`new`) - Upload và tạo record
4. **Kiểm tra ảnh chính** - Đảm bảo có ảnh chính

### 5.3 File Upload

-   **Định dạng:** jpeg, png, jpg, webp
-   **Kích thước tối đa:** 2MB
-   **Đường dẫn lưu:** `storage/products/{product_id}/`
-   **Tên file:** `{timestamp}_{uniqid}.{extension}`

### 5.4 Error Handling

```json
{
    "success": false,
    "message": "Validation failed",
    "errors": {
        "base_price": ["The base price field is required."],
        "images.new.0.image_file": ["The image file must be an image."]
    }
}
```

## 6. Best Practices

1. **Luôn backup** trước khi xóa ảnh
2. **Kiểm tra quyền** trước khi cho phép edit
3. **Validate file size** phía client trước khi upload
4. **Sử dụng transaction** để đảm bảo tính nhất quán
5. **Log các thao tác** quan trọng để debug

## 7. Testing

### Test Cases Cần Kiểm Tra

-   [ ] Update thông tin cơ bản
-   [ ] Xóa ảnh (bao gồm ảnh chính)
-   [ ] Cập nhật thông tin ảnh
-   [ ] Thêm ảnh mới
-   [ ] Kết hợp nhiều thao tác ảnh
-   [ ] Validation lỗi
-   [ ] File upload lớn
-   [ ] Định dạng file không hỗ trợ

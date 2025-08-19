# 📋 API Product - Hướng dẫn sử dụng

> **Tài liệu API cho việc browse và tìm kiếm sản phẩm cà phê**

## 🎯 Tổng quan

API Product cung cấp các endpoint công khai (không cần authentication) để browse, tìm kiếm và xem chi tiết sản phẩm cà phê. API hỗ trợ đầy đủ các tính năng filter, sort, pagination và SEO-friendly URLs.

## 📚 Danh sách Endpoints

### 1. 🛍️ Lấy danh sách sản phẩm
**GET** `/api/products`

Lấy danh sách sản phẩm với đầy đủ tính năng filter, sort và pagination.

#### Query Parameters

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `search` | string | Tìm kiếm theo tên, mô tả, flavor profile | `arabica` |
| `category_id` | integer | Lọc theo danh mục | `1` |
| `brand_id` | integer | Lọc theo thương hiệu | `1` |
| `origin_id` | integer | Lọc theo xuất xứ | `1` |
| `coffee_type` | string | Lọc theo loại cà phê | `arabica`, `robusta`, `blend` |
| `roast_level` | string | Lọc theo độ rang | `light`, `medium`, `dark`, `extra_dark` |
| `min_price` | numeric | Giá tối thiểu (VND) | `100000` |
| `max_price` | numeric | Giá tối đa (VND) | `500000` |
| `is_featured` | boolean | Chỉ lấy sản phẩm nổi bật | `true` |
| `sort` | string | Sắp xếp theo | `product_name`, `base_price`, `created_at`, `view_count`, `sold_count` |
| `order` | string | Thứ tự sắp xếp | `asc`, `desc` |
| `page` | integer | Trang hiện tại | `1` |
| `per_page` | integer | Số items per page (max 50) | `12` |

#### Response Structure
```json
{
  "data": [
    {
      "id": 1,
      "product_name": "Cà Phê Arabica Premium",
      "description": "Cà phê Arabica chất lượng cao...",
      "short_description": "Hương vị đậm đà, thơm ngon",
      "base_price": 250000,
      "formatted_price": "250,000 VND",
      "display_price": "250,000 VND",
      "price_range": "200,000 - 300,000 VND",
      "slug": "ca-phe-arabica-premium",
      "coffee_type": "arabica",
      "roast_level": "medium",
      "flavor_profile": "Chocolate, caramel, nutty",
      "strength_score": 7.5,
      "stock_quantity": 100,
      "total_stock": 150,
      "has_variants": true,
      "status": "active",
      "is_featured": true,
      "is_in_stock": true,
      "view_count": 1250,
      "sold_count": 89,
      "category": {
        "id": 1,
        "category_name": "Cà Phê Hạt",
        "slug": "ca-phe-hat"
      },
      "brand": {
        "id": 1,
        "brand_name": "Trung Nguyên",
        "slug": "trung-nguyen"
      },
      "origin": {
        "id": 1,
        "origin_name": "Đà Lạt",
        "country": "Vietnam"
      },
      "primary_image": {
        "id": 1,
        "image_url": "storage/products/product1.jpg",
        "alt_text": "Cà Phê Arabica Premium"
      },
      "created_at": "2024-01-15T10:30:00.000000Z",
      "updated_at": "2024-01-20T14:45:00.000000Z"
    }
  ],
  "links": {
    "first": "http://localhost/api/products?page=1",
    "last": "http://localhost/api/products?page=5",
    "prev": null,
    "next": "http://localhost/api/products?page=2"
  },
  "meta": {
    "current_page": 1,
    "from": 1,
    "last_page": 5,
    "per_page": 12,
    "to": 12,
    "total": 58
  },
  "message": "Products retrieved successfully"
}
```

### 2. 🔍 Xem chi tiết sản phẩm theo ID
**GET** `/api/products/{id}`

#### Response Structure
```json
{
  "success": true,
  "data": {
    "id": 1,
    "product_name": "Cà Phê Arabica Premium",
    "description": "Mô tả chi tiết sản phẩm...",
    "short_description": "Mô tả ngắn",
    "base_price": 250000,
    "formatted_price": "250,000 VND",
    "slug": "ca-phe-arabica-premium",
    "coffee_type": "arabica",
    "roast_level": "medium",
    "flavor_profile": "Chocolate, caramel, nutty",
    "strength_score": 7.5,
    "meta_title": "Cà Phê Arabica Premium - Chất lượng cao",
    "meta_description": "Cà phê Arabica premium với hương vị đặc trưng...",
    "stock_quantity": 100,
    "total_stock": 150,
    "has_variants": true,
    "status": "active",
    "is_featured": true,
    "is_in_stock": true,
    "view_count": 1251,
    "sold_count": 89,
    "category": { /* ... */ },
    "brand": { /* ... */ },
    "origin": { /* ... */ },
    "primary_image": { /* ... */ },
    "images": [ /* ... */ ],
    "variants": [ /* ... */ ]
  },
  "price_info": {
    "type": "variants",
    "min_price": 200000,
    "max_price": 300000,
    "formatted_range": "200,000 - 300,000 VND",
    "available_variants_count": 3,
    "total_variants_count": 4
  },
  "availability": {
    "in_stock": true,
    "available_variants": 3,
    "total_variants": 4,
    "total_stock": 150
  },
  "message": "Lấy thông tin sản phẩm thành công."
}
```

### 3. 🌐 Xem chi tiết sản phẩm theo Slug (SEO-friendly)
**GET** `/api/products/slug/{slug}`

Tương tự như endpoint trên nhưng sử dụng slug thay vì ID, tốt hơn cho SEO.

#### Response bổ sung thêm SEO info:
```json
{
  "success": true,
  "data": { /* ... */ },
  "price_info": { /* ... */ },
  "availability": { /* ... */ },
  "seo": {
    "meta_title": "Cà Phê Arabica Premium - Chất lượng cao",
    "meta_description": "Cà phê Arabica premium với hương vị đặc trưng...",
    "canonical_url": "http://localhost/api/products/slug/ca-phe-arabica-premium",
    "slug": "ca-phe-arabica-premium"
  },
  "message": "Lấy thông tin sản phẩm thành công."
}
```

### 4. 🎯 Lấy variants của sản phẩm
**GET** `/api/products/{id}/variants`

#### Response Structure
```json
{
  "success": true,
  "message": "Product variants retrieved successfully",
  "data": [
    {
      "id": 10,
      "sku_code": "ARA-250-GR",
      "variant_name": "250g - Ground",
      "price": 250000,
      "formatted_price": "250,000 VNĐ",
      "stock_quantity": 50,
      "image_url": "storage/variants/variant1.jpg",
      "is_available": true,
      "full_name": "Arabica Premium - 250g - Ground"
    }
  ]
}
```

## 🔧 Tính năng Filter đã có

### ✅ Filters hiện tại:
- **Search**: Tìm kiếm trong `product_name`, `description`, `short_description`, `flavor_profile`
- **Category**: Lọc theo danh mục (`category_id`)
- **Brand**: Lọc theo thương hiệu (`brand_id`)
- **Origin**: Lọc theo xuất xứ (`origin_id`)
- **Coffee Type**: Lọc theo loại cà phê (`arabica`, `robusta`, `blend`)
- **Roast Level**: Lọc theo độ rang (`light`, `medium`, `dark`, `extra_dark`)
- **Price Range**: Lọc theo khoảng giá (`min_price`, `max_price`)
- **Featured**: Chỉ lấy sản phẩm nổi bật (`is_featured=true`)

### ✅ Sorting options:
- `product_name` - Tên sản phẩm
- `base_price` - Giá cơ bản
- `created_at` - Ngày tạo (mặc định)
- `view_count` - Lượt xem
- `sold_count` - Lượt bán

### ✅ Pagination:
- Hỗ trợ pagination với `page` và `per_page`
- Giới hạn tối đa 50 items per page
- Trả về đầy đủ `links` và `meta` information

## 🚀 Ví dụ sử dụng

### Lấy sản phẩm nổi bật
```javascript
fetch('/api/products?is_featured=true&per_page=8')
```

### Tìm kiếm cà phê Arabica
```javascript
fetch('/api/products?search=arabica&coffee_type=arabica')
```

### Lọc theo giá và danh mục
```javascript
fetch('/api/products?category_id=1&min_price=100000&max_price=500000&sort=base_price&order=asc')
```

### Lấy sản phẩm theo thương hiệu
```javascript
fetch('/api/products?brand_id=1&sort=sold_count&order=desc')
```

## 📝 Lưu ý quan trọng

1. **Chỉ trả về sản phẩm active**: API chỉ trả về sản phẩm có `status = 'active'`
2. **Phải có category**: Sản phẩm phải được gán vào danh mục (`category_id` không null)
3. **Auto increment view count**: Khi xem chi tiết sản phẩm, `view_count` sẽ tự động tăng
4. **Price calculation**: Giá hiển thị được tính toán dựa trên variants nếu có
5. **Stock management**: Tính toán tồn kho real-time bao gồm cả variants
6. **SEO optimization**: Hỗ trợ slug-based URLs và meta information

## 🔄 Error Responses

### 404 - Product Not Found
```json
{
  "success": false,
  "message": "Sản phẩm với ID 999 không tồn tại.",
  "error": {
    "code": "PRODUCT_NOT_FOUND",
    "details": "Sản phẩm không được tìm thấy trong hệ thống."
  }
}
```

### 404 - Product Inactive
```json
{
  "success": false,
  "message": "Sản phẩm với ID 1 hiện không khả dụng.",
  "error": {
    "code": "PRODUCT_INACTIVE",
    "details": "Sản phẩm có trạng thái: inactive. Chỉ hiển thị sản phẩm đang hoạt động."
  }
}
```

# 📝 API Edit Product - 1 API Duy Nhất

> **Tài liệu API đơn giản cho việc edit sản phẩm cà phê**  
> **Version:** 2.0 - Simplified  
> **Last Updated:** 2024-01-20  
> **Base URL:** `http://localhost/api/admin`  
> **Authentication:** Required (Bearer Token)

## 🎯 Tổng quan

**1 API DUY NHẤT** để edit tất cả loại sản phẩm! API thông minh tự động phát hiện và xử lý:
- ✅ Sản phẩm có variants hoặc không có variants
- ✅ Có ảnh hoặc không có ảnh
- ✅ JSON request hoặc multipart form data
- ✅ Tự động quản lý images và variants

### 🚀 Tính năng chính
- 🎯 **1 API cho tất cả** - Không cần phân biệt loại sản phẩm
- 🤖 **Auto-detect** - Tự động nhận biết có variants hay không
- 🖼️ **Smart image handling** - Tự động xử lý ảnh mới/cũ/xóa
- 🔄 **Flexible input** - Hỗ trợ cả JSON và form-data
- 🛡️ **Transaction safe** - Rollback khi có lỗi
- ⚡ **Performance optimized** - Chỉ update fields thay đổi

### 📊 Smart Workflow
```
PUT /api/admin/products/{id}
├── Auto-detect request type (JSON/Form-data)
├── Auto-detect variants (has_variants field)
├── Smart image processing (new/keep/delete)
├── Validate all data
├── Update product + variants + images
└── Return complete updated data
```

## 📚 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| **GET** | `/api/admin/products/{id}` | Lấy chi tiết sản phẩm để edit |
| **PUT** | `/api/admin/products/{id}` | **CẬP NHẬT TẤT CẢ** - 1 API duy nhất |

---

## 1. 📋 Lấy chi tiết sản phẩm để edit
**GET** `/api/admin/products/{id}`

> **🎯 Mục đích:** Lấy đầy đủ thông tin sản phẩm để populate form edit

### Response (Đầy đủ dữ liệu)
```json
{
  "data": {
    "id": 1,
    "product_name": "Cà Phê Arabica Premium",
    "description": "Mô tả chi tiết...",
    "base_price": 250000,
    "category": { "id": 1, "category_name": "Cà Phê Hạt" },
    "brand": { "id": 2, "brand_name": "Highlands Coffee" },
    "has_variants": true,
    "variants": [
      {
        "id": 10,
        "variant_name": "250g - Hạt",
        "sku_code": "ARA-250-BEAN",
        "price": 250000,
        "stock_quantity": 100
      }
    ],
    "images": [
      {
        "id": 1,
        "image_url": "storage/products/1/image1.jpg",
        "alt_text": "Ảnh chính",
        "is_primary": true
      }
    ]
  }
}
```

## 2. 🎯 Cập nhật sản phẩm - 1 API cho tất cả
**PUT** `/api/admin/products/{id}`

> **🎯 Mục đích:** 1 API duy nhất xử lý tất cả trường hợp edit  
> **🤖 Auto-detect:** Tự động nhận biết loại request và xử lý phù hợp

### Request Headers
```
Authorization: Bearer {token}
Content-Type: multipart/form-data (có ảnh) hoặc application/json (không ảnh)
Accept: application/json
```

### Case 1: Sản phẩm cơ bản (không có variants)
```json
{
  "product_name": "Cà Phê Arabica Premium Updated",
  "description": "Mô tả mới...",
  "base_price": 280000,
  "category_id": 1,
  "brand_id": 2,
  "coffee_type": "arabica",
  "roast_level": "medium",
  "stock_quantity": 150,
  "has_variants": false,
  "status": "active",
  "is_featured": true,
  "images": {
    "new": [
      {
        "image_file": "file_upload",
        "alt_text": "Ảnh mới",
        "is_primary": true
      }
    ],
    "keep": [1, 2],
    "delete": [3, 4]
  }
}
```

### Case 2: Sản phẩm có variants
```json
{
  "product_name": "Cà Phê Arabica Premium Variants",
  "description": "Sản phẩm có nhiều lựa chọn...",
  "base_price": 250000,
  "category_id": 1,
  "has_variants": true,
  "variants": [
    {
      "id": 10,
      "variant_name": "250g - Hạt Updated",
      "sku_code": "ARA-250-BEAN-V2",
      "price": 260000,
      "stock_quantity": 120,
      "status": true
    },
    {
      "variant_name": "500g - Xay",
      "sku_code": "ARA-500-GROUND",
      "price": 450000,
      "stock_quantity": 50,
      "status": true
    }
  ],
  "images": {
    "new": [
      {
        "image_file": "file_upload",
        "alt_text": "Ảnh chính mới"
      }
    ]
  }
}
```

### Case 3: Chỉ update thông tin (JSON, không ảnh)
```json
{
  "product_name": "Tên mới",
  "base_price": 300000,
  "stock_quantity": 200,
  "is_featured": false
}
```

### Response Success (200) - Tất cả cases
```json
{
  "success": true,
  "message": "Sản phẩm đã được cập nhật thành công",
  "data": {
    "id": 1,
    "product_name": "Cà Phê Arabica Premium Updated",
    "base_price": 280000,
    "has_variants": true,
    "variants": [
      {
        "id": 10,
        "variant_name": "250g - Hạt Updated",
        "price": 260000,
        "stock_quantity": 120
      }
    ],
    "images": [
      {
        "id": 5,
        "image_url": "storage/products/1/new_image.jpg",
        "is_primary": true
      }
    ],
    "updated_at": "2024-01-20T15:30:00.000000Z"
  }
}
```

---

## 🔧 Smart Logic

### 🤖 Auto-Detection Rules
1. **Has variants?** → Check `has_variants` field
2. **Has images?** → Check `images` field exists
3. **JSON or Form-data?** → Check Content-Type header
4. **New or update variants?** → Check variant has `id` field

### 🖼️ Smart Image Processing
```javascript
// API tự động xử lý:
{
  "images": {
    "new": [...],     // Ảnh mới → Upload và tạo record
    "keep": [1,2,3],  // Giữ lại ảnh có ID này
    "delete": [4,5],  // Xóa ảnh có ID này
    "update": [       // Cập nhật metadata ảnh
      {
        "id": 6,
        "alt_text": "New alt text",
        "sort_order": 2
      }
    ]
  }
}
```

### 🎯 Smart Variant Processing
```javascript
// API tự động xử lý:
{
  "variants": [
    {
      "id": 10,           // Có ID → Update existing variant
      "variant_name": "Updated name"
    },
    {
      // Không có ID → Create new variant
      "variant_name": "New variant",
      "sku_code": "NEW-SKU"
    }
  ]
}
```

---

## 🚀 Code Examples

### JavaScript - Universal Update Function
```javascript
const updateProduct = async (productId, productData) => {
  // Determine if we need form-data (for images)
  const hasImages = productData.images && 
    (productData.images.new || productData.images.update);
  
  let body;
  let headers = {
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Accept': 'application/json'
  };
  
  if (hasImages) {
    // Use FormData for images
    const formData = new FormData();
    
    // Add all non-image fields
    Object.keys(productData).forEach(key => {
      if (key !== 'images' && key !== 'variants') {
        formData.append(key, productData[key]);
      }
    });
    
    // Add variants
    if (productData.variants) {
      productData.variants.forEach((variant, index) => {
        Object.keys(variant).forEach(field => {
          formData.append(`variants[${index}][${field}]`, variant[field]);
        });
      });
    }
    
    // Add images
    if (productData.images) {
      // New images
      if (productData.images.new) {
        productData.images.new.forEach((image, index) => {
          formData.append(`images[new][${index}][image_file]`, image.file);
          formData.append(`images[new][${index}][alt_text]`, image.alt_text || '');
        });
      }
      
      // Keep, delete, update arrays
      ['keep', 'delete', 'update'].forEach(action => {
        if (productData.images[action]) {
          productData.images[action].forEach((item, index) => {
            if (action === 'update') {
              Object.keys(item).forEach(field => {
                formData.append(`images[${action}][${index}][${field}]`, item[field]);
              });
            } else {
              formData.append(`images[${action}][${index}]`, item);
            }
          });
        }
      });
    }
    
    body = formData;
  } else {
    // Use JSON for simple updates
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(productData);
  }
  
  try {
    const response = await fetch(`/api/admin/products/${productId}`, {
      method: 'PUT',
      headers,
      body
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('Product updated successfully:', result);
      return result;
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('Update failed:', error);
    throw error;
  }
};

// Usage Examples
// 1. Simple update (JSON)
updateProduct(1, {
  product_name: 'New Name',
  base_price: 300000,
  is_featured: true
});

// 2. Update with new images
updateProduct(1, {
  product_name: 'Updated Product',
  images: {
    new: [{ file: selectedFile, alt_text: 'New image' }],
    delete: [3, 4]
  }
});

// 3. Update with variants
updateProduct(1, {
  product_name: 'Product with Variants',
  has_variants: true,
  variants: [
    { id: 10, price: 280000 }, // Update existing
    { variant_name: 'New Variant', sku_code: 'NEW-SKU', price: 350000 } // Create new
  ]
});
```

# 📝 Review Management API (Admin)

> API endpoints for admin to view and manage product reviews

## Base URL
```
/api/admin/reviews
```

## Authentication
All admin endpoints require authentication via Bearer token with admin role.

---

## 📋 Endpoints Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/reviews` | Get all reviews with filters and statistics |
| GET | `/api/admin/reviews/{id}` | Get detailed review information |

---

## 📖 API Details

### 1. Get All Reviews
**GET** `/api/admin/reviews`

Lấy danh sách tất cả đánh giá sản phẩm với khả năng lọc và tìm kiếm.

#### Query Parameters

| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `page` | integer | No | Trang hiện tại | `1` |
| `per_page` | integer | No | Số items per page (max 50) | `15` |
| `status` | string | No | Lọc theo trạng thái (`approved`, `pending`) | `pending` |
| `rating` | integer | No | Lọc theo rating (1-5) | `5` |
| `verified_only` | boolean | No | Chỉ lấy review đã xác thực mua hàng | `true` |
| `search` | string | No | Tìm kiếm theo tên user, sản phẩm, nội dung | `"great product"` |
| `product_id` | integer | No | Lọc theo sản phẩm | `1` |
| `user_id` | integer | No | Lọc theo user | `1` |
| `date_from` | string | No | Từ ngày (Y-m-d) | `"2024-01-01"` |
| `date_to` | string | No | Đến ngày (Y-m-d) | `"2024-12-31"` |
| `sort_by` | string | No | Sắp xếp (`newest`, `oldest`, `rating_high`, `rating_low`, `helpful`) | `"newest"` |

#### Response

**Success Response (200)**
```json
{
    "success": true,
    "message": "Reviews retrieved successfully",
    "data": {
        "reviews": {
            "data": [
                {
                    "id": 1,
                    "rating": 5,
                    "title": "Excellent product!",
                    "comment": "Really love this coffee. Great taste and aroma.",
                    "images": [
                        "reviews/coffee-review-1.jpg",
                        "reviews/coffee-review-2.jpg"
                    ],
                    "is_verified_purchase": true,
                    "is_approved": true,
                    "helpful_count": 15,
                    "not_helpful_count": 2,
                    "reviewed_at": "2024-01-15T10:30:00.000000Z",
                    "created_at": "2024-01-15T10:30:00.000000Z",
                    "user": {
                        "id": 123,
                        "name": "john_doe",
                        "email": "john@example.com",
                        "full_name": "John Doe"
                    },
                    "product": {
                        "id": 45,
                        "name": "Premium Arabica Coffee",
                        "slug": "premium-arabica-coffee",
                        "image": "products/coffee-arabica.jpg"
                    },
                    "order": {
                        "id": 789,
                        "order_number": "ORD-2024-001",
                        "status": "delivered"
                    }
                }
            ],
            "current_page": 1,
            "last_page": 10,
            "per_page": 15,
            "total": 150,
            "from": 1,
            "to": 15
        },
        "statistics": {
            "total_reviews": 450,
            "approved_reviews": 420,
            "pending_reviews": 30,
            "average_rating": 4.3
        }
    }
}
```

**Error Response (500)**
```json
{
    "success": false,
    "message": "Failed to get reviews",
    "error": "Database connection error"
}
```

---

## 🔍 Usage Examples

### Get All Reviews (Default)
```bash
curl -X GET "https://api.example.com/api/admin/reviews" \
  -H "Authorization: Bearer {admin_token}" \
  -H "Accept: application/json"
```

### Get Pending Reviews Only
```bash
curl -X GET "https://api.example.com/api/admin/reviews?status=pending" \
  -H "Authorization: Bearer {admin_token}" \
  -H "Accept: application/json"
```

### Get Reviews for Specific Product
```bash
curl -X GET "https://api.example.com/api/admin/reviews?product_id=45" \
  -H "Authorization: Bearer {admin_token}" \
  -H "Accept: application/json"
```

### Search Reviews
```bash
curl -X GET "https://api.example.com/api/admin/reviews?search=excellent&rating=5" \
  -H "Authorization: Bearer {admin_token}" \
  -H "Accept: application/json"
```

### Get Reviews with Date Range
```bash
curl -X GET "https://api.example.com/api/admin/reviews?date_from=2024-01-01&date_to=2024-01-31" \
  -H "Authorization: Bearer {admin_token}" \
  -H "Accept: application/json"
```

### 2. Get Review Details
**GET** `/api/admin/reviews/{id}`

Lấy thông tin chi tiết của một review cụ thể, bao gồm thông tin đầy đủ về user, product, order và helpfulness votes.

#### URL Parameters

| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `id` | integer | Yes | Review ID | `1` |

#### Example Request
```http
GET /api/admin/reviews/1
Authorization: Bearer {admin_token}
```

#### Example Response
```json
{
    "success": true,
    "message": "Review retrieved successfully",
    "data": {
        "id": 1,
        "rating": 5,
        "title": "Sản phẩm tuyệt vời!",
        "comment": "Cà phê rất thơm ngon, đóng gói cẩn thận. Sẽ mua lại lần sau.",
        "images": [
            "http://127.0.0.1:8000/storage/reviews/review_123.jpg",
            "http://127.0.0.1:8000/storage/reviews/review_124.jpg"
        ],
        "is_verified_purchase": true,
        "is_approved": true,
        "helpful_count": 15,
        "not_helpful_count": 2,
        "helpfulness_ratio": 88.24,
        "reviewed_at": "2024-01-15T10:30:00.000000Z",
        "created_at": "2024-01-15T10:30:00.000000Z",
        "updated_at": "2024-01-15T10:30:00.000000Z",
        "user": {
            "id": 1,
            "name": "Nguyễn Văn A",
            "email": "user@example.com",
            "full_name": "Nguyễn Văn A",
            "avatar": "http://127.0.0.1:8000/storage/avatars/user_1.jpg",
            "total_reviews": 5,
            "average_rating": 4.2
        },
        "product": {
            "id": 1,
            "name": "Cà phê Arabica Premium",
            "slug": "ca-phe-arabica-premium",
            "image": "http://127.0.0.1:8000/storage/products/product_1.jpg",
            "price": 250000,
            "brand": {
                "id": 1,
                "name": "Highland Coffee"
            },
            "average_rating": 4.5,
            "total_reviews": 25
        },
        "order": {
            "id": 1,
            "order_number": "ORD-20240115-001",
            "status": {
                "id": 5,
                "name": "Completed",
                "color": "#10B981"
            },
            "total_amount": 275000,
            "created_at": "2024-01-10T14:20:00.000000Z"
        },
        "helpfulness_votes": [
            {
                "user_id": 2,
                "user_name": "Nguyễn Thị B",
                "is_helpful": true,
                "created_at": "2024-01-16T09:15:00.000000Z"
            },
            {
                "user_id": 3,
                "user_name": "Trần Văn C",
                "is_helpful": false,
                "created_at": "2024-01-17T11:30:00.000000Z"
            }
        ]
    }
}
```

#### Error Responses
```json
{
    "success": false,
    "message": "Review not found"
}
```

---

## 📊 Response Data Structure

### Review Object
| Field | Type | Description |
|-------|------|-------------|
| `id` | integer | Review ID |
| `rating` | integer | Rating (1-5 stars) |
| `title` | string | Review title |
| `comment` | string | Review comment |
| `images` | array | Array of full image URLs |
| `is_verified_purchase` | boolean | Whether purchase is verified |
| `is_approved` | boolean | Whether review is approved |
| `helpful_count` | integer | Number of helpful votes |
| `not_helpful_count` | integer | Number of not helpful votes |
| `reviewed_at` | datetime | When review was created |
| `created_at` | datetime | Record creation time |

### User Object
| Field | Type | Description |
|-------|------|-------------|
| `id` | integer | User ID |
| `name` | string | Username |
| `email` | string | User email |
| `full_name` | string | User's full name |

### Product Object
| Field | Type | Description |
|-------|------|-------------|
| `id` | integer | Product ID |
| `name` | string | Product name |
| `slug` | string | Product slug |
| `image` | string | Product image path |

### Order Object
| Field | Type | Description |
|-------|------|-------------|
| `id` | integer | Order ID |
| `order_number` | string | Order number |
| `status` | string | Order status |

### Statistics Object
| Field | Type | Description |
|-------|------|-------------|
| `total_reviews` | integer | Total number of reviews |
| `approved_reviews` | integer | Number of approved reviews |
| `pending_reviews` | integer | Number of pending reviews |
| `average_rating` | float | Average rating across all reviews |

---

## 🔒 Security & Permissions

- **Authentication Required**: All endpoints require valid admin authentication token
- **Admin Role Required**: Only users with admin role can access these endpoints
- **Rate Limiting**: Standard API rate limits apply
- **Data Privacy**: User email addresses are included for admin management purposes

---

## 📝 Notes

- Reviews are paginated with a maximum of 50 items per page
- Search functionality covers review title, comment, user name/email, and product name
- Date filters use the review creation date (`created_at`)
- Sorting by "helpful" orders by `helpful_count` in descending order
- Images are returned as full URLs for direct access
- Verified purchases are automatically marked when review is linked to a completed order

---

## 🔗 Related APIs

- [Review Statistics API](statistics.md#6-review-statistics) - Get detailed review statistics
- [Product Management API](product_management.md) - Manage products that have reviews
- [User Management API](user_management.md) - Manage users who create reviews

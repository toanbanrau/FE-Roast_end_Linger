# 📦 Order Management API (User)

> API endpoints for user order management and checkout

## Base URL

```
/api/orders
```

## Authentication

All order endpoints require authentication via Bearer token (except promotion validation).

---

## 📋 Endpoints Overview

| Method | Endpoint                         | Description                 |
| ------ | -------------------------------- | --------------------------- |
| GET    | `/api/orders`                    | Get user's order history    |
| POST   | `/api/orders`                    | Create new order (checkout) |
| GET    | `/api/orders/{id}`               | Get order details           |
| POST   | `/api/orders/{id}/cancel`        | Cancel order                |
| POST   | `/api/orders/validate-promotion` | Validate promotion code     |

---

## 📜 Get Order History

**GET** `/api/orders`

### Headers

```json
{
    "Authorization": "Bearer {token}",
    "Content-Type": "application/json"
}
```

### Query Parameters

| Parameter      | Type    | Description                                                    |
| -------------- | ------- | -------------------------------------------------------------- |
| page           | integer | Page number (default: 1)                                       |
| per_page       | integer | Items per page (default: 10)                                   |
| status_id      | integer | Filter by order status                                         |
| payment_method | string  | Filter by payment method                                       |
| payment_status | boolean | Filter by payment status (true=paid, false=unpaid)            |

### Response Success (200)

```json
{
    "success": true,
    "message": "Orders retrieved successfully",
    "data": {
        "orders": [
            {
                "id": 1,
                "order_number": "ORD20240621143000001",
                "customer_info": {
                    "name": "Nguyễn Văn A",
                    "email": "customer@example.com",
                    "phone": "0123456789"
                },
                "delivery_info": {
                    "address": "123 Đường ABC",
                    "city": "Hà Nội",
                    "district": "Cầu Giấy",
                    "ward": "Dịch Vọng",
                    "full_address": "123 Đường ABC, Dịch Vọng, Cầu Giấy, Hà Nội"
                },
                "order_totals": {
                    "subtotal": 250000,
                    "shipping_fee": 30000,
                    "discount_amount": 25000,
                    "total_amount": 255000,
                    "formatted_total": "255,000 VNĐ"
                },
                "payment_method": "cod",
                "payment_status": false,
                "payment_status_text": "Chưa thanh toán",
                "is_paid": false,
                "status": {
                    "id": 2,
                    "name": "Confirmed",
                    "color": "#007BFF",
                    "can_be_cancelled": false
                },
                "promotion_code": "DISCOUNT10",
                "notes": "Giao hàng buổi sáng",
                "is_guest_order": false,
                "user_id": 1,
                "dates": {
                    "created_at": "2024-06-21T14:30:00.000000Z",
                    "delivery_date": null,
                    "completed_date": null,
                    "updated_at": "2024-06-21T14:35:00.000000Z"
                }
            }
        ],
        "pagination": {
            "current_page": 1,
            "last_page": 3,
            "per_page": 10,
            "total": 25,
            "from": 1,
            "to": 10
        }
    }
}
```

---

## 🛒 Create Order (Checkout)

**POST** `/api/orders`

### Headers

```json
{
    "Authorization": "Bearer {token}",
    "Content-Type": "application/json"
}
```

### 📋 **Workflow**

1. Gọi `GET /api/shipping/methods` để lấy danh sách phương thức giao hàng
2. Chọn shipping method và sử dụng `id` trong request
3. Tạo order với `shipping_method_id`

### Request Body

```json
{
    "customer_name": "Nguyễn Văn A",
    "customer_email": "customer@example.com",
    "customer_phone": "0123456789",
    "delivery_address": "123 Đường ABC",
    "city": "Hà Nội",
    "district": "Cầu Giấy",
    "ward": "Dịch Vọng",
    "payment_method": "cod",
    "shipping_method_id": 1,
    "promotion_code": "DISCOUNT10",
    "notes": "Giao hàng buổi sáng"
}
```

### Parameters

| Field              | Type    | Required | Description                                              |
| ------------------ | ------- | -------- | -------------------------------------------------------- |
| customer_name      | string  | Yes      | Customer full name (2-100 chars)                         |
| customer_email     | string  | Yes      | Customer email address                                   |
| customer_phone     | string  | Yes      | Customer phone number                                    |
| delivery_address   | string  | Yes      | Delivery address (max 500 chars)                         |
| city               | string  | No       | City name                                                |
| district           | string  | No       | District name                                            |
| ward               | string  | No       | Ward name                                                |
| payment_method     | string  | Yes      | Payment method (cod, bank_transfer, momo, vnpay, paypal) |
| shipping_method_id | integer | Yes      | Shipping method ID (get from /api/shipping/methods)      |
| promotion_code     | string  | No       | Promotion code                                           |
| notes              | string  | No       | Order notes (max 1000 chars)                             |

### Response Success (201)

```json
{
    "success": true,
    "message": "Order created successfully",
    "data": {
        "id": 1,
        "order_number": "ORD20240621143000001",
        "customer_info": {
            "name": "Nguyễn Văn A",
            "email": "customer@example.com",
            "phone": "0123456789"
        },
        "delivery_info": {
            "address": "123 Đường ABC",
            "city": "Hà Nội",
            "district": "Cầu Giấy",
            "ward": "Dịch Vọng",
            "full_address": "123 Đường ABC, Dịch Vọng, Cầu Giấy, Hà Nội"
        },
        "order_totals": {
            "subtotal": 250000,
            "shipping_fee": 30000,
            "discount_amount": 25000,
            "total_amount": 255000,
            "formatted_total": "255,000 VNĐ"
        },
        "payment_method": "cod",
        "payment_status": false,
        "payment_status_text": "Chưa thanh toán",
        "is_paid": false,
        "shipping_method": {
            "id": 1,
            "name": "Nhận tại cửa hàng",
            "code": "pickup",
            "description": "Khách hàng đến cửa hàng để nhận hàng",
            "estimated_delivery": "0 ngày"
        },
        "status": {
            "id": 1,
            "name": "Pending",
            "color": "#FFA500",
            "can_be_cancelled": true
        },
        "promotion_code": "DISCOUNT10",
        "notes": "Giao hàng buổi sáng",
        "items": [
            {
                "id": 1,
                "order_id": 1,
                "product": {
                    "id": 1,
                    "name": "Cà phê Arabica Premium",
                    "current_name": "Cà phê Arabica Premium",
                    "slug": "ca-phe-arabica-premium",
                    "image": "/storage/products/arabica-premium.jpg"
                },
                "variant": {
                    "id": 1,
                    "name": "250g - Whole Bean",
                    "current_name": "250g - Whole Bean",
                    "sku": "ARAB-250-WB",
                    "image": "/storage/variants/arabica-250g.jpg"
                },
                "full_product_info": "Cà phê Arabica Premium - 250g - Whole Bean",
                "quantity": 2,
                "unit_price": 125000,
                "total_price": 250000,
                "formatted_unit_price": "125,000 VNĐ",
                "formatted_total_price": "250,000 VNĐ",
                "product_snapshot": {
                    "product_id": 1,
                    "product_name": "Cà phê Arabica Premium",
                    "variant_id": 1,
                    "variant_name": "250g - Whole Bean",
                    "variant_sku": "ARAB-250-WB"
                }
            }
        ],
        "dates": {
            "created_at": "2024-06-21T14:30:00.000000Z",
            "delivery_date": null,
            "completed_date": null,
            "updated_at": "2024-06-21T14:30:00.000000Z"
        }
    }
}
```

### Response Error (400)

```json
{
    "success": false,
    "message": "Cart is empty"
}
```

---

## 🔍 Get Order Details

**GET** `/api/orders/{id}`

### Headers

```json
{
    "Authorization": "Bearer {token}",
    "Content-Type": "application/json"
}
```

### Response Success (200)

```json
{
    "success": true,
    "message": "Order retrieved successfully",
    "data": {
        "id": 1,
        "order_number": "ORD20240621143000001",
        "customer_info": {
            "name": "Nguyễn Văn A",
            "email": "customer@example.com",
            "phone": "0123456789"
        },
        "delivery_info": {
            "address": "123 Đường ABC",
            "city": "Hà Nội",
            "district": "Cầu Giấy",
            "ward": "Dịch Vọng",
            "full_address": "123 Đường ABC, Dịch Vọng, Cầu Giấy, Hà Nội"
        },
        "order_totals": {
            "subtotal": 250000,
            "shipping_fee": 30000,
            "discount_amount": 25000,
            "total_amount": 255000,
            "formatted_total": "255,000 VNĐ"
        },
        "payment_method": "cod",
        "payment_status": false,
        "payment_status_text": "Chưa thanh toán",
        "is_paid": false,
        "status": {
            "id": 2,
            "name": "Confirmed",
            "color": "#007BFF",
            "can_be_cancelled": false
        },
        "promotion_code": "DISCOUNT10",
        "notes": "Giao hàng buổi sáng",
        "is_guest_order": false,
        "user_id": 1,
        "items": [
            {
                "id": 1,
                "order_id": 1,
                "product": {
                    "id": 1,
                    "name": "Cà phê Arabica Premium",
                    "current_name": "Cà phê Arabica Premium",
                    "slug": "ca-phe-arabica-premium",
                    "image": "/storage/products/arabica-premium.jpg"
                },
                "variant": {
                    "id": 1,
                    "name": "250g - Whole Bean",
                    "current_name": "250g - Whole Bean",
                    "sku": "ARAB-250-WB",
                    "image": "/storage/variants/arabica-250g.jpg"
                },
                "full_product_info": "Cà phê Arabica Premium - 250g - Whole Bean",
                "quantity": 2,
                "unit_price": 125000,
                "total_price": 250000,
                "formatted_unit_price": "125,000 VNĐ",
                "formatted_total_price": "250,000 VNĐ",
                "product_snapshot": {
                    "product_id": 1,
                    "product_name": "Cà phê Arabica Premium",
                    "variant_id": 1,
                    "variant_name": "250g - Whole Bean",
                    "variant_sku": "ARAB-250-WB"
                }
            }
        ],
        "histories": [
            {
                "id": 1,
                "order_id": 1,
                "old_status": {
                    "id": 1,
                    "name": "Pending",
                    "color": "#FFA500"
                },
                "new_status": {
                    "id": 2,
                    "name": "Confirmed",
                    "color": "#007BFF"
                },
                "updated_by": {
                    "id": 1,
                    "name": "Admin User",
                    "full_name": "Admin User"
                },
                "notes": "Order confirmed by admin",
                "change_description": "Status changed from 'Pending' to 'Confirmed' by Admin User",
                "created_at": "2024-06-21T14:35:00.000000Z"
            }
        ],
        "dates": {
            "created_at": "2024-06-21T14:30:00.000000Z",
            "delivery_date": null,
            "completed_date": null,
            "updated_at": "2024-06-21T14:35:00.000000Z"
        }
    }
}
```

---

## ❌ Cancel Order

**POST** `/api/orders/{id}/cancel`

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
    "reason": "Đổi ý không muốn mua nữa"
}
```

### Response Success (200)

```json
{
    "success": true,
    "message": "Order cancelled successfully",
    "data": {
        "id": 1,
        "order_number": "ORD20240621143000001",
        "status": {
            "id": 6,
            "name": "Cancelled",
            "color": "#DC3545",
            "can_be_cancelled": false
        }
    }
}
```

### Response Error (400)

```json
{
    "success": false,
    "message": "Order cannot be cancelled in current status"
}
```

---

## 🎫 Validate Promotion Code

**POST** `/api/orders/validate-promotion`

### Headers

```json
{
    "Content-Type": "application/json"
}
```

### Request Body

```json
{
    "promotion_code": "DISCOUNT10",
    "order_value": 250000
}
```

### Response Success (200)

```json
{
    "success": true,
    "message": "Promotion code is valid",
    "data": {
        "valid": true,
        "discount_amount": 25000,
        "formatted_discount": "25,000 VNĐ",
        "promotion": {
            "id": 1,
            "promotion_name": "Giảm giá 10%",
            "promotion_code": "DISCOUNT10",
            "discount_type": "percentage",
            "discount_value": 10,
            "minimum_order_value": 100000,
            "maximum_discount_amount": 50000
        }
    }
}
```

### Response Error (400)

```json
{
    "success": false,
    "message": "Minimum order value is 100,000 VNĐ",
    "data": {
        "valid": false
    }
}
```

---

## 🚨 Error Responses

### Validation Error (422)

```json
{
    "message": "The given data was invalid.",
    "errors": {
        "customer_name": ["The customer name field is required."],
        "customer_email": ["The customer email must be a valid email address."]
    }
}
```

### Unauthorized (403)

```json
{
    "success": false,
    "message": "Unauthorized to view this order"
}
```

### Not Found (404)

```json
{
    "success": false,
    "message": "Order not found"
}
```

---

## 📝 Notes

1. **Order Creation**: Requires non-empty cart and valid customer information
2. **Stock Management**: Stock is automatically reduced when order is created
3. **Cancellation**: Only orders in "Pending" status can be cancelled by users
4. **Guest Orders**: Guest users can create orders but cannot view order history
5. **Promotion Codes**: Validated in real-time during checkout
6. **Payment Methods**: Currently supports COD, bank transfer, MoMo, VNPay, and PayPal
7. **Shipping Fee**: Free shipping for orders ≥ 500,000 VNĐ, otherwise 30,000 VNĐ
# 📦 Order Management API (Admin)

> API endpoints for admin order management and monitoring

## Base URL

```
/api/admin/orders
```

## Authentication

All admin endpoints require authentication via Bearer token with admin role.

---

## 📋 Endpoints Overview

| Method | Endpoint                        | Description                 |
| ------ | ------------------------------- | --------------------------- |
| GET    | `/api/admin/orders`             | Get all orders with filters |
| GET    | `/api/admin/orders/statistics`  | Get order statistics        |
| GET    | `/api/admin/orders/{id}`        | Get order details           |
| PATCH  | `/api/admin/orders/{id}/status` | Update order status         |

---

## 📜 Get All Orders

**GET** `/api/admin/orders`

### Headers

```json
{
    "Authorization": "Bearer {admin_token}",
    "Content-Type": "application/json"
}
```

### Query Parameters

| Parameter      | Type    | Description                                          |
| -------------- | ------- | ---------------------------------------------------- |
| page           | integer | Page number (default: 1)                             |
| per_page       | integer | Items per page (default: 15)                         |
| search         | string  | Search by order number, name, email, phone           |
| status_id      | integer | Filter by order status                               |
| payment_method | string  | Filter by payment method                             |
| payment_status | boolean | Filter by payment status (true=paid, false=unpaid)  |
| date_from      | string  | From date (Y-m-d format)                             |
| date_to        | string  | To date (Y-m-d format)                               |
| sort_by        | string  | Sort field (default: created_at)                     |
| sort_direction | string  | Sort direction: asc/desc (default: desc)             |

### Example Request

```
GET /api/admin/orders?page=1&per_page=15&search=ORD123&status_id=1&payment_status=true&date_from=2024-01-01&date_to=2024-12-31&sort_by=total_amount&sort_direction=desc
```

### Response Success (200)

```json
{
    "success": true,
    "message": "Orders retrieved successfully",
    "data": {
        "orders": [
            {
                "id": 1,
                "order_number": "ORD20240621143000001",
                "customer_info": {
                    "name": "Nguyễn Văn A",
                    "email": "customer@example.com",
                    "phone": "0123456789"
                },
                "delivery_info": {
                    "address": "123 Đường ABC",
                    "city": "Hà Nội",
                    "district": "Cầu Giấy",
                    "ward": "Dịch Vọng",
                    "full_address": "123 Đường ABC, Dịch Vọng, Cầu Giấy, Hà Nội"
                },
                "order_totals": {
                    "subtotal": 250000,
                    "shipping_fee": 30000,
                    "discount_amount": 25000,
                    "total_amount": 255000,
                    "formatted_total": "255,000 VNĐ"
                },
                "payment_method": "cod",
                "payment_status": false,
                "payment_status_text": "Chưa thanh toán",
                "is_paid": false,
                "shipping_method": {
                    "id": 1,
                    "name": "Nhận tại cửa hàng",
                    "code": "pickup",
                    "description": "Khách hàng đến cửa hàng để nhận hàng",
                    "estimated_delivery": "0 ngày"
                },
                "status": {
                    "id": 1,
                    "name": "Pending",
                    "color": "#FFA500",
                    "can_be_cancelled": true
                },
                "promotion_code": "DISCOUNT10",
                "notes": "Giao hàng buổi sáng",
                "is_guest_order": false,
                "user_id": 1,
                "dates": {
                    "created_at": "2024-06-21T14:30:00.000000Z",
                    "delivery_date": null,
                    "completed_date": null,
                    "updated_at": "2024-06-21T14:30:00.000000Z"
                }
            }
        ],
        "pagination": {
            "current_page": 1,
            "last_page": 10,
            "per_page": 15,
            "total": 150,
            "from": 1,
            "to": 15
        },
        "filters": {
            "search": "ORD123",
            "status_id": 1,
            "payment_method": null,
            "date_from": "2024-01-01",
            "date_to": "2024-12-31",
            "sort_by": "total_amount",
            "sort_direction": "desc"
        },
        "statistics": {
            "total_orders": 150,
            "total_revenue": 38500000,
            "average_order_value": 256666.67,
            "orders_by_status": {
                "Pending": 25,
                "Confirmed": 30,
                "Processing": 20,
                "Shipping": 15,
                "Delivered": 50,
                "Cancelled": 10
            }
        }
    }
}
```

---

## 📊 Get Order Statistics

**GET** `/api/admin/orders/statistics`

### Headers

```json
{
    "Authorization": "Bearer {admin_token}",
    "Content-Type": "application/json"
}
```

### Query Parameters

| Parameter | Type   | Description                           |
| --------- | ------ | ------------------------------------- |
| period    | string | Time period: today, week, month, year |
| date_from | string | Custom from date (Y-m-d format)       |
| date_to   | string | Custom to date (Y-m-d format)         |

### Response Success (200)

```json
{
    "success": true,
    "message": "Order statistics retrieved successfully",
    "data": {
        "summary": {
            "total_orders": 150,
            "total_revenue": 38500000,
            "formatted_total_revenue": "38,500,000 VND",
            "average_order_value": 256666.67,
            "formatted_average_order_value": "256,667 VND",
            "total_items_sold": 450
        },
        "by_status": [
            {
                "status_name": "Pending",
                "count": 25,
                "revenue": 6250000,
                "formatted_revenue": "6,250,000 VND"
            },
            {
                "status_name": "Confirmed",
                "count": 30,
                "revenue": 7500000,
                "formatted_revenue": "7,500,000 VND"
            },
            {
                "status_name": "Delivered",
                "count": 50,
                "revenue": 15000000,
                "formatted_revenue": "15,000,000 VND"
            }
        ],
        "by_payment_method": [
            {
                "payment_method": "cod",
                "count": 100,
                "revenue": 25000000,
                "formatted_revenue": "25,000,000 VND"
            },
            {
                "payment_method": "bank_transfer",
                "count": 30,
                "revenue": 8500000,
                "formatted_revenue": "8,500,000 VND"
            },
            {
                "payment_method": "momo",
                "count": 20,
                "revenue": 5000000,
                "formatted_revenue": "5,000,000 VND"
            }
        ],
        "revenue_chart": [
            {
                "date": "2024-06-01",
                "revenue": 1250000,
                "formatted_revenue": "1,250,000 VND",
                "orders": 5
            },
            {
                "date": "2024-06-02",
                "revenue": 2100000,
                "formatted_revenue": "2,100,000 VND",
                "orders": 8
            }
        ],
        "date_range": {
            "from": "2024-06-01T00:00:00.000000Z",
            "to": "2024-06-30T23:59:59.000000Z"
        }
    }
}
```

---

## 🔍 Get Order Details

**GET** `/api/admin/orders/{id}`

### Headers

```json
{
    "Authorization": "Bearer {admin_token}",
    "Content-Type": "application/json"
}
```

### Response Success (200)

```json
{
    "success": true,
    "message": "Order retrieved successfully",
    "data": {
        "id": 1,
        "order_number": "ORD20240621143000001",
        "customer_info": {
            "name": "Nguyễn Văn A",
            "email": "customer@example.com",
            "phone": "0123456789"
        },
        "delivery_info": {
            "address": "123 Đường ABC",
            "city": "Hà Nội",
            "district": "Cầu Giấy",
            "ward": "Dịch Vọng",
            "full_address": "123 Đường ABC, Dịch Vọng, Cầu Giấy, Hà Nội"
        },
        "order_totals": {
            "subtotal": 250000,
            "shipping_fee": 30000,
            "discount_amount": 25000,
            "total_amount": 255000,
            "formatted_total": "255,000 VNĐ"
        },
        "payment_method": "cod",
        "payment_status": false,
        "payment_status_text": "Chưa thanh toán",
        "is_paid": false,
        "shipping_method": {
            "id": 1,
            "name": "Nhận tại cửa hàng",
            "code": "pickup",
            "description": "Khách hàng đến cửa hàng để nhận hàng",
            "estimated_delivery": "0 ngày"
        },
        "status": {
            "id": 1,
            "name": "Pending",
            "color": "#FFA500",
            "can_be_cancelled": true
        },
        "promotion_code": "DISCOUNT10",
        "notes": "Giao hàng buổi sáng",
        "is_guest_order": false,
        "user_id": 1,
        "items": [
            {
                "id": 1,
                "order_id": 1,
                "product": {
                    "id": 1,
                    "name": "Cà phê Arabica Premium",
                    "current_name": "Cà phê Arabica Premium",
                    "slug": "ca-phe-arabica-premium",
                    "image": "/storage/products/arabica-premium.jpg"
                },
                "variant": {
                    "id": 1,
                    "name": "250g - Whole Bean",
                    "current_name": "250g - Whole Bean",
                    "sku": "ARAB-250-WB",
                    "image": "/storage/variants/arabica-250g.jpg"
                },
                "full_product_info": "Cà phê Arabica Premium - 250g - Whole Bean",
                "quantity": 2,
                "unit_price": 125000,
                "total_price": 250000,
                "formatted_unit_price": "125,000 VNĐ",
                "formatted_total_price": "250,000 VNĐ",
                "product_snapshot": {
                    "product_id": 1,
                    "product_name": "Cà phê Arabica Premium",
                    "variant_id": 1,
                    "variant_name": "250g - Whole Bean",
                    "variant_sku": "ARAB-250-WB"
                }
            }
        ],
        "histories": [
            {
                "id": 2,
                "order_id": 1,
                "old_status": {
                    "id": 1,
                    "name": "Pending",
                    "color": "#FFA500"
                },
                "new_status": {
                    "id": 2,
                    "name": "Confirmed",
                    "color": "#007BFF"
                },
                "updated_by": {
                    "id": 1,
                    "name": "Admin User",
                    "full_name": "Admin User"
                },
                "notes": "Order confirmed by admin",
                "change_description": "Status changed from 'Pending' to 'Confirmed' by Admin User",
                "created_at": "2024-06-21T14:35:00.000000Z"
            },
            {
                "id": 1,
                "order_id": 1,
                "old_status": {
                    "id": null,
                    "name": null,
                    "color": null
                },
                "new_status": {
                    "id": 1,
                    "name": "Pending",
                    "color": "#FFA500"
                },
                "updated_by": {
                    "id": null,
                    "name": "System",
                    "full_name": null
                },
                "notes": "Order created",
                "change_description": "Status changed from 'None' to 'Pending' by System",
                "created_at": "2024-06-21T14:30:00.000000Z"
            }
        ],
        "dates": {
            "created_at": "2024-06-21T14:30:00.000000Z",
            "delivery_date": null,
            "completed_date": null,
            "updated_at": "2024-06-21T14:35:00.000000Z"
        }
    }
}
```

---

## ✏️ Update Order Status

**PATCH** `/api/admin/orders/{id}/status`

### Headers

```json
{
    "Authorization": "Bearer {admin_token}",
    "Content-Type": "application/json"
}
```

### Request Body

```json
{
    "status_id": 2,
    "notes": "Order confirmed and ready for processing"
}
```

### Parameters

| Field     | Type    | Required | Description                                |
| --------- | ------- | -------- | ------------------------------------------ |
| status_id | integer | Yes      | New order status ID                        |
| notes     | string  | No       | Notes about status change (max 1000 chars) |

### Response Success (200)

```json
{
    "success": true,
    "message": "Order status updated successfully",
    "data": {
        "id": 1,
        "order_number": "ORD20240621143000001",
        "status": {
            "id": 2,
            "name": "Confirmed",
            "color": "#007BFF",
            "can_be_cancelled": false
        },
        "histories": [
            {
                "id": 2,
                "order_id": 1,
                "old_status": {
                    "id": 1,
                    "name": "Pending",
                    "color": "#FFA500"
                },
                "new_status": {
                    "id": 2,
                    "name": "Confirmed",
                    "color": "#007BFF"
                },
                "updated_by": {
                    "id": 1,
                    "name": "Admin User",
                    "full_name": "Admin User"
                },
                "notes": "Order confirmed and ready for processing",
                "change_description": "Status changed from 'Pending' to 'Confirmed' by Admin User",
                "created_at": "2024-06-21T14:35:00.000000Z"
            }
        ]
    }
}
```

### Response Error (400)

```json
{
    "success": false,
    "message": "Order is already in this status"
}
```

---

## 🚨 Error Responses

### Validation Error (422)

```json
{
    "message": "The given data was invalid.",
    "errors": {
        "status_id": ["The status id field is required."],
        "notes": ["The notes may not be greater than 1000 characters."]
    }
}
```

### Unauthorized (401)

```json
{
    "message": "Unauthenticated."
}
```

### Forbidden (403)

```json
{
    "message": "This action is unauthorized."
}
```

### Not Found (404)

```json
{
    "success": false,
    "message": "Order not found"
}
```

---

## 📝 Notes

1. **Admin Access**: All endpoints require admin authentication
2. **Order Filtering**: Supports multiple filter combinations for efficient order management
3. **Status Updates**: Automatically creates order history entries when status changes
4. **Statistics**: Real-time statistics with customizable date ranges
5. **Search**: Full-text search across order number, customer name, email, and phone
6. **Sorting**: Flexible sorting by any order field
7. **Pagination**: Efficient pagination for large order datasets
8. **Export**: Consider implementing CSV/Excel export for order data
9. **Notifications**: Consider implementing email/SMS notifications for status changes

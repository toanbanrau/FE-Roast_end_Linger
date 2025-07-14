# 🏠 Address Management API

> Comprehensive user address management system with GPS support

## Base URL

```
/api/user/addresses
```

---

## 📋 Endpoints Overview

| Method | Endpoint                               | Auth | Description         |
| ------ | -------------------------------------- | ---- | ------------------- |
| GET    | `/api/user/addresses`                  | Yes  | List user addresses |
| POST   | `/api/user/addresses`                  | Yes  | Add new address     |
| GET    | `/api/user/addresses/{id}`             | Yes  | Get address details |
| PUT    | `/api/user/addresses/{id}`             | Yes  | Update address      |
| DELETE | `/api/user/addresses/{id}`             | Yes  | Delete address      |
| POST   | `/api/user/addresses/{id}/set-default` | Yes  | Set default address |

---

## 📋 List User Addresses

**GET** `/api/user/addresses`

### Headers

```json
{
    "Authorization": "Bearer {token}",
    "Content-Type": "application/json"
}
```

### Query Parameters

| Parameter | Type   | Description    | Example  |
| --------- | ------ | -------------- | -------- |
| type      | string | Filter by type | `home`   |
| city      | string | Filter by city | `Hà Nội` |

### Response Success (200)

```json
{
    "success": true,
    "message": "Addresses retrieved successfully",
    "data": [
        {
            "id": 1,
            "label": "Nhà riêng",
            "recipient_name": "John Doe",
            "phone_number": "0123456789",
            "address_line_1": "123 Nguyễn Trãi",
            "address_line_2": "Tầng 5",
            "ward": "Phường Thanh Xuân",
            "district": "Thanh Xuân",
            "city": "Hà Nội",
            "postal_code": "100000",
            "latitude": 21.0285,
            "longitude": 105.8542,
            "is_default": true,
            "type": "home",
            "type_display": "Nhà riêng",
            "type_icon": "🏠",
            "display_label": "Nhà riêng",
            "delivery_notes": "Gọi trước khi giao",
            "full_address": "123 Nguyễn Trãi, Tầng 5, Phường Thanh Xuân, Thanh Xuân, Hà Nội",
            "formatted_address": "John Doe\n0123456789\n123 Nguyễn Trãi, Tầng 5, Phường Thanh Xuân, Thanh Xuân, Hà Nội",
            "has_coordinates": true,
            "is_complete": true,
            "available_shipping_methods": [
                {
                    "id": 1,
                    "name": "Giao hàng tiêu chuẩn",
                    "cost": 30000,
                    "estimated_delivery": "2-3 ngày"
                }
            ],
            "created_at": "2024-06-22T10:30:00.000000Z"
        }
    ]
}
```

---

## ➕ Add New Address

**POST** `/api/user/addresses`

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
    "label": "Văn phòng",
    "recipient_name": "John Doe",
    "phone_number": "0123456789",
    "address_line_1": "456 Lê Duẩn",
    "address_line_2": "Tòa nhà ABC, Tầng 10",
    "ward": "Phường Đống Đa",
    "district": "Đống Đa",
    "city": "Hà Nội",
    "postal_code": "100000",
    "latitude": 21.0285,
    "longitude": 105.8542,
    "type": "office",
    "delivery_notes": "Liên hệ lễ tân tầng 1",
    "is_default": false
}
```

### Parameters

| Field          | Type    | Required | Description                      |
| -------------- | ------- | -------- | -------------------------------- |
| label          | string  | No       | Custom label for address         |
| recipient_name | string  | Yes      | Recipient full name              |
| phone_number   | string  | Yes      | Contact phone number             |
| address_line_1 | string  | Yes      | Main address line                |
| address_line_2 | string  | No       | Additional address info          |
| ward           | string  | Yes      | Ward/Commune                     |
| district       | string  | Yes      | District                         |
| city           | string  | Yes      | City/Province                    |
| postal_code    | string  | No       | Postal/ZIP code                  |
| latitude       | decimal | No       | GPS latitude                     |
| longitude      | decimal | No       | GPS longitude                    |
| type           | string  | No       | Address type (home/office/other) |
| delivery_notes | string  | No       | Special delivery instructions    |
| is_default     | boolean | No       | Set as default address           |

### Response Success (201)

```json
{
    "success": true,
    "message": "Address created successfully",
    "data": {
        "id": 2,
        "label": "Văn phòng",
        "recipient_name": "John Doe",
        "phone_number": "0123456789",
        "address_line_1": "456 Lê Duẩn",
        "address_line_2": "Tòa nhà ABC, Tầng 10",
        "ward": "Phường Đống Đa",
        "district": "Đống Đa",
        "city": "Hà Nội",
        "postal_code": "100000",
        "latitude": 21.0285,
        "longitude": 105.8542,
        "is_default": false,
        "type": "office",
        "type_display": "Văn phòng",
        "type_icon": "🏢",
        "display_label": "Văn phòng",
        "delivery_notes": "Liên hệ lễ tân tầng 1",
        "full_address": "456 Lê Duẩn, Tòa nhà ABC, Tầng 10, Phường Đống Đa, Đống Đa, Hà Nội",
        "has_coordinates": true,
        "is_complete": true,
        "created_at": "2024-06-22T14:30:00.000000Z"
    }
}
```

---

## 🏠 Get Address Details

**GET** `/api/user/addresses/{id}`

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
    "message": "Address retrieved successfully",
    "data": {
        "id": 1,
        "label": "Nhà riêng",
        "recipient_name": "John Doe",
        "phone_number": "0123456789",
        "address_line_1": "123 Nguyễn Trãi",
        "address_line_2": "Tầng 5",
        "ward": "Phường Thanh Xuân",
        "district": "Thanh Xuân",
        "city": "Hà Nội",
        "postal_code": "100000",
        "latitude": 21.0285,
        "longitude": 105.8542,
        "is_default": true,
        "type": "home",
        "type_display": "Nhà riêng",
        "type_icon": "🏠",
        "display_label": "Nhà riêng",
        "delivery_notes": "Gọi trước khi giao",
        "full_address": "123 Nguyễn Trãi, Tầng 5, Phường Thanh Xuân, Thanh Xuân, Hà Nội",
        "formatted_address": "John Doe\n0123456789\n123 Nguyễn Trãi, Tầng 5, Phường Thanh Xuân, Thanh Xuân, Hà Nội",
        "has_coordinates": true,
        "is_complete": true,
        "missing_fields": [],
        "available_shipping_methods": [
            {
                "id": 1,
                "name": "Giao hàng tiêu chuẩn",
                "cost": 30000,
                "estimated_delivery": "2-3 ngày"
            },
            {
                "id": 2,
                "name": "Giao hàng nhanh",
                "cost": 50000,
                "estimated_delivery": "1-2 ngày"
            }
        ],
        "created_at": "2024-06-22T10:30:00.000000Z",
        "updated_at": "2024-06-22T10:30:00.000000Z"
    }
}
```

---

## ✏️ Update Address

**PUT** `/api/user/addresses/{id}`

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
    "label": "Nhà mới",
    "recipient_name": "John Doe",
    "phone_number": "0987654321",
    "address_line_1": "789 Hoàng Quốc Việt",
    "delivery_notes": "Gọi trước 30 phút"
}
```

### Business Rules

-   ✅ Only address owner can update
-   ✅ All fields are optional
-   ✅ Partial updates supported
-   ✅ Validation on required fields

### Response Success (200)

```json
{
    "success": true,
    "message": "Address updated successfully",
    "data": {
        "id": 1,
        "label": "Nhà mới",
        "recipient_name": "John Doe",
        "phone_number": "0987654321",
        "address_line_1": "789 Hoàng Quốc Việt",
        "delivery_notes": "Gọi trước 30 phút",
        "updated_at": "2024-06-22T15:00:00.000000Z"
    }
}
```

---

## 🎯 Set Default Address

**POST** `/api/user/addresses/{id}/set-default`

### Headers

```json
{
    "Authorization": "Bearer {token}",
    "Content-Type": "application/json"
}
```

### Business Rules

-   ✅ Only one default address per user
-   ✅ Previous default automatically unset
-   ✅ First address auto-set as default

### Response Success (200)

```json
{
    "success": true,
    "message": "Default address updated successfully",
    "data": {
        "id": 2,
        "is_default": true,
        "updated_at": "2024-06-22T15:30:00.000000Z"
    }
}
```

---

## 🗑️ Delete Address

**DELETE** `/api/user/addresses/{id}`

### Headers

```json
{
    "Authorization": "Bearer {token}",
    "Content-Type": "application/json"
}
```

### Business Rules

-   ✅ Only address owner can delete
-   ✅ Cannot delete if used in pending orders
-   ✅ If default deleted, next address becomes default

### Response Success (200)

```json
{
    "success": true,
    "message": "Address deleted successfully",
    "data": null
}
```

### Response Error (400)

```json
{
    "success": false,
    "message": "Cannot delete address used in pending orders"
}
```

---

## 🏷️ Address Types

| Type     | Display   | Icon | Description              |
| -------- | --------- | ---- | ------------------------ |
| `home`   | Nhà riêng | 🏠   | Residential address      |
| `office` | Văn phòng | 🏢   | Office/workplace address |
| `other`  | Khác      | 📍   | Other address type       |

---

## 🗺️ GPS Integration

### **Coordinate System**

-   ✅ WGS84 coordinate system
-   ✅ Decimal degrees format
-   ✅ 8 decimal places precision
-   ✅ Vietnam coordinate bounds validation

### **Distance Calculation**

```php
// Calculate distance between addresses
$distance = $address1->distanceTo($address2); // Returns km

// Get nearby addresses
$nearbyAddresses = UserAddress::where('city', $address->city)
    ->where('district', $address->district)
    ->get();
```

### **Map Integration Ready**

-   Google Maps API
-   OpenStreetMap
-   Vietnam specific map services
-   Geocoding services

---

## 🚚 Shipping Integration

### **Available Shipping Methods**

```php
// Get shipping methods for address
$shippingMethods = $address->getAvailableShippingMethods();

// Returns array of available methods with costs
[
    [
        'id' => 1,
        'name' => 'Giao hàng tiêu chuẩn',
        'cost' => 30000,
        'estimated_delivery' => '2-3 ngày'
    ]
]
```

### **Address Validation**

-   ✅ Required field validation
-   ✅ Phone number format validation
-   ✅ City/District/Ward validation
-   ✅ Coordinate bounds checking

---

## 🔒 Security & Privacy

### **Access Control**

-   ✅ Users can only access their own addresses
-   ✅ Address ID validation
-   ✅ Ownership verification

### **Data Protection**

-   ✅ Personal information encryption
-   ✅ GPS coordinate protection
-   ✅ Phone number masking in logs
-   ✅ GDPR compliance ready

---

## 📊 Analytics & Insights

### **Address Usage**

-   Most used address types
-   Geographic distribution
-   Delivery success rates by area
-   Popular delivery locations

### **Business Intelligence**

-   Customer location patterns
-   Shipping cost optimization
-   Service area expansion
-   Delivery route planning

---

## 🧪 Testing Examples

### **cURL Examples**

#### List Addresses

```bash
curl -X GET "http://localhost:8000/api/user/addresses" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"
```

#### Create Address

```bash
curl -X POST "http://localhost:8000/api/user/addresses" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "label": "Nhà riêng",
    "recipient_name": "Nguyễn Văn A",
    "phone_number": "0123456789",
    "address_line_1": "123 Nguyễn Trãi",
    "ward": "Phường Thanh Xuân",
    "district": "Thanh Xuân",
    "city": "Hà Nội",
    "type": "home"
  }'
```

#### Set Default Address

```bash
curl -X POST "http://localhost:8000/api/user/addresses/1/set-default" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"
```

### **JavaScript/Fetch Examples**

#### Get Addresses

```javascript
const response = await fetch("/api/user/addresses", {
    method: "GET",
    headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
    },
});
const data = await response.json();
```

#### Update Address

```javascript
const response = await fetch(`/api/user/addresses/${addressId}`, {
    method: "PUT",
    headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
    },
    body: JSON.stringify({
        label: "Văn phòng mới",
        delivery_notes: "Gọi trước 15 phút",
    }),
});
```

---

## ❌ Error Responses

### **Validation Error (422)**

```json
{
    "success": false,
    "message": "Validation failed",
    "errors": {
        "recipient_name": ["The recipient name field is required."],
        "phone_number": ["The phone number field is required."],
        "address_line_1": ["The address line 1 field is required."]
    }
}
```

### **Not Found (404)**

```json
{
    "success": false,
    "message": "Address not found"
}
```

### **Unauthorized (401)**

```json
{
    "success": false,
    "message": "Unauthenticated"
}
```

### **Forbidden (403)**

```json
{
    "success": false,
    "message": "You don't have permission to access this address"
}
```

---

## 📱 Frontend Integration

### **React Hook Example**

```javascript
import { useState, useEffect } from "react";

const useUserAddresses = () => {
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchAddresses = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/user/addresses", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) throw new Error("Failed to fetch addresses");

            const data = await response.json();
            setAddresses(data.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const addAddress = async (addressData) => {
        try {
            const response = await fetch("/api/user/addresses", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(addressData),
            });

            if (!response.ok) throw new Error("Failed to add address");

            const data = await response.json();
            setAddresses((prev) => [...prev, data.data]);
            return data.data;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const setDefaultAddress = async (addressId) => {
        try {
            const response = await fetch(
                `/api/user/addresses/${addressId}/set-default`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!response.ok) throw new Error("Failed to set default address");

            // Update local state
            setAddresses((prev) =>
                prev.map((addr) => ({
                    ...addr,
                    is_default: addr.id === addressId,
                }))
            );
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    useEffect(() => {
        fetchAddresses();
    }, []);

    return {
        addresses,
        loading,
        error,
        fetchAddresses,
        addAddress,
        setDefaultAddress,
    };
};
```

---

## 🔧 Development Notes

### **Database Schema**

```sql
CREATE TABLE user_addresses (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    label VARCHAR(255),
    recipient_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    address_line_1 VARCHAR(500) NOT NULL,
    address_line_2 VARCHAR(500),
    ward VARCHAR(255) NOT NULL,
    district VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    postal_code VARCHAR(20),
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    is_default BOOLEAN DEFAULT FALSE,
    type ENUM('home', 'office', 'other') DEFAULT 'home',
    delivery_notes TEXT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_default (user_id, is_default),
    INDEX idx_coordinates (latitude, longitude)
);
```

### **Model Relationships**

-   `User` hasMany `UserAddress`
-   `UserAddress` belongsTo `User`
-   `Order` belongsTo `UserAddress` (delivery_address_id)

---

## 🚀 Performance Tips

1. **Pagination**: For users with many addresses, implement pagination
2. **Caching**: Cache frequently accessed addresses
3. **Indexing**: Database indexes on user_id and coordinates
4. **Lazy Loading**: Load shipping methods only when needed
5. **Validation**: Client-side validation for better UX

---

## 🌟 Best Practices

1. **Always validate coordinates** if provided
2. **Sanitize address inputs** to prevent XSS
3. **Implement rate limiting** for address creation
4. **Log address changes** for audit trails
5. **Backup address data** regularly
6. **Test with real Vietnamese addresses**

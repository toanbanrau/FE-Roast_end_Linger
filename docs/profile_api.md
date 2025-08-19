# 📦 Order Delivery Confirmation API

> API for customers to confirm receipt of delivered orders

## Base URL
```
/api/orders/{orderId}/confirm-delivery
```

---

## 📋 Overview

This API allows customers to confirm that they have received their delivered orders, automatically changing the order status from **"Delivered"** to **"Completed"**.

### Workflow
```
Delivered → [Customer Confirms] → Completed
     ↓
[Auto after 3 days] → Completed
```

---

## ✅ Confirm Delivery

**POST** `/api/orders/{orderId}/confirm-delivery`

### Headers
```json
{
  "Authorization": "Bearer {token}",
  "Content-Type": "application/json"
}
```

### URL Parameters
- `orderId` (integer, required): ID of the order to confirm delivery

### Response Success (200)
```json
{
  "success": true,
  "message": "Đã xác nhận nhận hàng thành công",
  "data": {
    "order": {
      "id": 1,
      "order_number": "ORD-20240101-001",
      "customer_name": "Nguyễn Văn A",
      "customer_email": "user@example.com",
      "customer_phone": "0123456789",
      "total_amount": "500000.00",
      "status": {
        "id": 6,
        "status_name": "Completed",
        "description": "Order has been completed and finalized",
        "color": "#20C997"
      },
      "completed_date": "2024-01-15T10:30:00.000000Z",
      "created_at": "2024-01-10T09:00:00.000000Z",
      "updated_at": "2024-01-15T10:30:00.000000Z"
    }
  }
}
```

### Response Error - Wrong Status (400)
```json
{
  "success": false,
  "message": "Đơn hàng chưa ở trạng thái đã giao hàng",
  "current_status": "Shipping"
}
```

### Response Error - Unauthorized (403)
```json
{
  "success": false,
  "message": "Bạn không có quyền thực hiện hành động này"
}
```

### Response Error - Not Found (404)
```json
{
  "success": false,
  "message": "Không tìm thấy đơn hàng"
}
```

### Response Error - Server Error (500)
```json
{
  "success": false,
  "message": "Xác nhận nhận hàng thất bại",
  "error": "Error details..."
}
```

---

## 🤖 Auto-Completion System

### Automatic Processing
Orders in **"Delivered"** status are automatically moved to **"Completed"** after **3 days** if the customer doesn't manually confirm.

### Schedule
- **Runs**: Daily at 3:00 AM
- **Command**: `php artisan orders:auto-complete-delivered --days=3`
- **Process**:
    1. Find orders with "Delivered" status older than 3 days
    2. Update status to "Completed"
    3. Set `completed_date`
    4. Create order history record

### Manual Command Usage
```bash
# Auto-complete orders delivered more than 3 days ago
php artisan orders:auto-complete-delivered

# Custom number of days
php artisan orders:auto-complete-delivered --days=5

# Dry run (show what would be updated without updating)
php artisan orders:auto-complete-delivered --dry-run
```

---

## 📝 Business Rules

### Status Requirements
- Order must be in **"Delivered"** status
- Only the order owner can confirm delivery
- Cannot confirm delivery for orders in other statuses

### Effects of Confirmation
1. **Status Change**: Delivered → Completed
2. **Timestamp**: Sets `completed_date` to current time
3. **History**: Creates order history record
4. **Finalization**: Order becomes final (no further changes allowed)

### Auto-Completion Rules
- **Trigger**: 3 days after order status changed to "Delivered"
- **Frequency**: Daily check at 3:00 AM
- **Safety**: Only processes orders that haven't been manually completed
- **Logging**: Creates system history record for tracking

---

## 🔧 Usage Examples

### Confirm Delivery
```javascript
fetch('/api/orders/123/confirm-delivery', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + token,
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => {
  if (data.success) {
    console.log('Order completed:', data.data.order);
    // Update UI to show completed status
    // Hide "Confirm Delivery" button
    // Show "Order Completed" message
  } else {
    console.error('Error:', data.message);
  }
});
```

### Check Order Status Before Showing Button
```javascript
// Only show "Confirm Delivery" button for delivered orders
if (order.status.status_name === 'Delivered') {
  showConfirmDeliveryButton();
} else if (order.status.status_name === 'Completed') {
  showOrderCompletedMessage();
}
```

---

## 📊 Order Status Flow

```
1. Pending     → Order placed, waiting confirmation
2. Confirmed   → Order confirmed, being prepared  
3. Processing  → Order being processed for shipping
4. Shipping    → Order shipped, on the way
5. Delivered   → Order delivered to customer
   ↓
   [Customer confirms OR 3 days pass]
   ↓
6. Completed   → Order finalized, can be reviewed
```

---

## 🚨 Important Notes

1. **One-Way Action**: Once confirmed, cannot be reversed
2. **Auto-Completion**: System automatically completes after 3 days
3. **Order History**: All status changes are logged
4. **Customer Reviews**: Only completed orders can be reviewed
5. **Final Status**: Completed orders cannot be modified further

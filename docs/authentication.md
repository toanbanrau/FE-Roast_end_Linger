# 📊 Admin Statistics Dashboard API

> Comprehensive dashboard statistics API for admin panel with real-time data and analytics

## Base URL
```
/api/admin/statistics/dashboard
```

---

## 📋 Overview

This API provides comprehensive dashboard statistics for admin panel including:
- **Overview metrics**: Revenue, orders, customers, products
- **Growth rates**: Comparison with previous period
- **Charts data**: Revenue trends, order distribution, top categories
- **Recent stats**: Today, this week, this month snapshots

---

## 📈 Get Dashboard Statistics

**GET** `/api/admin/statistics/dashboard`

### Headers
```json
{
  "Authorization": "Bearer {admin_token}",
  "Content-Type": "application/json"
}
```

### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `period` | string | No | `month` | Time period: `today`, `week`, `month`, `year`, `custom` |
| `start_date` | string | Conditional | - | Start date (Y-m-d). Required if `period=custom` |
| `end_date` | string | Conditional | - | End date (Y-m-d). Required if `period=custom` |
| `include_charts` | boolean | No | `true` | Include chart data in response |
| `timezone` | string | No | `UTC` | Timezone for calculations (e.g., `Asia/Ho_Chi_Minh`) |

### Response Success (200)

```json
{
  "success": true,
  "message": "Dashboard statistics retrieved successfully",
  "data": {
    "overview": {
      "total_revenue": "15000000.00",
      "total_orders": 150,
      "total_customers": 89,
      "total_products": 45,
      "average_order_value": "100000.00"
    },
    "growth": {
      "revenue_growth": 15.5,
      "orders_growth": 8.2,
      "customers_growth": 12.1,
      "products_growth": 2.3
    },
    "recent_stats": {
      "today": {
        "revenue": "500000.00",
        "orders": 5,
        "users": 3
      },
      "this_week": {
        "revenue": "2500000.00",
        "orders": 25,
        "users": 18
      },
      "this_month": {
        "revenue": "15000000.00",
        "orders": 150,
        "users": 89
      }
    },
    "charts": {
      "revenue_trend": [
        {
          "date": "2024-01-01",
          "revenue": "450000.00",
          "orders": 4
        },
        {
          "date": "2024-01-02",
          "revenue": "680000.00",
          "orders": 6
        }
      ],
      "order_status_distribution": [
        {
          "status": "Completed",
          "count": 120,
          "percentage": 80.0,
          "color": "#28A745"
        },
        {
          "status": "Pending",
          "count": 20,
          "percentage": 13.3,
          "color": "#FFA500"
        },
        {
          "status": "Cancelled",
          "count": 10,
          "percentage": 6.7,
          "color": "#DC3545"
        }
      ],
      "top_categories": [
        {
          "category_id": 1,
          "category_name": "Coffee Beans",
          "revenue": "8000000.00",
          "orders": 80,
          "percentage": 53.3
        },
        {
          "category_id": 2,
          "category_name": "Equipment",
          "revenue": "4500000.00",
          "orders": 45,
          "percentage": 30.0
        }
      ]
    },
    "detailed_stats": {
      "daily_breakdown": [
        {
          "date": "2024-01-01",
          "total_orders": 5,
          "total_revenue": "500000.00",
          "avg_order_value": "100000.00",
          "unique_customers": 4
        },
        {
          "date": "2024-01-02",
          "total_orders": 8,
          "total_revenue": "750000.00",
          "avg_order_value": "93750.00",
          "unique_customers": 6
        }
      ],
      "weekly_breakdown": [
        {
          "week": "W1/2024",
          "week_start": "2024-01-01",
          "week_end": "2024-01-07",
          "total_orders": 35,
          "total_revenue": "3500000.00",
          "avg_order_value": "100000.00"
        }
      ],
      "monthly_comparison": [
        {
          "month": "Dec 2023",
          "year": 2023,
          "month_number": 12,
          "total_orders": 120,
          "total_revenue": "12000000.00",
          "avg_order_value": "100000.00"
        },
        {
          "month": "Jan 2024",
          "year": 2024,
          "month_number": 1,
          "total_orders": 150,
          "total_revenue": "15000000.00",
          "avg_order_value": "100000.00"
        }
      ],
      "hourly_pattern": [
        {
          "hour": 9,
          "hour_display": "09:00",
          "total_orders": 15,
          "total_revenue": "1500000.00"
        },
        {
          "hour": 14,
          "hour_display": "14:00",
          "total_orders": 25,
          "total_revenue": "2500000.00"
        }
      ]
    },
    "period": {
      "type": "month",
      "start_date": "2024-01-01",
      "end_date": "2024-01-31",
      "timezone": "Asia/Ho_Chi_Minh"
    }
  },
  "timestamp": "2024-01-31T10:30:00.000000Z"
}
```

### Response Error - Validation (422)
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "period": ["The selected period is invalid."],
    "start_date": ["The start date field is required when period is custom."],
    "end_date": ["The end date must be a date after or equal to start date."]
  }
}
```

### Response Error - Unauthorized (401)
```json
{
  "success": false,
  "message": "Authentication required",
  "error": "Unauthenticated"
}
```

### Response Error - Forbidden (403)
```json
{
  "success": false,
  "message": "Admin access required",
  "error": "Insufficient permissions"
}
```

### Response Error - Server Error (500)
```json
{
  "success": false,
  "message": "Failed to get dashboard statistics",
  "error": "Database connection failed",
  "debug": {
    "file": "/path/to/file.php",
    "line": 123,
    "trace": "Stack trace..."
  }
}
```

---

## 🔧 Usage Examples

### Basic Usage (Current Month)
```javascript
fetch('/api/admin/statistics/dashboard', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer ' + adminToken,
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => {
  if (data.success) {
    console.log('Revenue:', data.data.overview.total_revenue);
    console.log('Orders:', data.data.overview.total_orders);
    console.log('Growth:', data.data.growth.revenue_growth + '%');
  }
});
```

### Custom Date Range
```javascript
const params = new URLSearchParams({
  period: 'custom',
  start_date: '2024-01-01',
  end_date: '2024-01-31',
  timezone: 'Asia/Ho_Chi_Minh'
});

fetch(`/api/admin/statistics/dashboard?${params}`, {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer ' + adminToken,
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => {
  // Handle custom period data
});
```

### Without Charts (Performance Optimization)
```javascript
const params = new URLSearchParams({
  period: 'week',
  include_charts: 'false'
});

fetch(`/api/admin/statistics/dashboard?${params}`, {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer ' + adminToken,
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => {
  // Faster response without chart data
});
```

---

## 📊 Data Structure Details

### Overview Metrics
- **total_revenue**: Total revenue in the selected period (decimal string)
- **total_orders**: Number of orders placed
- **total_customers**: Number of unique customers
- **total_products**: Total products in catalog
- **average_order_value**: Revenue divided by orders

### Growth Rates
- **Calculation**: `((current - previous) / previous) * 100`
- **Positive values**: Growth compared to previous period
- **Negative values**: Decline compared to previous period
- **null values**: No data for previous period

### Chart Data
- **revenue_trend**: Daily revenue and order count
- **order_status_distribution**: Orders grouped by status with percentages
- **top_categories**: Best performing categories by revenue

---

## ⏰ Period Types

| Period | Description | Previous Period |
|--------|-------------|-----------------|
| `today` | Current day | Yesterday |
| `week` | Current week (Mon-Sun) | Previous week |
| `month` | Current month | Previous month |
| `year` | Current year | Previous year |
| `custom` | Custom date range | Same duration before start_date |

---

## 🌍 Timezone Support

The API supports timezone-aware calculations:
- **Default**: UTC
- **Recommended**: `Asia/Ho_Chi_Minh` for Vietnam
- **Format**: Standard timezone identifiers
- **Effect**: All date calculations use specified timezone

---

## 🚀 Performance Tips

1. **Use `include_charts=false`** for faster responses when charts aren't needed
2. **Cache results** on frontend for frequently accessed periods
3. **Use appropriate periods** - avoid very large custom ranges
4. **Implement pagination** for large datasets in charts

---

## 📝 Notes

1. **Admin Only**: Requires admin authentication
2. **Real-time Data**: Statistics are calculated in real-time
3. **Timezone Aware**: All calculations respect specified timezone
4. **Growth Comparison**: Automatically compares with equivalent previous period
5. **Flexible Periods**: Supports both predefined and custom date ranges

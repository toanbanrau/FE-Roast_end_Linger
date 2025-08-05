# ⭐ Product Reviews API

> Comprehensive API for product review and rating system

## Base URL

```
/api/products/{productId}/reviews
```

---

## 📋 Endpoints Overview

| Method | Endpoint                                               | Auth | Description         |
| ------ | ------------------------------------------------------ | ---- | ------------------- |
| GET    | `/api/products/{productId}/reviews`                    | No   | Get product reviews |
| POST   | `/api/products/{productId}/reviews`                    | Yes  | Create review       |
| GET    | `/api/products/{productId}/reviews/{reviewId}`         | No   | Get review details  |
| PUT    | `/api/products/{productId}/reviews/{reviewId}`         | Yes  | Update review       |
| DELETE | `/api/products/{productId}/reviews/{reviewId}`         | Yes  | Delete review       |
| POST   | `/api/products/{productId}/reviews/{reviewId}/helpful` | Yes  | Mark helpful        |

---

## 📖 Get Product Reviews

**GET** `/api/products/{productId}/reviews`

### Query Parameters

| Parameter     | Type    | Description             | Example  |
| ------------- | ------- | ----------------------- | -------- |
| rating        | integer | Filter by rating (1-5)  | `5`      |
| verified_only | boolean | Only verified purchases | `true`   |
| sort_by       | string  | Sort order              | `newest` |
| per_page      | integer | Items per page          | `10`     |

### Sort Options

-   `newest` - Newest first (default)
-   `oldest` - Oldest first
-   `rating_high` - Highest rating first
-   `rating_low` - Lowest rating first
-   `helpful` - Most helpful first

### Response Success (200)

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
                    "title": "Excellent coffee!",
                    "comment": "Great taste and aroma. Highly recommended!",
                    "images": ["reviews/review_1.jpg"],
                    "is_verified_purchase": true,
                    "helpful_count": 12,
                    "not_helpful_count": 1,
                    "helpfulness_ratio": 92.3,
                    "user_helpfulness": null,
                    "time_ago": "2 days ago",
                    "created_at": "2024-06-20T10:30:00.000000Z",
                    "user": {
                        "id": 1,
                        "name": "John",
                        "full_name": "John Doe"
                    }
                }
            ],
            "current_page": 1,
            "per_page": 10,
            "total": 25
        },
        "statistics": {
            "average_rating": 4.5,
            "total_reviews": 25,
            "verified_purchase_count": 20,
            "rating_distribution": {
                "1": { "count": 1, "percentage": 4.0 },
                "2": { "count": 2, "percentage": 8.0 },
                "3": { "count": 3, "percentage": 12.0 },
                "4": { "count": 7, "percentage": 28.0 },
                "5": { "count": 12, "percentage": 48.0 }
            }
        }
    }
}
```

---

## 📋 Get Reviewable Products

**GET** `/api/reviews/reviewable-products`

> Get list of products that user can review (from completed orders, not yet reviewed)

### Headers

```json
{
    "Authorization": "Bearer {token}"
}
```

### Response Success (200)

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
                "slug": "ca-phe-arabica-premium-1234",
                "image": {
                    "url": "http://localhost:8000/storage/products/coffee.jpg",
                    "alt_text": "Cà phê Arabica"
                },
                "category": {
                    "id": 1,
                    "name": "Cà phê rang xay"
                }
            },
            "variant": {
                "id": 1,
                "name": "250g - Ground",
                "sku": "CA-250G-GR-001"
            },
            "quantity": 2,
            "unit_price": 150000,
            "formatted_unit_price": "150,000 VND",
            "purchased_at": "2024-01-01T10:00:00.000000Z",
            "days_since_purchase": 15,
            "can_review": true
        }
    ]
}
```

### Usage Example

```javascript
// Get products user can review
const response = await fetch("/api/reviews/reviewable-products", {
    headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
    },
});

const data = await response.json();
if (data.success) {
    // Display reviewable products
    data.data.forEach((item) => {
        console.log(`Can review: ${item.product.name}`);
        console.log(`Order Item ID: ${item.order_item_id}`); // Use this for review creation
    });
}
```

---

## ✍️ Create Product Review

**POST** `/api/products/{productId}/reviews`

> **⚠️ Important**: Only users who have purchased and received the product (order status = 'completed') can create reviews.

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
formData.append("rating", "5"); // Required: 1-5
formData.append("title", "Excellent coffee!"); // Optional
formData.append("comment", "Great taste and aroma. Highly recommended!"); // Optional
formData.append("order_item_id", "123"); // Required: From completed order
formData.append("images[]", imageFile1); // Optional: Review images
formData.append("images[]", imageFile2); // Optional: Multiple images
```

### Field Requirements

#### Required Fields

| Field           | Type    | Description                | Example |
| --------------- | ------- | -------------------------- | ------- |
| `rating`        | integer | Rating score (1-5)         | `5`     |
| `order_item_id` | integer | ID of purchased order item | `123`   |

#### Optional Fields

| Field      | Type   | Description                            | Example                  |
| ---------- | ------ | -------------------------------------- | ------------------------ |
| `title`    | string | Review title (max: 200 chars)          | `"Excellent coffee!"`    |
| `comment`  | string | Review content (max: 1000 chars)       | `"Great taste..."`       |
| `images[]` | file[] | Review images (max: 5 files, 2MB each) | `[file1.jpg, file2.jpg]` |

### Prerequisites for Creating Review

#### ✅ Required Conditions

1. **User must be authenticated** - Valid Bearer token
2. **Must have purchased the product** - Order item exists
3. **Order must be completed** - Order status = 'completed'
4. **Haven't reviewed yet** - One review per user per product
5. **Valid order_item_id** - Must belong to user's completed order

### Validation Rules

| Field         | Type    | Required | Rules                                   |
| ------------- | ------- | -------- | --------------------------------------- |
| rating        | integer | ✅ Yes   | Required, between 1-5                   |
| title         | string  | ⚪ No    | Max 200 characters                      |
| comment       | string  | ⚪ No    | Max 1000 characters                     |
| images[]      | file[]  | ⚪ No    | Max 5 files, 2MB each, image types      |
| order_item_id | integer | ✅ Yes   | Required, must exist and belong to user |

### Response Success (201)

```json
{
    "success": true,
    "message": "Review created successfully",
    "data": {
        "id": 1,
        "product_id": 1,
        "user_id": 1,
        "order_id": 15,
        "order_item_id": 123,
        "rating": 5,
        "title": "Excellent coffee!",
        "comment": "Great taste and aroma. Highly recommended!",
        "images": [
            "http://localhost:8000/storage/reviews/image1.jpg",
            "http://localhost:8000/storage/reviews/image2.jpg"
        ],
        "is_verified_purchase": true,
        "is_approved": true,
        "helpful_count": 0,
        "reviewed_at": "2024-01-01T00:00:00.000000Z",
        "created_at": "2024-01-01T00:00:00.000000Z",
        "user": {
            "id": 1,
            "name": "John Doe"
        }
    }
}
```

### Error Responses

#### 400 Bad Request - Already Reviewed

```json
{
    "success": false,
    "message": "You have already reviewed this product"
}
```

#### 400 Bad Request - Not Purchased

```json
{
    "success": false,
    "message": "You can only review products you have purchased"
}
```

#### 422 Validation Error

```json
{
    "message": "The given data was invalid.",
    "errors": {
        "rating": ["The rating field is required."],
        "order_item_id": ["The order item id field is required."],
        "images.0": ["The image must be a file of type: jpeg, png, jpg, gif."]
    }
}
```

#### 404 Not Found

```json
{
    "success": false,
    "message": "Product not found"
}
```

---

## 👍 Mark Review Helpfulness

**POST** `/api/products/{productId}/reviews/{reviewId}/helpful`

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
    "is_helpful": true
}
```

### Parameters

| Field      | Type    | Required | Description                         |
| ---------- | ------- | -------- | ----------------------------------- |
| is_helpful | boolean | Yes      | true = helpful, false = not helpful |

### Response Success (200)

```json
{
    "success": true,
    "message": "Marked as helpful",
    "data": {
        "helpful_count": 13,
        "not_helpful_count": 1,
        "user_vote": true
    }
}
```

---

## 📝 Update Review

**PUT** `/api/products/{productId}/reviews/{reviewId}`

### Headers

```json
{
    "Authorization": "Bearer {token}",
    "Content-Type": "multipart/form-data"
}
```

### Request Body

```json
{
    "rating": 4,
    "title": "Good coffee",
    "comment": "Updated review content",
    "images": ["new_file.jpg"]
}
```

### Business Rules

-   ✅ Only review owner can update
-   ✅ Can only edit within 7 days of creation
-   ✅ All fields are optional
-   ✅ New images replace old ones

### Response Success (200)

```json
{
    "success": true,
    "message": "Review updated successfully",
    "data": {
        "id": 1,
        "rating": 4,
        "title": "Good coffee",
        "comment": "Updated review content"
    }
}
```

---

## 🗑️ Delete Review

**DELETE** `/api/products/{productId}/reviews/{reviewId}`

### Headers

```json
{
    "Authorization": "Bearer {token}",
    "Content-Type": "application/json"
}
```

### Business Rules

-   ✅ Only review owner can delete
-   ✅ Soft delete (keeps data for analytics)
-   ✅ Updates product rating statistics

### Response Success (200)

```json
{
    "success": true,
    "message": "Review deleted successfully",
    "data": null
}
```

---

## 🔍 Get Review Details

**GET** `/api/products/{productId}/reviews/{reviewId}`

### Response Success (200)

```json
{
    "success": true,
    "message": "Review retrieved successfully",
    "data": {
        "id": 1,
        "rating": 5,
        "title": "Excellent coffee!",
        "comment": "Great taste and aroma. Highly recommended!",
        "images": ["reviews/review_1.jpg"],
        "is_verified_purchase": true,
        "helpful_count": 12,
        "not_helpful_count": 1,
        "helpfulness_ratio": 92.3,
        "user_helpfulness": true,
        "time_ago": "2 days ago",
        "created_at": "2024-06-20T10:30:00.000000Z",
        "user": {
            "id": 1,
            "name": "John",
            "full_name": "John Doe"
        }
    }
}
```

---

## 🎯 Business Logic

### **Review Eligibility**

-   ✅ Must have purchased the product
-   ✅ One review per product per user
-   ✅ Can review specific variants
-   ✅ Order must be completed

### **Verification System**

-   ✅ Verified purchase badge
-   ✅ Links to specific order item
-   ✅ Prevents fake reviews

### **Helpfulness System**

-   ✅ Users can vote helpful/not helpful
-   ✅ Cannot vote on own reviews
-   ✅ Can change vote or remove vote
-   ✅ Real-time count updates

### **Image Management**

-   ✅ Max 5 images per review
-   ✅ 2MB per image limit
-   ✅ JPEG, PNG, JPG, GIF formats
-   ✅ Automatic storage management

### **Rating Calculation**

-   ✅ Real-time average rating
-   ✅ Rating distribution statistics
-   ✅ Verified vs unverified breakdown
-   ✅ Product search ranking impact

---

## 📊 Integration Points

### **Product Model Integration**

```php
$product->average_rating        // 4.5
$product->review_count         // 25
$product->rating_distribution  // Array of 1-5 star counts
$product->hasUserReviewed($userId)  // Boolean
$product->canUserReview($userId)    // Boolean
```

### **Order Integration**

-   Links reviews to specific order items
-   Enables verified purchase badges
-   Prevents duplicate reviews

### **User Experience**

-   Review prompts after delivery
-   Email notifications for helpful votes
-   Review management in user profile

---

## 🔒 Security Features

-   ✅ Authentication required for actions
-   ✅ Authorization checks (own reviews only)
-   ✅ Input validation and sanitization
-   ✅ Image upload security
-   ✅ Rate limiting on review creation
-   ✅ Spam detection ready

---

## � Complete Usage Examples

### Full Review Creation Flow

```javascript
// Step 1: Get products user can review
async function getReviewableProducts() {
    const response = await fetch("/api/reviews/reviewable-products", {
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
        },
    });

    const data = await response.json();
    return data.success ? data.data : [];
}

// Step 2: Create review with images
async function createReview(productId, orderItemId, reviewData, imageFiles) {
    const formData = new FormData();

    // Required fields
    formData.append("rating", reviewData.rating.toString());
    formData.append("order_item_id", orderItemId.toString());

    // Optional fields
    if (reviewData.title) formData.append("title", reviewData.title);
    if (reviewData.comment) formData.append("comment", reviewData.comment);

    // Images
    imageFiles.forEach((file, index) => {
        formData.append("images[]", file);
    });

    const response = await fetch(`/api/products/${productId}/reviews`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            // Don't set Content-Type for FormData
        },
        body: formData,
    });

    return await response.json();
}

// Step 3: Complete usage example
async function handleReviewSubmission() {
    try {
        // Get reviewable products
        const reviewableProducts = await getReviewableProducts();

        if (reviewableProducts.length === 0) {
            console.log("No products to review");
            return;
        }

        // Create review for first product
        const product = reviewableProducts[0];
        const reviewData = {
            rating: 5,
            title: "Excellent coffee!",
            comment: "Great taste and aroma. Highly recommended!",
        };

        const imageFiles = []; // Array of File objects from input

        const result = await createReview(
            product.product.id,
            product.order_item_id,
            reviewData,
            imageFiles
        );

        if (result.success) {
            console.log("Review created successfully!", result.data);
        } else {
            console.error("Failed to create review:", result.message);
        }
    } catch (error) {
        console.error("Error:", error);
    }
}
```

---

## 🔗 Related APIs

-   [Orders API](order_management.md) - For order status and tracking
-   [Products API](phase1-product-browse-apis.md) - For product information
-   [Authentication API](authentication.md) - For user login/logout

---

## 📊 Response Status Codes

| Code | Description          |
| ---- | -------------------- |
| 200  | Success              |
| 201  | Review created       |
| 400  | Business logic error |
| 401  | Unauthorized         |
| 404  | Not found            |
| 422  | Validation error     |
| 500  | Server error         |

---

## �📈 Analytics Ready

-   Review conversion rates
-   Average rating trends
-   Most helpful reviewers
-   Product improvement insights
-   Customer satisfaction metrics

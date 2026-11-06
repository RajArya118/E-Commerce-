# NOVA STORE — REST API Architecture & Endpoint Reference

**Base URL**: `/api/v1`  
**Protocol**: HTTPS / REST  
**Authentication**: Bearer JWT (`Authorization: Bearer <token>`)

---

## 1. Authentication Endpoints (`/api/v1/auth`)

### 1.1 Register Customer
- **Method**: `POST`
- **Path**: `/api/v1/auth/register`
- **Access**: Public
- **Request Body**:
```json
{
  "email": "customer@novastore.com",
  "password": "StrongPassword123!",
  "full_name": "Aether Vance",
  "phone": "+1-415-555-0199"
}
```
- **Response `201 Created`**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "672b1234567890abcdef0002",
      "email": "customer@novastore.com",
      "full_name": "Aether Vance",
      "role": "customer"
    },
    "access_token": "eyJhbGciOi...",
    "refresh_token": "eyJhbGciOi...",
    "token_type": "bearer"
  }
}
```

### 1.2 Login
- **Method**: `POST`
- **Path**: `/api/v1/auth/login`
- **Access**: Public
- **Request Body**:
```json
{
  "email": "customer@novastore.com",
  "password": "StrongPassword123!"
}
```
- **Response `200 OK`**: Same token structure as register.

### 1.3 Logout
- **Method**: `POST`
- **Path**: `/api/v1/auth/logout`
- **Access**: Bearer
- **Response `200 OK`**:
```json
{
  "success": true,
  "message": "Successfully logged out"
}
```

### 1.4 Refresh Token
- **Method**: `POST`
- **Path**: `/api/v1/auth/refresh`
- **Access**: Public (requires valid refresh token)
- **Request Body**: `{ "refresh_token": "eyJhbGciOi..." }`
- **Response `200 OK`**: `{ "access_token": "eyJhbGciOi...", "token_type": "bearer" }`

### 1.5 Forgot Password
- **Method**: `POST`
- **Path**: `/api/v1/auth/forgot-password`
- **Access**: Public
- **Request Body**: `{ "email": "customer@novastore.com" }`
- **Response `200 OK`**:
```json
{
  "success": true,
  "message": "Password reset instructions sent to email"
}
```

### 1.6 Reset Password
- **Method**: `POST`
- **Path**: `/api/v1/auth/reset-password`
- **Access**: Public
- **Request Body**:
```json
{
  "token": "reset_token_xxx",
  "new_password": "NewStrongPassword123!"
}
```
- **Response `200 OK`**:
```json
{
  "success": true,
  "message": "Password successfully updated"
}
```

### 1.7 Current User Profile
- **Method**: `GET`
- **Path**: `/api/v1/auth/me`
- **Access**: Customer / Admin
- **Response `200 OK`**: Returns user profile and addresses.

---

## 2. Product Catalog (`/api/v1/products`)

### 2.1 Query Catalog
- **Method**: `GET`
- **Path**: `/api/v1/products`
- **Query Parameters**:
  - `page` (int, default: 1)
  - `limit` (int, default: 12)
  - `category` (string, slug)
  - `search` (string, keyword)
  - `min_price` (float)
  - `max_price` (float)
  - `sort_by` (enum: `price_asc`, `price_desc`, `rating`, `newest`, `popular`)
- **Response `200 OK`**:
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "672b1234567890abcdef0003",
        "name": "NOVA Eclipse X-1 Headphones",
        "slug": "nova-eclipse-x-1",
        "short_description": "Precision Titanium Spatial Audio",
        "brand": "NOVA Audio",
        "price": 499.00,
        "discount_price": 449.00,
        "SKU": "NOV-ECL-001",
        "stock_quantity": 45,
        "images": ["https://..."],
        "average_rating": 4.9,
        "review_count": 86,
        "featured": true,
        "trending": true
      }
    ],
    "pagination": {
      "total": 16,
      "page": 1,
      "limit": 12,
      "total_pages": 2
    }
  }
}
```

### 2.2 Get Product Details
- **Method**: `GET`
- **Path**: `/api/v1/products/{id}` (or slug)
- **Access**: Public

### 2.3 Create Product
- **Method**: `POST`
- **Path**: `/api/v1/products`
- **Access**: Admin

### 2.4 Update Product
- **Method**: `PUT`
- **Path**: `/api/v1/products/{id}`
- **Access**: Admin

### 2.5 Delete Product
- **Method**: `DELETE`
- **Path**: `/api/v1/products/{id}`
- **Access**: Admin

---

## 3. Categories (`/api/v1/categories`)

### 3.1 List Categories
- **Method**: `GET`
- **Path**: `/api/v1/categories`
- **Access**: Public

### 3.2 Create Category
- **Method**: `POST`
- **Path**: `/api/v1/categories`
- **Access**: Admin

### 3.3 Update Category
- **Method**: `PUT`
- **Path**: `/api/v1/categories/{id}`
- **Access**: Admin

### 3.4 Delete Category
- **Method**: `DELETE`
- **Path**: `/api/v1/categories/{id}`
- **Access**: Admin

---

## 4. Shopping Cart (`/api/v1/cart`)

### 4.1 Fetch Active Cart
- **Method**: `GET`
- **Path**: `/api/v1/cart`
- **Access**: Public (Session Header) / Customer

### 4.2 Add Cart Item
- **Method**: `POST`
- **Path**: `/api/v1/cart/items`
- **Request Body**:
```json
{
  "product_id": "672b1234567890abcdef0003",
  "quantity": 1,
  "variant": { "color": "Obsidian Black" }
}
```

### 4.3 Update Cart Item Quantity
- **Method**: `PUT`
- **Path**: `/api/v1/cart/items/{id}`
- **Request Body**: `{ "quantity": 2 }`

### 4.4 Remove Cart Item
- **Method**: `DELETE`
- **Path**: `/api/v1/cart/items/{id}`

### 4.5 Apply Coupon
- **Method**: `POST`
- **Path**: `/api/v1/cart/apply-coupon`
- **Request Body**: `{ "code": "NOVALUXURY" }`

---

## 5. Wishlist (`/api/v1/wishlist`)

### 5.1 Get Customer Wishlist
- **Method**: `GET`
- **Path**: `/api/v1/wishlist`
- **Access**: Bearer

### 5.2 Add to Wishlist
- **Method**: `POST`
- **Path**: `/api/v1/wishlist`
- **Request Body**: `{ "product_id": "672b1234567890abcdef0003" }`
- **Access**: Bearer

### 5.3 Remove from Wishlist
- **Method**: `DELETE`
- **Path**: `/api/v1/wishlist/{id}`
- **Access**: Bearer

---

## 6. Orders (`/api/v1/orders`)

### 6.1 Create Order
- **Method**: `POST`
- **Path**: `/api/v1/orders`
- **Access**: Bearer

### 6.2 Get Customer Orders
- **Method**: `GET`
- **Path**: `/api/v1/orders`
- **Access**: Bearer

### 6.3 Get Order by ID or Order Number
- **Method**: `GET`
- **Path**: `/api/v1/orders/{id}`
- **Access**: Bearer

---

## 7. Payments & Razorpay (`/api/v1/payments`)

### 7.1 Create Payment Order
- **Method**: `POST`
- **Path**: `/api/v1/payments/create-order`
- **Access**: Bearer
- **Request Body**: `{ "order_id": "672b1234567890abcdef0004" }`

### 7.2 Verify Payment Signature
- **Method**: `POST`
- **Path**: `/api/v1/payments/verify`
- **Access**: Bearer
- **Request Body**:
```json
{
  "order_id": "672b1234567890abcdef0004",
  "razorpay_order_id": "order_Rz99881122",
  "razorpay_payment_id": "pay_Rz11223344",
  "razorpay_signature": "a6b7c8d9e0..."
}
```

### 7.3 Payment Webhook
- **Method**: `POST`
- **Path**: `/api/v1/payments/webhook`
- **Access**: Razorpay Webhook Signature Verified

---

## 8. Customer Reviews (`/api/v1/products/{id}/reviews`)

### 8.1 List Product Reviews
- **Method**: `GET`
- **Path**: `/api/v1/products/{id}/reviews`
- **Access**: Public

### 8.2 Submit Review
- **Method**: `POST`
- **Path**: `/api/v1/products/{id}/reviews`
- **Access**: Customer (Verified purchase)

---

## 9. AI Shopping Assistant (`/api/v1/ai`)

### 9.1 Conversational Chat
- **Method**: `POST`
- **Path**: `/api/v1/ai/chat`
- **Request Body**:
```json
{
  "message": "Find me a laptop under 60000",
  "conversation_history": []
}
```

### 9.2 Natural Language Search
- **Method**: `POST`
- **Path**: `/api/v1/ai/search`
- **Request Body**: `{ "query": "best headphones for gaming" }`

### 9.3 Product Recommendations
- **Method**: `POST`
- **Path**: `/api/v1/ai/recommendations`
- **Request Body**: `{ "product_id": "672b1234567890abcdef0003", "limit": 4 }`

---

## 10. Admin Control Center (`/api/v1/admin`)

- `GET /api/v1/admin/analytics`: Aggregate metrics (revenue, orders, low-stock, top products).
- `GET /api/v1/admin/orders`: List all orders with filters and pagination.
- `GET /api/v1/admin/customers`: List customer accounts and activity.
- `GET /api/v1/admin/inventory`: Inventory monitoring, reorder alerts, stock updates.
- `PUT /api/v1/admin/orders/{id}/status`: Transition fulfillment state (`PROCESSING` -> `SHIPPED` -> `DELIVERED`).

---

## 11. Newsletter (`/api/v1/newsletter`)

- `POST /api/v1/newsletter/subscribe`: Subscribe an email address to the newsletter list.

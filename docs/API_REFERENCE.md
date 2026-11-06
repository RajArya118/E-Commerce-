# NOVA STORE — API Reference & Architecture Specifications

## Base URL
`/api/v1`

## API Endpoints Summary

### Authentication (`/auth`)
- `POST /api/v1/auth/register`: Create a new customer profile.
- `POST /api/v1/auth/login`: Return JWT Access & Refresh Tokens.
- `POST /api/v1/auth/refresh`: Issue new access token from refresh token.
- `GET /api/v1/auth/me`: Fetch authenticated user profile.
- `POST /api/v1/auth/logout`: Revoke active session tokens.

### Catalog & Products (`/products`, `/categories`)
- `GET /api/v1/products`: Search, filter by price/category/rating, and sort.
- `GET /api/v1/products/{id_or_slug}`: Retrieve full product details with reviews.
- `GET /api/v1/products/featured`: Top trending and editor's choice products.
- `GET /api/v1/categories`: Retrieve all product categories.

### Cart & Wishlist (`/cart`, `/wishlist`)
- `GET /api/v1/cart`: Current session or user cart.
- `POST /api/v1/cart/items`: Add or increment item.
- `PUT /api/v1/cart/items/{item_id}`: Update item quantity.
- `DELETE /api/v1/cart/items/{item_id}`: Remove item.
- `POST /api/v1/cart/apply-coupon`: Apply and calculate coupon discount.
- `GET /api/v1/wishlist`: Customer wishlist items.
- `POST /api/v1/wishlist/toggle/{product_id}`: Toggle product in wishlist.

### Orders & Payments (`/orders`, `/payments`)
- `POST /api/v1/orders`: Create an order snapshot.
- `GET /api/v1/orders/my-orders`: Retrieve customer order history.
- `GET /api/v1/orders/{order_number}`: Real-time order progress tracking.
- `POST /api/v1/payments/create-razorpay-order`: Generate Razorpay transaction order.
- `POST /api/v1/payments/verify`: Verify Razorpay signature cryptographically.

### Admin Dashboard (`/admin`)
- `GET /api/v1/admin/analytics`: Aggregated metrics (revenue, orders, low-stock count).
- `POST /api/v1/admin/products`: Create catalog product.
- `PUT /api/v1/admin/products/{id}`: Update product details and inventory.
- `DELETE /api/v1/admin/products/{id}`: Soft-delete/archive product.
- `GET /api/v1/admin/orders`: List all customer orders for fulfillment.
- `PUT /api/v1/admin/orders/{id}/status`: Update order fulfillment lifecycle state.

### AI Shopping Assistant (`/ai`)
- `POST /api/v1/ai/chat`: Real-time contextual product queries and suggestions.


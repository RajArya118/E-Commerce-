# NOVA STORE — Beyond Shopping. Experience Innovation.

> A luxury, Awwwards-inspired AI-powered e-commerce platform built with React 19, Vite, Tailwind CSS, Three.js, GSAP, and a high-performance Python FastAPI backend backed by MongoDB and Razorpay.

---

## 🌟 Executive Highlights

- **Cinematic Awwwards-Grade Visuals**: Dark luxury aesthetic (`#050505`), obsidian glassmorphism, responsive 3D interactive holographic canvas, and Lenis smooth momentum inertia scrolling.
- **22 Complete Production Pages**: Complete customer and administrative journeys covering Catalog, Product Showcase with variants, Dynamic Cart, Wishlist, Multi-step Checkout, Profile, Order Tracking, Admin Analytics, and AI Concierge.
- **Zero-Trust Security**: Python FastAPI backend with JWT Bearer authentication, native bcrypt password hashing, structured JSON logging, and robust Pydantic schemas.
- **Production MongoDB Engine**: Async Motor driver, compound indexes, transactional inventory deduction, and automated in-memory mock fallback.
- **Cryptographic Payment Verification**: Razorpay checkout integration with server-side HMAC SHA-256 signature verification and idempotency protection.
- **Context-Aware AI Assistant (NOVA AI)**: Natural language product discovery, budget recommendations, and comparison queries grounded strictly in live database inventory.
- **Executive Operations Console**: Revenue charts with Recharts, low-stock warnings, product CRUD, and order fulfillment state transitions.

---

## 🛠️ Complete Technology Stack

| Domain | Technology |
|---|---|
| **Frontend Framework** | React 19, Vite 6 |
| **Styling & Tokens** | Tailwind CSS, PostCSS, Custom Cyber Glassmorphism |
| **Smooth Motion** | Lenis Smooth Scroll, GSAP, Framer Motion |
| **3D Hologram** | Three.js WebGL Holographic Particle Torus Canvas |
| **Iconography & Visuals** | Lucide React |
| **Data Visualization** | Recharts (Sales Velocity, Category Share) |
| **Backend Framework** | Python 3.11+ / FastAPI, Uvicorn |
| **Data Serialization** | Pydantic v2, Pydantic Settings |
| **Database & Driver** | MongoDB, Motor (AsyncIOMotorClient), mongomock-motor |
| **Authentication & Auth** | PyJWT (HS256 tokens), Bcrypt |
| **Payment Gateway** | Razorpay SDK (HMAC-SHA256 signature verification) |
| **AI Assistant** | Grounded Catalog Retrieval Engine |
| **Testing** | Pytest, pytest-asyncio, HTTPX ASGI client, Vitest |

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js**: `v18+` or `v20+` / `v26+`
- **Python**: `3.10+` or `3.11+`
- **MongoDB**: Local MongoDB daemon or MongoDB Atlas cloud connection string (auto in-memory fallback enabled if offline)

### 2. Launch FastAPI Backend
```bash
cd backend
# Activate virtualenv (already generated in .venv)
# Windows:
.\.venv\Scripts\activate
# Linux/macOS:
# source .venv/bin/activate

# Run database seed
python seed_data.py

# Launch ASGI server on http://localhost:8000
python -m uvicorn app.main:app --reload --port 8000
```
Interactive API Documentation: `http://localhost:8000/api/docs`

### 3. Launch React Frontend
```bash
cd frontend
npm run dev
```
Explore the experience: `http://localhost:5173`

---

## 🔑 Default Evaluation Accounts

| Role | Email | Password | Access Level |
|---|---|---|---|
| **Executive Admin** | `admin@novastore.com` | `NovaAdminSecure2026!` | Admin Analytics, Product CRUD, Order Status Manager |
| **Verified Customer** | `customer@novastore.com` | `CustomerPass2026!` | Profile, Address Book, Cart, Wishlist, Orders |

> Quick-fill demo buttons are provided on the `/login` screen for 1-click evaluation.

---

## 🧪 Automated Testing Suite

To run the complete automated test suite across all 12 core full-stack API endpoints:
```bash
cd backend
.\.venv\Scripts\pytest.exe ..\tests\backend\test_api_endpoints.py -v -s
```

All 12 test suites verify:
1. Health status
2. Catalog listing & pagination
3. Single product retrieval by slug
4. Categories discovery
5. Customer authentication & JWT issuance
6. User profile (`/auth/me`)
7. Cart item addition & live recalculation
8. Promo coupon validation (`NOVALUXURY`)
9. Wishlist state toggling & persistence
10. Grounded AI shopping recommendations
11. Admin role authorization & analytics
12. Newsletter subscription flow

---

## 📦 Containerized Deployment (Docker)

To run the entire full-stack application (MongoDB + FastAPI + React Nginx) via Docker Compose:
```bash
docker-compose up --build
```
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8000`
- MongoDB: `mongodb://localhost:27017`

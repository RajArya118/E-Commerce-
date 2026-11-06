import asyncio
from datetime import datetime, timezone
from bson import ObjectId
from app.database.connection import db_manager, get_database
from app.core.security import hash_password
from app.core.config import settings
from app.core.logging import logger


async def seed_collections(db):
    """Populates collections on an already-connected database instance."""
    if not settings.ADMIN_DEFAULT_PASSWORD or not settings.CUSTOMER_DEFAULT_PASSWORD:
        raise ValueError(
            "Set ADMIN_DEFAULT_PASSWORD and CUSTOMER_DEFAULT_PASSWORD before seeding."
        )

    now = datetime.now(timezone.utc)
    admin_email = settings.ADMIN_DEFAULT_EMAIL.lower()
    await db.users.delete_many({"email": {"$in": [admin_email, "customer@novastore.com"]}})

    admin_doc = {
        "email": admin_email,
        "password_hash": hash_password(settings.ADMIN_DEFAULT_PASSWORD),
        "full_name": "NOVA Chief Executive",
        "role": "admin",
        "phone": "+1-800-555-0199",
        "is_active": True,
        "addresses": [
            {
                "id": "addr_hq",
                "label": "Global Operations Hub",
                "full_name": "NOVA Executive HQ",
                "phone": "+1-800-555-0199",
                "street": "100 Quantum Way, Innovation District",
                "city": "Bengaluru",
                "state": "Karnataka",
                "postal_code": "560100",
                "country": "India",
                "is_default": True
            }
        ],
        "created_at": now,
        "updated_at": now
    }
    await db.users.insert_one(admin_doc)

    customer_doc = {
        "email": "customer@novastore.com",
        "password_hash": hash_password(settings.CUSTOMER_DEFAULT_PASSWORD),
        "full_name": "Aether Vance",
        "role": "customer",
        "phone": "+91-98765-43210",
        "is_active": True,
        "addresses": [
            {
                "id": "addr_primary",
                "label": "Penthouse",
                "full_name": "Aether Vance",
                "phone": "+91-98765-43210",
                "street": "42 Cyber Heights, Sky Tower #8B",
                "city": "Mumbai",
                "state": "Maharashtra",
                "postal_code": "400001",
                "country": "India",
                "is_default": True
            }
        ],
        "created_at": now,
        "updated_at": now
    }
    cust_res = await db.users.insert_one(customer_doc)
    cust_id = str(cust_res.inserted_id)

    # 2. Categories
    await db.categories.delete_many({})
    categories_data = [
        {
            "name": "Technology",
            "slug": "technology",
            "description": "Next-generation quantum computing, neural interfaces and bio-wearables.",
            "image_url": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
            "is_featured": True,
            "sort_order": 1
        },
        {
            "name": "Electronics",
            "slug": "electronics",
            "description": "Titanium acoustic drivers, precision displays and holographic optics.",
            "image_url": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
            "is_featured": True,
            "sort_order": 2
        },
        {
            "name": "Fashion",
            "slug": "fashion",
            "description": "Cyberpunk tailoring, thermal-adaptive fabrics and carbon weave garments.",
            "image_url": "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80",
            "is_featured": True,
            "sort_order": 3
        },
        {
            "name": "Accessories",
            "slug": "accessories",
            "description": "Aerospace-grade chronographs, biometric jewelry and magnetic carry goods.",
            "image_url": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
            "is_featured": True,
            "sort_order": 4
        },
        {
            "name": "Lifestyle",
            "slug": "lifestyle",
            "description": "Ergonomic hydration vessels, ambient light sculptures and biometric travel accessories.",
            "image_url": "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80",
            "is_featured": True,
            "sort_order": 5
        },
        {
            "name": "Home Products",
            "slug": "home-products",
            "description": "Levitating ambient fixtures, neural air purification and minimalist architectural artifacts.",
            "image_url": "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80",
            "is_featured": True,
            "sort_order": 6
        }
    ]
    for cat in categories_data:
        cat["created_at"] = now
    await db.categories.insert_many(categories_data)

    # 3. Products
    await db.products.delete_many({})
    products_data = [
        {
            "name": "NOVA Eclipse X-1 Spatial Headphones",
            "slug": "nova-eclipse-x-1",
            "short_description": "Precision Titanium Spatial Audio with Active Bio-Acoustics",
            "description": "Engineered from aerospace-grade titanium and memory-foam acoustic dampeners, the Eclipse X-1 delivers unprecedented 360-degree sonic fidelity with real-time room calibration.",
            "category_slug": "electronics",
            "brand": "NOVA Audio",
            "price": 38999.00,
            "discount_price": 34999.00,
            "SKU": "NOV-ECL-001",
            "stock_quantity": 42,
            "images": [
                "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80",
                "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=1000&q=80",
                "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=1000&q=80"
            ],
            "variants": [
                {"name": "Color", "options": ["Obsidian Black", "Cosmic Silver", "Nebula Purple"]}
            ],
            "specifications": {
                "Driver Unit": "50mm Beryllium Vapor Diaphragms",
                "Battery Life": "65 Hours Continuous Playback",
                "Frequency Response": "4Hz - 48,000Hz",
                "Weight": "248 grams",
                "Connectivity": "Ultra-Wideband 2.4GHz & Bluetooth 5.4 LE"
            },
            "average_rating": 4.9,
            "review_count": 128,
            "featured": True,
            "trending": True,
            "active": True
        },
        {
            "name": "NOVA Chronos Chronograph",
            "slug": "nova-chronos-chronograph",
            "short_description": "Sapphire Crystal Biometric Smart Chronograph",
            "description": "A union of Haute Horlogerie craftsmanship and quantum sensor telemetry. Housed in forged Damascus titanium with micro-OLED perpetual displays.",
            "category_slug": "accessories",
            "brand": "NOVA Timepieces",
            "price": 64999.00,
            "discount_price": 58999.00,
            "SKU": "NOV-CHR-002",
            "stock_quantity": 18,
            "images": [
                "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80",
                "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=1000&q=80"
            ],
            "variants": [
                {"name": "Finish", "options": ["Forged Titanium", "Midnight Carbon", "Rose Gold Ion"]}
            ],
            "specifications": {
                "Case": "41mm Grade 5 Titanium",
                "Glass": "Dual-curved Anti-Reflective Sapphire",
                "Sensors": "ECG, Continuous SpO2, HRV, Core Temp",
                "Water Resistance": "100 Meters / 10 ATM"
            },
            "average_rating": 5.0,
            "review_count": 74,
            "featured": True,
            "trending": True,
            "active": True
        },
        {
            "name": "NOVA Lumina Neural Glasses",
            "slug": "nova-lumina-glasses",
            "short_description": "Augmented Holographic Eyewear with Waveguide Micro-LED",
            "description": "Ultra-lightweight spatial augmented reality frames weighing under 42 grams, casting transparent holographic telemetry into your natural field of view.",
            "category_slug": "technology",
            "brand": "NOVA Optics",
            "price": 79999.00,
            "discount_price": 72499.00,
            "SKU": "NOV-LUM-003",
            "stock_quantity": 25,
            "images": [
                "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=1000&q=80",
                "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1000&q=80"
            ],
            "variants": [
                {"name": "Frame", "options": ["Stealth Matte", "Glacier Clear", "Hyper Cyan"]}
            ],
            "specifications": {
                "Display": "Dual Binocular Micro-LED 1080p Waveguide",
                "FOV": "52 Degrees Diagonal",
                "Battery": "14 Hours Active Mixed Reality",
                "Weight": "38.5 grams"
            },
            "average_rating": 4.8,
            "review_count": 52,
            "featured": True,
            "trending": False,
            "active": True
        },
        {
            "name": "NOVA Cyber Weave Tech Jacket",
            "slug": "nova-cyber-jacket",
            "short_description": "Graphene Thermoregulation All-Weather Trench",
            "description": "Crafted from ballistics-grade nylon infused with graphene micro-threads that adapt their thermal conductivity based on ambient atmospheric temperatures.",
            "category_slug": "fashion",
            "brand": "NOVA Atelier",
            "price": 28999.00,
            "discount_price": 24999.00,
            "SKU": "NOV-JCK-004",
            "stock_quantity": 30,
            "images": [
                "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1000&q=80",
                "https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?auto=format&fit=crop&w=1000&q=80"
            ],
            "variants": [
                {"name": "Size", "options": ["S", "M", "L", "XL"]},
                {"name": "Color", "options": ["Void Black", "Cyber Fog"]}
            ],
            "specifications": {
                "Membrane": "3-Layer Graphene DWR Membrane",
                "Waterproof Rating": "28,000mm",
                "Breathability": "25,000g/m²/24h",
                "Hardware": "Magnetic Fidlock Buckles"
            },
            "average_rating": 4.9,
            "review_count": 89,
            "featured": False,
            "trending": True,
            "active": True
        },
        {
            "name": "NOVA Orbit Levitating Sound Stage",
            "slug": "nova-orbit-speaker",
            "short_description": "Magnetic Levitation 360 Omnidirectional Acoustic Orb",
            "description": "A zero-contact acoustic orb floating freely in magnetic equilibrium, eliminating cabinet resonance and dissipating sound uniformly across the room.",
            "category_slug": "home-products",
            "brand": "NOVA Audio",
            "price": 45999.00,
            "discount_price": 39999.00,
            "SKU": "NOV-ORB-005",
            "stock_quantity": 14,
            "images": [
                "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=1000&q=80",
                "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1000&q=80"
            ],
            "variants": [
                {"name": "Base Finish", "options": ["Brushed Obsidian", "White Alabaster"]}
            ],
            "specifications": {
                "Amplifier": "80W RMS Class-D Digital Amp",
                "Levitation": "Active Electrodynamic Stabilization",
                "Lighting": "Circadian RGBW Aura Glow",
                "Wireless": "Wi-Fi 6E, AirPlay 2, Spotify Connect"
            },
            "average_rating": 4.7,
            "review_count": 41,
            "featured": True,
            "trending": True,
            "active": True
        },
        {
            "name": "NOVA Matrix Mechanical Keyboard",
            "slug": "nova-matrix-keyboard",
            "short_description": "Solid CNC Brass-Weight Gasket Mounted Keyboard",
            "description": "Precision milled from a single block of aerospace aluminum with an integrated internal brass weight, lubed POM switches, and custom PBT keycaps.",
            "category_slug": "electronics",
            "brand": "NOVA Peripherals",
            "price": 19999.00,
            "discount_price": 16999.00,
            "SKU": "NOV-KB-006",
            "stock_quantity": 50,
            "images": [
                "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1000&q=80",
                "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=1000&q=80"
            ],
            "variants": [
                {"name": "Switch Type", "options": ["NOVA Linear Quartz", "NOVA Tactile Sapphire"]}
            ],
            "specifications": {
                "Mounting": "Multi-layer Silicone Gasket",
                "Polling Rate": "8000Hz Ultra-Low Latency",
                "Plate": "Forged Carbon Fiber Plate",
                "Weight": "2.2 kilograms"
            },
            "average_rating": 4.9,
            "review_count": 115,
            "featured": False,
            "trending": True,
            "active": True
        },
        {
            "name": "NOVA Aero Hydration Flask",
            "slug": "nova-aero-flask",
            "short_description": "Self-Cleaning UV-C Vacuum Insulated Titanium Bottle",
            "description": "Grade 1 surgical titanium thermal flask with deep UV-C sterilization built into the capacitive OLED touch cap.",
            "category_slug": "lifestyle",
            "brand": "NOVA Living",
            "price": 8999.00,
            "discount_price": 7499.00,
            "SKU": "NOV-FLK-007",
            "stock_quantity": 65,
            "images": [
                "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=1000&q=80"
            ],
            "variants": [
                {"name": "Volume", "options": ["600ml", "900ml"]}
            ],
            "specifications": {
                "Material": "Pure Grade 1 Titanium",
                "Sterilization": "275nm UV-C LED (99.99% Pathogen Eradication)",
                "Thermal Retention": "Cold for 36h / Hot for 24h"
            },
            "average_rating": 4.6,
            "review_count": 34,
            "featured": False,
            "trending": False,
            "active": True
        },
        {
            "name": "NOVA Cyber Drone 4K",
            "slug": "nova-cyber-drone",
            "short_description": "Folding Carbon Fiber Aerial Cinema Platform",
            "description": "Equipped with omnidirectional LiDAR obstacle avoidance and a 1-inch Hasselblad sensor capable of 4K 120fps HDR video capture.",
            "category_slug": "technology",
            "brand": "NOVA Aerial",
            "price": 119999.00,
            "discount_price": 109999.00,
            "SKU": "NOV-DRN-008",
            "stock_quantity": 12,
            "images": [
                "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=1000&q=80",
                "https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=1000&q=80"
            ],
            "variants": [
                {"name": "Bundle", "options": ["Standard Flight", "Fly More Cine Combo"]}
            ],
            "specifications": {
                "Sensor": "1-inch CMOS 20MP Sensor",
                "Flight Time": "46 Minutes per Battery",
                "Transmission Range": "15 Kilometers O4 HD",
                "Wind Resistance": "Level 7 (15 m/s)"
            },
            "average_rating": 5.0,
            "review_count": 48,
            "featured": True,
            "trending": True,
            "active": True
        }
    ]
    for p in products_data:
        p["created_at"] = now
        p["updated_at"] = now
    await db.products.insert_many(products_data)

    # 4. Coupons
    await db.coupons.delete_many({})
    coupons_data = [
        {
            "code": "NOVALUXURY",
            "discount_type": "PERCENTAGE",
            "discount_value": 15.0,
            "min_order_amount": 10000.0,
            "max_discount_cap": 8000.0,
            "usage_limit": 1000,
            "is_active": True,
            "created_at": now
        },
        {
            "code": "WELCOME10",
            "discount_type": "PERCENTAGE",
            "discount_value": 10.0,
            "min_order_amount": 5000.0,
            "max_discount_cap": 3000.0,
            "usage_limit": 5000,
            "is_active": True,
            "created_at": now
        },
        {
            "code": "SUPERNOVA",
            "discount_type": "FIXED",
            "discount_value": 2000.0,
            "min_order_amount": 25000.0,
            "max_discount_cap": 2000.0,
            "usage_limit": 200,
            "is_active": True,
            "created_at": now
        }
    ]
    await db.coupons.insert_many(coupons_data)

    # 5. Customer Reviews
    await db.reviews.delete_many({})
    sample_prod = await db.products.find_one({"slug": "nova-eclipse-x-1"})
    if sample_prod:
        sample_reviews = [
            {
                "product_id": str(sample_prod["_id"]),
                "user_id": cust_id,
                "user_name": "Aether Vance",
                "rating": 5,
                "title": "Acoustic transcendence beyond belief",
                "comment": "The titanium enclosure and bio-acoustic precision create an audio stage that feels like being in the center of an orchestra. Battery life easily exceeded 60 hours on my transatlantic flight.",
                "is_verified_buyer": True,
                "created_at": now
            },
            {
                "product_id": str(sample_prod["_id"]),
                "user_id": str(ObjectId()),
                "user_name": "Elena Rostova",
                "rating": 5,
                "title": "Unrivaled industrial design",
                "comment": "Minimalist, futuristic, and comfortably light. The cyber purple accent lighting in the dusk looks breathtaking.",
                "is_verified_buyer": True,
                "created_at": now
            }
        ]
        await db.reviews.insert_many(sample_reviews)

    logger.info("NOVA STORE Database Seeding Completed Successfully!")


async def seed_database():
    await db_manager.connect()
    db = get_database()
    logger.info("Starting NOVA STORE Database Seeding...")
    await seed_collections(db)
    await db_manager.close()


if __name__ == "__main__":
    asyncio.run(seed_database())

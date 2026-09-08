import mongoose from "mongoose"
import dotenv from "dotenv"
import path from "path"
import { fileURLToPath } from "url"
import Product from "./models/productModel.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config({ path: path.resolve(__dirname, "../.env") })
dotenv.config({ path: path.resolve(__dirname, "./.env") })

const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI
if (!mongoUri) {
  console.log("MONGO_URI missing")
  process.exit(1)
}

const sampleProducts = [
  {
    name: "Classic White T-Shirt",
    description: "Premium cotton classic white tee with regular fit. Perfect for virtual try-on.",
    category: "Men's Fashion",
    originalPrice: 999,
    salePrice: 599,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
    tryOnImage: "/products/classic-white-tshirt-crop.jpg",
    tryOnTexture: "/products/try-on/classic-white-tshirt.png",
    garmentShape: "tshirt",
    stock: 50,
    size: "md"
  },
  {
    name: "Oversized Black Tee",
    description: "Trendy oversized black t-shirt with soft fabric and modern cut.",
    category: "Men's Fashion",
    originalPrice: 1299,
    salePrice: 799,
    image: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=500",
    tryOnImage: "/products/oversized-black-tee-crop.jpg",
    tryOnTexture: "/products/try-on/oversized-black-tee.png",
    garmentShape: "tshirt",
    stock: 30,
    size: "lg"
  },
  {
    name: "Women's Floral Dress",
    description: "Elegant floral print dress for casual outings.",
    category: "Women's Fashion",
    originalPrice: 2499,
    salePrice: 1499,
    image: "https://images.unsplash.com/photo-1515372039744-f1fd71e2d9b6?w=500",
    tryOnImage: "/products/womens-floral-dress-crop.jpg",
    tryOnTexture: "/products/try-on/womens-floral-dress.png",
    garmentShape: "tshirt",
    stock: 20,
    size: "sm"
  },
  {
    name: "Denim Jacket",
    description: "Classic denim jacket — ab Hoodies section me move kar diya, try-on hoodie model (7037 verts) pe dikhega.",
    category: "Hoodies",
    originalPrice: 2999,
    salePrice: 1999,
    image: "https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=500",
    tryOnImage: "/products/denim-jacket-crop.jpg",
    tryOnTexture: "/products/try-on/denim-jacket.png",
    garmentShape: "hoodie",
    stock: 15,
    size: "xl"
  },
  // --- NEW HOODIES — 3 alag colors, same hoodie/jacket model (7037 verts, avatar-jacket) pe attach hongi ---
  {
    name: "Black Pullover Hoodie",
    description: "Cozy black pullover hoodie — fleece lined, kangaroo pocket. Hoodies select pe jacket model (hoodie shape) pe attach hogi.",
    category: "Hoodies",
    originalPrice: 2499,
    salePrice: 1699,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500",
    tryOnImage: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500",
    tryOnTexture: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500",
    garmentShape: "hoodie",
    stock: 35,
    size: "lg"
  },
  {
    name: "Grey Melange Hoodie",
    description: "Heather grey melange hoodie — soft cotton blend, ribbed cuffs. Hoodie model pe perfect fit.",
    category: "Hoodies",
    originalPrice: 2299,
    salePrice: 1499,
    image: "https://images.unsplash.com/photo-1578681994506-b8f463eea48a?w=500",
    tryOnImage: "https://images.unsplash.com/photo-1578681994506-b8f463eea48a?w=500",
    tryOnTexture: "https://images.unsplash.com/photo-1578681994506-b8f463eea48a?w=500",
    garmentShape: "hoodie",
    stock: 28,
    size: "md"
  },
  {
    name: "Red Street Hoodie",
    description: "Bold red street-style hoodie — oversized fit, front print. Hoodies section me 3rd color variant.",
    category: "Hoodies",
    originalPrice: 2699,
    salePrice: 1799,
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500",
    tryOnImage: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500",
    tryOnTexture: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500",
    garmentShape: "hoodie",
    stock: 22,
    size: "xl"
  },
  {
    name: "Leather Handbag",
    description: "Premium leather handbag for daily use.",
    category: "Bags",
    originalPrice: 3999,
    salePrice: 2499,
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500",
    tryOnImage: "/products/leather-handbag-crop.jpg",
    tryOnTexture: "/products/try-on/leather-handbag.png",
    stock: 10,
    size: "md"
  },
  {
    name: "Running Shoes",
    description: "Comfortable running shoes with breathable material. Nike Red Edition - real 3D view available.",
    category: "Shoes",
    originalPrice: 4999,
    salePrice: 2999,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
    tryOnImage: "/products/running-shoes-crop.jpg",
    tryOnTexture: "/products/try-on/running-shoes.png",
    stock: 25,
    size: "lg",
    model3d: "https://modelviewer.dev/shared-assets/models/Astronaut.glb"
  },
  {
    name: "Ghost Mannequin Beige Oversized T-Shirt",
    description: "Beige oversized ghost-mannequin tee — clean garment-only webp, ideal for 3D try-on. No model, no face, studio lighting.",
    category: "Men's Fashion",
    originalPrice: 1499,
    salePrice: 899,
    image: "/ghost-mannequin-beige-oversized-tshirt.webp",
    tryOnImage: "/products/try-on/ghost-mannequin-beige-oversized-tshirt.png",
    tryOnTexture: "/products/try-on/ghost-mannequin-beige-oversized-tshirt.png",
    garmentShape: "tshirt",
    stock: 40,
    size: "lg"
  },
  // --- WOMENS — alag section ke liye 3 aur products (womens images) ---
  {
    name: "Women's Chic Blouse",
    description: "Elegant chic blouse for office and casual wear — soft drape, womens fit.",
    category: "Women's Fashion",
    originalPrice: 2199,
    salePrice: 1399,
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=500",
    tryOnImage: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=500",
    tryOnTexture: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=500",
    garmentShape: "tshirt",
    stock: 25,
    size: "md"
  },
  {
    name: "Women's Summer Kurta",
    description: "Breathable summer kurta — womens ethnic wear, light cotton.",
    category: "Women's Fashion",
    originalPrice: 1899,
    salePrice: 1199,
    image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=500",
    tryOnImage: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=500",
    tryOnTexture: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=500",
    garmentShape: "tshirt",
    stock: 30,
    size: "lg"
  },
  {
    name: "Women's Denim Jacket",
    description: "Trendy womens denim jacket — street style, womens cut.",
    category: "Women's Fashion",
    originalPrice: 2799,
    salePrice: 1899,
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500",
    tryOnImage: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500",
    tryOnTexture: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500",
    garmentShape: "hoodie",
    stock: 18,
    size: "sm"
  },
  // --- KIDS — 2 products ---
  {
    name: "Kids Cool Graphic Tee",
    description: "Fun graphic tee for kids — bright print, comfy cotton.",
    category: "Kids",
    originalPrice: 999,
    salePrice: 599,
    image: "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=500",
    tryOnImage: "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=500",
    tryOnTexture: "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=500",
    garmentShape: "tshirt",
    stock: 40,
    size: "sm"
  },
  {
    name: "Kids Denim Overalls",
    description: "Cute denim overalls for kids — durable, playful design.",
    category: "Kids",
    originalPrice: 1499,
    salePrice: 899,
    image: "https://images.unsplash.com/photo-1518831959646-742c3a379eb8?w=500",
    tryOnImage: "https://images.unsplash.com/photo-1518831959646-742c3a379eb8?w=500",
    tryOnTexture: "https://images.unsplash.com/photo-1518831959646-742c3a379eb8?w=500",
    garmentShape: "tshirt",
    stock: 35,
    size: "sm"
  }
]

const seed = async () => {
  try {
    await mongoose.connect(mongoUri)
    console.log(`Connected: ${mongoose.connection.name}`)
    await Product.deleteMany({})
    console.log("Old products cleared")
    const inserted = await Product.insertMany(sampleProducts)
    console.log(`Seeded ${inserted.length} products`)
    process.exit(0)
  } catch (e) {
    console.error("Seed failed:", e.message)
    process.exit(1)
  }
}
seed()

# Meta Fashion 👗✨

**Meta Fashion** is a full-stack **MERN e-commerce app** for T-shirts and clothing with modern Virtual Try-On (VTO), secure checkout, and admin panel.

> Formerly "Libas Mitr" — rebranded as Meta Fashion

---

## ✨ Features
* Product Catalog, Search & Filters
* Cart & Checkout, Razorpay Payments, Order Management
* JWT Auth, Admin Dashboard
* Virtual Try-On (Replicate + basic overlay)

## 🧱 Tech Stack
React + Redux Toolkit + Tailwind + Vite | Node + Express + Mongoose | MongoDB Atlas | Cloudinary | Replicate

## ⚙️ Setup
```bash
git clone <your-new-repo-url>
cd meta-fashion
npm install
cd client && npm install --legacy-peer-deps && cd ..
cp .env.example .env  # edit values
npm run dev
```
Frontend: http://localhost:5173 | Backend: http://localhost:5000

## 📁 Structure
```
meta-fashion/
├─ client/  # React frontend
├─ server/  # Express backend
├─ uploads/
├─ .env / .env.example
└─ package.json
```

## 🔑 Env (.env)
```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/metafashion
JWT_SECRET=your_jwt_secret_change_this
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
REPLICATE_API_TOKEN=...
Frontend_URL=http://localhost:5173
NODE_ENV=development
```

## 🚀 Push to your new GitHub repo
```bash
cd meta-fashion
git init
git add .
git commit -m "Initial commit: Meta Fashion"
git branch -M main
git remote add origin https://github.com/<username>/meta-fashion.git
git push -u origin main
```

License: MIT

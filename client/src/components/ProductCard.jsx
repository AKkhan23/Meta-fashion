import { Link, useNavigate } from 'react-router-dom'
import React from 'react'
import { useDispatch } from 'react-redux'
import { addItemToCart } from '../features/cart/cartSlice'

const ProductCard = ({ product }) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const customStyle = {
        backgroundImage: `url(${product.image})`,
    }
    const handleAddToCart = (e) => {
        e.preventDefault()
        dispatch(addItemToCart({ productId: product._id, qty: 1 }))
        navigate("/auth/cart")
    }
    const handleBuyNow = (e) => {
        e.preventDefault()
        dispatch(addItemToCart({ productId: product._id, qty: 1 }))
        navigate("/auth/cart")
    }
    return (
        <div className="bg-white rounded-3xl overflow-hidden border border-charcoal/5 hover:shadow-[0_16px_32px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300">
            <div style={customStyle} className="aspect-[3/4] bg-[#F3F0EB] relative bg-center bg-cover">
                <span className="absolute top-4 left-4 bg-white/90 backdrop-blur text-charcoal text-xs font-semibold px-3 py-1 rounded-full border border-charcoal/10">
                    Get {Math.round(((product.originalPrice - product.salePrice) / product.originalPrice) * 100)}% Off
                </span>
            </div>
            <div className="p-5">
                <h3 className="font-bold text-charcoal mb-1">{product.name}</h3>
                <p className="text-sm text-charcoal/60 mb-1">{product.category}</p>
                <p className="text-xl font-bold text-charcoal mb-3">₹{product.salePrice} <span className="text-xs font-normal text-charcoal/40 line-through">₹{product.originalPrice}</span></p>
                {/* Try Now — virtual try, not touched */}
                <Link to={`/collections/${product._id}`} className="block w-full text-center bg-[var(--color-cream)] border border-charcoal/10 text-charcoal py-2.5 rounded-xl text-sm font-medium hover:border-charcoal/20 transition-colors mb-2">
                    Try Now
                </Link>
                <div className="grid grid-cols-2 gap-2">
                    <button onClick={handleAddToCart} className="border border-charcoal/10 text-charcoal py-2.5 rounded-xl text-sm font-medium hover:bg-charcoal hover:text-white transition-colors">Add to Cart</button>
                    <button onClick={handleBuyNow} className="bg-[var(--color-gold)] text-white py-2.5 rounded-xl text-sm font-semibold hover:brightness-95 transition-all">Buy Now</button>
                </div>
            </div>
        </div>
    )
}

export default ProductCard

import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { removeCartItem, updateCartItems } from '../features/cart/cartSlice'
import { toast } from 'react-toastify'

const CartItem = ({ item }) => {



    const dispatch = useDispatch()


    const handleRemoveItem = (id) => {
        dispatch(removeCartItem(id))
    }

    const handleCartItemUpdate = (cartData) => {

        if (cartData.qty <= 0) {
            dispatch(removeCartItem(cartData.productId))
        } else {
            dispatch(updateCartItems(cartData))
        }

    }





    return (
        <div className="bg-white rounded-3xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex flex-col sm:flex-row gap-6">
                <div style={{ backgroundImage: `url(${item.product.image})` }} className="w-full sm:w-32 h-40 rounded-2xl flex-shrink-0 bg-cover bg-center"></div>

                <div className="flex-1">
                    <div className="flex justify-between items-start mb-3">
                        <div>
                            <h3 className="text-lg font-bold text-neutral-900 mb-1">{item.product.name}</h3>
                            <p className="text-sm text-gray-600">{item.product.category}</p>
                        </div>
                        <button onClick={() => handleRemoveItem(item.product._id)} className="text-gray-400 hover:text-red-500 transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="flex items-center gap-4 mb-4">
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Size</p>
                            <p className="text-sm font-semibold text-neutral-900">{item.product.size.toUpperCase()}</p>
                        </div>
                    </div>

                    <div className="flex justify-between items-center">
                        <div className="flex items-center border-2 border-gray-300 rounded-xl overflow-hidden">
                            <button onClick={() => handleCartItemUpdate({ productId: item.product._id, qty: item.qty - 1 })} className="px-4 py-2 hover:bg-gray-100 transition-colors">
                                <span className="text-lg font-semibold">−</span>
                            </button>
                            <span className="px-4 py-2 font-semibold text-neutral-900 border-x-2 border-gray-300">{item.qty}</span>
                            <button onClick={() => handleCartItemUpdate({ productId: item.product._id, qty: item.qty + 1 })} className="px-4 py-2 hover:bg-gray-100 transition-colors">
                                <span className="text-lg font-semibold">+</span>
                            </button>
                        </div>
                        <p className="text-2xl font-bold text-neutral-900">₹{item.product.salePrice}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CartItem

import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { applyCouponOnCart } from '../features/cart/cartSlice'
import { toast } from 'react-toastify'
import { checkoutWithOrder } from '../features/order/orderSlice'
import { useNavigate } from 'react-router-dom'

const OrderSummary = ({ cart }) => {

    const { user } = useSelector(state => state.auth)
    const { coupon, cartLoading, cartSuccess, couponError, couponErrorMessage } = useSelector(state => state.cart)
    const { order, orderSuccess, orderError, orderLoading, orderErrorMessage } = useSelector(state => state.order)

    const [couponCode, setCouponCode] = useState(coupon ? coupon.coupanCode : "")
    const [shippingAddress, setShippingAddress] = useState(user.address)

    const dispatch = useDispatch()
    const navigate = useNavigate()



    let subTotal = cart.products.reduce((acc, item) => acc + item.product.salePrice * item.qty, 0)
    let shippingChrages = 0
    let taxPrice = 0
    let total = subTotal + shippingChrages + taxPrice
    let couponDiscount = coupon ? subTotal * coupon.coupanDiscount / 100 : 0





    const handleApplyCoupon = (coupanCode) => {
        dispatch(applyCouponOnCart({ coupanCode }))

    }


    const handlePlaceOrder = (orderDetails) => {
        dispatch(checkoutWithOrder(orderDetails))
    }


    useEffect(() => {

        if (orderSuccess && order) {
            navigate("/auth/profile")
        }


        if (couponError && couponErrorMessage || orderError && orderErrorMessage) {
            toast.error(couponErrorMessage, { position: "top-center" })
        }


    }, [couponError, couponErrorMessage, orderError, orderErrorMessage, orderSuccess, order])



    return (
        <div>
            <div className="bg-white rounded-3xl shadow-md p-6 sticky top-6">
                <h3 className="text-xl font-bold text-neutral-900 mb-6">Order Summary</h3>

                <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                    <div className="flex justify-between">
                        <span className="text-gray-700">Subtotal</span>
                        <span className="font-semibold text-neutral-900">₹{subTotal}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-700">Shipping</span>
                        <span className="font-semibold text-neutral-900">₹{shippingChrages}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-700">Tax</span>
                        <span className="font-semibold text-neutral-900">₹{taxPrice}</span>
                    </div>
                </div>

                <div className="mb-6">
                    <label htmlFor="coupon" className="block text-sm font-semibold text-neutral-900 mb-2">
                        Have a coupon?
                    </label>
                    <div className="flex gap-2">
                        <input
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            type="text"
                            id="coupon"
                            placeholder="Enter coupon code"
                            className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent"
                        />
                        <button onClick={() => handleApplyCoupon(couponCode)} className="px-6 py-3 bg-amber-600 text-white rounded-xl font-semibold hover:bg-amber-700 transition-colors">
                            Apply
                        </button>
                    </div>
                    {
                        coupon && <p className="text-xs text-green-500 mt-2">{coupon.coupanCode} Applied : You Are Getting {coupon.coupanDiscount}% Discount</p>
                    }
                </div>

                <div className="mb-6">
                    <label htmlFor="coupon" className="block text-sm font-semibold text-neutral-900 mb-2">
                        Shipping Address
                    </label>
                    <div className="flex gap-2 flex-col">
                        <input
                            value={shippingAddress}
                            onChange={(e) => setShippingAddress(e.target.value)}
                            type="text"
                            id="shippingAddress"
                            placeholder="Enter shipping adress"
                            className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent"
                        />
                        <p className="text-xs text-gray-500 mt-2">You can change shipping address here</p>
                    </div>

                </div>

                <div className="flex justify-between mb-6 pt-6 border-t border-gray-200">
                    <span className="text-lg font-bold text-neutral-900">Total</span>
                    <span className="text-2xl font-bold text-neutral-900">₹{total - couponDiscount}</span>
                </div>

                <button onClick={() => handlePlaceOrder({ shippingAddress: shippingAddress, coupon: coupon?.coupanCode ? coupon?.coupanCode : "" })} className="w-full bg-[var(--color-gold)] to-amber-600 text-white py-4 rounded-xl font-bold hover:from-amber-700 hover:to-amber-700 transition-all shadow-lg mb-3">
                    Proceed to Checkout
                </button>

                <div className="bg-violet-50 rounded-2xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                        <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        <span className="text-sm font-semibold text-neutral-900">Secure Checkout</span>
                    </div>
                    <p className="text-xs text-gray-600">Your payment information is encrypted and secure</p>
                </div>
            </div>
        </div>
    )
}

export default OrderSummary

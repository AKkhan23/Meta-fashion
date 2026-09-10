import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { applyCouponOnCart } from '../features/cart/cartSlice'
import { checkoutWithOrder } from '../features/order/orderSlice'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const OrderSummary = ({ cart }) => {
    const { user } = useSelector(state => state.auth)
    const { coupon, couponError, couponErrorMessage } = useSelector(state => state.cart)
    const { order, orderSuccess, orderError, orderErrorMessage } = useSelector(state => state.order)
    const [couponCode, setCouponCode] = useState(coupon ? coupon.coupanCode : "")
    const [fullName, setFullName] = useState(user?.name || "")
    const [phone, setPhone] = useState(user?.phone || "")
    const [house, setHouse] = useState("")
    const [street, setStreet] = useState("")
    const [city, setCity] = useState("")
    const [pincode, setPincode] = useState("")
    const [landmark, setLandmark] = useState("")
    const [paymentMethod, setPaymentMethod] = useState("COD")
    const [showSuccess, setShowSuccess] = useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const validProducts = cart?.products?.filter(p => p.product) || []
    let subTotal = validProducts.reduce((acc, item) => acc + item.product.salePrice * item.qty, 0)
    let couponDiscount = coupon ? subTotal * coupon.coupanDiscount / 100 : 0
    let total = subTotal - couponDiscount

    const handleApplyCoupon = () => dispatch(applyCouponOnCart({ coupanCode: couponCode }))

    const handlePlaceOrder = () => {
        if (!fullName.trim() || !phone.trim() || !house.trim() || !street.trim() || !city.trim() || !pincode.trim()) {
            toast.error("Please fill all address fields", { position: "top-center" })
            return
        }
        if (!/^\d{6}$/.test(pincode.trim())) {
            toast.error("Pincode must be 6 digits", { position: "top-center" })
            return
        }
        if (!/^\d{10}$/.test(phone.trim())) {
            toast.error("Phone must be 10 digits", { position: "top-center" })
            return
        }
        if (validProducts.length === 0) {
            toast.error("Cart is empty", { position: "top-center" })
            return
        }
        const shippingAddress = `${fullName}, ${phone} | ${house}, ${street}${landmark ? ', ' + landmark : ''}, ${city} - ${pincode}`
        dispatch(checkoutWithOrder({ shippingAddress, coupon: coupon?.coupanCode || "", paymentMethod }))
    }

    const [hasShownSuccess, setHasShownSuccess] = useState(false)
    useEffect(() => {
        if (orderSuccess && order?._id && !hasShownSuccess) { setShowSuccess(true); setHasShownSuccess(true) }
        if (couponError && couponErrorMessage) toast.error(couponErrorMessage, { position: "top-center" })
        if (orderError && orderErrorMessage) toast.error(orderErrorMessage, { position: "top-center" })
    }, [couponError, couponErrorMessage, orderError, orderErrorMessage, orderSuccess, order, hasShownSuccess])

    return (
        <div>
            {showSuccess && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-8 text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">✓</div>
                        <h3 className="text-xl font-bold mb-2">Order Placed!</h3>
                        <p className="text-sm text-gray-600 mb-1">Payment: <b>{order?.paymentMethod || paymentMethod}</b></p>
                        <p className="text-xs text-gray-500 mb-6">Order ID: #{order?._id?.slice(-8)}</p>
                        <button onClick={() => { setShowSuccess(false); navigate('/profile') }} className="w-full py-3 rounded-xl bg-amber-600 text-white font-semibold hover:bg-amber-700">View My Orders</button>
                    </div>
                </div>
            )}
            <div className="bg-white rounded-3xl shadow-md p-6 sticky top-6">
                <h3 className="text-xl font-bold text-neutral-900 mb-6">Order Summary</h3>
                <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                    <div className="flex justify-between"><span className="text-gray-700">Subtotal ({validProducts.length} items)</span><span className="font-semibold">₹{subTotal}</span></div>
                    <div className="flex justify-between"><span className="text-gray-700">Shipping</span><span className="font-semibold text-green-600">FREE</span></div>
                    {couponDiscount > 0 && <div className="flex justify-between text-green-600"><span>Coupon Discount</span><span>-₹{couponDiscount.toFixed(0)}</span></div>}
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-semibold mb-2">Have a coupon?</label>
                    <div className="flex gap-2">
                        <input value={couponCode} onChange={(e) => setCouponCode(e.target.value)} placeholder="Enter coupon code" className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-600" />
                        <button onClick={handleApplyCoupon} className="px-6 py-3 bg-amber-600 text-white rounded-xl font-semibold hover:bg-amber-700">Apply</button>
                    </div>
                    {coupon && <p className="text-xs text-green-600 mt-2">{coupon.coupanCode} Applied: {coupon.coupanDiscount}% OFF</p>}
                </div>

                <div className="mb-4 border border-gray-100 rounded-2xl p-4 bg-gray-50/50">
                    <h4 className="text-sm font-bold mb-3 flex items-center gap-2">📍 Shipping Address *</h4>
                    <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-xs font-medium text-gray-600">Full Name *</label>
                                <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Rahul Sharma" className="w-full mt-1 px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent" />
                            </div>
                            <div>
                                <label className="text-xs font-medium text-gray-600">Phone *</label>
                                <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="9876543210" maxLength={10} className="w-full mt-1 px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-600" />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-medium text-gray-600">House / Flat No *</label>
                            <input value={house} onChange={(e) => setHouse(e.target.value)} placeholder="House 123, Block A" className="w-full mt-1 px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-600" />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-gray-600">Street / Area *</label>
                            <input value={street} onChange={(e) => setStreet(e.target.value)} placeholder="MG Road, Near Metro" className="w-full mt-1 px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-600" />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-gray-600">Landmark (optional)</label>
                            <input value={landmark} onChange={(e) => setLandmark(e.target.value)} placeholder="Near City Mall" className="w-full mt-1 px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-600" />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-xs font-medium text-gray-600">City *</label>
                                <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Delhi" className="w-full mt-1 px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-600" />
                            </div>
                            <div>
                                <label className="text-xs font-medium text-gray-600">Pincode *</label>
                                <input value={pincode} onChange={(e) => setPincode(e.target.value)} placeholder="110001" maxLength={6} className="w-full mt-1 px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-600" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-semibold mb-2">Payment Method *</label>
                    <div className="grid grid-cols-3 gap-2">
                        {[
                            { id: "COD", label: "Cash on Delivery", icon: "💵" },
                            { id: "UPI", label: "UPI", icon: "📱" },
                            { id: "Card", label: "Card", icon: "💳" },
                        ].map(m => (
                            <button key={m.id} onClick={() => setPaymentMethod(m.id)} className={`p-3 rounded-xl border-2 text-xs font-semibold flex flex-col items-center gap-1 ${paymentMethod === m.id ? "border-amber-600 bg-amber-50 text-amber-700" : "border-gray-200 hover:border-gray-300"}`}>
                                <span className="text-lg">{m.icon}</span>{m.label}
                            </button>
                        ))}
                    </div>
                    {paymentMethod === "UPI" && <p className="text-xs text-gray-500 mt-2">UPI ID will be asked on delivery / next step (demo)</p>}
                    {paymentMethod === "COD" && <p className="text-xs text-green-600 mt-2">Pay when delivered — no advance needed</p>}
                </div>

                <div className="flex justify-between mb-6 pt-6 border-t border-gray-200">
                    <span className="text-lg font-bold">Total</span><span className="text-2xl font-bold">₹{total.toFixed(0)}</span>
                </div>

                <button onClick={handlePlaceOrder} disabled={validProducts.length === 0} className={`w-full py-4 rounded-xl font-bold shadow-lg mb-3 ${validProducts.length === 0 ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-[var(--color-gold)] text-white hover:brightness-95"}`}>
                    {paymentMethod === "COD" ? "Place Order (COD)" : `Pay with ${paymentMethod} & Place Order`}
                </button>

                <div className="bg-violet-50 rounded-2xl p-4">
                    <p className="text-xs text-gray-600 text-center">🔒 Secure Checkout • Real e-commerce flow with address + payment</p>
                </div>
            </div>
        </div>
    )
}
export default OrderSummary

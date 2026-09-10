import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { LoadingScreen } from './LoadingScreen'
import { toast } from 'react-toastify'

const OrderDetailsModal = ({ handleShowOrder }) => {

    const { order, orderSuccess, orderError, orderLoading, orderErrorMessage } = useSelector(state => state.order)

    // Guard: order initially {} -> myOrder undefined until fetch completes
    const myOrder = order?.myOrder

    // Safe subtotal — handle null product (deleted/archived) gracefully
    let subTotal = 0
    if (myOrder?.products?.length) {
        subTotal = myOrder.products.reduce((acc, item) => acc + (item?.product?.salePrice || 0) * (item?.qty || 0), 0)
    }

    useEffect(() => {
        if (orderError && orderErrorMessage) {
            toast.error(orderErrorMessage, { position: "top-center" })
        }
    }, [orderError, orderErrorMessage])

    if (orderLoading) {
        return (
            <LoadingScreen loadingMessage={"Getting Orders"} />
        )
    }

    // Don't crash if modal opened before data loads or order was deleted
    if (!myOrder) {
        return (
            <div className="absolute top-20 right-15 md:right-40 z-40 w-4/5 bg-white rounded-2xl shadow-md p-6 mb-12 text-center">
                <p className="text-gray-600">Order details not available.</p>
                <button onClick={() => handleShowOrder(null)} className="mt-4 px-4 py-2 bg-gray-900 text-white rounded-xl text-sm">Close</button>
            </div>
        )
    }


    return (
        <div className="absolute top-20 right-15 md:right-40 z-40 w-4/5 bg-white rounded-2xl shadow-md p-6 mb-12">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
                <button onClick={() => handleShowOrder(null)} className="text-gray-500 hover:text-gray-900 transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-500 mb-1">Order ID</p>
                    <p className="font-semibold text-gray-900"># {myOrder._id}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-500 mb-1">Order Date</p>
                    <p className="font-medium text-gray-900">{myOrder.createdAt ? new Date(myOrder.createdAt).toLocaleDateString('en-IN') : '-'}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-500 mb-1">Status</p>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {myOrder.status}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="border border-gray-200 rounded-xl p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Shipping Address</h3>
                    <p className="text-gray-600 text-sm">{myOrder.user?.name || '—'}</p>
                    <p className="text-gray-600 text-sm">{myOrder.shippingAddress || '—'}</p>
                </div>
                <div className="border border-gray-200 rounded-xl p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Payment Method</h3>
                    <div className="flex items-center space-x-3">
                        <div className={`w-12 h-8 rounded flex items-center justify-center text-white text-xs font-bold ${myOrder.paymentMethod === 'COD' ? 'bg-green-600' : myOrder.paymentMethod === 'UPI' ? 'bg-blue-600' : 'bg-amber-600'}`}>
                            {myOrder.paymentMethod || 'COD'}
                        </div>
                        <div>
                            <p className="text-gray-900 font-medium">{myOrder.paymentMethod === 'COD' ? 'Cash on Delivery' : myOrder.paymentMethod === 'UPI' ? 'UPI Payment' : 'Card Payment'}</p>
                            <p className="text-gray-500 text-sm">{myOrder.paymentMethod === 'COD' ? 'Pay on delivery' : 'Paid online'}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
                <h3 className="font-semibold text-gray-900 mb-4">Order Items</h3>
                <div className="space-y-4">
                    {
                        myOrder.products.map((item, idx) => {
                            // item has _id:false in schema -> no item._id, use product id + idx
                            const p = item.product
                            return (
                                <div key={p?._id ? `${p._id}-${idx}` : `item-${idx}`} className="flex items-center space-x-4 pb-4 border-b border-gray-100">
                                    <div style={{ backgroundImage: `url(${p?.image || ''})` }} className="w-20 h-20 sm:w-24 sm:h-24 bg-cover bg-center rounded-lg flex-shrink-0 bg-gray-100"></div>
                                    <div className="flex-grow">
                                        <h4 className="font-semibold text-gray-900 mb-1">{p?.name || 'Product unavailable'}</h4>
                                        <p className="text-sm text-gray-600 mb-1">Size: {p?.size ? p.size.toUpperCase() : '-'}</p>
                                        <p className="text-sm text-gray-500">Qty: {item.qty}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-gray-900"> ₹ {p?.salePrice ?? '-'}</p>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>

                <div className="mt-6 space-y-2">
                    <div className="flex justify-between text-gray-600">
                        <span>Subtotal</span>
                        <span>₹{subTotal}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                        <span>Shipping</span>
                        <span>₹0.00</span>
                    </div>
                    <div className="flex justify-between text-green-600">
                        <span>Discount</span>
                        {myOrder.isDiscounted ? <span> - ₹{subTotal - myOrder.totalBillAmount}</span> : <span>₹0.00</span>}
                    </div>
                    <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t border-gray-200">
                        <span>Total</span>
                        <span>₹{myOrder.totalBillAmount} </span>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default OrderDetailsModal

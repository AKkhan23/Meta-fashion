import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCartItems } from "../features/cart/cartSlice";
import { toast } from "react-toastify";
import { LoadingScreen } from "../components/LoadingScreen";
import CartItem from "../components/CartItem";
import OrderSummary from "../components/OrderSummary";

function Cart() {

    const { cart, cartLoading, cartSuccess, cartError, cartMessage } = useSelector(state => state.cart)

    const dispatch = useDispatch()



    useEffect(() => {
        // Api Call - only once on mount if cart is null
        if (!cart) {
            dispatch(getCartItems())
        }
    }, [dispatch, cart])

    useEffect(() => {
        if (cartError && cartMessage) {
            toast.error(cartMessage, { position: "top-center" })
        }
    }, [cartError, cartMessage])


    if (!cart || cartLoading) {
        return (
            <LoadingScreen loadingMessage={"Cart Is Loading..."} />
        )
    }





    return (
        <div className="min-h-screen bg-stone-50">
            <div className="max-w-7xl mx-auto px-4 py-6">
                <nav className="text-sm text-gray-600 mb-6">
                    <span>Home</span> <span className="mx-2">/</span>
                    <span className="text-neutral-900 font-medium">Shopping Cart</span>
                </nav>

                <h2 className="text-4xl font-bold text-neutral-900 mb-8">Your Cart</h2>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <div className="space-y-4">
                            {cart?.products?.map((item) => (
                                <CartItem key={item.product._id} item={item} />
                            ))}
                        </div>

                        <button className="mt-6 text-amber-600 font-semibold hover:text-amber-700 transition-colors flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Continue Shopping
                        </button>
                    </div>

                    <OrderSummary cart={cart} />
                </div>
            </div>
        </div>
    );
}

export default Cart;
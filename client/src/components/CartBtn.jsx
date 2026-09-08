import { ShoppingCart } from "lucide-react"
import { Link } from "react-router-dom"

const CartBtn = () => {
    return (
        <div className="fixed bottom-5 left-5">
            <Link to={"/auth/cart"} className="bg-charcoal text-white font-bold text-xl flex items-center justify-center p-2 h-12 w-12 rounded-full"><ShoppingCart /></Link>
        </div>
    )
}

export default CartBtn

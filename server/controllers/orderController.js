import Cart from "../models/cartModel.js";
import Coupan from "../models/coupanModel.js";
import Order from "../models/orderModal.js";


const placeOrder = async (req, res) => {
    const userId = req.user._id;

    let { shippingAddress } = req.body

    if (!shippingAddress) {
        res.status(409)
        throw new Error("Please Provide Shipping Address")
    }

    // Find If Coupon Exists
    let couponCode = await Coupan.findOne({ coupanCode: req.body?.coupon })

    // Find Cart
    const cart = await Cart.findOne({ user: userId })
        .populate('products.product');



    if (!cart) {
        res.status(404)
        throw new Error("Cart not found")
    }

    let totalBill = cart.products.reduce((acc, product) => {
        return acc + product.product.salePrice * product.qty
    }, 0)

    // Apply Coupan Discount
    totalBill = couponCode ? totalBill - (totalBill * couponCode.coupanDiscount / 100) : totalBill


    const order = new Order({
        user: userId,
        products: cart.products,
        totalBillAmount: totalBill,
        isDiscounted: couponCode ? true : false,
        coupon: couponCode ? couponCode._id : null,
        shippingAddress: shippingAddress
    })


    await order.save()


    if (!order) {
        res.status(409)
        throw new Error("Order Not Created!")
    }


    // If ordered clear the cart
    await cart.deleteOne();
    res.status(201).json(order)


}

const cancelOrder = async (req, res) => {
    const orderId = req.params.oid

    const myOrder = await Order.findById(orderId).populate('products.product').populate('user')

    if (!myOrder) {
        res.status(404)
        throw new Error('Order Not Found!')
    }

    if (myOrder.status === "placed") {

        const updatedOrder = await Order.findByIdAndUpdate(orderId, { status: "cancelled" }, { new: true })

        if (!updatedOrder) {
            res.status(409)
            throw new Error("Order Cannot Be Cancelled!")
        }

        res.status(200).json({
            message: "Order Cancelled",
            updatedOrder
        })
    } else {
        res.status(409)
        throw new Error("Order Cannot Be Cancelled!")
    }
}

const getOrders = async (req, res) => {

    const userId = req.user._id

    const myOrders = await Order.find({ user: userId }).populate('products.product').populate('user')



    if (!myOrders) {
        res.status(404)
        throw new Error('Orders Not Found!')
    }

    res.status(200).json(myOrders)

}

const getOrder = async (req, res) => {
    const orderId = req.params.oid

    try {
        const myOrder = await Order.findById(orderId).populate('products.product').populate('user')

        if (!myOrder) {
            res.status(404)
            throw new Error('Order Not Found!')
        }

        res.status(200).json({
            myOrder
        })
    } catch (error) {
        res.status(404)
        throw new Error('Order Not Found!')
    }
}


const orderControllers = { placeOrder, cancelOrder, getOrders, getOrder }

export default orderControllers
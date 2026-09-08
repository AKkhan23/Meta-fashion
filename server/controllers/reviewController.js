import Order from "../models/orderModal.js"
import Review from "../models/reviewModel.js"

const getReviews = async (req, res) => {
    const productId = req.product
    let reviews = await Review.find({ product: productId }).populate("user")

    if (!reviews) {
        res.status(404)
        throw new Error("Reviews Not Found!")
    } else {
        res.status(200).json(reviews)
    }
}

const getReview = async (req, res) => {
    let review = await Review.findById(req.params.pid)

    if (!review) {
        res.status(404)
        throw new Error("Review Not Found!")
    } else {
        res.status(200).json(review)
    }
}

const addReview = async (req, res) => {

    const userId = req.user._id
    const productId = req.product
    const { rating, text } = req.body


    if (!rating || !text) {
        res.status(409)
        throw new Error("Please Fill All Details!")
    }

    // Check if verified buyer
    let orders = (await Order.find({ user: userId }).populate("products.product"))

    let orderHistory = orders.map((order) => order.products).flat()

    let productExist = orderHistory.filter((product) => {
        return product.product.toString() === productId
    })



    const review = new Review({
        user: userId,
        product: productId,
        rating: rating,
        text: text,
        isVerifiedBuyer: productExist.length !== 0 ? true : false
    })

    await review.save()
    await review.populate("user")
    await review.populate("product")

    if (!review) {
        res.status(409)
        throw new Error("Review Not Saved")
    }


    res.status(201).json(review)


}

const reviewController = { getReviews, addReview, getReview }


export default reviewController
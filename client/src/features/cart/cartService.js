import axios from "axios"

const addToCart = async (token, cartData) => {

    let options = {
        headers: {
            authorization: `Bearer ${token}`
        }
    }


    const response = await axios.post("/api/cart", cartData, options)
    return response.data


}

const getCart = async (token) => {

    let options = {
        headers: {
            authorization: `Bearer ${token}`
        }
    }


    const response = await axios.get("/api/cart", options)
    return response.data


}


const removeFromCart = async (token, productId) => {

    let options = {
        headers: {
            authorization: `Bearer ${token}`
        }
    }


    const response = await axios.delete("/api/cart/" + productId, options)
    return response.data


}


const updateCart = async (token, cartData) => {
    let options = {
        headers: {
            authorization: `Bearer ${token}`
        }
    }


    const response = await axios.put("/api/cart/", cartData, options)
    return response.data
}


const applyCoupon = async (token, coupanCode) => {



    let options = {
        headers: {
            authorization: `Bearer ${token}`
        }
    }

    const response = await axios.post("/api/coupon", coupanCode, options)
    return response.data


}



const cartService = { addToCart, getCart, removeFromCart, updateCart, applyCoupon }

export default cartService
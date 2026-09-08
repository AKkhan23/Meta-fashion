import axios from "axios"

const API_URL = '/api/products'

const fetchProducts = async () => {
    const response = await axios.get(API_URL)
    return response.data
}

const fetchProduct = async (pid) => {
    const response = await axios.get(API_URL + "/" + pid)
    return response.data
}


const fetchReviews = async (pid) => {

    const response = await axios.get(API_URL + "/" + pid + "/review")
    return response.data


}


const createReview = async (token, reviewData) => {

    console.log(token)

    let options = {
        headers: {
            authorization: `Bearer ${token}`
        }
    }


    const response = await axios.post(API_URL + "/" + reviewData._id + "/review", reviewData, options)
    return response.data


}




const productService = { fetchProducts, fetchProduct, fetchReviews, createReview }


export default productService
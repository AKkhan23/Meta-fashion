import axios from "axios"

const API_URL = '/api/order'

const placeOrder = async (token, orderDetails) => {
    let options = {
        headers: {
            authorization: `Bearer ${token}`
        }
    }

    const response = await axios.post(API_URL, orderDetails, options)
    return response.data

}

const fetchMyOrders = async (token) => {
    let options = {
        headers: {
            authorization: `Bearer ${token}`
        }
    }

    const response = await axios.get(API_URL, options)
    return response.data

}

const fetchMyOrder = async (token, orderId) => {
    let options = {
        headers: {
            authorization: `Bearer ${token}`
        }
    }

    const response = await axios.get(`${API_URL}/${orderId}`, options)
    return response.data

}

const cancelOrder = async (token, orderId) => {
    let options = {
        headers: {
            authorization: `Bearer ${token}`
        }
    }

    const response = await axios.put(`${API_URL}/${orderId}`, { status: "cancelled" }, options)
    return response.data

}


const orderService = { placeOrder, fetchMyOrders, fetchMyOrder, cancelOrder }

export default orderService
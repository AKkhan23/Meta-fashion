import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import orderService from './orderService';

const initialState = {
    orders: [],
    order: {},
    orderLoading: false,
    orderSuccess: false,
    orderError: false,
    orderErrorMessage: ""
}

const orderSlice = createSlice({
    name: "order",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(checkoutWithOrder.pending, (state, action) => {
                state.orderLoading = true
                state.orderSuccess = false
                state.orderError = false
            })
            .addCase(checkoutWithOrder.fulfilled, (state, action) => {
                state.orderLoading = false
                state.orderSuccess = true
                state.order = action.payload
                state.orderError = false
            })
            .addCase(checkoutWithOrder.rejected, (state, action) => {
                state.orderLoading = false
                state.orderSuccess = false
                state.orderError = true
                state.orderErrorMessage = action.payload
            })
            .addCase(getMyOrders.pending, (state, action) => {
                state.orderLoading = true
                state.orderSuccess = false
                state.orderError = false
            })
            .addCase(getMyOrders.fulfilled, (state, action) => {
                state.orderLoading = false
                state.orderSuccess = true
                state.orders = action.payload
                state.orderError = false
            })
            .addCase(getMyOrders.rejected, (state, action) => {
                state.orderLoading = false
                state.orderSuccess = false
                state.orderError = true
                state.orderErrorMessage = action.payload
            })
            .addCase(getMyOrder.pending, (state, action) => {
                state.orderLoading = true
                state.orderSuccess = false
                state.orderError = false
            })
            .addCase(getMyOrder.fulfilled, (state, action) => {
                state.orderLoading = false
                state.orderSuccess = true
                state.order = action.payload
                state.orderError = false
            })
            .addCase(getMyOrder.rejected, (state, action) => {
                state.orderLoading = false
                state.orderSuccess = false
                state.orderError = true
                state.orderErrorMessage = action.payload
            })
            .addCase(cancelMyOrder.pending, (state, action) => {
                state.orderLoading = true
                state.orderSuccess = false
                state.orderError = false
            })
            .addCase(cancelMyOrder.fulfilled, (state, action) => {
                state.orderLoading = false
                state.orderSuccess = true
                state.orders = state.orders.map(order => order._id === action.payload.updatedOrder._id ? action.payload.updatedOrder : order)
                state.orderError = false
            })
            .addCase(cancelMyOrder.rejected, (state, action) => {
                state.orderLoading = false
                state.orderSuccess = false
                state.orderError = true
                state.orderErrorMessage = action.payload
            })
    }
});

export const { } = orderSlice.actions

export default orderSlice.reducer


// Place Order
export const checkoutWithOrder = createAsyncThunk("CHECKOUT/ORDER", async (orderDetails, thunkAPI) => {
    let token = thunkAPI.getState().auth.user.token
    try {
        return await orderService.placeOrder(token, orderDetails)
    } catch (error) {
        let message = error.response?.data?.message || error.message || "Something went wrong"
        return thunkAPI.rejectWithValue(message)
    }
})

// Get Orders
export const getMyOrders = createAsyncThunk("GET/ORDERS", async (_, thunkAPI) => {
    let token = thunkAPI.getState().auth.user.token
    try {
        return await orderService.fetchMyOrders(token)
    } catch (error) {
        let message = error.response?.data?.message || error.message || "Something went wrong"
        return thunkAPI.rejectWithValue(message)
    }
})

// Get Order
export const getMyOrder = createAsyncThunk("GET/ORDER", async (orderId, thunkAPI) => {
    let token = thunkAPI.getState().auth.user.token
    try {
        return await orderService.fetchMyOrder(token, orderId)
    } catch (error) {
        let message = error.response?.data?.message || error.message || "Something went wrong"
        return thunkAPI.rejectWithValue(message)
    }
})

// Cancel Order
export const cancelMyOrder = createAsyncThunk("CANCEL/ORDER", async (orderId, thunkAPI) => {
    let token = thunkAPI.getState().auth.user.token
    try {
        return await orderService.cancelOrder(token, orderId)
    } catch (error) {
        let message = error.response?.data?.message || error.message || "Something went wrong"
        return thunkAPI.rejectWithValue(message)
    }
})
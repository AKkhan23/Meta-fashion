import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import cartService from './cartService';

const initialState = {
    cart: null,
    coupon: null,
    cartLoading: false,
    cartSuccess: false,
    cartError: false,
    cartMessage: "",
    couponError: false,
    couponErrorMessage: ""
}

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {},
    extraReducers: (builder) => {

        builder
            .addCase(addItemToCart.pending, (state, action) => {
                state.cartLoading = true
                state.cartSuccess = false
                state.cartError = false
            })
            .addCase(addItemToCart.fulfilled, (state, action) => {
                state.cartLoading = false
                state.cartSuccess = true
                state.cart = action.payload
                state.cartError = false
            })
            .addCase(addItemToCart.rejected, (state, action) => {
                state.cartLoading = false
                state.cartSuccess = false
                state.cartError = true
                state.cartMessage = action.payload
            })
            .addCase(getCartItems.pending, (state, action) => {
                state.cartLoading = true
                state.cartSuccess = false
                state.cartError = false
            })
            .addCase(getCartItems.fulfilled, (state, action) => {
                state.cartLoading = false
                state.cartSuccess = true
                state.cart = action.payload
                state.cartError = false
            })
            .addCase(getCartItems.rejected, (state, action) => {
                state.cartLoading = false
                state.cartSuccess = false
                state.cartError = true
                state.cartMessage = action.payload
            })
            .addCase(removeCartItem.pending, (state, action) => {
                state.cartLoading = true
                state.cartSuccess = false
                state.cartError = false
            })
            .addCase(removeCartItem.fulfilled, (state, action) => {
                state.cartLoading = false
                state.cartSuccess = true
                state.cart = action.payload
                state.cartError = false
            })
            .addCase(removeCartItem.rejected, (state, action) => {
                state.cartLoading = false
                state.cartSuccess = false
                state.cartError = true
                state.cartMessage = action.payload
            })
            .addCase(updateCartItems.pending, (state, action) => {
                state.cartLoading = true
                state.cartSuccess = false
                state.cartError = false
            })
            .addCase(updateCartItems.fulfilled, (state, action) => {
                state.cartLoading = false
                state.cartSuccess = true
                state.cart = action.payload
                state.cartError = false
            })
            .addCase(updateCartItems.rejected, (state, action) => {
                state.cartLoading = false
                state.cartSuccess = false
                state.cartError = true
                state.cartMessage = action.payload
            })
            .addCase(applyCouponOnCart.pending, (state, action) => {
                state.cartLoading = true
                state.cartSuccess = false
                state.couponError = false
            })
            .addCase(applyCouponOnCart.fulfilled, (state, action) => {
                state.cartLoading = false
                state.cartSuccess = true
                state.coupon = action.payload
                state.couponError = false
            })
            .addCase(applyCouponOnCart.rejected, (state, action) => {
                state.cartLoading = false
                state.cartSuccess = false
                state.couponError = true
                state.couponErrorMessage = action.payload
            })


    }
});

export const { } = cartSlice.actions

export default cartSlice.reducer


// ADD TO CART

export const addItemToCart = createAsyncThunk("ADD/CART", async (cartData, thunkAPI) => {
    let token = thunkAPI.getState().auth.user.token
    try {
        return await cartService.addToCart(token, cartData)
    } catch (error) {
        let message = error.response?.data?.message || error.message || "Something went wrong"
        return thunkAPI.rejectWithValue(message)
    }
})


// GET  CART
export const getCartItems = createAsyncThunk("FETCH/CART", async (_, thunkAPI) => {
    let token = thunkAPI.getState().auth.user.token
    try {
        return await cartService.getCart(token)
    } catch (error) {
        let message = error.response?.data?.message || error.message || "Something went wrong"
        return thunkAPI.rejectWithValue(message)
    }
})

// REMOVE FROM  CART
export const removeCartItem = createAsyncThunk("REMOVE_ITEM/CART", async (productId, thunkAPI) => {
    let token = thunkAPI.getState().auth.user.token
    try {
        return await cartService.removeFromCart(token, productId)
    } catch (error) {
        let message = error.response?.data?.message || error.message || "Something went wrong"
        return thunkAPI.rejectWithValue(message)
    }
})

// UDPATE  CART
export const updateCartItems = createAsyncThunk("UDPATE_ITEM/CART", async (cartData, thunkAPI) => {
    let token = thunkAPI.getState().auth.user.token
    try {
        return await cartService.updateCart(token, cartData)
    } catch (error) {
        let message = error.response?.data?.message || error.message || "Something went wrong"
        return thunkAPI.rejectWithValue(message)
    }
})



// APPLY Coupon
export const applyCouponOnCart = createAsyncThunk("APPLY_COUPON/CART", async (couponCode, thunkAPI) => {
    let token = thunkAPI.getState().auth.user.token
    try {
        return await cartService.applyCoupon(token, couponCode)
    } catch (error) {
        let message = error.response?.data?.message || error.message || "Something went wrong"
        return thunkAPI.rejectWithValue(message)
    }
})




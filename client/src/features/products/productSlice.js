import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import productService from './productService';

const initialState = {

    products: [],
    product: {},
    productReviews: [],
    productLoading: false,
    productSuccess: false,
    productError: false,
    productErrorMessage: ""

}

const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllProducts.pending, (state, action) => {
                state.productLoading = true
                state.productSuccess = false
                state.productError = false
            })
            .addCase(getAllProducts.fulfilled, (state, action) => {
                state.productLoading = false
                state.productSuccess = true
                state.products = action.payload
                state.productError = false
            })
            .addCase(getAllProducts.rejected, (state, action) => {
                state.productLoading = false
                state.productSuccess = false
                state.productError = true
                state.productErrorMessage = action.payload
            })
            .addCase(getProduct.pending, (state, action) => {
                state.productLoading = true
                state.productSuccess = false
                state.productError = false
            })
            .addCase(getProduct.fulfilled, (state, action) => {
                state.productLoading = false
                state.productSuccess = true
                state.product = action.payload
                state.productError = false
            })
            .addCase(getProduct.rejected, (state, action) => {
                state.productLoading = false
                state.productSuccess = false
                state.productError = true
                state.productErrorMessage = action.payload
            })
            .addCase(getProductReviews.pending, (state, action) => {
                state.productLoading = true
                state.productSuccess = false
                state.productError = false
            })
            .addCase(getProductReviews.fulfilled, (state, action) => {
                state.productLoading = false
                state.productSuccess = true
                state.productReviews = action.payload
                state.productError = false
            })
            .addCase(getProductReviews.rejected, (state, action) => {
                state.productLoading = false
                state.productSuccess = false
                state.productError = true
                state.productErrorMessage = action.payload
            })
            .addCase(addProductReview.pending, (state, action) => {
                state.productLoading = true
                state.productSuccess = false
                state.productError = false
            })
            .addCase(addProductReview.fulfilled, (state, action) => {
                state.productLoading = false
                state.productSuccess = true
                state.productReviews = [action.payload, ...state.productReviews]
                state.productError = false
            })
            .addCase(addProductReview.rejected, (state, action) => {
                state.productLoading = false
                state.productSuccess = false
                state.productError = true
                state.productErrorMessage = action.payload
            })
    }
});

export const { } = productSlice.actions

export default productSlice.reducer

// Get All Products
export const getAllProducts = createAsyncThunk("GET/PRODUCTS", async (_, thunkAPI) => {
    try {
        return await productService.fetchProducts()
    } catch (error) {
        let message = error.response?.data?.message || error.message || "Failed to fetch products"
        return thunkAPI.rejectWithValue(message)
    }

})


// Get All Product
export const getProduct = createAsyncThunk("GET/PRODUCT", async (pid, thunkAPI) => {
    try {
        return await productService.fetchProduct(pid)
    } catch (error) {
        let message = error.response?.data?.message || error.message || "Failed to fetch product"
        return thunkAPI.rejectWithValue(message)
    }

})

// Get All Product Reviews
export const getProductReviews = createAsyncThunk("GET/PRODUCT_REVIEWS", async (pid, thunkAPI) => {
    try {
        return await productService.fetchReviews(pid)
    } catch (error) {
        let message = error.response?.data?.message || error.message || "Failed to fetch reviews"
        return thunkAPI.rejectWithValue(message)
    }

})

// Add Product Reviews
export const addProductReview = createAsyncThunk("ADD/PRODUCT_REVIEWS", async (reviewData, thunkAPI) => {
    let token = thunkAPI.getState().auth.user.token
    try {
        return await productService.createReview(token, reviewData)
    } catch (error) {
        let message = error.response?.data?.message || error.message || "Failed to add review"
        return thunkAPI.rejectWithValue(message)
    }

})
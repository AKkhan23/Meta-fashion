import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import adminService from './adminService';

const initialState = {
    adminIsLoading: false,
    adminIsSuccess: false,
    adminIsError: false,
    adminErrorMessage: "",
    allUsers: [],
    allProducts: [],
    allOrders: [],
    allCoupons: [],
    allReviews: [],
    productEdit: { product: {}, isEdit: false }
}

const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
        editProduct: (state, action) => {
            return {
                ...state,
                productEdit: { product: action.payload, isEdit: true }
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllUsersForAdmin.pending, (state, action) => {
                state.adminIsLoading = true
                state.adminIsSuccess = false
                state.adminIsError = false
                state.adminErrorMessage = ""
            })
            .addCase(getAllUsersForAdmin.fulfilled, (state, action) => {
                state.adminIsLoading = false
                state.adminIsSuccess = true
                state.allUsers = action.payload
                state.adminIsError = false
                state.adminErrorMessage = ""
            })
            .addCase(getAllUsersForAdmin.rejected, (state, action) => {
                state.adminIsLoading = false
                state.adminIsSuccess = false
                state.adminIsError = true
                state.adminErrorMessage = action.payload
            })
            .addCase(getAllOrdersForAdmin.pending, (state, action) => {
                state.adminIsLoading = true
                state.adminIsSuccess = false
                state.adminIsError = false
                state.adminErrorMessage = ""
            })
            .addCase(getAllOrdersForAdmin.fulfilled, (state, action) => {
                state.adminIsLoading = false
                state.adminIsSuccess = true
                state.allOrders = action.payload
                state.adminIsError = false
                state.adminErrorMessage = ""
            })
            .addCase(getAllOrdersForAdmin.rejected, (state, action) => {
                state.adminIsLoading = false
                state.adminIsSuccess = false
                state.adminIsError = true
                state.adminErrorMessage = action.payload
            })
            .addCase(updateUser.pending, (state, action) => {
                state.adminIsLoading = true
                state.adminIsSuccess = false
                state.adminIsError = false
                state.adminErrorMessage = ""
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.adminIsLoading = false
                state.adminIsSuccess = true
                state.allUsers = state.allUsers.map(user => user._id === action.payload._id ? action.payload : user)
                state.adminIsError = false
                state.adminErrorMessage = ""
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.adminIsLoading = false
                state.adminIsSuccess = false
                state.adminIsError = true
                state.adminErrorMessage = action.payload
            })
            .addCase(getAllProducts.pending, (state, action) => {
                state.adminIsLoading = true
                state.adminIsSuccess = false
                state.adminIsError = false
                state.adminErrorMessage = ""
            })
            .addCase(getAllProducts.fulfilled, (state, action) => {
                state.adminIsLoading = false
                state.adminIsSuccess = true
                state.allProducts = action.payload
                state.adminIsError = false
                state.adminErrorMessage = ""
            })
            .addCase(getAllProducts.rejected, (state, action) => {
                state.adminIsLoading = false
                state.adminIsSuccess = false
                state.adminIsError = true
                state.adminErrorMessage = action.payload
            })
            .addCase(createProduct.pending, (state, action) => {
                state.adminIsLoading = true
                state.adminIsSuccess = false
                state.adminIsError = false
                state.adminErrorMessage = ""
            })
            .addCase(createProduct.fulfilled, (state, action) => {
                state.adminIsLoading = false
                state.adminIsSuccess = true
                state.allProducts = [action.payload, ...state.allProducts]
                state.adminIsError = false
                state.adminErrorMessage = ""
            })
            .addCase(createProduct.rejected, (state, action) => {
                state.adminIsLoading = false
                state.adminIsSuccess = false
                state.adminIsError = true
                state.adminErrorMessage = action.payload
            })
            .addCase(productUpdate.pending, (state, action) => {
                state.adminIsLoading = true
                state.adminIsSuccess = false
                state.adminIsError = false
                state.adminErrorMessage = ""
            })
            .addCase(productUpdate.fulfilled, (state, action) => {
                state.adminIsLoading = false
                state.adminIsSuccess = true
                state.allProducts = state.allProducts.map(product => product._id === action.payload._id ? action.payload : product)
                state.productEdit = { product: {}, isEdit: false }
                state.adminIsError = false
                state.adminErrorMessage = ""
            })
            .addCase(productUpdate.rejected, (state, action) => {
                state.adminIsLoading = false
                state.adminIsSuccess = false
                state.adminIsError = true
                state.adminErrorMessage = action.payload
            })
            .addCase(orderUpdate.pending, (state, action) => {
                state.adminIsLoading = true
                state.adminIsSuccess = false
                state.adminIsError = false
                state.adminErrorMessage = ""
            })
            .addCase(orderUpdate.fulfilled, (state, action) => {
                state.adminIsLoading = false
                state.adminIsSuccess = true
                state.allOrders = state.allOrders.map(order => order._id === action.payload._id ? action.payload : order)
                state.adminIsError = false
                state.adminErrorMessage = ""
            })
            .addCase(orderUpdate.rejected, (state, action) => {
                state.adminIsLoading = false
                state.adminIsSuccess = false
                state.adminIsError = true
                state.adminErrorMessage = action.payload
            })
            .addCase(getAllCoupons.pending, (state, action) => {
                state.adminIsLoading = true
                state.adminIsSuccess = false
                state.adminIsError = false
                state.adminErrorMessage = ""
            })
            .addCase(getAllCoupons.fulfilled, (state, action) => {
                state.adminIsLoading = false
                state.adminIsSuccess = true
                state.allCoupons = action.payload
                state.adminIsError = false
                state.adminErrorMessage = ""
            })
            .addCase(getAllCoupons.rejected, (state, action) => {
                state.adminIsLoading = false
                state.adminIsSuccess = false
                state.adminIsError = true
                state.adminErrorMessage = action.payload
            })
            .addCase(addCoupon.pending, (state, action) => {
                state.adminIsLoading = true
                state.adminIsSuccess = false
                state.adminIsError = false
                state.adminErrorMessage = ""
            })
            .addCase(addCoupon.fulfilled, (state, action) => {
                state.adminIsLoading = false
                state.adminIsSuccess = true
                state.allCoupons = [action.payload, ...state.allCoupons]
                state.adminIsError = false
                state.adminErrorMessage = ""
            })
            .addCase(addCoupon.rejected, (state, action) => {
                state.adminIsLoading = false
                state.adminIsSuccess = false
                state.adminIsError = true
                state.adminErrorMessage = action.payload
            })
            .addCase(getAllReviews.pending, (state, action) => {
                state.adminIsLoading = true
                state.adminIsSuccess = false
                state.adminIsError = false
                state.adminErrorMessage = ""
            })
            .addCase(getAllReviews.fulfilled, (state, action) => {
                state.adminIsLoading = false
                state.adminIsSuccess = true
                state.allReviews = action.payload
                state.adminIsError = false
                state.adminErrorMessage = ""
            })
            .addCase(getAllReviews.rejected, (state, action) => {
                state.adminIsLoading = false
                state.adminIsSuccess = false
                state.adminIsError = true
                state.adminErrorMessage = action.payload
            })
    }
});

export const { editProduct } = adminSlice.actions

export default adminSlice.reducer



// FETCH ALL USERS
export const getAllUsersForAdmin = createAsyncThunk("FETCH/ADMIN/USERS", async (_, thunkAPI) => {
    let token = thunkAPI.getState().auth.user.token
    try {
        return await adminService.fetchAllUsers(token)
    } catch (error) {
        let message = error.response?.data?.message || error.message || "Failed to fetch users"
        return thunkAPI.rejectWithValue(message)
    }
})

// FETCH ALL ORDERS
export const getAllOrdersForAdmin = createAsyncThunk("FETCH/ADMIN/ORDERS", async (_, thunkAPI) => {
    let token = thunkAPI.getState().auth.user.token
    try {
        return await adminService.fetchAllOrders(token)
    } catch (error) {
        let message = error.response?.data?.message || error.message || "Failed to fetch orders"
        return thunkAPI.rejectWithValue(message)
    }
})


// UPDATE USER
export const updateUser = createAsyncThunk("UPDATE/ADMIN/USER", async (userData, thunkAPI) => {
    let token = thunkAPI.getState().auth.user.token
    try {
        return await adminService.userUpdate(userData, token)
    } catch (error) {
        let message = error.response?.data?.message || error.message || "Failed to update user"
        return thunkAPI.rejectWithValue(message)
    }

})

// ADD PRODUCT
export const createProduct = createAsyncThunk("ADD/ADMIN/PRODUCT", async (formData, thunkAPI) => {
    let token = thunkAPI.getState().auth.user.token
    try {
        return await adminService.addProduct(formData, token)
    } catch (error) {
        let message = error.response?.data?.message || error.message || "Failed to create product"
        return thunkAPI.rejectWithValue(message)
    }

})

// UPDATE PRODUCT
export const productUpdate = createAsyncThunk("UPDATE/ADMIN/PRODUCT", async (formData, thunkAPI) => {
    let token = thunkAPI.getState().auth.user.token
    let productId = thunkAPI.getState().admin.productEdit.product._id
    try {
        return await adminService.updateProduct(formData, productId, token)
    } catch (error) {
        let message = error.response?.data?.message || error.message || "Failed to update product"
        return thunkAPI.rejectWithValue(message)
    }
})


// UPDATE ORDER
export const orderUpdate = createAsyncThunk("UPDATE/ADMIN/ORDER", async (orderDetails, thunkAPI) => {
    let token = thunkAPI.getState().auth.user.token
    try {
        return await adminService.updateOrder(orderDetails, token)
    } catch (error) {
        let message = error.response?.data?.message || error.message || "Failed to update order"
        return thunkAPI.rejectWithValue(message)
    }
})


// FETCH ALL COUPONS
export const getAllCoupons = createAsyncThunk("FETCH/ADMIN/COUPONS", async (_, thunkAPI) => {
    let token = thunkAPI.getState().auth.user.token
    try {
        return await adminService.fetchAllCoupons(token)
    } catch (error) {
        let message = error.response?.data?.message || error.message || "Failed to fetch coupons"
        return thunkAPI.rejectWithValue(message)
    }
})


// FETCH ALL REVIEWS
export const getAllReviews = createAsyncThunk("FETCH/ADMIN/REVIEWS", async (_, thunkAPI) => {
    let token = thunkAPI.getState().auth.user.token
    try {
        return await adminService.fetchAllReviews(token)
    } catch (error) {
        let message = error.response?.data?.message || error.message || "Failed to fetch reviews"
        return thunkAPI.rejectWithValue(message)
    }
})


// ADD COUPON
export const addCoupon = createAsyncThunk("ADD/ADMIN/COUPONS", async (formData, thunkAPI) => {
    let token = thunkAPI.getState().auth.user.token
    try {
        return await adminService.createCoupon(formData, token)
    } catch (error) {
        let message = error.response?.data?.message || error.message || "Failed to create coupon"
        return thunkAPI.rejectWithValue(message)
    }
})




// GET PRODUCTS
export const getAllProducts = createAsyncThunk("GET/ADMIN/PRODUCTS", async (_, thunkAPI) => {
    try {
        return await adminService.getProducts()
    } catch (error) {
        let message = error.response?.data?.message || error.message || "Failed to fetch products"
        return thunkAPI.rejectWithValue(message)
    }

})
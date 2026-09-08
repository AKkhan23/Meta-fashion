import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import authService from "./authService";


let userExist = JSON.parse(localStorage.getItem('user'))


const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: userExist || null,
        isLoading: false,
        isSuccess: false,
        isError: false,
        message: ""
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state, action) => {
                state.isLoading = true
                state.isSuccess = false
                state.isError = false
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.isError = false
                state.user = action.payload
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false
                state.isSuccess = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(loginUser.pending, (state, action) => {
                state.isLoading = true
                state.isSuccess = false
                state.isError = false
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.isError = false
                state.user = action.payload
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false
                state.isSuccess = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(logoutUser.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = false
                state.isError = false
                state.message = ""
                state.user = null
            })
    }
})


export default authSlice.reducer


// REGISTER USER

export const registerUser = createAsyncThunk("AUTH/REGISTER", async (formData, thunkAPI) => {
    try {
        return await authService.register(formData)
    } catch (error) {
        let message = error.response?.data?.message || error.message || "Something went wrong"
        return thunkAPI.rejectWithValue(message)
    }

})

// LOGIN USER

export const loginUser = createAsyncThunk("AUTH/LOGIN", async (formData, thunkAPI) => {
    try {
        return await authService.login(formData)
    } catch (error) {
        let message = error.response?.data?.message || error.message || "Something went wrong"
        return thunkAPI.rejectWithValue(message)
    }

})


// LOGOUT USER
export const logoutUser = createAsyncThunk("AUTH/LOGOUT", async () => {
    localStorage.removeItem('user')
})






// Template :
// import { createSlice } from "@reduxjs/toolkit";

// const authSlice = createSlice({
//     name : 'auth',
//     initialState : {},
//     reducers : {},
//     extraReducers : (builder) => {

//     }
// })


// export default authSlice.reducer
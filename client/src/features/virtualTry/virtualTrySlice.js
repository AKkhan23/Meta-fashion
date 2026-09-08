import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import virtualTryService from './virtualTryService';

const initialState = {
    virtualTry: null,
    virtualTryLoading: false,
    virtualTrySuccess: false,
    virtualTryError: false,
    virtualTryErrorMessage: ""
}

const virtualTrySlice = createSlice({
    name: 'virtual_try',
    initialState,
    reducers: {},
    extraReducers: (builder) => {

        builder
            .addCase(tryCloths.pending, (state, action) => {
                state.virtualTryLoading = true
                state.virtualTrySuccess = false
                state.virtualTryError = false
            })
            .addCase(tryCloths.fulfilled, (state, action) => {
                state.virtualTryLoading = false
                state.virtualTrySuccess = true
                state.virtualTry = action.payload
                state.virtualTryError = false
            })
            .addCase(tryCloths.rejected, (state, action) => {
                state.virtualTryLoading = false
                state.virtualTrySuccess = false
                state.virtualTryError = true
                state.virtualTryErrorMessage = action.payload
            })

    }
});

export const { } = virtualTrySlice.actions

export default virtualTrySlice.reducer


// Virtual Try

export const tryCloths = createAsyncThunk("FETCH/VIRTUAL_TRY", async (formData, thunkAPI) => {
    let token = thunkAPI.getState().auth.user.token
    try {
        return await virtualTryService.virtualTryCloths(formData, token)
    } catch (error) {
        let message = error.response?.data?.message || error.message || "Something went wrong"
        return thunkAPI.rejectWithValue(message)
    }

})
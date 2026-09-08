import axios from "axios"

const virtualTryCloths = async (formData, token) => {
    let options = {
        headers: {
            authorization: `Bearer ${token}`
        }
    }

    console.log(formData)

    const response = await axios.post("/api/virtual_try", formData, options)
    console.log(response)
    return response.data

}


const virtualTryService = { virtualTryCloths }

export default virtualTryService
// src/pages/Products.tsx
import Layout from '../components/Layout';
import { Edit2, Trash2, Plus, Image } from 'lucide-react';
import { LoadingScreen } from '../components/LoadingScreen';
import { toast } from 'react-toastify';
import { createProduct, editProduct, getAllProducts, productUpdate } from '../features/admin/adminSlice';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

function Products() {

    const { user } = useSelector(state => state.auth)
    const { adminIsLoading, adminIsSuccess, adminIsError, adminErrorMessage, allProducts, productEdit } = useSelector(state => state.admin)



    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [formData, setFormData] = useState({
        _id: "",
        name: "",
        description: "",
        salePrice: "",
        originalPrice: "",
        stock: "",
        category: "",
        size: "",
        image: ""
    })


    const { _id, name, description, salePrice, originalPrice, stock, category, size, image } = formData

    const handleChange = (e) => {
        if (e.target.name === "image") {
            const file = e.target.files[0]
            if (file) {
                setFormData({ ...formData, [e.target.name]: file })
            }
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value })
        }
    }


    const handleSubmit = (e) => {
        e.preventDefault()

        // Create FormData object for file upload
        const formDataToSend = new FormData()
        formDataToSend.append('name', name)
        formDataToSend.append('description', description)
        formDataToSend.append('salePrice', salePrice)
        formDataToSend.append('originalPrice', originalPrice)
        formDataToSend.append('stock', stock)
        formDataToSend.append('category', category)
        formDataToSend.append('size', size)
        formDataToSend.append('image', image) // This is the File object


        !productEdit.isEdit ?
            // Add Product
            dispatch(createProduct(formDataToSend)) :
            // Update Product 
            dispatch(productUpdate(formData))

        setFormData({
            _id: "",
            name: "",
            description: "",
            salePrice: "",
            originalPrice: "",
            stock: "",
            category: "",
            size: "",
            image: ""
        })
    }


    const handleProductEdit = (product) => {
        dispatch(editProduct(product))
    }



    useEffect(() => {
        if (!user?.isAdmin) {
            navigate("/")
        } else {
            // Api's Fetching - only once when user becomes admin
            dispatch(getAllProducts())
        }
    }, [user, dispatch, navigate])

    useEffect(() => {
        if (adminIsError && adminErrorMessage) {
            toast.error(adminErrorMessage, { position: "top-center" })
        }
    }, [adminIsError, adminErrorMessage])

    useEffect(() => {
        if (productEdit?.product) {
            setFormData(productEdit.product)
        }
    }, [productEdit])



    if (adminIsLoading) {
        return (
            <LoadingScreen loadingMessage={"Admin Panel Loading...."} />
        )
    }





    return (
        <Layout activeMenu="products" pageTitle="Products">
            <div className="space-y-8">
                <div className="bg-white rounded-xl shadow-md border border-gray-200">
                    <div className="p-6 border-b border-gray-200">
                        <h3 className="text-lg font-bold text-gray-900 mb-6">Add / Update Product</h3>
                        <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="productId" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Product Id
                                    </label>
                                    <input
                                        name='_id'
                                        value={_id}
                                        onChange={handleChange}
                                        type="text"
                                        disabled={true}
                                        id="productName"
                                        placeholder="Product Id"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:bg-gray-200"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="productName" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Product Name
                                    </label>
                                    <input
                                        name='name'
                                        value={name}
                                        onChange={handleChange}
                                        type="text"
                                        id="productName"
                                        placeholder="Enter product name"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Category
                                    </label>
                                    <select
                                        name='category'
                                        value={category}
                                        onChange={handleChange}
                                        id="category"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                    >
                                        <option>Select category</option>
                                        <option value={"Mens's Fashion"}>Men's Fashion</option>
                                        <option value={"Women's Fashion"}>Women's Fashion</option>
                                        <option value={"Accessories"}>Accessories</option>
                                        <option value={"Shoes"}>Shoes</option>
                                        <option value={"Bags"}>Bags</option>
                                    </select>
                                </div>
                                {/* "sm", "md", "lg", "xl", "2xl", "3xl" */}
                                <div>
                                    <label htmlFor="size" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Size
                                    </label>
                                    <select
                                        name='size'
                                        value={size}
                                        onChange={handleChange}
                                        id="size"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                    >
                                        <option>Select size</option>
                                        <option value={'sm'}>Small (sm)</option>
                                        <option value={'md'}>Medium (md)</option>
                                        <option value={"lg"}>Large (lg)</option>
                                        <option value={"xl"}>Xtra Large (xl)</option>
                                        <option value={"2xl"}>2Xtra Large (2xl)</option>
                                        <option value={"3xl"}>3Xtra Large (3xl)</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="price" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Original Price
                                    </label>
                                    <input
                                        name='originalPrice'
                                        value={originalPrice}
                                        onChange={handleChange}
                                        type="number"
                                        id="price"
                                        placeholder="0.00"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="price" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Sale Price
                                    </label>
                                    <input
                                        name='salePrice'
                                        value={salePrice}
                                        onChange={handleChange}
                                        type="number"
                                        id="price"
                                        placeholder="0.00"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="stock" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Stock
                                    </label>
                                    <input
                                        name='stock'
                                        value={stock}
                                        onChange={handleChange}
                                        type="number"
                                        id="stock"
                                        placeholder="0"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Description
                                </label>
                                <textarea
                                    name='description'
                                    value={description}
                                    onChange={handleChange}
                                    id="description"
                                    rows={4}
                                    placeholder="Enter product description"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                ></textarea>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Product Image
                                </label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-amber-500 transition-colors">
                                    <Image className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-sm text-gray-600 mb-2">Click to upload or drag and drop</p>
                                    <p className="text-xs text-gray-500">PNG, JPG, WEBP up to 5MB</p>
                                    <input
                                        name='image'
                                        accept="image/png,image/jpeg,image/webp"
                                        onChange={handleChange} type="file" className="" />
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-colors flex items-center gap-2"
                                >
                                    <Plus className="w-4 h-4" />
                                    {productEdit.isEdit ? "Update Product" : "Add Product"}
                                </button>
                                {/* <button
                                    type="button"
                                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button> */}
                            </div>
                        </form>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md border border-gray-200">
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-gray-900">All Products</h3>
                            <input
                                type="search"
                                placeholder="Search products..."
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                            />
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Image</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Category</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Size</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Price</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Sale Price</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Stock</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {
                                    allProducts.map((product) => {
                                        return (
                                            <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div style={{ backgroundImage: `url(${product.image})` }} className="w-16 h-16 rounded-lg bg-center bg-cover"></div>
                                                </td>
                                                <td className="px-6 py-4 text-sm font-medium text-gray-900">{product.name}</td>
                                                <td className="px-6 py-4 text-sm text-gray-600">{product.category}</td>
                                                <td className="px-6 py-4 text-sm text-gray-600">{product.size}</td>
                                                <td className="px-6 py-4 text-sm font-semibold text-gray-900">{product.originalPrice}</td>
                                                <td className="px-6 py-4 text-sm font-semibold text-gray-900">{product.salePrice}</td>
                                                <td className="px-6 py-4 text-sm text-gray-900">{product.stock}</td>
                                                <td className="px-6 py-4">
                                                    {
                                                        product.stock > 0 ? (<span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">In Stock</span>) : (<span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-green-800">Out Of Stock</span>)
                                                    }
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <button onClick={() => handleProductEdit(product)} className="p-2 text-amber-600 hover:bg-violet-50 rounded-lg transition-colors">
                                                            <Edit2 className="w-4 h-4" />
                                                        </button>
                                                        <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                    <div className="p-6 border-t border-gray-200 flex items-center justify-between">
                        <p className="text-sm text-gray-600">Showing 1 to 6 of 1,245 products</p>
                        <div className="flex items-center gap-2">
                            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                                Previous
                            </button>
                            <button className="px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 transition-colors">
                                1
                            </button>
                            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                                2
                            </button>
                            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                                3
                            </button>
                            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default Products;

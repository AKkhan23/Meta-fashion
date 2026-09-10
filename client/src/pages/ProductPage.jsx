import React, { useEffect, useState } from 'react'
import { LoadingScreen } from '../components/LoadingScreen'
import { useDispatch, useSelector } from 'react-redux'
import { getProduct, getProductReviews } from '../features/products/productSlice'
import { toast } from 'react-toastify'
import { useNavigate, useParams } from 'react-router-dom'
import { addItemToCart } from '../features/cart/cartSlice'
import { ProductReviews } from '../components/ProductReviews'
import { AddReviewForm } from '../components/AddReview'
import { tryCloths } from '../features/virtualTry/virtualTrySlice'

const ProductPage = () => {




    const { user } = useSelector(state => state.auth)
    const { product, productSuccess, productReviews, productLoading, productError, productErrorMessage } = useSelector(state => state.product)
    const { virtualTry, virtualTryLoading, virtualTrySuccess, virtualTryError, virtualTryErrorMessage } = useSelector(state => state.virtualTry)
    // alias for legacy name used below
    const virtualSuccess = virtualTrySuccess

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { pid } = useParams()
    const [showRecharge, setShowRecharge] = useState(false)



    const customStyle = {
        backgroundImage: virtualTry ? `url(${virtualTry?.output_url})` : `url(${product.image})`,
    }


    const [formData, setFormData] = useState({
        person_url: "",
        cloth_url: product.image,
        garment_des: product.description
    })

    // Keep formData in sync when product loads
    useEffect(() => {
        if (product?.image) {
            setFormData(prev => ({ ...prev, cloth_url: product.image, garment_des: product.description }))
        }
    }, [product?.image, product?.description])



    const { person_url, cloth_url, garment_des } = formData

    const handleChange = (e) => {
        if (e.target.name === "person_url") {
            const file = e.target.files[0]
            if (file) {
                console.log("File selected:", file)  // Debug log
                setFormData({ ...formData, person_url: file })
            }
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if ((user?.credits ?? 0) < 2) {
            setShowRecharge(true)
            return
        }
        const formDataToSend = new FormData()
        formDataToSend.append('person_url', person_url)
        formDataToSend.append('cloth_url', product.image)
        formDataToSend.append('garment_des', product.description)
        for (let pair of formDataToSend.entries()) {
            console.log(pair[0] + ': ', pair[1])
        }
        dispatch(tryCloths(formDataToSend))
    }



    const handleAddToCart = async (cartData, buyNow = false) => {
        try {
            await dispatch(addItemToCart(cartData)).unwrap()
            toast.success(buyNow ? "Added! Go to checkout" : "Added to cart!", { position: "top-center" })
            navigate("/cart")
        } catch (e) {
            toast.error(e || "Add to cart failed", { position: "top-center" })
        }
    }


    let aveRating = productReviews.length ? productReviews.reduce((acc, product) => acc + product.rating, 0) / productReviews.length : 0


    useEffect(() => {
        // Api Call - only when pid changes
        dispatch(getProduct(pid))
        dispatch(getProductReviews(pid))
    }, [dispatch, pid])

    useEffect(() => {
        if (virtualSuccess) {
            toast.success("Looking Great!", { position: "top-center" })
        }
    }, [virtualSuccess])

    useEffect(() => {
        if (productError && productErrorMessage) {
            toast.error(productErrorMessage, { position: "top-center" })
        }
        if (virtualTryError && virtualTryErrorMessage) {
            toast.error(virtualTryErrorMessage, { position: "top-center" })
            if (virtualTryErrorMessage.toLowerCase().includes("credit") || virtualTryErrorMessage.toLowerCase().includes("recharge")) {
                setShowRecharge(true)
            }
        }
    }, [productError, productErrorMessage, virtualTryError, virtualTryErrorMessage])


    if (productLoading || virtualTryLoading) {
        return (
            <LoadingScreen loadingMessage={"Loading Your Experience...."} />
        )
    }

    if (productError && productErrorMessage === 'Product Not Found!') {
        return (
            <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
                <div className="bg-white rounded-3xl shadow-lg p-8 text-center max-w-md">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found!</h2>
                    <p className="text-gray-600 mb-2">Ye product ID purana hai (DB reseed hua hai).</p>
                    <p className="text-xs text-gray-400 mb-6">Naye IDs: collections se fresh product pe click karo.</p>
                    <a href="/collections" className="inline-block bg-amber-600 text-white px-6 py-3 rounded-full font-semibold">Go to Collections</a>
                </div>
            </div>
        )
    }



    return (
        <div className="min-h-screen bg-[var(--color-cream)]">
            {/* Recharge Popup */}
            {showRecharge && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-8 text-center">
                        <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">⚡</div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Credits Khatam!</h3>
                        <p className="text-sm text-gray-600 mb-1">Har Virtual Try pe <span className="font-bold text-amber-600">2 credits</span> lagte hain.</p>
                        <p className="text-sm text-gray-600 mb-1">Aapke paas sirf <span className="font-bold">{user?.credits ?? 0}</span> bacha hai.</p>
                        <p className="text-xs text-gray-500 mb-6">Naya try karne ke liye recharge karein — admin se contact karein.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setShowRecharge(false)} className="flex-1 py-3 rounded-xl border border-gray-200 font-semibold">Band karo</button>
                            <button onClick={() => { setShowRecharge(false); navigate('/contact'); }} className="flex-1 py-3 rounded-xl bg-amber-600 text-white font-semibold hover:bg-amber-700">Recharge / Contact</button>
                        </div>
                    </div>
                </div>
            )}
            <div className="max-w-7xl mx-auto px-4 py-6">
                <nav className="flex flex-wrap items-center gap-2 text-xs tracking-[0.14em] uppercase text-charcoal/40 mb-6">
                    <a href="/" className="hover:text-charcoal">Home</a> <span className="text-[var(--color-gold)]">/</span>
                    <a href="/collections" className="hover:text-charcoal">Collections</a> <span className="text-[var(--color-gold)]">/</span>
                    {product.category && <><a href={`/collections?category=${encodeURIComponent(product.category)}`} className="hover:text-charcoal normal-case tracking-normal text-xs">{product.category}</a> <span className="text-[var(--color-gold)]">/</span></>}
                    <span className="text-charcoal font-medium normal-case tracking-normal text-sm truncate max-w-[200px]">{product.name}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div>
                        <div className="bg-white rounded-3xl shadow-lg p-4 mb-4">
                            <div style={customStyle} className="aspect-[3/4] bg-gray-200 relative bg-center bg-cover"></div>
                        </div>
                        {/* Virtual Try result — QR hata diya, sirf image/link */}
                        {virtualTry?.output_url && (
                            <div className="bg-white rounded-3xl shadow-lg p-6 mb-4 text-center border-2 border-violet-200">
                                <h3 className="text-lg font-bold text-neutral-900 mb-2">Virtual Try-On Result</h3>
                                <div className="flex justify-center mb-4">
                                    <img src={virtualTry.output_url} alt="Virtual try result" className="w-full max-w-sm rounded-xl border-4 border-white shadow-md" />
                                </div>
                                <a href={virtualTry.output_url} target="_blank" rel="noreferrer" className="text-sm text-amber-600 font-medium hover:underline">Open image result in new tab</a>
                            </div>
                        )}

                    </div>

                    <div>
                        <div className="mb-6">
                            <span className="inline-block bg-amber-50 text-amber-700 text-xs font-semibold px-3 py-1 rounded-full mb-4">
                                {product.category}
                            </span>
                            <h1 className="text-4xl font-bold text-neutral-900 mb-4">{product.name}</h1>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="mt-1 flex gap-0.5">
                                    {[...Array(5)].map((_, i) => (
                                        <svg
                                            key={i}
                                            className={`h-3.5 w-3.5 ${i < aveRating ? "fill-yellow-400 text-yellow-400" : "fill-slate-200 text-slate-200"
                                                }`}
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </div>
                                <span className="text-sm text-gray-600">({productReviews.length} Reviews)</span>
                            </div>
                            <p className="text-4xl font-bold text-neutral-900 mb-6">₹{product.salePrice}</p>
                            <p className="text-gray-700 leading-relaxed">
                                {product.description}
                            </p>
                        </div>

                        <div className="mb-6">
                            <h3 className="text-sm font-semibold text-neutral-900 mb-3">Available SIze</h3>
                            <div className="flex gap-3">
                                <button className="px-6 py-3 border-2 border-amber-600 bg-violet-50 text-amber-600 rounded-xl text-sm font-medium">{product?.size?.toUpperCase()}</button>

                            </div>
                        </div>
                        <div className="flex gap-3 mb-8">
                            <button onClick={() => handleAddToCart({ productId: product._id, qty: 1 }, false)} className="cursor-pointer flex-1 border border-charcoal/15 text-charcoal py-4 rounded-xl font-semibold hover:bg-charcoal hover:text-white transition-all">
                                Add to Cart
                            </button>
                            <button onClick={() => handleAddToCart({ productId: product._id, qty: 1 }, true)} className="cursor-pointer flex-1 bg-[var(--color-gold)] text-white py-4 rounded-xl font-semibold hover:brightness-95 transition-all">
                                Buy Now
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} encType="multipart/form-data" >
                            <div className="bg-[var(--color-gold-soft)] border border-[var(--color-gold)]/30 rounded-3xl p-6 mb-8">
                                <div className="text-center mb-4">
                                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white border border-[var(--color-gold)]/20 rounded-2xl mb-4">
                                        <svg className="w-8 h-8 text-[var(--color-gold)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-charcoal mb-2">Upload Your Photo for Virtual Try-On</h3>
                                    <p className="text-sm text-charcoal/60 mb-1">Front-facing photo works best for accurate results</p>
                                    <p className="text-xs font-semibold text-amber-600 bg-white inline-block px-3 py-1 rounded-full border border-amber-200">Cost: 2 credits / try • Your credits: {user?.credits ?? 0}</p>
                                </div>

                                <div className="bg-white border-2 border-dashed border-[var(--color-gold)]/40 rounded-2xl p-8 mb-4 text-center hover:border-[var(--color-gold)] transition-colors cursor-pointer">
                                    <input required onChange={handleChange} name='person_url' type="file" accept="image/png,image/jpeg,image/webp" className="" id="upload-photo" />
                                    <label htmlFor="upload-photo" className="cursor-pointer">
                                        <svg className="w-12 h-12 text-[var(--color-gold)]/60 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                        </svg>
                                        <p className="text-sm font-medium text-charcoal mb-1">Click to upload or drag and drop</p>
                                        <p className="text-xs text-charcoal/40">PNG, JPG up to 10MB</p>
                                    </label>
                                </div>



                                <div className="flex gap-3">
                                    <button type='submit' disabled={user?.credits < 2} className={`flex-1 py-3.5 rounded-xl font-semibold transition-all shadow-md ${user?.credits < 2 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-[var(--color-gold)] text-white hover:brightness-95'}`}>
                                        {user?.credits < 2 ? 'Not enough credits (need 2)' : 'Upload & Try Virtually (2 credits)'}
                                    </button>
                                </div>
                                {user?.credits < 2 && <p className="text-xs text-red-600 text-center mt-2">Credits khatam — 2 credits lagenge, recharge karein</p>}
                            </div>
                        </form>


                        <div className="bg-white rounded-3xl shadow-md p-6 mb-8">
                            <h3 className="text-lg font-bold text-neutral-900 mb-4">Product Details</h3>
                            <div className="space-y-3">
                                <div className="flex">
                                    <span className="text-sm font-semibold text-gray-700 w-32">Fabric:</span>
                                    <span className="text-sm text-gray-600">100% Premium Cotton</span>
                                </div>
                                <div className="flex">
                                    <span className="text-sm font-semibold text-gray-700 w-32">Fit Type:</span>
                                    <span className="text-sm text-gray-600">Regular Fit</span>
                                </div>
                                <div className="flex">
                                    <span className="text-sm font-semibold text-gray-700 w-32">Care:</span>
                                    <span className="text-sm text-gray-600">Machine wash cold, tumble dry low</span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="bg-violet-50 rounded-2xl p-4 text-center">
                                <p className="text-2xl font-bold text-amber-600 mb-1">95%</p>
                                <p className="text-xs text-gray-700 font-medium">AI Fit Accuracy</p>
                            </div>
                            <div className="bg-violet-50 rounded-2xl p-4 text-center">
                                <p className="text-sm font-bold text-amber-600 mb-1">No Size</p>
                                <p className="text-xs text-gray-700 font-medium">Guessing</p>
                            </div>
                            <div className="bg-violet-50 rounded-2xl p-4 text-center">
                                <p className="text-sm font-bold text-amber-600 mb-1">Easy</p>
                                <p className="text-xs text-gray-700 font-medium">Returns</p>
                            </div>
                        </div>
                    </div>
                </div>
                <ProductReviews productReviews={productReviews} />
                {

                    user && <AddReviewForm pid={pid} />

                }
            </div>
        </div>
    )
}

export default ProductPage

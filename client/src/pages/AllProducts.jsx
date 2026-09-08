import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify"
import ProductCard from "../components/ProductCard";
import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { LoadingScreen } from "../components/LoadingScreen";
import { getAllProducts } from "../features/products/productSlice";

function AllProducts() {

    const { products, productSuccess, productLoading, productError, productErrorMessage } = useSelector(state => state.product)

    const dispatch = useDispatch()
    const [searchParams] = useSearchParams()
    const categoryParam = searchParams.get("category") // e.g. Women's Fashion, Hoodies, Kids
    // Filter by category if query present — exact match
    const filteredProducts = categoryParam ? products.filter(p => p.category === categoryParam) : products
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 6
    // Reset page when category changes
    useEffect(()=>{ setCurrentPage(1) },[categoryParam])
    const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage))
    const paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    const title = categoryParam ? categoryParam : "All Collections"
    const subtitle = categoryParam === "Women's Fashion" ? "Curated womens wear — dresses, blouses, kurtas" : categoryParam === "Men's Fashion" ? "Mens essentials — tees, hoodies, curated fits" : categoryParam === "Hoodies" ? "Hoodies • 4 styles — hoodie model 7037" : categoryParam === "Kids" ? "Kids world — playful fits" : "Discover AI-powered fashion with virtual try-on"

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page)
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }
    }



    useEffect(() => {
        // Api Call - only once on mount
        dispatch(getAllProducts())
    }, [dispatch])

    useEffect(() => {
        if (productError && productErrorMessage) {
            toast.error(productErrorMessage, { position: "top-center" })
        }
    }, [productError, productErrorMessage])


    if (productLoading) {
        return (
            <LoadingScreen loadingMessage={"Products Message"} />
        )
    }



    return (
        <div className="min-h-screen bg-[var(--color-cream)]">
            {/* PROFESSIONAL LIGHT HEADER — editorial, no brown, premium */}
            <div className="bg-white border-b border-charcoal/5">
                <div className="max-w-7xl mx-auto px-4 py-10 lg:py-12">
                    <nav className="flex items-center gap-2 text-xs tracking-[0.14em] uppercase text-charcoal/40 mb-6">
                        <Link to="/" className="hover:text-charcoal">Home</Link> <span className="text-[var(--color-gold)]">/</span> <Link to="/collections" className="hover:text-charcoal">Collections</Link> {categoryParam && <><span className="text-[var(--color-gold)]">/</span> <span className="text-charcoal font-medium normal-case tracking-normal text-sm">{categoryParam}</span></>}
                    </nav>
                    <div className="flex flex-wrap items-end justify-between gap-6">
                        <div>
                            <span className="inline-block h-px w-12 bg-[var(--color-gold)] mb-4"></span>
                            <h2 className="font-display text-4xl lg:text-5xl font-bold text-charcoal tracking-[-0.03em]">{title}</h2>
                            <p className="text-charcoal/60 mt-3 max-w-xl text-base leading-relaxed">{subtitle}</p>
                            {categoryParam && <p className="text-xs text-charcoal/40 mt-2">Showing {filteredProducts.length} products in {categoryParam} • <Link to="/collections" className="underline hover:text-charcoal">View All Collections</Link></p>}
                        </div>
                        {categoryParam && <Link to="/collections" className="text-xs bg-charcoal text-white px-5 py-2.5 rounded-full font-semibold hover:bg-[var(--color-gold)] hover:text-white transition-colors">Clear filter ✕</Link>}
                    </div>
                </div>
            </div>
            <div className="max-w-7xl mx-auto px-4 py-8">

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* <aside className="lg:w-64 flex-shrink-0">
                        <div className="bg-white rounded-3xl shadow-md p-6 sticky top-6">
                            <h3 className="text-lg font-bold text-neutral-900 mb-6">Filters</h3>

                            <div className="mb-6">
                                <h4 className="text-sm font-semibold text-neutral-900 mb-3">Category</h4>
                                <div className="space-y-2">
                                    <label className="flex items-center">
                                        <input type="checkbox" className="rounded border-gray-300 text-amber-600 focus:ring-amber-500" />
                                        <span className="ml-2 text-sm text-gray-700">Dresses</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input type="checkbox" className="rounded border-gray-300 text-amber-600 focus:ring-amber-500" />
                                        <span className="ml-2 text-sm text-gray-700">Tops</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input type="checkbox" className="rounded border-gray-300 text-amber-600 focus:ring-amber-500" />
                                        <span className="ml-2 text-sm text-gray-700">Bottoms</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input type="checkbox" className="rounded border-gray-300 text-amber-600 focus:ring-amber-500" />
                                        <span className="ml-2 text-sm text-gray-700">Outerwear</span>
                                    </label>
                                </div>
                            </div>

                            <div className="mb-6">
                                <h4 className="text-sm font-semibold text-neutral-900 mb-3">Size</h4>
                                <div className="flex flex-wrap gap-2">
                                    <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:border-amber-600 hover:text-amber-600 transition-colors">XS</button>
                                    <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:border-amber-600 hover:text-amber-600 transition-colors">S</button>
                                    <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:border-amber-600 hover:text-amber-600 transition-colors">M</button>
                                    <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:border-amber-600 hover:text-amber-600 transition-colors">L</button>
                                    <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:border-amber-600 hover:text-amber-600 transition-colors">XL</button>
                                </div>
                            </div>

                            <div className="mb-6">
                                <h4 className="text-sm font-semibold text-neutral-900 mb-3">Price Range</h4>
                                <input type="range" min="0" max="500" className="w-full accent-amber-600" />
                                <div className="flex justify-between text-xs text-gray-600 mt-2">
                                    <span>$0</span>
                                    <span>$500</span>
                                </div>
                            </div>

                            <div className="mb-6">
                                <h4 className="text-sm font-semibold text-neutral-900 mb-3">Color</h4>
                                <div className="flex flex-wrap gap-2">
                                    <button className="w-8 h-8 rounded-full bg-charcoal border-2 border-gray-300 hover:border-amber-600 transition-colors"></button>
                                    <button className="w-8 h-8 rounded-full bg-white border-2 border-gray-300 hover:border-amber-600 transition-colors"></button>
                                    <button className="w-8 h-8 rounded-full bg-red-500 border-2 border-gray-300 hover:border-amber-600 transition-colors"></button>
                                    <button className="w-8 h-8 rounded-full bg-blue-500 border-2 border-gray-300 hover:border-amber-600 transition-colors"></button>
                                    <button className="w-8 h-8 rounded-full bg-green-500 border-2 border-gray-300 hover:border-amber-600 transition-colors"></button>
                                    <button className="w-8 h-8 rounded-full bg-yellow-500 border-2 border-gray-300 hover:border-amber-600 transition-colors"></button>
                                </div>
                            </div>

                            <button className="w-full py-2 bg-neutral-900 text-white rounded-xl hover:bg-neutral-800 transition-colors">
                                Apply Filters
                            </button>
                        </div>
                    </aside> */}

                    <main className="flex-1">
                        <div className="flex justify-between items-center mb-6">
                            <p className="text-xs tracking-wide text-charcoal/50">Showing <span className="font-semibold text-charcoal">{paginatedProducts.length}</span> of {filteredProducts.length} {totalPages > 1 && `• Page ${currentPage}/${totalPages}`}</p>
                            <select className="bg-white border border-charcoal/10 rounded-full px-4 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]">
                                <option>Most Popular</option>
                                <option>Price: Low to High</option>
                                <option>Price: High to Low</option>
                                <option>Newest</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
                            {
                                paginatedProducts.length === 0 ? (
                                    <p className="col-span-3 text-center text-gray-500 py-10">No products found.</p>
                                ) : (
                                    paginatedProducts.map((product) => {
                                        return (
                                            <ProductCard key={product._id} product={product} />
                                        )
                                    })
                                )
                            }
                        </div>

                        {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-2 mt-12">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:border-amber-600 hover:text-amber-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                                Previous
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    className={`px-4 py-2 rounded-lg text-sm transition-colors ${currentPage === page ? "bg-amber-600 text-white" : "border border-gray-300 hover:border-amber-600 hover:text-amber-600"}`}>
                                    {page}
                                </button>
                            ))}
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:border-amber-600 hover:text-amber-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                                Next
                            </button>
                        </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}

export default AllProducts;



export function ProductReviews({ productReviews }) {

    let aveRating = productReviews.length ? (productReviews.reduce((acc, product) => acc + product.rating, 0) / productReviews.length).toFixed(1) : "0.0"



    return (
        <section className="space-y-10">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-slate-100 pb-8">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">Customer Reviews</h2>
                    <p className="mt-2 text-slate-500">Real feedback from our fashion community.</p>
                </div>
                <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-2">
                    <div className="flex items-center gap-1">
                        <span className="text-lg font-bold text-slate-900">{aveRating}</span>
                        <div className="flex">
                            {productReviews.map((_, i) => (
                                <svg key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            ))}
                        </div>
                    </div>
                    <div className="h-4 w-px bg-slate-200" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{productReviews.length} Reviews</span>
                </div>
            </div>

            <div className="grid gap-8">
                {productReviews.map((review) => (
                    <div
                        key={review._id}
                        className="group relative rounded-3xl border border-slate-50 bg-white p-8 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/5"
                    >
                        <div className="mb-6 flex items-start justify-between">
                            <div className="flex items-center gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-lg font-bold text-amber-600">
                                    {review.user.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900">{review.user.name}</h3>
                                    <div className="mt-1 flex gap-0.5">
                                        {[...Array(5)].map((_, i) => (
                                            <svg
                                                key={i}
                                                className={`h-3.5 w-3.5 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "fill-slate-200 text-slate-200"
                                                    }`}
                                                viewBox="0 0 20 20"
                                            >
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{new Date(review.createdAt).toLocaleDateString('en-IN')}</span>
                        </div>
                        <p className="leading-relaxed text-slate-600 italic">"{review.text}"</p>
                    </div>
                ))}
            </div>
        </section>
    )
}

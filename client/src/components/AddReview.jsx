
import { Star } from "lucide-react"
import { useState } from "react"
import { useDispatch } from "react-redux"
import { addProductReview } from "../features/products/productSlice"

export function AddReviewForm({ pid }) {

    const [text, setText] = useState("")
    const [rating, setRating] = useState(1)

    const dispatch = useDispatch()

    const handleSubmit = (e) => {
        e.preventDefault()


        dispatch(addProductReview({
            _id: pid,
            text,
            rating
        }))

    }




    return (
        <section className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
            <div className="mb-8 space-y-2">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">Add Your Review</h2>
                <p className="text-sm text-slate-500 font-medium">Help others find the perfect style.</p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Star Rating</label>
                    <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star, index) => (
                            <button
                                key={star}
                                onClick={() => setRating(index + 1)}
                                type="button"
                                className={`${rating === index + 1 ? 'bg-yellow-100' : 'bg-slate-50'} group flex h-10 w-10 items-center justify-center rounded-xl transition-all hover:bg-yellow-50 hover:scale-110 active:scale-95`}
                            >
                                <Star className={`${rating === index + 1 ? 'text-yellow-500 fill-yellow-400' : 'text-slate-300'} h-5 w-5  transition-colors group-hover:fill-yellow-400 group-hover:text-yellow-400`} />
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <label htmlFor="message" className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                        Your Experience
                    </label>
                    <textarea
                        id="message"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        rows={4}
                        placeholder="Tell us about the fabric, fit, and feel..."
                        className="w-full resize-none rounded-2xl border border-slate-100 bg-slate-50 px-5 py-4 text-sm font-medium outline-none transition-all focus:border-amber-600 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full rounded-2xl bg-amber-600 py-4 text-sm font-bold text-white transition-all hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 active:scale-[0.98]"
                >
                    Submit Review
                </button>
            </form>
        </section>
    )
}

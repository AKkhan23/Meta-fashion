// src/pages/Coupons.tsx
import Layout from '../components/Layout';
import { Plus, Ban } from 'lucide-react';
import { LoadingScreen } from '../components/LoadingScreen';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { addCoupon, getAllCoupons } from '../features/admin/adminSlice';

function Coupons() {

    const { user } = useSelector(state => state.auth)
    const { adminIsLoading, adminIsSuccess, adminIsError, adminErrorMessage, allCoupons } = useSelector(state => state.admin)

    const [formData, setFormData] = useState({
        coupanCode: "",
        coupanDiscount: ""
    })


    const { coupanCode, coupanDiscount } = formData

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })

    }


    const navigate = useNavigate()
    const dispatch = useDispatch()


    const handleSubmit = (e) => {
        e.preventDefault()
        dispatch(addCoupon(formData))
        setFormData({
            coupanCode: "",
            coupanDiscount: ""
        })
    }


    useEffect(() => {
        if (!user?.isAdmin) {
            navigate("/")
        } else {
            // Api's Fetching
            dispatch(getAllCoupons())
        }
    }, [user, dispatch, navigate])

    useEffect(() => {
        if (adminIsError && adminErrorMessage) {
            toast.error(adminErrorMessage, { position: "top-center" })
        }
    }, [adminIsError, adminErrorMessage])



    if (adminIsLoading) {
        return (
            <LoadingScreen loadingMessage={"Coupons Loading...."} />
        )
    }




    return (
        <Layout activeMenu="coupons" pageTitle="Coupons">
            <div className="space-y-8">
                <div className="bg-white rounded-xl shadow-md border border-gray-200">
                    <div className="p-6 border-b border-gray-200">
                        <h3 className="text-lg font-bold text-gray-900 mb-6">Create Coupon</h3>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="couponCode" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Coupon Code
                                    </label>
                                    <input
                                        value={coupanCode}
                                        onChange={handleChange}
                                        name='coupanCode'
                                        type="text"
                                        id="couponCode"
                                        placeholder="e.g., SUMMER2024"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="discount" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Discount Percentage
                                    </label>
                                    <input
                                        value={coupanDiscount}
                                        onChange={handleChange}
                                        name='coupanDiscount'
                                        type="number"
                                        id="discount"
                                        placeholder="0"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-colors flex items-center gap-2"
                                >
                                    <Plus className="w-4 h-4" />
                                    Create Coupon
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md border border-gray-200">
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-gray-900">All Coupons</h3>
                            <input
                                type="search"
                                placeholder="Search coupons..."
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                            />
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Code</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Discount</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Created On</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {
                                    allCoupons.map(coupon => {
                                        return (
                                            <tr key={coupon._id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 text-sm font-semibold text-gray-900">{coupon.coupanCode}</td>
                                                <td className="px-6 py-4 text-sm text-gray-900">{coupon.coupanDiscount}%</td>
                                                <td className="px-6 py-4 text-sm text-gray-600">{new Date(coupon.createdAt).toLocaleDateString('en-IN')}</td>
                                                <td className="px-6 py-4">
                                                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">{coupon.isActive ? "Active" : "Expired"}</span>
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                    <div className="p-6 border-t border-gray-200 flex items-center justify-between">
                        <p className="text-sm text-gray-600">Showing 1 to 8 of 32 coupons</p>
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
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default Coupons;

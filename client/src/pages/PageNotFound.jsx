function NotFound() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="max-w-md w-full text-center">
                <div className="mb-8">
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-amber-100 to-amber-100 rounded-3xl mb-6">
                        <span className="text-6xl font-bold text-amber-600">404</span>
                    </div>
                </div>

                <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-3">
                    Page Not Found
                </h1>

                <p className="text-lg text-gray-600 mb-2">
                    Oops! We couldn't find the page you're looking for.
                </p>

                <p className="text-base text-gray-500 mb-8">
                    The page might have been removed, or the URL might be incorrect. Let's get you back on track.
                </p>

                <div className="mb-8 p-4 bg-white rounded-xl border border-gray-200">
                    <p className="text-sm text-gray-500 break-all">
                        {typeof window !== 'undefined' ? window.location.pathname : '/not-found'}
                    </p>
                </div>

                <div className="space-y-3 sm:space-y-0 sm:flex sm:flex-col sm:gap-3">
                    <a
                        href="/"
                        className="inline-block bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 px-8 rounded-xl transition-colors w-full"
                    >
                        Back to Home
                    </a>

                    <a
                        href="/shop"
                        className="inline-block bg-white hover:bg-gray-50 text-amber-600 border-2 border-amber-600 font-semibold py-3 px-8 rounded-xl transition-colors w-full"
                    >
                        Continue Shopping
                    </a>

                    <a
                        href="/support"
                        className="inline-block bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-3 px-8 rounded-xl transition-colors w-full"
                    >
                        Contact Support
                    </a>
                </div>

                <div className="mt-12 pt-8 border-t border-gray-200">
                    <p className="text-sm text-gray-500 mb-4">Need help?</p>
                    <div className="flex justify-center gap-4">
                        <a href="/faq" className="text-amber-600 hover:text-amber-700 text-sm font-medium transition-colors">
                            FAQ
                        </a>
                        <span className="text-gray-300">•</span>
                        <a href="/contact" className="text-amber-600 hover:text-amber-700 text-sm font-medium transition-colors">
                            Contact Us
                        </a>
                        <span className="text-gray-300">•</span>
                        <a href="/sitemap" className="text-amber-600 hover:text-amber-700 text-sm font-medium transition-colors">
                            Sitemap
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NotFound;

import { Sparkles } from 'lucide-react'
import React from 'react'

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-6 h-6 text-amber-400" />
                        <span className="text-xl font-bold">Meta Fashion</span>
                    </div>
                    <div className="flex gap-6">
                        <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Twitter</a>
                        <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Instagram</a>
                        <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Facebook</a>
                        <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">LinkedIn</a>
                    </div>
                </div>
                <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                    <p>&copy; 2026 Meta Fashion. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}

export default Footer

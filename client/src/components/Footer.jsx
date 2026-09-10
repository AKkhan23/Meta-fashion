import { Sparkles } from 'lucide-react'
import React from 'react'

const Footer = () => {
    return (
        <footer className="bg-white border-t border-gray-100 py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2 group cursor-pointer">
                        <Sparkles className="w-6 h-6 text-amber-600 group-hover:rotate-12 transition-transform duration-300" />
                        <span className="text-xl font-bold text-gray-900 tracking-tight">Meta Fashion</span>
                    </div>
                    <div className="flex gap-6">
                        {['Twitter','Instagram','Facebook','LinkedIn'].map(link => (
                            <a key={link} href="#" className="relative text-sm font-medium text-gray-500 hover:text-amber-600 transition-colors duration-300 after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-amber-600 after:transition-all after:duration-300 hover:after:w-full">
                                {link}
                            </a>
                        ))}
                    </div>
                </div>
                <div className="border-t border-gray-100 mt-8 pt-6 text-center">
                    <p className="text-sm text-gray-400">© 2026 Meta Fashion. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}

export default Footer

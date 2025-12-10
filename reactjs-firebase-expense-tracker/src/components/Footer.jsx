import React from 'react';

const Footer = () => {
    return (
        <footer className="w-full bg-gray-900 text-gray-300 mt-auto border-t border-gray-800">
            {/* Main Footer Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    
                    {/* Column 1: Brand & Description */}
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                             <span className="p-1 bg-indigo-200 rounded-full">
                                <img src="./public/logo.png" alt="" className='w-11 h-11' />
                             </span>
                            Expense<span className="text-indigo-500">Tracker</span>
                        </h2>
                        <p className="text-sm text-gray-400 max-w-xs leading-relaxed">
                            Take control of your financial future. Track expenses, monitor income, and analyze your spending habits securely.
                        </p>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div className="md:pl-10">
                        <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
                        <ul className="space-y-3 text-sm">
                            <li>
                                <a href="#" className="hover:text-indigo-400 transition-colors duration-200 flex items-center gap-2">
                                    <i className="fa-solid fa-chevron-right text-xs text-indigo-600"></i> Dashboard
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-indigo-400 transition-colors duration-200 flex items-center gap-2">
                                    <i className="fa-solid fa-chevron-right text-xs text-indigo-600"></i> Transactions
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-indigo-400 transition-colors duration-200 flex items-center gap-2">
                                    <i className="fa-solid fa-chevron-right text-xs text-indigo-600"></i> Analytics
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Column 3: Connect / Socials */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">Connect With Us</h3>
                        <div className="flex space-x-4">
                            {/* Social Icon 1 (Github) */}
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-indigo-600 hover:text-white transition-all duration-300 transform hover:-translate-y-1">
                                <i className="fa-brands fa-github text-lg"></i>
                            </a>
                            {/* Social Icon 2 (Twitter/X) */}
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-blue-500 hover:text-white transition-all duration-300 transform hover:-translate-y-1">
                                <i className="fa-brands fa-twitter text-lg"></i>
                            </a>
                            {/* Social Icon 3 (LinkedIn) */}
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-blue-700 hover:text-white transition-all duration-300 transform hover:-translate-y-1">
                                <i className="fa-brands fa-linkedin-in text-lg"></i>
                            </a>
                        </div>
                        <p className="mt-4 text-xs text-gray-500">
                            Have questions? Email us at <span className="text-indigo-400">support@expensetracker.com</span>
                        </p>
                    </div>
                </div>

                {/* Bottom Bar: Copyright */}
                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-sm text-gray-400">
                        &copy; {new Date().getFullYear()} Expense Tracker. All rights reserved.
                    </p>
                    <p className="text-sm text-gray-400 mt-2 md:mt-0 flex items-center gap-1">
                        Made with <i className="fa-solid fa-heart text-red-500 animate-pulse"></i> by <span className="text-white font-medium">Hasnain Dev.</span>
                    </p>
                </div>

            </div>
        </footer>
    );
};

export default Footer;
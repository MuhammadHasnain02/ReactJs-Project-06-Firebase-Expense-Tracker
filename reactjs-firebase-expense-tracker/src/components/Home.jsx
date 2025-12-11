// src/pages/Home.jsx (or wherever your Home component lives)

import { useNavigate } from "react-router-dom"
// Import the new components
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

function Home() {
    const navigation = useNavigate()

    return (
        // min-h-screen and flex-col for sticky footer layout
        <div className="min-h-screen flex flex-col bg-gray-50"> 
            
            {/* The imported Navbar component */}
            <Navbar />

            {/* Main Content Area: pt-20 to offset the fixed Navbar height */}
            <main className="flex-grow flex items-center justify-center p-4 pt-20">

                {/* Content Grid (UI Unchanged) */}
                <div className="w-full max-w-6xl flex flex-col md:grid md:grid-cols-2 gap-12 items-center py-12">

                    {/* 1. Marketing / Hero Content (Left Side on Desktop) */}
                    <div className="text-center md:text-left space-y-6 order-2 md:order-1">
                        
                        <p className="text-lg font-semibold text-indigo-600 uppercase tracking-widest">
                            Smart Finance Management
                        </p>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
                            Take Control of Your <span className="text-indigo-600">Expenses</span>
                        </h1>
                        <p className="text-xl text-gray-600 max-w-lg mx-auto md:mx-0">
                            The simplest and most powerful expense tracking application, powered securely by Firebase. Get started in seconds.
                        </p>

                        {/* Button Group */}
                        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
                            <button 
                                onClick={() => navigation('/signup')} 
                                className="flex-1 py-3 px-8 rounded-full bg-indigo-600 text-white font-bold text-lg 
                                           shadow-lg shadow-indigo-500/50 hover:bg-indigo-700 transition duration-300 
                                           transform hover:scale-[1.02] cursor-pointer"
                            >
                                Start Tracking Now
                            </button>
                            <button 
                                onClick={() => navigation('/signin')} 
                                className="flex-1 py-3 px-8 rounded-full border-2 border-indigo-200 bg-white text-indigo-600 font-bold text-lg 
                                           hover:bg-indigo-50 transition duration-300 cursor-pointer"
                            >
                                I Already Have an Account
                            </button>
                        </div>
                    </div>

                    {/* 2. Application Visual / Logo (Right Side on Desktop) */}
                    <div className="w-full flex justify-center order-1 md:order-2">
                        <div className="p-8 bg-white rounded-3xl shadow-2xl cursor-pointer transform rotate-3 hover:rotate-0 transition duration-500">
                            <img 
                                src="./public/logo.png" 
                                alt="Application Dashboard Mockup"
                                className="w-32 h-32 md:w-48 md:h-48 object-contain bg-gray-200 rounded-full" 
                            />
                        </div>
                    </div>
                </div>
            </main>

            {/* The imported Footer component */}
            <Footer />

        </div>
    )
}

export default Home
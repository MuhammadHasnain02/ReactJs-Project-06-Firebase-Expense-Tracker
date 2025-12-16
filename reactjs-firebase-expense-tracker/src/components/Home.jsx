import { useContext, useEffect, useState } from "react"
import { ThemeContext } from "../context/ThemeContext"
import { useNavigate } from "react-router-dom"
import { RotatingLines } from "react-loader-spinner";

import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

function Home() {
    const navigation = useNavigate()
    const { darkMode , setDarkMode } = useContext(ThemeContext)
    const [loading , setLoading] = useState(true)

    useEffect(() => {
        setTimeout(() => {
            setLoading(false)
        } , 300)
    } , [])

    return (
        <>

        <div className={`min-h-screen flex flex-col transition duration-300 
            ${darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"}`}>

            <Navbar />

            {/* Loading State */}
            {loading ? (
                <div className="flex flex-col items-center min-h-screen justify-center">
                    <RotatingLines
                        visible={true}
                        height="70"
                        width="70"
                        color="#4F39F6"
                        strokeWidth="5"
                        animationDuration="1"
                        ariaLabel="rotating-lines-loading"
                    />
                </div>
            ) : (
                <main className="flex items-center justify-center p-4 pt-20">

                    <div className="w-full max-w-6xl flex flex-col md:grid md:grid-cols-2 gap-12 items-center py-20">

                        {/* LEFT TEXT SECTION */}
                        <div className="text-center md:text-left space-y-6 order-2 md:order-1">

                            <p className={`text-lg font-semibold uppercase tracking-widest 
                                ${darkMode ? "text-indigo-400" : "text-indigo-600"}`}>
                                Smart Finance Management
                            </p>

                            <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight
                                ${darkMode ? "text-white" : "text-gray-900"}`}>
                                Take Control of Your <span className="text-indigo-600">Expenses</span>
                            </h1>

                            <p className={`text-xl font-sans max-w-lg mx-auto md:mx-0 
                                ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                                The simplest and most powerful expense tracking application, powered securely by Firebase.
                            </p>

                            {/* BUTTONS */}
                            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-4">

                                <button 
                                    onClick={() => navigation('/signup')} 
                                    className="flex-1 py-3 px-8 rounded-full bg-indigo-600 
                                            text-white font-bold text-lg shadow-lg shadow-indigo-500/50 
                                            hover:bg-indigo-700 transition duration-300 
                                            transform hover:scale-[1.02] cursor-pointer"
                                >
                                    Start Tracking Now
                                </button>

                                <button 
                                    onClick={() => navigation('/signin')} 
                                    className={`flex-1 py-3 px-8 rounded-full border-2 font-bold text-lg transition duration-300 cursor-pointer
                                        ${darkMode 
                                            ? "border-indigo-400 bg-gray-800 text-indigo-300 hover:bg-gray-700" 
                                            : "border-indigo-200 bg-white text-indigo-600 hover:bg-indigo-50"}`}
                                >
                                    I Already Have an Account
                                </button>
                            </div>
                        </div>

                        {/* RIGHT LOGO BOX */}
                        <div className="w-full flex justify-center order-1 md:order-2">

                            <div className={`p-10 rounded-3xl shadow-2xl cursor-pointer transform rotate-3 
                                hover:rotate-0 transition duration-500
                                ${darkMode ? "bg-gray-800 shadow-black/30" : "bg-white"}`}>
                                
                                <img 
                                    src={`${darkMode ? './logo-2.png' : './logo.png'}`}
                                    alt="Application Logo"
                                    className={`w-32 h-32 md:w-50 md:h-50 object-contain rounded-full p-3.5 
                                        ${darkMode ? "bg-gray-700" : "bg-gray-200"}`}
                                />
                            </div>

                        </div>

                    </div>

                </main>
            )}


            <Footer />
        </div>

        

        </>

    )
}

export default Home

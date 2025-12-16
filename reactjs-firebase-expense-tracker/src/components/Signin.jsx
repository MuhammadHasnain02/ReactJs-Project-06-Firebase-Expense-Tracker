import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import Navbar from "../components/Navbar"; 
import Footer from "../components/Footer";
import { RotatingLines } from "react-loader-spinner";

function Signin() {
    const navigation = useNavigate();
    const { darkMode } = useContext(ThemeContext)

    const [email , setEmail] = useState('');
    const [password , setPassword] = useState('');
    const {login, signInWithGoogle} = useAuth(); 
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();

        if (!email || !password) {
            return alert('Please enter both email and password!');
        }

        setLoading(true);
        try {
            await login(email, password);
            navigation('/dashboard');
        } catch (error) {
            alert('Login Failed: Check your credentials.');
            setPassword("")
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        setLoading(true)

        setTimeout(() => {
            setLoading(false)
        } , 300)
    } , [])

    return (
        <div className={`min-h-screen flex flex-col transition-all duration-300 
            ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
            
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

                <main className="flex items-center justify-center p-4 pt-30 pb-10">

                    <div className={`w-full max-w-md p-8 sm:px-10 sm:py-8 rounded-2xl shadow-2xl transition-all duration-300
                        ${darkMode ? "bg-gray-800 shadow-black/40" : "bg-white shadow-indigo-100"}`}>

                        {/* Header */}
                        <div className={`flex flex-col items-center border-b pb-3
                            ${darkMode ? "border-gray-600" : "border-gray-200"}`}>
                            
                            <div className={`p-3 rounded-full shadow-lg 
                                ${darkMode ? "bg-indigo-500 text-white" : "bg-indigo-600 text-white"}`}>
                                <i className="fa-solid fa-lock text-2xl"></i>
                            </div>

                            <h2 className={`text-[27px] font-extrabold 
                                ${darkMode ? "text-white" : "text-gray-900"}`}>
                                Welcome Back!
                            </h2>

                            <p className={`text-[12px] transition duration-300 sm:text-[13px] font-normal
                                ${darkMode ? "text-gray-300" : "text-gray-500"}`}>
                                Sign in to access your Expense Tracker dashboard.
                            </p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-4 font-sans mt-4">

                            {/* Email */}
                            <div>
                                <label className={`block text-sm font-medium mb-1 
                                    ${darkMode ? "text-gray-200" : "text-gray-700"}`}>
                                    Email Address
                                </label>

                                <input
                                    type="email"
                                    value={email}
                                    required
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="e.g., you@domain.com"
                                    disabled={loading}
                                    className={`w-full px-4 py-2 rounded-lg border shadow-sm transition-all 
                                    ${darkMode 
                                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-indigo-400"
                                        : "bg-white border-gray-300 text-black placeholder-gray-400 focus:ring-indigo-500"
                                    }`}
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <label className={`block text-sm font-medium mb-1 
                                    ${darkMode ? "text-gray-200" : "text-gray-700"}`}>
                                    Password
                                </label>

                                <input
                                    type="password"
                                    value={password}
                                    required
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    disabled={loading}
                                    className={`w-full px-4 py-2 rounded-lg border shadow-sm transition-all 
                                        ${darkMode 
                                            ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-indigo-400"
                                            : "bg-white border-gray-300 text-black placeholder-gray-400 focus:ring-indigo-500"
                                        }`}
                                />
                            </div>

                            {/* Forgot Password */}
                            <div className="flex justify-end">
                                <span className={`text-sm cursor-pointer 
                                    ${darkMode ? "text-indigo-400 hover:text-indigo-300" : "text-indigo-600 hover:text-indigo-500"}`}>
                                    Forgot Password?
                                </span>
                            </div>

                            {/* Login Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-3 rounded-lg font-semibold text-lg transition-all cursor-pointer
                                    ${loading 
                                        ? "bg-indigo-400 cursor-not-allowed text-white"
                                        : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:scale-[1.01]"
                                    }`}
                            >
                                {loading ? "Logging In..." : "Sign In"}
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="flex items-center my-4">
                            <div className={`${darkMode ? "border-gray-700" : "border-gray-300"} flex-grow border-t`}></div>
                            <span className={`${darkMode ? "text-gray-400" : "text-gray-400"} mx-3 text-sm`}>or</span>
                            <div className={`${darkMode ? "border-gray-700" : "border-gray-300"} flex-grow border-t`}></div>
                        </div>

                        {/* Google Login */}
                        <button onClick={signInWithGoogle} disabled={loading}
                            className={`flex items-center justify-center gap-3 py-3 w-full rounded-lg border transition-all font-medium text-[14px] sm:text-[15px] cursor-pointer
                                ${darkMode 
                                    ? "bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600" 
                                    : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50"
                                }`
                            }
                        >
                            <i className="fa-brands fa-google text-red-500 text-xl"></i>
                            Sign In with Google
                        </button>

                        {/* Footer Link */}
                        <div className="text-center mt-5">
                            <p className={`${darkMode ? "text-gray-300" : "text-gray-600"} text-[13px]`}>
                                Don't have an account?{" "}
                                <Link 
                                    to="/signup" 
                                    className={`font-medium ${darkMode ? "text-indigo-400 hover:text-indigo-300" : "text-indigo-600 hover:text-indigo-700"}`}
                                >
                                    Create an account
                                </Link>
                            </p>
                        </div>

                    </div>

                </main>

            )}

            <Footer />
        </div>
    );
}

export default Signin;

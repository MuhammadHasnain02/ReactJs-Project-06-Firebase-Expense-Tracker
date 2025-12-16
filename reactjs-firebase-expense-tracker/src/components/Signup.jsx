import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { RotatingLines } from "react-loader-spinner";

function Signup() {
    const navigation = useNavigate();
    const { darkMode } = useContext(ThemeContext);

    const [email , setEmail] = useState('');
    const [password , setPassword] = useState('');
    const [confirmPassw , setConfirmPassw] = useState('');
    const { signup } = useAuth();
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();

        if (password !== confirmPassw) {
            return alert('Error: Passwords do not match');
        }

        setLoading(true);
        try {
            await signup(email, password);
            navigation('/dashboard');
        } catch (error) {
            alert("Registration Failed! Please try again.");
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

                <main className="flex items-center justify-center p-4 pt-25 pb-8">

                    {/* CARD */}
                    <div className={`w-full max-w-md rounded-2xl p-8 sm:px-10 sm:py-8 shadow-2xl space-y-5 transition duration-300
                        ${darkMode ? "bg-gray-800 shadow-black/40" : "bg-white shadow-gray-300"}`}>

                        {/* HEADER */}
                        <div className={`flex flex-col items-center border-b pb-3
                            ${darkMode ? "border-gray-600" : "border-gray-200"}`}>

                            {/* Icon */}
                            <div className={`p-3 rounded-full shadow-lg transition duration-300 mb-2
                                ${darkMode ? "bg-gray-700 shadow-black/40" : "bg-indigo-100 shadow-indigo-200"}`}>
                                <svg 
                                    className={`w-8 h-8 ${darkMode ? "text-indigo-300" : "text-indigo-600"}`}
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-1 16l-3.5-3.5L9.5 12l2.5 2.5L18.5 8l-1.5 1.5-5 5-2.5-2.5z" />
                                </svg>
                            </div>

                            <h2 className="text-[26px] font-extrabold">
                                Create Your Account
                            </h2>

                            <p className={`text-[13px] transition duration-300 font-normal
                                ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                                Start tracking your expenses for a better financial future.
                            </p>
                        </div>

                        {/* FORM */}
                        <form onSubmit={handleSubmit} className="space-y-5 font-sans">

                            {/* EMAIL */}
                            <div>
                                <label htmlFor="email" className={`block text-sm font-medium mb-1 transition 
                                    ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                                    Email Address
                                </label>
                                
                                <input
                                    type="email"
                                    placeholder="you@domain.com"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    id="email"
                                    className={`w-full px-4 py-2 rounded-lg shadow-sm transition-all
                                        ${darkMode 
                                            ? "bg-gray-700 border border-gray-600 text-gray-100 placeholder-gray-400 focus:ring-indigo-400"
                                            : "bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-indigo-500"
                                        } focus:outline-none focus:ring-2`}
                                    disabled={loading}
                                />
                            </div>

                            {/* PASSWORD */}
                            <div>
                                <label htmlFor="password" className={`block text-sm font-medium mb-1 
                                    ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                                    Password
                                </label>

                                <input
                                    type="password"
                                    placeholder="Your password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    id="password"
                                    className={`w-full px-4 py-2 rounded-lg shadow-sm transition-all
                                        ${darkMode 
                                            ? "bg-gray-700 border border-gray-600 text-gray-100 placeholder-gray-400 focus:ring-indigo-400"
                                            : "bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-indigo-500"
                                        } focus:outline-none focus:ring-2`}
                                    disabled={loading}
                                />
                            </div>

                            {/* CONFIRM PASSWORD */}
                            <div>
                                <label htmlFor="reEnterpassword" className={`block text-sm font-medium mb-1 
                                    ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                                    Confirm Password
                                </label>

                                <input
                                    type="password"
                                    placeholder="Re-enter password"
                                    value={confirmPassw}
                                    onChange={(e) => setConfirmPassw(e.target.value)}
                                    id="reEnterpassword"
                                    className={`w-full px-4 py-2 rounded-lg shadow-sm transition-all
                                        ${darkMode 
                                            ? "bg-gray-700 border border-gray-600 text-gray-100 placeholder-gray-400 focus:ring-indigo-400"
                                            : "bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-indigo-500"
                                        } focus:outline-none focus:ring-2`}
                                    disabled={loading}
                                />

                                {password && confirmPassw && password !== confirmPassw && (
                                    <p className="text-red-500 text-xs mt-1">Passwords do not match.</p>
                                )}
                            </div>

                            {/* SUBMIT BUTTON */}
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-3 px-4 rounded-lg text-white font-semibold text-lg transition duration-300 cursor-pointer
                                    ${loading 
                                        ? "bg-indigo-400 cursor-not-allowed"
                                        : "bg-indigo-600 hover:bg-indigo-700 shadow-lg hover:scale-[1.01]"
                                    }`}
                            >
                                {loading ? "Registering..." : "Sign Up"}
                            </button>

                        </form>

                        {/* SIGN IN LINK */}
                        <div className="text-center mt-5">
                            <p className={`${darkMode ? "text-gray-300" : "text-gray-600"} text-[13px]`}>
                                Already have an account?{" "}
                                <Link 
                                    to="/signin" 
                                    className={`font-medium ${darkMode ? "text-indigo-400 hover:text-indigo-300" : "text-indigo-600 hover:text-indigo-700"}`}
                                >
                                    Log in
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

export default Signup;

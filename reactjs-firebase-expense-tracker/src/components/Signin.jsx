import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
// Assuming Navbar and Footer are imported for consistency
import Navbar from "../components/Navbar"; 
import Footer from "../components/Footer";

function Signin() {
    const navigation = useNavigate();
    const [email , setEmail] = useState('');
    const [password , setPassword] = useState('');
    // Assuming useAuth provides login and signInWithGoogle methods
    const { login, signInWithGoogle } = useAuth(); 
    const [loading, setLoading] = useState(false); // Added loading state

    async function handleSubmit(e) {
        e.preventDefault();

        if (!email || !password) {
            // Using a more modern alert for better UX (replace with toast library later)
            return alert('Please enter both email and password!');
        }

        setLoading(true);
        try {
            await login(email, password);
            alert("Successfully Logged In!"); // Replace with toast notification
            navigation('/dashboard');
            setEmail('');
            setPassword('');
        } catch (error) {
            console.error('Failed to login:', error.message);
            alert('Login Failed: Check your credentials.'); // Specific error message is better
        } finally {
            setLoading(false);
        }
    }

    // Modernized UI structure starts here
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            {/* Navbar is optional here, but good practice for full app layout */}
            <Navbar /> 

            {/* Main Content: Centered Form, pt-20 for navbar offset */}
            <main className="flex-grow flex items-center justify-center p-4 pt-25 pb-8">
                {/* Sign-in Card Container: Modern shadow, rounded corners, and primary color focus */}
                <div className="w-full max-w-md bg-white p-8 sm:p-10 sm:py-8 rounded-2xl shadow-2xl space-y-6">
                    
                    {/* Header Section */}
                    <div className="flex flex-col items-center space-y-3">
                         {/* Modern Icon/Logo for visual appeal */}
                        <div className="p-3 bg-indigo-600 rounded-full text-white shadow-lg shadow-indigo-600/50">
                            {/* Placeholder for Lock/Key Icon */}
                            <svg 
                                className="w-8 h-8" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24" 
                                xmlns="http://www.w3.org/2000/svg"
                            >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v3h8z"></path>
                            </svg>
                        </div>
                        <h2 className="text-3xl font-extrabold text-gray-900">
                            Welcome Back!
                        </h2>
                        <p className="text-sm text-gray-500">
                            Sign in to access your Expense Tracker dashboard.
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">

                        {/* Email Input */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="e.g., you@domain.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                id="email"
                                // Modern Input Styling
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 
                                           focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                disabled={loading}
                            />
                        </div>

                        {/* Password Input */}
                        <div className="mb-1">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <input
                                type="password"
                                name="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                id="password"
                                // Modern Input Styling
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 
                                           focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                disabled={loading}
                            />
                        </div>

                        {/* Forgot Password Link - Added for completeness */}
                        <div className="flex justify-end">
                            <span className="text-sm font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer">
                                Forgot Password?
                            </span>
                        </div>
                        
                        {/* Submit Button (Primary Action) */}
                        <button type="submit" disabled={loading}
                            className={`w-full py-3 px-4 rounded-lg text-white font-semibold text-lg transition duration-300 cursor-pointer
                            ${loading 
                                ? 'bg-indigo-400 cursor-not-allowed' 
                                : 'bg-indigo-600 shadow-md hover:bg-indigo-700 transform hover:scale-[1.01] focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50'
                            }`}
                        >
                            {loading ? 'Logging In...' : 'Sign In'}
                        </button>

                    </form>

                    {/* Separator (Optional: For Google Sign-in) */}
                    <div className="flex items-center mb-3">
                        <div className="flex-grow border-t border-gray-300"></div>
                        <span className="flex-shrink mx-4 text-gray-400 text-sm">or continue with</span>
                        <div className="flex-grow border-t border-gray-300"></div>
                    </div>

                    {/* Google Sign-in Button */}
                    <button 
                        onClick={signInWithGoogle}
                        disabled={loading}
                        className="flex items-center justify-center gap-3 py-3 mb-3 w-full border border-gray-300 bg-white text-gray-600 font-semibold rounded-lg 
                                   hover:bg-gray-50 transition-all duration-300 shadow-sm disabled:opacity-50"
                    >
                        {/* Note: I kept the font-awesome class but recommend a standard SVG/image for better styling */}
                        <i className="fa-brands fa-google text-red-500 text-xl"></i>
                        Sign In with Google
                    </button>

                    {/* Footer: Link to Sign-up */}
                    <div className="text-center mt-4">
                        <p className="text-gray-600 text-sm">
                            Don't have an account?{" "}
                            <Link to="/signup" className="font-medium text-indigo-600 hover:text-indigo-700">
                                Create an account
                            </Link>
                        </p>
                    </div>

                </div>
            </main>

            {/* Footer is optional but good practice */}
            <Footer /> 
        </div>
    );
}

export default Signin;
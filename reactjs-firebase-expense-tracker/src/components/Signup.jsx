import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext";
// Assuming Navbar and Footer are imported for consistency
import Navbar from "../components/Navbar"; 
import Footer from "../components/Footer";

function Signup() {
    const navigation = useNavigate()

    const [email , setEmail] = useState('');
    const [password , setPassword] = useState('');
    const [confirmPassw , setConfirmPassw] = useState('');
    const { signup } = useAuth()
    const [loading, setLoading] = useState(false); // Added loading state

    async function handleSubmit(e) {
        e.preventDefault();

        if (password !== confirmPassw) {
            // Using modern alert/toast style
            return alert('Error: Passwords do not match');
        }
        
        setLoading(true);
        try {
            await signup(email , password)
            alert("Successfully Signed Up! Redirecting to Dashboard."); // Replace with toast notification
            navigation('/dashboard');
            setEmail('')
            setPassword('')
            setConfirmPassw('')

        } catch (error) {
            console.error('Failed to create account: ' + error.message);
            alert("Registration Failed: Please try again or check your network."); // Specific error message is better
        } finally {
            setLoading(false);
        }
    }
    
    // Modernized UI structure starts here
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar /> 

            {/* Main Content: Centered Form, pt-20 for navbar offset */}
            <main className="flex-grow flex items-center justify-center p-4 pt-25 pb-8">

                {/* Sign-up Card Container: Consistent modern styling */}
                <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-2xl shadow-2xl space-y-8">
                    
                    {/* Header Section */}
                    <div className="flex flex-col items-center space-y-4">
                         {/* Integrated Modern Logo for visual appeal (Shield/Graph) */}
                        <div className="p-3 bg-indigo-100 rounded-full shadow-lg">
                            {/* Using the shield/growth concept from your image suggestion */}
                            <svg 
                                className="w-8 h-8 text-indigo-600" 
                                fill="currentColor" 
                                viewBox="0 0 24 24" 
                                xmlns="http://www.w3.org/2000/svg"
                                // A placeholder for a modern growth/shield icon
                            >
                                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-1 16l-3.5-3.5L9.5 12l2.5 2.5L18.5 8l-1.5 1.5-5 5-2.5-2.5z" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-extrabold text-gray-900">
                            Create Your Account
                        </h2>
                        <p className="text-sm text-gray-500">
                            Start tracking your expenses for a better financial future.
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">

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
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <input
                                type="password"
                                name="password"
                                placeholder="Choose a secure password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                id="password"
                                // Modern Input Styling
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 
                                           focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                disabled={loading}
                            />
                        </div>

                        {/* Confirm Password Input */}
                        <div>
                            <label htmlFor="reEnterpassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                            <input
                                type="password"
                                name="reEnterpassword"
                                placeholder="Re-enter password"
                                value={confirmPassw}
                                onChange={(e) => setConfirmPassw(e.target.value)}
                                id="reEnterpassword"
                                // Modern Input Styling
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 
                                           focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                disabled={loading}
                            />
                             {/* Optional: Password mismatch feedback */}
                            {password && confirmPassw && password !== confirmPassw && (
                                <p className="text-red-500 text-xs mt-1">Passwords do not match.</p>
                            )}
                        </div>

                        {/* Submit Button (Primary Action) */}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3 px-4 rounded-lg text-white font-semibold text-lg transition duration-300 
                                       ${loading 
                                            ? 'bg-indigo-400 cursor-not-allowed' 
                                            : 'bg-indigo-600 shadow-lg hover:bg-indigo-700 transform hover:scale-[1.01] focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50'
                                        }`}
                        >
                            {loading ? 'Registering...' : 'Sign Up'}
                        </button>

                    </form>

                    {/* Footer: Link to Sign-in */}
                    <div className="text-center mt-6">
                        <p className="text-gray-600 text-sm">
                            Already have an account?{" "}
                            <Link to="/signin" className="font-medium text-indigo-600 hover:text-indigo-700">
                                Log in
                            </Link>
                        </p>
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
}

export default Signup;
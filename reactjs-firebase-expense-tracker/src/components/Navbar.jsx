import React, { useContext } from 'react';
import { useNavigate } from "react-router-dom";
import { ThemeContext } from '../context/ThemeContext';

const Navbar = () => {
    const navigation = useNavigate();
    const { darkMode, setDarkMode } = useContext(ThemeContext);

    // Toggle theme
    const handleThemeToggle = () => {
        setDarkMode(!darkMode);
    };

    return (
        <header
            className={`fixed top-0 left-0 w-full shadow-md z-10 transition duration-300
                ${darkMode ? "bg-gray-900 text-gray-100 shadow-gray-800" : "bg-white text-gray-900"}`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-3">

                {/* LOGO */}
                <div
                    className="flex items-center space-x-2 cursor-pointer"
                    onClick={() => navigation('/')}
                >
                    <div className={`p-1.5 rounded-full transition duration-300
                        ${darkMode ? "bg-gray-700" : "bg-indigo-100"}`}>
                        
                        <img
                            src={`${darkMode ? './logo-2.png' : './logo.png'}`}
                            alt="Logo"
                            className="w-12 h-12 object-contain"
                        />
                    </div>

                    <p className={`text-[23px] font-bold tracking-tight transition duration-300
                        ${darkMode ? "text-gray-100" : "text-gray-700"}`}>
                        Expense <span className="text-indigo-600">Tracker</span>
                    </p>
                </div>

                {/* RIGHT SIDE BUTTONS */}
                <div className="flex items-center space-x-3">

                    {/* THEME TOGGLE BUTTON */}
                    <button
                        onClick={handleThemeToggle}
                        className={`flex justify-center items-center w-10 h-10 cursor-pointer transition-all duration-200 rounded-full shadow-md
                            ${darkMode
                                ? "bg-gray-700 shadow-black/40 rotate-0 hover:-rotate-30"
                                : "bg-indigo-100 -rotate-10 hover:-rotate-20"
                            }`}
                    >
                        {darkMode ? (
                            <i className="fa-regular fa-sun text-indigo-400 text-[20px]"></i>
                        ) : (
                            <i className="fa-regular fa-moon text-indigo-700 text-[20px]"></i>
                        )}
                    </button>

                    {/* LOGIN BUTTON */}
                    <button
                        onClick={() => navigation('/signin')}
                        className={`hidden sm:inline-block py-2 px-4 font-semibold rounded-lg cursor-pointer transition
                            ${darkMode
                                ? "text-indigo-300 hover:bg-gray-800"
                                : "text-indigo-600 hover:bg-indigo-50"
                            }`}
                    >
                        Login
                    </button>

                    {/* REGISTER BUTTON */}
                    <button
                        onClick={() => navigation('/signup')}
                        className={`py-2 px-4 font-semibold rounded-lg shadow-md cursor-pointer transition
                            ${darkMode
                                ? "bg-indigo-600 text-white hover:bg-indigo-700"
                                : "bg-indigo-600 text-white hover:bg-indigo-700"
                            }`}
                    >
                        Register
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Navbar;

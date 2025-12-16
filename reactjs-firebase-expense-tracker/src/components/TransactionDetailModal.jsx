import React, { useState, useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

const TransactionDetailModal = ({ transaction, onClose }) => {
    const { darkMode } = useContext(ThemeContext);
    const [isClosing, setIsClosing] = useState(false);

    if (!transaction) return null;

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => onClose(), 200);
    };

    // Income/Expense Colors
    const isIncome = transaction.type === 'income';

    const icon = isIncome ? 'fa-arrow-up' : 'fa-arrow-down';

    const colorClass = isIncome
        ? `text-green-600 ${darkMode ? 'bg-green-900/30' : 'bg-green-50'}`
        : `text-red-600 ${darkMode ? 'bg-red-900/30' : 'bg-red-50'}`;

    // Date
    const date = transaction.createdAt?.toDate
        ? transaction.createdAt.toDate().toLocaleString()
        : new Date(transaction.createdAt).toLocaleString();

    return (
        <>
            {/* Animations */}
            <style>{`
                @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
                @keyframes zoomIn { from { opacity: 0; transform: scale(0.95) } to { opacity: 1; transform: scale(1) } }
                @keyframes fadeOut { from { opacity: 1 } to { opacity: 0 } }
                @keyframes zoomOut { from { opacity: 1; transform: scale(1) } to { opacity: 0; transform: scale(0.95) } }

                .animate-backdrop-in { animation: fadeIn .25s ease-out forwards }
                .animate-backdrop-out { animation: fadeOut .25s ease-in forwards }
                .animate-modal-in { animation: zoomIn .25s ease-out forwards }
                .animate-modal-out { animation: zoomOut .25s ease-in forwards }
            `}</style>

            {/* Backdrop */}
            <div
                onClick={handleClose}
                className={`fixed inset-0 z-50 flex items-center justify-center p-4 
                backdrop-blur-sm transition-all duration-300
                ${darkMode ? 'bg-black/40' : 'bg-black/20'}
                ${isClosing ? 'animate-backdrop-out' : 'animate-backdrop-in'}
            `}
            >

                {/* Modal */}
                <div
                    onClick={(e) => e.stopPropagation()}
                    className={`w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl transform transition-all
                    ${darkMode ? 'bg-gray-900 text-gray-200' : 'bg-white text-gray-800'}
                    ${isClosing ? 'animate-modal-out' : 'animate-modal-in'}
                `}
                >

                    {/* Header */}
                    <div className={`flex justify-between items-center px-6 py-4 border-b 
                        ${darkMode ? 'border-gray-700' : 'border-gray-200'}
                    `}>
                        <h3 className="text-lg font-bold tracking-wide flex items-center gap-2">
                            <i className="fa-solid fa-receipt text-indigo-500"></i>
                            Transaction Details
                        </h3>

                        {/* Close Button */}
                        <button
                            onClick={handleClose}
                            className={`w-8 h-8 rounded-full flex items-center justify-center 
                            transition-all duration-200 cursor-pointer
                            ${darkMode
                                ? 'hover:bg-red-600/20 text-gray-300 hover:text-red-400'
                                : 'hover:bg-red-100 text-gray-500 hover:text-red-600'
                            }`}
                        >
                            <i className="fa-solid fa-xmark text-lg"></i>
                        </button>
                    </div>

                    {/* Body */}
                    <div className="p-6 flex flex-col items-center text-center space-y-4">

                        {/* Icon Badge */}
                        <div
                            className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl shadow-sm ${colorClass}`}
                        >
                            <i className={`fa-solid ${icon}`}></i>
                        </div>

                        {/* Amount */}
                        <div className="space-y-1">
                            <p className={`text-sm uppercase tracking-wide ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                Amount
                            </p>
                            <h2
                                className={`text-2xl font-extrabold 
                                ${isIncome ? 'text-green-500' : 'text-red-500'}
                            `}
                            >
                                {isIncome ? '+' : '-'} Rs. {Math.abs(transaction.amount).toLocaleString()}
                            </h2>
                        </div>

                        {/* Details */}
                        <div className={`w-full space-y-4 text-left pt-4 border-t 
                            ${darkMode ? 'border-gray-700' : 'border-gray-200'}
                        `}>
                            {/* Description */}
                            <div className="flex justify-between items-center">
                                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                    Description
                                </span>
                                <span className="font-semibold">{transaction.description}</span>
                            </div>

                            {/* Type */}
                            <div className="flex justify-between items-center">
                                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                    Category / Type
                                </span>
                                <span
                                    className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${colorClass}`}
                                >
                                    {transaction.type}
                                </span>
                            </div>

                            {/* Date */}
                            <div className="flex justify-between items-center">
                                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                    Date & Time
                                </span>
                                <span className="text-sm font-medium">{date}</span>
                            </div>

                            {/* ID */}
                            <div className="flex justify-between items-center">
                                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                    Transaction ID
                                </span>
                                <span className="text-[13px] font-mono truncate max-w-[150px] text-indigo-400">
                                    {transaction.id}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className={`p-4 text-center border-t 
                        ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}
                    `}>
                        <button
                            onClick={handleClose}
                            className={`w-full py-3 rounded-full font-bold transition-all duration-300 cursor-pointer
                            ${darkMode
                                ? 'bg-gray-700 hover:bg-gray-600 text-gray-100'
                                : 'bg-black hover:bg-gray-800 text-white'
                            } hover:scale-[0.98]
                        `}
                        >
                            Close
                        </button>
                    </div>

                </div>
            </div>
        </>
    );
};

export default TransactionDetailModal;

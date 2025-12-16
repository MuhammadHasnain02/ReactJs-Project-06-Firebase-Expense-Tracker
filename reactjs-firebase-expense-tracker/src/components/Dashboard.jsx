import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { 
    addDoc, collection, deleteDoc, doc, onSnapshot, query, 
    updateDoc, where, orderBy 
} from "firebase/firestore";

import { db } from '../firebase/config';
import Footer from "../components/Footer"
import TransactionDetailModal from "../components/TransactionDetailModal"
import { ThemeContext } from '../context/ThemeContext';
import { RotatingLines } from 'react-loader-spinner';

<style>
    {`
        .dropdown-item {
            @apply w-full flex items-center gap-3 text-left px-4 py-2.5 
            hover:bg-gray-100 text-gray-700 transition cursor-pointer;
        }
        .dropdown-item i {
            @apply text-lg;
        }
    `}
</style>

function Dashboard() {
    const navigation = useNavigate();
    const { darkMode, setDarkMode } = useContext(ThemeContext);
    const { currentUser, logout } = useAuth();

    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [newDescription, setNewDescription] = useState("");
    const [newAmount, setNewAmount] = useState("");
    const [editId, setEditId] = useState("");
    const [formType, setFormType] = useState('income');

    const [open, setOpen] = useState(false);
    const dropdownRef = useRef();
    const [summary, setSummary] = useState({ income: 0, expense: 0, balance: 0 });

    const [pageLoading, setPageLoading] = useState(true);   // first load only
    const [historyLoading, setHistoryLoading] = useState(false); // add/update/delete
    const [formLoading, setFormLoading] = useState(false); // form button

    // ------------------ GET DATA --------------------
    useEffect(() => {
        
        if (!currentUser) return;
        setPageLoading(true);

        const qry = query(
            collection(db, "transactions"),
            where("uid", "==", currentUser.uid),
            orderBy("createdAt", "desc")
        );

        const unsubscribe = onSnapshot(qry, (snapshot) => {
            const dataArr = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }));
            setTransactions(dataArr);

            let totalIncome = 0;
            let totalExpense = 0;

            dataArr.forEach(t => {
                const amount = parseFloat(t.amount || 0);
                if (t.type === 'income') totalIncome += amount;
                else totalExpense += amount;
            });

            setSummary({
                income: totalIncome,
                expense: totalExpense,
                balance: totalIncome - totalExpense,
            });

            setPageLoading(false);
        });

        return () => unsubscribe();

    }, [currentUser]);

    // ------------------ Dropdown Handling --------------------

    useEffect(() => {

        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);

    }, []);

    // ------------------ ADD / UPDATE Transaction --------------------

    async function handleAddUpdateTransaction() {
        if (!newDescription.trim() || !newAmount || historyLoading) return;
        setFormLoading(true);
        setHistoryLoading(true);

        const data = {
            description: newDescription,
            amount: parseFloat(newAmount),
            type: formType,
            uid: currentUser.uid,
            createdAt: new Date(),
        };

        try {   
            // await new Promise(res => setTimeout(res, 500));

            if (editId) {
                await updateDoc(doc(db, "transactions", editId), {
                    description: data.description,
                    amount: data.amount,
                    type: data.type
                });
            } else {
                await addDoc(collection(db, "transactions"), data);
            }
            setNewDescription("");
            setNewAmount("");
            setEditId("");

        } finally {
            setFormLoading(false);
            setHistoryLoading(false);
        }
    }

    // ------------------ Edit Transaction --------------------

    function editTransaction(t) {
        setNewDescription(t.description);
        setNewAmount(t.amount);
        setFormType(t.type);
        setEditId(t.id);
    }

    // ------------------ Delete Transaction --------------------

    async function handleDeleteTransaction(id) {
        if (historyLoading) return;
        setHistoryLoading(true);

        try { 
            await deleteDoc(doc(db, "transactions", id)); 
        }
        catch (error) {
            console.error('Error deleting transaction:', error);
        }
        finally { 
            setHistoryLoading(false);
        }
    }

    // ------------------ Handle Logout --------------------

    async function handleLogout() {
        await logout();
        navigation('/');
    }

    const formatCurrency = (v) => `Rs. ${Math.abs(v).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

    return (
        <div className={`min-h-screen flex flex-col transition-colors duration-300
            ${darkMode ? 'bg-gray-900 text-gray-200' : 'bg-gray-50 text-gray-900'}`}>

            {/* ------------------ HEADER ------------------ */}
            <nav className={`flex justify-between items-center w-full shadow-md px-4 sm:px-8 md:px-10 py-3 border-b sticky top-0 z-10
                ${darkMode 
                    ? "bg-gray-900 border-gray-700 shadow-gray-800" 
                    : "bg-white border-gray-100"
                }`}>

                {/* Logo */}
                <div onClick={() => navigation('/')}
                    className="flex items-center space-x-3 cursor-pointer">
                        
                    <div className={`p-1 rounded-full 
                        ${darkMode ? "bg-gray-800" : "bg-indigo-100"}`}
                    >
                        <img 
                            src={`${darkMode ? './logo-2.png' : './logo.png'}`}
                            alt="Logo"
                            className="w-12 h-12 object-contain"
                        />
                    </div>

                    <p className={`text-2xl font-bold tracking-tight 
                        ${darkMode ? "text-gray-200" : "text-gray-700"}`}
                    >
                        Expense <span className="text-indigo-600">Tracker</span>
                    </p>
                </div>

                <div className="relative flex flex-row justify-center items-center gap-8" 
                    ref={dropdownRef}>

                    {/* ==== Welcome User ==== */}
                    <p className={`hidden md:block text-sm font-medium tracking-tight
                        ${darkMode ? "text-gray-300" : "text-gray-800"}`}
                    >
                        WELCOME, {currentUser.email.toUpperCase().split("@")[0]}
                    </p>

                    {/* ==== Theme Toggle ==== */}
                    <button
                        onClick={() => setDarkMode(!darkMode)}
                        className={`flex justify-center items-center w-10 h-10 cursor-pointer transition-all duration-200 rounded-full shadow-md 
                            ${darkMode
                                ? "bg-gray-700 shadow-black/40 rotate-0 hover:-rotate-30"
                                : "bg-indigo-100 -rotate-10 hover:-rotate-20"
                            }`}
                    >
                        <i 
                            className={`text-[20px] transition-all duration-200 
                                ${darkMode 
                                    ? "fa-solid fa-sun text-indigo-400" 
                                    : "fa-regular fa-moon text-indigo-700"
                                }`}
                        ></i>
                    </button>

                    {/* ==== Profile Trigger ==== */}
                    <div onClick={() => setOpen(!open)}
                        className="flex flex-col items-center cursor-pointer -space-y-2.5">
                        <i className={`ri-account-circle-fill text-[32px] 
                            ${darkMode ? "text-gray-200" : "text-indigo-700"}`}></i>

                        <p className={`hidden md:block font-sans text-sm font-medium truncate max-w-[120px]
                            ${darkMode ? "text-gray-300" : "text-gray-800"}`}>

                            {currentUser.email.split("@")[0]}

                        </p>
                    </div>

                    {/* ==== DROPDOWN BOX ==== */}
                    <div className={`absolute top-0 -right-5 mt-16 w-64 rounded-xl py-2 z-50 transition-all duration-200 border shadow-2xl
                        ${open 
                            ? "opacity-100 scale-100" 
                            : "opacity-0 scale-95 pointer-events-none"
                        }
                        ${darkMode
                            ? "bg-gray-900 border-gray-700 shadow-black"
                            : "bg-white border-gray-200 shadow-gray-300"
                        }`}>

                        {/* Top User Info */}
                        <div className={`flex items-center gap-3 px-4 py-3 border-b
                            ${darkMode ? "border-gray-700" : "border-gray-300"}`}>

                            <i className={`ri-account-circle-fill text-4xl 
                                ${darkMode ? "text-gray-300" : "text-gray-700"}`}></i>

                            <div className='font-sans'>
                                <p className={`font-semibold truncate font-sans
                                    ${darkMode ? "text-gray-200" : "text-gray-800"}`}>
                                    {currentUser.email.split("@")[0]}
                                </p>

                                <p className={`text-sm font-medium truncate max-w-[150px]
                                    ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                                    {currentUser.email}
                                </p>
                            </div>

                        </div>

                        {/* Settings Items */}
                        <div className={`${darkMode ? "border-gray-700" : "border-gray-300"} border-b py-4`}>
                            {[

                                ["Profile", "ri-user-line"],
                                ["Account", "ri-user-settings-line"],
                                ["Appearance", "ri-brush-line"],
                                ["Settings", "ri-settings-3-line"],

                            ].map(([name, icon]) => (

                                <button key={name}
                                    className={`flex items-center gap-2 px-5 py-2 w-full text-left cursor-pointer
                                        transition-colors duration-150
                                        ${darkMode 
                                            ? "text-gray-300 hover:bg-gray-800" 
                                            : "text-gray-700 hover:bg-gray-100"
                                        }`}>
                                    <i className={icon}></i> <span className='tracking-tight font-medium'>{name}</span>
                                </button>

                            ))}
                        </div>

                        {/* Logout */}
                        <button
                            onClick={handleLogout}
                            className={`flex items-center gap-2 px-4 py-2 w-full text-left transition tracking-tight font-medium cursor-pointer
                                ${darkMode 
                                    ? "text-red-400 hover:bg-red-900/20" 
                                    : "text-red-600 hover:bg-red-50"
                                }`}
                        >
                            <i className="ri-logout-box-r-line text-[18px]"></i> Sign out
                        </button>
                    </div>
                </div>
            </nav>

            {/* Page Loading State */}
            {pageLoading ? (

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

                <main className={`max-w-7xl mx-auto w-full space-y-10 p-4 sm:px-6 sm:py-6 lg:px-8 lg:py-10 lg:pb-14 transition-colors duration-300
                    ${darkMode ? 'bg-gray-900 text-gray-200' : 'bg-gray-50 text-gray-900'}`}>

                    {/* ------------------ SUMMARY CARDS (INLINE UI) ------------------ */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">

                        {/* Income Card */}
                        <div className={`p-5 sm:p-6 md:p-6.5 rounded-xl shadow-md flex items-center gap-4 cursor-pointer duration-200
                            ${darkMode ? "bg-gray-900 border border-gray-700 hover:shadow-lg hover:bg-[#141d2d]" 
                                        : "bg-white border border-gray-200 hover:shadow-lg hover:bg-gray-50"}`}>
                            <div className={`${darkMode ? "px-4 py-3 rounded-full bg-green-900/20" : "px-4 py-3 rounded-full bg-green-100"}`}>
                                <i className="ri-arrow-up-circle-line text-2xl text-green-600"></i>
                            </div>
                            <div>
                            <p className={`${darkMode ? "text-gray-300" : "text-gray-700"} font-semibold font-sans`}>Total Income</p>
                            <h3 className="text-[26px] font-bold mt-0.5 text-green-700">
                                <span className='pr-1'>Rs.</span>
                                {Math.abs(summary.income).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </h3>
                            </div>
                        </div>

                        {/* Expense Card */}
                        <div className={`p-5 sm:p-6 md:p-6.5 rounded-xl shadow-md flex items-center gap-4 cursor-pointer duration-200
                                        ${darkMode ? "bg-gray-900 border border-gray-700 hover:shadow-lg hover:bg-[#141d2d]" 
                                                    : "bg-white border border-gray-200 hover:shadow-lg hover:bg-gray-50"}`}>
                            <div className={`${darkMode ? "px-4 py-3 rounded-full bg-red-900/20" : "px-4 py-3 rounded-full bg-red-100"}`}>
                            <i className="ri-arrow-down-circle-line text-2xl text-red-600"></i>
                            </div>
                            <div>
                            <p className={`${darkMode ? "text-gray-300" : "text-gray-700"} font-semibold font-sans`}>Total Expense</p>
                            <h3 className="text-[26px] font-bold mt-0.5 text-red-700">
                                <span className='pr-1'>Rs.</span>
                                {Math.abs(summary.expense).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </h3>
                            </div>
                        </div>

                        {/* Balance Card */}
                        <div className={`p-5 sm:p-6 md:p-6.5 rounded-xl shadow-md flex items-center gap-4 cursor-pointer duration-200
                                        ${darkMode ? "bg-gray-900 border border-gray-700 hover:shadow-lg hover:bg-[#141d2d]" 
                                                    : "bg-white border border-gray-200 hover:shadow-lg hover:bg-gray-50"}`}>
                            <div className={`${darkMode ? "px-4 py-3 rounded-full bg-indigo-900/20" : "px-4 py-3 rounded-full bg-indigo-100"}`}>
                            <i className="ri-wallet-3-line text-2xl text-indigo-600"></i>
                            </div>
                            <div>
                            <p className={`${darkMode ? "text-gray-300" : "text-gray-700"} font-semibold font-sans`}>Net Balance</p>
                            <h3 className="text-[26px] font-bold mt-0.5 text-indigo-700">
                                <span className='pr-1'>Rs.</span>
                                {Math.abs(summary.balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </h3>
                            </div>
                        </div>

                    </div>

                    {/* ---------- FORM + HISTORY (2 COLUMNS) ---------- */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                        {/* -------- FORM (LEFT SIDE) -------- */}
                        <div className={`h-100 rounded-xl shadow-xl p-6 sm:p-8
                            ${darkMode ? 'bg-gray-900 border border-gray-700' : 'bg-white border border-gray-200'}`}>

                            {/* header */}
                            <div className={`flex items-center justify-between mb-3 pb-4 border-b
                                ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>

                                {/* Left Side: Dynamic Icon & Title */}
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm transition-all duration-300
                                                    ${darkMode ? 'bg-indigo-900/30 text-indigo-400' : 'bg-indigo-100 text-indigo-600'}`}>
                                    <i className={`fa-solid ${editId ? 'fa-pen-to-square' : 'fa-layer-group'} text-lg`}></i>
                                    </div>
                                    <h3 className={`text-[21px] font-bold tracking-tight
                                                    ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                    {editId ? "Edit" : "New"} <span className={`text-indigo-600 ${darkMode ? 'dark:text-indigo-400' : ''}`}>Transaction</span>
                                    </h3>
                                </div>

                                {/* Right Side: Status Badge */}
                                <span className={`hidden sm:inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase border
                                                ${editId 
                                                    ? (darkMode 
                                                    ? 'bg-amber-900/20 text-amber-300 border-amber-800' 
                                                    : 'bg-amber-50 text-amber-700 border-amber-200') 
                                                    : (darkMode 
                                                    ? 'bg-indigo-900/20 text-indigo-300 border-indigo-800' 
                                                    : 'bg-indigo-50 text-indigo-700 border-indigo-200')}`}>
                                    {editId ? "Update Mode" : "Create Mode"}
                                </span>

                            </div>

                            {/* Switch Buttons */}
                            <div className={`flex mb-5 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                            <button
                                onClick={() => { setFormType("income"); setEditId(""); setNewDescription(""); setNewAmount(""); }}
                                className={`flex-1 py-3 font-semibold text-[16px] cursor-pointer 
                                            ${formType === 'income'
                                            ? 'text-indigo-600 border-b-2 border-indigo-600'
                                            : darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                Income
                            </button>
                            <button
                                onClick={() => { setFormType("expense"); setEditId(""); setNewDescription(""); setNewAmount(""); }}
                                className={`flex-1 py-3 font-semibold text-[16px] cursor-pointer 
                                            ${formType === 'expense'
                                            ? 'text-indigo-600 border-b-2 border-indigo-600'
                                            : darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                Expense
                            </button>
                            </div>

                            {/* INLINE INPUTS */}
                            <div className="flex flex-col gap-5 font-sans">
                                <input 
                                    type="number"
                                    value={newAmount}
                                    onChange={(e) => setNewAmount(e.target.value)}
                                    placeholder={formType === 'income' ? "Amount Received" : "Amount Spent"}
                                    className={`w-full rounded-lg px-4 py-2.5 shadow-sm focus:ring-2 focus:ring-indigo-500
                                                ${darkMode ? 'bg-gray-800 border border-gray-600 text-gray-200 placeholder-gray-400' 
                                                        : 'bg-white border border-gray-300 text-gray-700 placeholder-gray-500'}`}
                                />
                                <input 
                                    value={newDescription}
                                    onChange={(e) => setNewDescription(e.target.value)}
                                    placeholder={formType === 'income' ? "Source (Salary etc.)" : "Description (Rent, Bills etc.)"}
                                    className={`w-full rounded-lg px-4 py-2.5 shadow-sm focus:ring-2 focus:ring-indigo-500
                                                ${darkMode ? 'bg-gray-800 border border-gray-600 text-gray-200 placeholder-gray-400' 
                                                        : 'bg-white border border-gray-300 text-gray-700 placeholder-gray-500'}`}
                                />
                                <button 
                                    onClick={handleAddUpdateTransaction}
                                    disabled={formLoading || !newDescription.trim() || !newAmount}
                                    className={`w-full font-semibold text-white px-5 py-2.5 rounded-lg shadow-md transition cursor-pointer duration-400 hover:scale-[0.99]
                                        ${formType === "income" ? "bg-purple-800": darkMode ? "bg-red-800" : "bg-red-700"}
                                        ${editId ? "bg-yellow-600" : "bg-purple-800"}
                                        ${formLoading ? "opacity-50" : ""}
                                    `}
                                >
                                    {formLoading ? "Please wait..." : editId ? "Update Transaction" : `Add ${formType}`}
                                </button>
                            </div>

                        </div>

                        {/* // -------- HISTORY (RIGHT SIDE) -------- */}
                        <div className={`flex flex-col rounded-xl shadow-xl h-full
                            ${darkMode ? 'bg-gray-900 border border-gray-700' : 'bg-white border border-gray-200'}`}>

                            {/* Header Section */}
                            <div className={`sticky top-0 p-6 border-b flex justify-between items-center rounded-t-xl
                                ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}>
                                <h3 className={`text-xl font-bold flex items-center gap-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm transition-all duration-300
                                                    ${darkMode ? 'bg-indigo-900/30 text-indigo-400' : 'bg-indigo-100 text-indigo-600'}`}>
                                    <i className={`fa-solid fa-clock-rotate-left text-lg`}></i>
                                    </div>
                                    History
                                </h3>
                                <p className={`uppercase font-semibold text-[13px] py-2 px-4 rounded-full border
                                    ${darkMode ? 'bg-indigo-900/20 text-indigo-300 border-indigo-800' : 'bg-indigo-50 text-indigo-700 border-indigo-200'}`}>
                                    <span className='text-[15px] font-extrabold'>{transactions.length}</span> Records
                                </p>
                            </div>

                            {/* Page Loading State */}
                            {historyLoading ? (

                                <div className="flex flex-col items-center justify-center rounded-xl shadow-xl h-full">
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

                                // {/* Scrollable List Section */}
                                <div className={`p-4 sm:p-6 lg:py-7 overflow-y-auto max-h-[400px] custom-scrollbar
                                                ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>

                                    {transactions.length > 0 ? (
                                        <div className="space-y-4">
                                        {transactions.map((t) => {
                                            const date = t.createdAt?.toDate 
                                                ? t.createdAt.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) 
                                                : new Date(t.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

                                            return (
                                            <div key={t.id} 
                                                className={`group flex items-center justify-between p-4 rounded-xl transition-all duration-300 cursor-pointer
                                                    ${darkMode ? 'bg-gray-800 border border-gray-700 hover:bg-[#263041] hover:shadow-md' 
                                                            : 'bg-gray-50 border border-gray-200 hover:bg-[#f8f9f6] hover:shadow-md'}`}>

                                                {/* Left Side: Icon & Details */}
                                                <div className="flex items-center gap-4 overflow-hidden">
                                                    <div className={`w-12 h-12 flex items-center justify-center rounded-full
                                                                    ${t.type === "income" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"} 
                                                                    ${darkMode ? (t.type === "income" ? "bg-green-900/20 text-green-500" : "bg-red-900/20 text-red-500") : ''}`}>
                                                        <i className={`fa-solid ${t.type === "income" ? "fa-arrow-up" : "fa-arrow-down"} text-lg`}></i>
                                                    </div>

                                                    <div className="min-w-0 space-y-1.5">
                                                        <div>
                                                        <p className={`font-bold text-[17px] truncate text-base
                                                                        ${darkMode ? 'text-gray-200' : 'text-gray-600'}`}>
                                                            {t.description}
                                                        </p>
                                                        </div>
                                                        <div className={`flex items-center gap-2 text-xs mt-1
                                                                        ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                        <span className="capitalize px-2 py-1 rounded text-[11px] font-medium
                                                                        bg-gray-200 dark:bg-gray-700">
                                                            {t.type}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <i className="fa-regular fa-calendar"></i> {date}
                                                        </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Right Side: Amount & Actions */}
                                                <div className="flex flex-col items-end gap-2 ml-4">

                                                    <p className={`text-lg font-bold tracking-tight
                                                        ${t.type === "income" ? "text-green-600" : "text-red-600"}
                                                        ${darkMode ? 'text-gray-200' : ''}`}>
                                                        {t.type === "income" ? "+ " : "- "}{formatCurrency(t.amount)}
                                                    </p>

                                                    {/* Action Buttons */}
                                                    <div className="flex items-center gap-1">

                                                        <button title="View" onClick={() => setSelectedTransaction(t)}
                                                        className={`p-1.5 rounded-lg transition-colors cursor-pointer
                                                            ${darkMode ? 'text-gray-400 hover:text-indigo-300 hover:bg-indigo-900/20' 
                                                                        : 'text-gray-400 hover:text-indigo-600 hover:bg-indigo-50'}`}
                                                        >
                                                        <i className="fa-regular fa-eye"></i>
                                                        </button>

                                                        <button title="Edit" onClick={() => editTransaction(t)} 
                                                        className={`p-1.5 rounded-lg transition-colors cursor-pointer
                                                            ${darkMode ? 'text-gray-400 hover:text-indigo-300 hover:bg-indigo-900/20' 
                                                                        : 'text-gray-400 hover:text-indigo-600 hover:bg-indigo-50'}`}
                                                        >
                                                        <i className="fa-solid fa-pen-to-square"></i>
                                                        </button>

                                                        <button title="Delete" onClick={() => handleDeleteTransaction(t.id)} 
                                                        className={`p-1.5 rounded-lg transition-colors cursor-pointer
                                                            ${darkMode ? 'text-gray-400 hover:text-red-400 hover:bg-red-900/20' 
                                                                        : 'text-gray-400 hover:text-red-600 hover:bg-red-50'}`}
                                                        >
                                                        <i className="fa-solid fa-trash-can"></i>
                                                        </button>

                                                    </div>

                                                </div>

                                            </div>
                                            );
                                        })}
                                        </div>
                                    ) : (
                                        <div className={`flex flex-col items-center justify-center py-12 px-4 text-center border-2 border-dashed rounded-xl
                                                        ${darkMode ? 'bg-gray-800 border-gray-700 text-gray-200' : 'bg-gray-50/50 border-gray-200 text-gray-800'}`}>
                                        <div className={`p-4 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                                            <i className="fa-solid fa-clipboard-list text-2xl text-gray-400"></i>
                                        </div>
                                        <p className="font-medium mt-2">No transactions found</p>
                                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Add a new transaction to see history.</p>
                                        </div>
                                    )}

                                </div>

                            )}

                        </div>

                    </div>

                    {/* 4. Additional Detail Section (Expanded JSX) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                        {/* Recent Activity Card */}
                        <div className={`rounded-xl shadow-xl p-8 h-full border transition-all duration-300
                                        ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-100'}`}>
                            
                            <h3 className={`flex items-center text-xl font-bold mb-4
                                        ${darkMode ? 'text-gray-200' : 'text-gray-600'}`}>
                            <i className="fa-solid fa-clock-rotate-left text-indigo-500 mr-2"></i> Quick Activity
                            </h3>
                            <div className="space-y-4">

                            {(() => {
                                const latest = transactions[0];
                                const largest = transactions.reduce((max, t) => {
                                const maxAmount = parseFloat(max.amount || 0);
                                const currentAmount = parseFloat(t.amount || 0);
                                return Math.abs(currentAmount) > Math.abs(maxAmount) ? t : max;
                                }, transactions[0] || {});

                                return (
                                <>
                                    {/* Latest Transaction */}
                                    <div className={`pb-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                                    <p className={`text-md font-semibold mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Most Recent:</p>
                                    {latest ? (
                                        <p className={`text-md font-medium truncate ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                                        {latest.description} 
                                        <span className={`ml-2 font-bold ${latest.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                                            {formatCurrency(latest.amount)}
                                        </span>
                                        </p>
                                    ) : (
                                        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No activity yet.</p>
                                    )}
                                    </div>

                                    {/* Largest Transaction */}
                                    <div>
                                    <p className={`text-md font-semibold mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Largest Transaction:</p>
                                    {largest && largest.amount ? (
                                        <p className={`text-md font-medium truncate ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                                        {largest.description} 
                                        <span className={`ml-2 font-bold ${largest.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                                            {formatCurrency(largest.amount)}
                                        </span>
                                        </p>
                                    ) : (
                                        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No activity yet.</p>
                                    )}
                                    </div>
                                </>
                                );
                            })()}

                            </div>
                            
                        </div>

                        {/* Spending Health Card */}
                        <div className={`rounded-xl shadow-xl p-8 h-full border transition-all duration-300
                                        ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-100'}`}>
                            
                            <h3 className={`text-xl font-bold mb-4 flex items-center ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                            <i className="fa-solid fa-gauge-high text-indigo-500 mr-2"></i> Spending Health
                            </h3>

                            {(() => {
                            const { income, expense } = summary;
                            const ratio = income > 0 ? (expense / income) * 100 : 0;
                            const gaugeColor = ratio < 50 ? 'bg-green-500' : ratio < 80 ? 'bg-yellow-500' : 'bg-red-500';
                            const gaugeMessage = ratio < 50 ? 'Excellent Spending Control!' : ratio < 80 ? 'Spending is Healthy.' : 'Warning: High Spending Ratio!';

                            return (
                                <>
                                <p className={`text-4xl font-extrabold mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>{ratio.toFixed(1)}%</p>
                                <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Expense as a percentage of Income</p>

                                {/* Progress Bar/Gauge */}
                                <div className={`w-full rounded-full h-2.5 mb-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                                    <div 
                                    className={`h-2.5 rounded-full transition-all duration-700 ${gaugeColor}`} 
                                    style={{ width: `${Math.min(ratio, 100)}%` }}
                                    ></div>
                                </div>

                                <p className={`font-semibold text-[15px] ${ratio < 80 ? 'text-green-700' : 'text-red-700'}`}>{gaugeMessage}</p>
                                </>
                            );
                            })()}

                        </div>

                    </div>

                </main>
                
            )}

            {/* 3. RENDER THE MODAL AT THE BOTTOM */}
            {selectedTransaction && (
                <TransactionDetailModal 
                    transaction={selectedTransaction} 
                    onClose={() => setSelectedTransaction(null)} 
                />
            )}

            {/* ------------------ Footer ------------------ */}
            <Footer />

        </div>
    );
}

export default Dashboard;
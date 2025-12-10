import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { 
    addDoc, collection, deleteDoc, doc, onSnapshot, query, 
    updateDoc, where, orderBy 
} from "firebase/firestore";

import { db } from '../firebase/config';
import Footer from "../components/Footer"

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
    const { currentUser, logout } = useAuth();

    const [transactions, setTransactions] = useState([]);
    const [newDescription, setNewDescription] = useState("");
    const [newAmount, setNewAmount] = useState("");
    const [editId, setEditId] = useState("");
    const [loading, setLoading] = useState(false);
    const [formType, setFormType] = useState('income');

    const [open, setOpen] = useState(false);
    const dropdownRef = useRef();
    const [summary, setSummary] = useState({ income: 0, expense: 0, balance: 0 });

    // ------------------ GET DATA --------------------
    useEffect(() => {
        if (!currentUser) return;

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

    // ------------------ ADD / UPDATE --------------------
    async function handleAddUpdateTransaction(transaction) {
        if (!newDescription.trim() || !newAmount || loading) return;

        setLoading(true);
        const data = {
            description: newDescription,
            amount: parseFloat(newAmount),
            type: formType,
            uid: currentUser.uid,
            createdAt: new Date(),
        };

        try {
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
            setLoading(false);
        }
    }

    function editTransaction(t) {
        setNewDescription(t.description);
        setNewAmount(t.amount);
        setFormType(t.type);
        setEditId(t.id);
    }

    async function handleDeleteTransaction(id) {
        if (loading) return;
        setLoading(true);
        try { 
            await deleteDoc(doc(db, "transactions", id)); 
        }
        catch (error) {
            console.error('Error deleting transaction:', error);
        }
        finally { setLoading(false); }
    }

    async function handleLogout() {
        await logout();
        navigation('/');
    }

    const formatCurrency = (v) => `$${Math.abs(v).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">

            {/* ------------------ HEADER ------------------ */}
            <nav className="flex justify-between items-center bg-white w-full shadow-lg px-4 sm:px-8 py-3 border-b border-gray-100 sticky top-0 z-10">

                {/* Logo */}
                <div className="flex items-center space-x-2 cursor-pointer" 
                    onClick={() => navigation('/')}>

                    <div className="p-1 bg-indigo-100 rounded-full">
                        <img 
                            src="./public/logo.png"
                            alt="Logo"
                            className="w-12 h-12 object-contain"
                        />
                    </div>
                    <p className="text-2xl font-bold tracking-tight text-gray-700">
                        Expense <span className='text-indigo-700'>Tracker</span>
                    </p>
                </div>

                <div className="relative flex flex-row items-center gap-10" ref={dropdownRef}>

                    {/* ==== Welcome User ==== */}
                    <p className="hidden md:block text-gray-800 font-medium">
                        WELCOME, {currentUser.email.toUpperCase().split("@")[0]}
                    </p>

                    {/* ==== Profile Trigger ==== */}
                    <div onClick={() => setOpen(!open)}
                        className="flex flex-col items-center cursor-pointer">

                        {/* Profile Circle Icon */}
                        <i className="ri-account-circle-fill text-3xl text-indigo-700"></i>

                        {/* User Name */}
                        <p className="hidden md:block text-gray-800 font-medium truncate max-w-[120px]">
                            {currentUser.email.split("@")[0]}
                        </p>
                    </div>

                    {/* ==== DROPDOWN BOX ==== */}
                    <div
                        className={`absolute right-0 mt-3 w-64 bg-white border border-gray-200 shadow-2xl rounded-xl py-2 z-50 transition-all duration-200 ${
                        open ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
                        }`}
                    >
                        {/* Top User Info */}
                        <div className="flex items-center gap-3 px-4 py-3">
                            <i className="ri-account-circle-fill text-4xl text-gray-700"></i>
                            <div>
                                <p className="font-semibold text-gray-800 truncate">
                                {currentUser.email.split("@")[0]}
                                </p>
                                <p className="text-sm text-gray-500 truncate max-w-[150px]">
                                {currentUser.email}
                                </p>
                            </div>
                        </div>

                        <hr className="my-2" />

                        {/* Main Menu Items */}
                        {[
                            ["Profile", "ri-user-line"],
                            ["Repositories", "ri-folder-line"],
                            ["Stars", "ri-star-line"],
                            ["Gists", "ri-git-repository-line"],
                            ["Organizations", "ri-building-line"],
                            ["Sponsors", "ri-community-line"],
                        ].map(([name, icon]) => (
                        <button
                            key={name}
                            className="dropdown-item flex items-center gap-2 px-4 py-2 hover:bg-gray-100 w-full text-left transition-colors duration-150"
                        >
                            <i className={icon}></i> {name}
                        </button>
                        ))}

                        <hr className="my-2" />

                        {/* Settings Items */}
                        {[
                            ["Settings", "ri-settings-3-line"],
                            ["Account", "ri-user-settings-line"],
                            ["Appearance", "ri-brush-line"],
                            ["Accessibility", "ri-accessibility-line"],
                        ].map(([name, icon]) => (
                        <button
                            key={name}
                            className="dropdown-item flex items-center gap-2 px-4 py-2 hover:bg-gray-100 w-full text-left transition-colors duration-150"
                        >
                            <i className={icon}></i> {name}
                        </button>
                        ))}

                        <hr className="my-2" />

                        {/* Logout */}
                        <button
                            onClick={handleLogout}
                            className="dropdown-item text-red-600 flex items-center gap-2 px-4 py-2 hover:bg-red-100 w-full text-left transition-colors duration-150"
                        >
                        <i className="ri-logout-box-r-line"></i> Sign out
                        </button>
                    </div>

                </div>

            </nav>

            {/* flex-grow */}

            <main className=" max-w-7xl mx-auto w-full space-y-8 p-4 sm:px-6 sm:py-6 lg:px-8 lg:py-10 lg:pb-14">

                {/* ------------------ SUMMARY CARDS (INLINE UI) ------------------ */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">

                    {/* Income Card */}
                    <div className="p-5 rounded-xl bg-white shadow-md border border-gray-200 flex items-center gap-4 cursor-pointer hover:shadow-lg duration-200">
                        <div className="px-4 py-3 rounded-full bg-green-100">
                            <i className="ri-arrow-up-circle-line text-2xl text-green-600"></i>
                        </div>
                        <div>
                            <p className="text-gray-600 font-semibold">Total Income</p>
                            <h3 className="text-3xl font-bold mt-1 text-green-700">
                                ${Math.abs(summary.income).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </h3>
                        </div>
                    </div>

                    {/* Expense Card */}
                    <div className="p-5 rounded-xl bg-white shadow-md border border-gray-200 flex items-center gap-4 cursor-pointer hover:shadow-lg duration-200">
                        <div className="px-4 py-3 rounded-full bg-red-100">
                            <i className="ri-arrow-down-circle-line text-2xl text-red-600"></i>
                        </div>
                        <div>
                            <p className="text-red-600 font-medium">Total Expense</p>
                            <h3 className="text-3xl font-bold mt-1 text-red-700">
                                ${Math.abs(summary.expense).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </h3>
                        </div>
                    </div>

                    {/* Balance Card */}
                    <div className="p-5 rounded-xl bg-white shadow-md border border-gray-200 flex items-center gap-4 cursor-pointer hover:shadow-lg duration-200">
                        <div className="px-4 py-3 rounded-full bg-indigo-100">
                            <i className="ri-wallet-3-line text-2xl text-indigo-600"></i>
                        </div>
                        <div>
                            <p className="text-indigo-600 font-medium">Net Balance</p>
                            <h3 className="text-3xl font-bold mt-1 text-indigo-700">
                                ${Math.abs(summary.balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </h3>
                        </div>
                    </div>

                </div>

                {/* ---------- FORM + HISTORY (2 COLUMNS) ---------- */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* -------- FORM (LEFT SIDE) -------- */}
                    <div className="bg-white border border-gray-200 rounded-xl shadow-xl p-6 sm:p-8">

                        <h3 className="text-xl font-bold text-gray-800 mb-4">
                            {editId ? `Editing ${formType} Transaction` : 'Add New Transaction'}
                        </h3>

                        {/* Switch Buttons */}
                        <div className="flex mb-5 border-b border-gray-200">
                            <button
                                onClick={() => { setFormType("income"); setEditId(""); }}
                                className={`flex-1 py-3 font-semibold text-lg ${
                                    formType === 'income'
                                    ? 'text-indigo-600 border-b-2 border-indigo-600'
                                    : 'text-gray-500'
                                }`}
                            >
                                Income
                            </button>

                            <button
                                onClick={() => { setFormType("expense"); setEditId(""); }}
                                className={`flex-1 py-3 font-semibold text-lg ${
                                    formType === 'expense'
                                    ? 'text-indigo-600 border-b-2 border-indigo-600'
                                    : 'text-gray-500'
                                }`}
                            >
                                Expense
                            </button>
                        </div>

                        {/* INLINE INPUTS */}
                        <div className="flex flex-col gap-4">

                            <input 
                                type="number"
                                value={newAmount}
                                onChange={(e) => setNewAmount(e.target.value)}
                                placeholder={formType === 'income' ? "Amount Received" : "Amount Spent"}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 shadow-sm focus:ring-2 focus:ring-indigo-500"
                            />

                            <input 
                                value={newDescription}
                                onChange={(e) => setNewDescription(e.target.value)}
                                placeholder={formType === 'income' ? "Source (Salary etc.)" : "Description (Rent, Bills etc.)"}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 shadow-sm focus:ring-2 focus:ring-indigo-500"
                            />

                            <button
                                onClick={handleAddUpdateTransaction}
                                disabled={loading || !newDescription.trim() || !newAmount}
                                className={`w-full text-white px-5 py-2.5 rounded-lg shadow-md transition ${
                                    formType === "income"
                                    ? "bg-green-600 hover:bg-green-700"
                                    : "bg-red-600 hover:bg-red-700"
                                } ${loading ? "opacity-50" : ""}`}
                            >
                                {loading ? "Please wait..." : editId ? "Update Transaction" : `Add ${formType}`}
                            </button>

                        </div>

                    </div>

                    {/* -------- HISTORY (RIGHT SIDE) -------- */}
                    <div className="flex flex-col bg-white border border-gray-200 rounded-xl shadow-xl p-6 sm:p-8">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Transaction History</h3>

                        {transactions.length > 0 ?

                            transactions.map(t => (
                            <div key={t.id} className="flex justify-between py-3 border-b border-gray-200">
                                <div>
                                    <p className="font-semibold">{t.description}</p>
                                    <p className="text-sm text-gray-500">{t.type}</p>
                                </div>

                                <p className={t.type === "income" ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
                                    {formatCurrency(t.amount)}
                                </p>

                                <div className="space-x-2">
                                    <button onClick={() => editTransaction(t)} className="text-indigo-700">
                                        Edit
                                    </button>
                                    <button onClick={() => handleDeleteTransaction(t.id)} className="text-red-600">
                                        Delete
                                    </button>
                                </div>
                            </div>

                        )):
                            <div className="flex-1 flex items-center justify-center text-center py-10 border border-dashed rounded-lg text-gray-500">
                                No transactions yet.
                            </div>
                        }
                    </div>

                </div>

                {/* 4. Additional Detail Section (Expanded JSX) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* Recent Activity Card (Direct JSX) */}
                    <div className="bg-white rounded-xl shadow-xl p-6 border border-gray-100 h-full">
                        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                            <i className="fa-solid fa-clock-rotate-left text-indigo-500 mr-2"></i> Quick Activity
                        </h3>
                        <div className="space-y-4">
                            {/* CALCULATE LATEST TRANSACTION */}
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
                                        <div className="border-b pb-4 border-gray-100">
                                            <p className="text-sm font-semibold text-gray-700 mb-1">Most Recent:</p>
                                            {latest ? (
                                                <p className="text-lg font-medium text-gray-900 truncate">
                                                    {latest.description} 
                                                    <span className={`ml-2 font-bold ${latest.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                                                        {formatCurrency(latest.amount)}
                                                    </span>
                                                </p>
                                            ) : (<p className="text-gray-500">No activity yet.</p>)}
                                        </div>
                                        
                                        {/* Largest Transaction */}
                                        <div>
                                            <p className="text-sm font-semibold text-gray-700 mb-1">Largest Transaction:</p>
                                            {largest && largest.amount ? (
                                                <p className="text-lg font-medium text-gray-900 truncate">
                                                    {largest.description} 
                                                    <span className={`ml-2 font-bold ${largest.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                                                        {formatCurrency(largest.amount)}
                                                    </span>
                                                </p>
                                            ) : (<p className="text-gray-500">No activity yet.</p>)}
                                        </div>
                                    </>
                                );
                            })()}
                        </div>
                    </div>

                    {/* Spending Health Card (Direct JSX) */}
                    <div className="bg-white rounded-xl shadow-xl p-6 border border-gray-100 h-full">
                        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                            <i className="fa-solid fa-gauge-high text-indigo-500 mr-2"></i> Spending Health
                        </h3>
                        
                        {/* CALCULATE SPENDING RATIO */}
                        {(() => {
                            const { income, expense } = summary;
                            const ratio = income > 0 ? (expense / income) * 100 : 0;
                            const gaugeColor = ratio < 50 ? 'bg-green-500' : ratio < 80 ? 'bg-yellow-500' : 'bg-red-500';
                            const gaugeMessage = ratio < 50 ? 'Excellent Spending Control!' : ratio < 80 ? 'Spending is Healthy.' : 'Warning: High Spending Ratio!';

                            return (
                                <>
                                    <p className="text-4xl font-extrabold text-gray-900 mb-2">{ratio.toFixed(1)}%</p>
                                    <p className="text-sm text-gray-500 mb-4">Expense as a percentage of Income</p>
                                    
                                    {/* Progress Bar/Gauge */}
                                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                                        <div 
                                            className={`h-2.5 rounded-full transition-all duration-700 ${gaugeColor}`} 
                                            style={{ width: `${Math.min(ratio, 100)}%` }}
                                        ></div>
                                    </div>
                                    
                                    <p className={`font-semibold ${ratio < 80 ? 'text-green-700' : 'text-red-700'}`}>{gaugeMessage}</p>
                                </>
                            );
                        })()}
                    </div>

                </div>

            </main>

            {/* ------------------ Footer ------------------ */}
            <Footer />

        </div>
    );
}

export default Dashboard;

import React, { useState, useEffect } from 'react';

import { auth, db, collection, addDoc, onSnapshot, query, orderBy, doc, deleteDoc } from './firebase';



const PAGE_DASHBOARD = 'dashboard';


function Trade() {
    const [userId, setUserId] = useState(null);
    const [trades, setTrades] = useState([]);
    const [weeklyPL, setWeeklyPL] = useState(0);
    const [monthlyPL, setMonthlyPL] = useState(0);
    const [totalTrades, setTotalTrades] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(PAGE_DASHBOARD);
   

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                setUserId(user.uid);
            } else {
                signInAnonymously(auth).then(res => {
                    setUserId(res.user.uid);
                }).catch(error => console.error("Anonymous sign-in failed: ", error));
            }
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!userId) return;

       const tradesCollectionRef = collection(db, 'users', userId, 'trades');
       const q = query(tradesCollectionRef, orderBy('date', 'desc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedTrades = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setTrades(fetchedTrades);
            calculateStats(fetchedTrades);
        });

        return () => unsubscribe();
    }, [userId]);

    const calculateStats = (trades) => {
        let weekly = 0;
        let monthly = 0;
        const now = new Date();
        const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

        trades.forEach(trade => {
            const tradeDate = new Date(trade.date);
            if (tradeDate >= weekStart) {
                weekly += trade.pl;
            }
            if (tradeDate >= monthStart) {
                monthly += trade.pl;
            }
        });

        setWeeklyPL(weekly);
        setMonthlyPL(monthly);
        setTotalTrades(trades.length);
    };

    const addTrade = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const newTrade = {
            date: formData.get('trade-date'),
            ticker: formData.get('trade-ticker'),
            strategy: formData.get('trade-strategy'),
            pl: parseFloat(formData.get('trade-pl')),
            mistakes: formData.get('trade-mistakes')
        };
        
        try {
            const tradesCollectionRef = collection(db, 'users', userId, 'trades');
            await addDoc(tradesCollectionRef, newTrade);
            setShowModal(false);
            event.target.reset();
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    };

    const deleteTrade = async (tradeId) => {
        try {
            const tradeDocRef = doc(db, 'users', userId, 'trades', tradeId);
            await deleteDoc(tradeDocRef);
        } catch (e) {
            console.error("Error deleting document: ", e);
        }
    };

    
    const renderPage = () => {
        if (currentPage === PAGE_DASHBOARD) {
            return (
               <div id="dashboard-page" className="page-content  " >

                    <h1 className=" text-black text-3xl font-bold text-center mb-6">Trading Dashboard</h1>
                    <div className=" grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-green-100 rounded-lg p-6 shadow">
                            <h3 className="text-xl font-semibold text-green-700">Weekly P/L</h3>
                            <p className={`text-2xl font-bold mt-2 ${weeklyPL >= 0 ? 'text-green-600' : 'text-red-600'}`}>${weeklyPL.toFixed(2)}</p>
                        </div>
                        <div className="bg-blue-100 rounded-lg p-6 shadow">
                            <h3 className="text-xl font-semibold text-blue-700">Monthly P/L</h3>
                            <p className={`text-2xl font-bold mt-2 ${monthlyPL >= 0 ? 'text-green-600' : 'text-red-600'}`}>${monthlyPL.toFixed(2)}</p>
                        </div>
                        <div className="bg-yellow-100 rounded-lg p-6 shadow">
                            <h3 className="text-xl font-semibold text-yellow-700">Total Trades</h3>
                            <p className=" text-black text-2xl font-bold mt-2">{totalTrades}</p>
                        </div>
                    </div>
                    
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-black text-2xl font-semibold">Previous Trades</h2>
                        <button onClick={() => setShowModal(true)} className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
                            Add New Trade
                        </button>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-base-100 rounded-lg shadow-md">
                            <thead className="bg-black-200">
                                <tr>
                                    <th className="py-3 px-4 text-left">Date</th>
                                    <th className="py-3 px-4 text-left">Company</th>
                                    <th className="py-3 px-4 text-left">Strategy</th>
                                    <th className="py-3 px-4 text-left">P/L</th>
                                    <th className="py-3 px-4 text-left">Mistakes</th>
                                    <th className="py-3 px-4 text-left">Action</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {trades.map(trade => (
                                    <tr key={trade.id}>
                                        <td className="text-black py-3 px-4">{trade.date}</td>
                                        <td className="text-black py-3 px-4">{trade.ticker}</td>
                                        <td className="text-black py-3 px-4">{trade.strategy}</td>
                                        <td className={`py-3 px-4 ${trade.pl >= 0 ? 'text-green-600' : 'text-red-600'}`}>${trade.pl.toFixed(2)}</td>
                                        <td className="text-black py-3 px-4">{trade.mistakes || 'N/A'}</td>
                                        <td className="py-3 px-4">
                                            <button onClick={() => deleteTrade(trade.id)} className="text-red-500 hover:text-red-700">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            );
        } 
    };

    return (
        <div className="min-h-screen bg-gray-800 flex flex-col">
            <main className="container mx-auto mt-8 p-4 bg-white rounded-lg shadow-xl flex-grow">
                {renderPage()}
            </main>

            {showModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
                    <div className="relative p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="flex justify-between items-center pb-3">
                            <h3 className="text-gray-700 text-xl font-bold">Add New Trade</h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
                        </div>
                        <form onSubmit={addTrade}>
                            <div className="mb-4">
                                <label className="block text-gray-700">Date</label>
                                <input type="date" name="trade-date" className="mt-1 block w-full p-2 border rounded-md bg-gray-200 text-gray-700 " required />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Ticker</label>
                                <input type="text" name="trade-ticker" className="mt-1 block w-full p-2 border rounded-md bg-gray-200 text-gray-700 " required />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Strategy</label>
                                <input type="text" name="trade-strategy" className="mt-1 block w-full p-2 border rounded-md bg-gray-200 text-gray-700 " required />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Profit / Loss ($)</label>
                                <input type="number" step="0.01" name="trade-pl" className="mt-1 block w-full p-2 border rounded-md bg-gray-200 text-gray-700 " required />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Mistakes & Learnings</label>
                                <textarea name="trade-mistakes" rows="3" className="mt-1 block w-full p-2 border rounded-md bg-gray-200 text-gray-700 "></textarea>
                            </div>
                            <div className="flex justify-end space-x-4">
                                <button type="button" onClick={() => setShowModal(false)} className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400">Cancel</button>
                                <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">Save Trade</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Trade;

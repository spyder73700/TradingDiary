import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';

import { auth } from "./firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from 'react-router-dom';

function Auth() {
   
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [message, setMessage] = useState('');

    const handleAuth = async (event) => {
        event.preventDefault();
        setError(null);
        setMessage('');

        try {
            if (isLogin) {
                // Sign in with email and password
                await signInWithEmailAndPassword(auth, email, password);
                setMessage('Successfully logged in!');
            } else {
                // Create new user with email and password
                await createUserWithEmailAndPassword(auth, email, password);
                setMessage('Registration successful! You are now logged in.');
            }
             navigate('/trade');
        } catch (err) {
            if (err.code === 'auth/email-already-in-use') {
                setError('This email is already in use. Please log in or use a different email.');
            } else if (err.code === 'auth/invalid-email') {
                setError('The email address is not valid.');
            } else if (err.code === 'auth/weak-password') {
                setError('The password must be at least 6 characters long.');
            } else if (err.code === 'auth/invalid-credential') {
                setError('Invalid email or password. Please check your credentials.');
            } else {
                setError(err.message);
            }
            console.error(err);
        }
    };

    return (
        <div>
        <div className="navbar px-[100px] bg-base-100 shadow-sm">
                <div className="navbar-start">
                    <div className="dropdown">
                        <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
                            </svg>
                        </div>
                    </div>
                    <a className="btn btn-ghost text-xl">Trading Diary</a>
                </div>
        </div>
    
        
        <div className="min-h-screen flex items-center justify-center bg-gray-200">
            <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg space-y-6">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900">
                        {isLogin ? 'Sign in to your account' : 'Create a new account'}
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Or{' '}
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="font-medium text-green-600 hover:text-green-500"
                        >
                            {isLogin ? 'register a new account' : 'sign in to an existing account'}
                        </button>
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleAuth}>
                    <div>
                        <label htmlFor="email" className="sr-only">
                            Email address
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-100 placeholder-white text-black-100 focus:outline-none focus:ring-green-900 focus:border-green-900 sm:text-sm"
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="sr-only">
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete={isLogin ? 'current-password' : 'new-password'}
                            required
                            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-white text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {error && (
                        <div className="text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    {message && (
                        <div className="text-sm text-green-600">
                            {message}
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                            {isLogin ? 'Sign in' : 'Register'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
        </div>
    );
}

export default Auth;

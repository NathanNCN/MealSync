'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { FaUtensils, FaShoppingCart, FaUserCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function Nav() {
    const [user, setUser] = useState<any>(null);
    const [isScrolled, setIsScrolled] = useState(false);

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };
        getUser();

        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogin = async () => {
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`
            }
        });
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setUser(null);
    };

    return (
        <motion.nav 
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className={`top-0 left-0 right-0 z-50 transition-all duration-300 ${
                isScrolled ? 'bg-white shadow-md' : 'bg-transparent'
            }`}
        >
            <div className="container mx-auto px-4 ">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                            <div className="text-white">
                                <FaUtensils />
                            </div>
                        </div>
                        <span className="text-xl font-bold text-gray-800">MealSync</span>
                    </Link>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link 
                            href="/" 
                            className="text-gray-600 hover:text-green-500 transition-colors flex items-center space-x-1"
                        >
                            <div className="text-sm">
                                <FaUtensils />
                            </div>
                            <span>Recipes</span>
                        </Link>
                        <Link 
                            href="/OrderMeals" 
                            className="text-gray-600 hover:text-green-500 transition-colors flex items-center space-x-1"
                        >
                            <div className="text-sm">
                                <FaShoppingCart />
                            </div>
                            <span>Order Meals</span>
                        </Link>
                    </div>

                    {/* Auth Button */}
                    <div>
                        {user ? (
                            <div className="flex items-center space-x-4">
                                <div className="text-sm text-gray-600">
                                    {user.email}
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-2"
                                >
                                    <div>
                                        <FaUserCircle />
                                    </div>
                                    <span>Logout</span>
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={handleLogin}
                                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
                            >
                                <div>
                                    <FaUserCircle />
                                </div>
                                <span>Login with Google</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </motion.nav>
    );
}
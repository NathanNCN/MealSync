'use client'

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaUtensils, FaShoppingCart, FaChartPie } from 'react-icons/fa';

export default function LoginBanner() {
    const features = [
        {
            icon: <div className="w-6 h-6 text-green-600"><FaUtensils /></div>,
            title: "Recipe Management",
            description: "Save and organize your favorite recipes in one place"
        },
        {
            icon: <div className="w-6 h-6 text-green-600"><FaShoppingCart /></div>,
            title: "Smart Shopping",
            description: "Automatic grocery list generation from your meal plans"
        },
        {
            icon: <div className="w-6 h-6 text-green-600"><FaChartPie /></div>,
            title: "Nutrition Tracking",
            description: "Track your macros and maintain a balanced diet"
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100">
            <div className="container mx-auto px-4 py-16 min-h-screen flex flex-col justify-center">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-6xl font-bold text-green-800 mb-6">
                        Welcome to <span className="text-green-600">MealSync</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Your all-in-one solution for meal planning, recipe management, and smart grocery shopping
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8 mb-16">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.2 }}
                            className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
                        >
                            <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mb-4 mx-auto">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                {feature.title}
                            </h3>
                            <p className="text-gray-600">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    className="text-center"
                >
                    <div className="inline-block bg-white rounded-lg shadow-md p-6">
                        <p className="text-gray-700 text-lg mb-4">
                            Ready to start your journey to better meal planning?
                        </p>
                        <p className="text-green-600 font-semibold">
                            Please log in using the button in the navigation bar above
                        </p>
                    </div>
                </motion.div>

                <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-green-100 to-transparent pointer-events-none"></div>
            </div>
        </div>
    );
}

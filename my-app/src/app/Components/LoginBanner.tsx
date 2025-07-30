'use client'

import React from 'react';
import Image from 'next/image';

export default function LoginBanner() {
    return (
        <div className="bg-gradient-to-r from-green-50 to-green-100 min-h-screen">
            <div className="container mx-auto px-4 py-16">
                <div className="flex items-center justify-between">
                    {/* Left side content */}
                    <div className="max-w-xl">
                        <h1 className="text-5xl font-bold text-green-800 mb-6">
                            Welcome to MealSync
                        </h1>
                        <p className="text-xl text-gray-600 mb-8">
                            Simplify your meal planning and grocery shopping with smart automation
                        </p>
                        <div className="space-y-4 text-gray-600">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <p>Save and organize your favorite recipes</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <p>Automatic grocery list generation</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <p>Smart meal planning with macros tracking</p>
                            </div>
                        </div>
                        <div className="mt-12">
                            <p className="text-gray-500">
                                Please login using the button in the navigation bar to get started
                            </p>
                        </div>
                    </div>

                    {/* Right side image */}
                    <div className="hidden lg:block">
                        <img 
                            src="https://placehold.co/600x400" 
                            alt="Meal Planning Illustration"
                            className="w-[500px] h-auto rounded-lg shadow-xl"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
